# AGENTS.md

The "nothingfiner" portfolio site — Preact + TypeScript + Tailwind + Vite.

## Coding standards (MANDATORY)

All changes MUST follow the standards in `~/Projects/standards-mcp`.
Before touching code, read ONLY the rule files relevant to the current task:

- `~/Projects/standards-mcp/rules/universal.md`        (always)
- `~/Projects/standards-mcp/rules/typescript.md`       (TS work)
- `~/Projects/standards-mcp/rules/css.md`              (styling)
- `~/Projects/standards-mcp/rules/preact.md`           (components)
- `~/Projects/standards-mcp/rules/projects/nothingfiner.md`  (project layer)

Read the specific file for the task — do NOT dump all rules into context.

## Hard gotchas (non-negotiable)
- Preact, not React: import hooks from `preact/hooks`, use `class=` not `className`.
- No `as any`, no non-null `!` outside tests.
- Hash routing via `wouter-preact`.
