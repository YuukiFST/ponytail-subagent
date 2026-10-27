// OpenCode 2 server plugin: the OpenCode side of the SubagentStart hook in hooks/hooks.json.
// OpenCode has no subagent-start event; its `context` hook runs before every model call
// and names the session's agent, so the ruleset goes to General's calls alone.

import fs from 'node:fs';

const ruleset = fs.readFileSync(new URL('../ponytail.md', import.meta.url), 'utf8');

// OpenCode's code-writing subagent; Explore and the primary agents never get the ruleset.
export const PONYTAIL_AGENTS = new Set(['general']);

export default {
  id: 'ponytail-subagent',
  async setup(ctx) {
    const addRuleset = (event) => {
      if (PONYTAIL_AGENTS.has(event.agent)) event.system.push({ type: 'text', text: ruleset });
    };
    await ctx.session.hook('context', addRuleset);
    // A compaction call without the ruleset would also miss the provider prompt cache.
    await ctx.session.hook('compaction', addRuleset);
  },
};
