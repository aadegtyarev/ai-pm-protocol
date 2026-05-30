# architect-owns-architecture-md — plan

## Context

Task #27 in the meta-audit follow-up backlog: no agent currently owns canonical `doc/architecture.md` (in this repo) / `docs/architecture.md` (in downstream) edits. When writing the meta-audit `audit-fixup-self-docs-architecture` plan, the orchestrator had to invoke `architect` with an extended prompt as a one-off, because the persona was scoped to per-feature arch notes only. Future canonical architecture.md edits would need the same workaround, which is dishonest by the protocol's own rules.

This is a small persona extension — broaden architect's mandate to include canonical architecture.md creation and maintenance.

## Scenarios

1. **Greenfield bootstrap** — bootstrap calls architect (instead of orchestrator writing in main session) to fill `docs/architecture.md` from the template with PM's stack answers + the stack-researcher result.
2. **Audit-fixup-self-docs-architecture** style work — orchestrator spawns architect; architect writes / refreshes canonical architecture.md without needing extended-prompt workaround.
3. **Per-feature arch notes** — unchanged. architect still produces `docs/features/<topic>_arch.md` for structural decisions.

## Existing behaviors

- Per-feature arch notes (`docs/features/<topic>_arch.md`) — unchanged behavior, unchanged output path.
- Read-only mandate — unchanged for source code; broadened to allow writing `docs/architecture.md` (template repo: `doc/architecture.md`).
- Project root boundary — unchanged.

## Categorical scope check

«Architecture documentation surfaces» — categorical. Existing element: per-feature arch notes. New element: canonical architecture.md. Out of scope (siblings, separate plans on demand):
- `docs/user-journeys.md` — owned by plan-feature + docs-extractor
- `docs/stack-notes.md` — owned by stack-researcher
- `docs/ui-guide.md` — owned by docs-extractor (legacy) / bootstrap (greenfield)
- `docs/threat-model.md` — owned by bootstrap if security requirements mentioned

## Contracts

**Modified:** `.claude/agents/architect.md`
- Persona description (frontmatter) extended: per-feature arch notes **and** canonical architecture.md.
- New section "When invoked for canonical architecture.md" describing the meta-case workflow: read stack-notes, read source code, read existing architecture.md if present, write/extend.
- Existing per-feature section unchanged.

**Modified:** `.claude/commands/bootstrap.md`
- Greenfield path step "create from templates" — when `docs/architecture.md` needs filling beyond template placeholders, spawn architect to populate it from PM stack answers + stack-researcher output, instead of orchestrator writing inline.
- Legacy full mode — no change (docs-extractor already produces architecture.md from code; architect is alternative for greenfield only).

**Not modified:** `.claude/agents/coder.md`, `reviewer.md`, `auditor.md`, `docs-extractor.md`, `stack-researcher.md`, `pr-prep.md`. Reviewer dim 8 still flags drift; auditor dim 10 still validates against stack-notes. No new dimension.

## Stack expectations touched

None — pure persona text edit. No stack components involved.

## Test plan

Validation by use (template repo, no automated tests by design):

- Scenario 1 (greenfield bootstrap): the bootstrap command file mentions architect for architecture.md when running greenfield. Reviewer reads bootstrap.md and verifies.
- Scenario 2 (audit-fixup): the workaround language in `audit-fixup-self-docs-architecture_plan.md` becomes obsolete after this PR. Mark in CHANGELOG so future fixup plans use architect directly.
- Scenario 3 (per-feature arch notes): existing architect persona behavior for structural choices unchanged. Reviewer reads diff to confirm.

Anti-regression:
- Persona's "Hard rules" still include read-only on source code (write only to architecture.md and to docs/features/<topic>_arch.md, never to source files).
- Project root boundary unchanged.

## Docs to update

- `.claude/agents/architect.md` — primary change
- `.claude/commands/bootstrap.md` — wire architect into greenfield architecture.md flow
- `WORKFLOW.md` agent table — extend architect's "When" column with "or to write/refresh canonical docs/architecture.md"

## Out of scope

- Bootstrap full-mode flow (docs-extractor already handles legacy architecture.md)
- Extension of architect to user-journeys.md, stack-notes.md, ui-guide.md, threat-model.md — siblings
- New review dimension for canonical architecture.md drift — dim 8 already covers it
- Refactor of existing `audit-fixup-self-docs-architecture` historical plan — leave the workaround note as historical record

## Handoff

1. Orchestrator updates `.claude/agents/architect.md` (persona extension).
2. Orchestrator updates `.claude/commands/bootstrap.md` (wire architect into greenfield).
3. Orchestrator updates `WORKFLOW.md` agent table row.
4. Self-review: spawn reviewer to verify persona extension, no regression on per-feature behavior, DoD pass.
5. pr-prep opens the PR.

No coder needed — this is persona text + command text + workflow table. No code, no tests, no contracts.
