import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

import plugin from '../opencode/server.mjs';

const ruleset = fs.readFileSync(new URL('../ponytail.md', import.meta.url), 'utf8');

// Loads the plugin the way OpenCode 2 does and returns its registered session hooks.
async function setupAsOpenCode() {
  const hooks = {};
  await plugin.setup({ session: { hook: async (name, fn) => { hooks[name] = fn; } } });
  return hooks;
}

async function systemFor(hooks, name, agent) {
  const event = { sessionID: 'ses_test', agent, system: [], messages: [], tools: {}, options: {} };
  await hooks[name](event);
  return event.system;
}

test('General gets the full ruleset on every model call and compaction', async () => {
  const hooks = await setupAsOpenCode();
  for (const name of ['context', 'compaction']) {
    assert.deepStrictEqual(await systemFor(hooks, name, 'general'), [{ type: 'text', text: ruleset }]);
  }
});

test('the main thread and read-only agents never get the ruleset', async () => {
  const hooks = await setupAsOpenCode();
  for (const agent of ['build', 'plan', 'explore', 'compaction', 'summary', 'title', 'general-x', 'interrogate-reviewer-1']) {
    assert.deepStrictEqual(await systemFor(hooks, 'context', agent), [], `${agent} should not get the ruleset`);
  }
});

test('the package entry is the plugin OpenCode loads', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.strictEqual(manifest.exports['.'], './opencode/server.mjs');
  assert.strictEqual(plugin.id, 'ponytail-subagent');
});
