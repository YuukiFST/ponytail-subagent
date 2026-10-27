# ponytail-subagent

Subagents that write code tend to overbuild, and [Ponytail](https://github.com/DietrichGebert/ponytail) can only reach them by also taking over the main thread.
This Claude Code plugin hands Ponytail's ruleset to code-writing subagents alone: the main thread, and read-only agents like `Explore`, never see it.

## Install

```
/plugin marketplace add YuukiFST/ponytail-subagent
```
```
/plugin install ponytail-subagent@ponytail-subagent
```

Needs `node` on `PATH`.

## What gets it

A `SubagentStart` hook ([`hooks/hooks.json`](hooks/hooks.json)) injects [`ponytail.md`](ponytail.md) as `additionalContext` into subagents whose type matches:

```
^general-purpose$
```

Every other subagent type starts as usual.
To cover another type, add it to that matcher and to the lists in [`test/hook.test.js`](test/hook.test.js).

## How it differs from Ponytail

- No `SessionStart` or `UserPromptSubmit` hook, so no mode flag, no `/ponytail` levels and no "stop ponytail": the ruleset is always the `full` level.
- No statusline, band, ledger or webhook.
- No `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain` or `/ponytail-help` skills.

`ponytail.md` is the body of upstream `skills/ponytail/SKILL.md` at [`09c434a`](https://github.com/DietrichGebert/ponytail/blob/09c434ab73ca43761c5d8b0c5d341926c2fba710/skills/ponytail/SKILL.md), without its frontmatter, its session-mode line and its levels table.

## Test

```
node --test
```
