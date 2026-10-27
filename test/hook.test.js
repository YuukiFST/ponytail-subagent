const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const pluginRoot = path.join(__dirname, '..');
const [subagentStartGroup] = require('../hooks/hooks.json').hooks.SubagentStart;
const [hookCommand] = subagentStartGroup.hooks;

// Claude Code caps additionalContext at 10,000 characters and truncates the rest.
const ADDITIONAL_CONTEXT_CAP = 10000;

function runHookAsClaudeCode(agentType) {
  const args = hookCommand.args.map((arg) => arg.replace('${CLAUDE_PLUGIN_ROOT}', pluginRoot));
  const stdout = execFileSync(hookCommand.command, args, {
    input: JSON.stringify({ hook_event_name: 'SubagentStart', agent_type: agentType }),
    encoding: 'utf8',
  });
  return JSON.parse(stdout);
}

test('hook hands the full ruleset to the subagent within the context cap', () => {
  const output = runHookAsClaudeCode('general-purpose');
  const ruleset = fs.readFileSync(path.join(pluginRoot, 'ponytail.md'), 'utf8');

  assert.strictEqual(output.hookSpecificOutput.hookEventName, 'SubagentStart');
  assert.strictEqual(output.hookSpecificOutput.additionalContext, ruleset);
  assert.ok(ruleset.length < ADDITIONAL_CONTEXT_CAP, `ruleset is ${ruleset.length} chars`);
});

test('matcher picks code-writing subagents only', () => {
  // Claude Code reads a matcher holding '^' or '$' as an unanchored JavaScript regex.
  const matcher = new RegExp(subagentStartGroup.matcher);

  for (const agentType of ['general-purpose']) {
    assert.ok(matcher.test(agentType), `${agentType} should get the ruleset`);
  }
  for (const agentType of ['Explore', 'Plan', 'general-purpose-x', 'caveman:cavecrew-builder', 'caveman:cavecrew-investigator', 'caveman:cavecrew-reviewer', 'claude-code-guide']) {
    assert.ok(!matcher.test(agentType), `${agentType} should not get the ruleset`);
  }
});
