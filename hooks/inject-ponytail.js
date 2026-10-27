#!/usr/bin/env node
// Claude Code SubagentStart hook: hands the Ponytail ruleset to the subagent.
// Without the hookSpecificOutput JSON form, Claude Code drops SubagentStart context.

const fs = require('fs');
const path = require('path');

const ruleset = fs.readFileSync(path.join(__dirname, '..', 'ponytail.md'), 'utf8');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: 'SubagentStart', additionalContext: ruleset },
}));
