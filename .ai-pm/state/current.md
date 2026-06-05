# Execution State

- **Status:** implementing `semgrep-pre-review-linter` — Pass-1 fix round
- **Decision authority:** autonomous. Conversation language: Russian.
- **Branch:** feature/severity-triage-deployment-context

## Task

Plan at `doc/features/semgrep-pre-review-linter_plan.md`.

## Done

1. Deleted `doc/_templates/stack-idioms/python.md` + `doc/_templates/stack-idioms/` directory
2. Removed "Seed from library" + "Contribute-up recommendation" sub-bullets from `.claude/agents/pm-stack-researcher.md`
3. Added Semgrep pre-check step to `workflow/pipeline.md` Step 5 Pass-2 (before AI code-review bullet)
4. Added `### Semgrep` section to `doc/stack-notes.md`
5. Ran `tests/hooks.sh` — 73/73 passed
6. Committed all four changes in one atomic commit
7. pm-architect updated `doc/architecture.md` (three decision-record changes)
8. Fixed two blocking items from Pass-1: dangling arch ref + state update

## Remaining

- Re-run Pass-1 (after fix commit), then Pass-2

## Touched files

- `doc/_templates/stack-idioms/python.md` (deleted)
- `doc/_templates/stack-idioms/` (directory deleted)
- `.claude/agents/pm-stack-researcher.md` (two sub-bullets removed)
- `workflow/pipeline.md` (Semgrep pre-check bullet added to Step 5 Pass-2)
- `doc/stack-notes.md` (### Semgrep section added)
- `doc/architecture.md` (three decision records updated; stale Semgrep-entries refs removed)
