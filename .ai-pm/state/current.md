# Execution State

- **Task:** `doc-migration-on-template-bump` — v1 extends `/pm-audit` with the SEMANTIC half of doc-migration: a version-keyed `### Expected-discipline manifest` in MIGRATIONS.md + a new docs-currency sub-check in pm-auditor + a remediation type in pm-audit (relay discipline questions → pm-architect authors) + "run /pm-audit after a template bump" in WORKFLOW Maintenance. Mechanical half already exists (### Pending-migration detection); no new command/agent/hook.
- **Status:** coded — awaiting post-coding pm-architect handoff (`doc/architecture.md`) + review loop
- **Branch:** `feature/doc-migration-on-template-bump` (from `main`)
- **Done:**
  - `/pm-research` → `.ai-pm/research/doc-migration-on-template-bump_research.md` (Copier template-update model + load-bearing markers + dpkg three-way + Django registry).
  - Plan approved → `doc/features/doc-migration-on-template-bump_plan.md` (7 scenarios, 6 key decisions).
  - Arch review → `.ai-pm/arch/doc-migration-on-template-bump_arch.md` (manifest = `### Expected-discipline manifest`, `####`-per-discipline encoding; sub-check inside dimension 5; remediation entry #7; orchestrator relays directly, NO advocate spawn; idempotence without a state file confirmed). Plan synced with these.
  - PM decisions (2026-06-04): extend /pm-audit (not new command/agent); arch-review run.
  - **pm-coder (2026-06-04):** all 5 docs landed.
    1. `MIGRATIONS.md`: `### Expected-discipline manifest` added (sibling to `### Pending-migration detection`), `####`-per-discipline, 3 disciplines seeded — populated threat-model lifecycle (Introduced: v2.13), foundational user-journeys (v2.16), value-first product story (v2.3). All versions confirmed from CHANGELOG (no `[?]`). Satisfied-checks = positive-presence-of-a-gap; disjoint-statement in preamble. `### Pending-migration detection` itself untouched.
    2. `.claude/agents/pm-auditor.md`: semantic-discipline-gap sub-check added inside dimension 5, after the threat↔constraint wiring bullet, before the two-consecutive→blocking note. References the manifest by name; reuses dimension-1 extraction for journeys/product-story applicability; presence-only; note default (inherits the existing escalation).
    3. `.claude/commands/pm-audit.md`: remediation entry #7 added after the token-laden-contract entry — orchestrator relays the discipline's foundational questions (one AskUserQuestion, by-name source) → spawn pm-architect; accept-with-context escape hatch; NO advocate spawn.
    4. `WORKFLOW.md` § Maintenance: "after the bump, run `/pm-audit`" line added (semantic-upgrade-aware).
    5. `README.md`: one-line capability mention added in the risk-reduction roster (Russian).
  - **Verified:** single-source (3 `####` names live only in MIGRATIONS.md; section referenced by name in WORKFLOW/pm-auditor/pm-audit); disjoint from `### Pending-migration detection`; `.claude/settings.json` not in diff; `### Pending-migration detection` heading/conditions not in diff; `bash tests/hooks.sh` 71/71.
- **Remaining:**
  - `doc/architecture.md` decision record — POST-coding `pm-architect` handoff (orchestrator-spawned), NOT coder's.
  - Review loop: `pm-plan-checker` (Pass 1) + `code-review` (Pass 2).
- **Touched files:** `MIGRATIONS.md`, `.claude/agents/pm-auditor.md`, `.claude/commands/pm-audit.md`, `WORKFLOW.md`, `README.md`, `.ai-pm/state/current.md`.
- **Next step:** spawn `pm-architect` for the `doc/architecture.md` decision record, then review loop (`pm-plan-checker` + `code-review`).
- **Validation:** no executable tests (repo "no automated tests by design"); `tests/hooks.sh` green; scenario coverage verified editorially.
- **Parked:** `doc/features/bootstrap-populated-journeys_plan.md` (committed, banner-marked) — resumes later.
