# ponytail-subagent

Subagents that write code tend to overbuild, and [Ponytail](https://github.com/DietrichGebert/ponytail) can only reach them by also taking over the main thread.
This plugin, for Claude Code and OpenCode, hands Ponytail's ruleset to code-writing subagents alone: the main thread, and read-only agents like `Explore`, never see it.

## Install

Claude Code:

```
/plugin marketplace add YuukiFST/ponytail-subagent
```
```
/plugin install ponytail-subagent@ponytail-subagent
```

Needs `node` on `PATH`.

OpenCode 2:

```
opencode plugin add github:YuukiFST/ponytail-subagent
```

## What gets it

In Claude Code, a `SubagentStart` hook ([`hooks/hooks.json`](hooks/hooks.json)) injects [`ponytail.md`](ponytail.md) as `additionalContext` into subagents whose type matches:

```
^general-purpose$
```

Every other subagent type starts as usual.
The hook also returns a `systemMessage`, so the subagent's own transcript shows `ponytail active in <agent type>`; Claude Code keeps that line out of the main thread.
To cover another type, add it to that matcher and to the lists in [`test/hook.test.js`](test/hook.test.js).

In OpenCode, [`opencode/server.mjs`](opencode/server.mjs) adds the same file to the system prompt of every model call the `general` subagent makes; `general` is OpenCode's counterpart of `general-purpose`.
To cover another agent, add its id to `PONYTAIL_AGENTS` there and to the lists in [`test/opencode.test.mjs`](test/opencode.test.mjs).

## How it differs from Ponytail

- No `SessionStart` or `UserPromptSubmit` hook, so no mode flag, no `/ponytail` levels and no "stop ponytail": the ruleset is always the `full` level.
- No statusline, band, ledger or webhook.
- No `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain` or `/ponytail-help` skills.

`ponytail.md` is the body of upstream `skills/ponytail/SKILL.md` at [`09c434a`](https://github.com/DietrichGebert/ponytail/blob/09c434ab73ca43761c5d8b0c5d341926c2fba710/skills/ponytail/SKILL.md), without its frontmatter, its session-mode line and its levels table.

## Test

```
node --test
```
