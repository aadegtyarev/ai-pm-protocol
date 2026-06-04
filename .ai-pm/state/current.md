# Execution State

- **Task:** `legacy-reader-role-split` — split pm-legacy-reader's two roles: rename it `pm-legacy-reader` → `pm-codebase-reader` (pure existing-codebase raw-drafter at bootstrap) and move `docs/user-journeys.md` ownership to `pm-architect` (it already owns the sibling docs + the Behavioral contract journeys reference). Completes the existing "reader drafts → architect finalizes/owns" pattern (already true for architecture.md / threat-model) for user-journeys.
- **Status:** coding
- **Branch:** `feature/legacy-reader-role-split` (from `main`)
- **Done:**
  - Plan approved → `doc/features/legacy-reader-role-split_plan.md`.
  - PM decisions (2026-06-04): (1) do this split BEFORE the parked bootstrap-populated-journeys feature; (2) rename to `pm-codebase-reader` (not keep, not new pm-journeys agent — consolidate journeys into pm-architect); arch-review skipped (structural fork resolved by the rename+consolidate choice).
- **Remaining (for pm-coder) — TWO-PHASE per the repo git convention:**
  - **Commit 1 (rename only):** `git mv .claude/agents/pm-legacy-reader.md .claude/agents/pm-codebase-reader.md` + set frontmatter `name: pm-codebase-reader`. Pure rename diff.
  - **Commit 2 (references + scope):** every `subagent_type`/prose ref → `pm-codebase-reader` (pm-plan.md:12, pm-bootstrap.md:13/185/191/211, pm-audit.md:34/83, WORKFLOW.md:17/36/128, pm-coder.md:50, pm-stack-researcher.md:14, protocol-vs-builtins-analysis.md:88, README.md:222, backlog.md:179); MOVE user-journeys.md ownership to pm-architect (pm-plan.md:45/58 + WORKFLOW.md:36/128 + pm-audit.md:83 + pm-coder.md:50 → pm-architect); extend pm-architect.md (owns user-journeys.md + journeys format rule + finalize the reader journeys draft at bootstrap); narrow pm-codebase-reader.md scope (raw-drafter only, standalone = code re-read).
  - **Verify:** `grep -rn pm-legacy-reader` over the LIVE surface returns 0; historical artifacts (CHANGELOG, past plans/reviews/arch/audits/state-archive) keep the old name; `.claude/settings.json` untouched (no MIGRATIONS entry); `bash tests/hooks.sh` green.
  - `doc/architecture.md` decision (rename + journeys-ownership) is POST-coding via pm-architect handoff, not coder's.
- **Touched files:** (to be filled by coder)
- **Next step:** spawn `pm-coder`. After coder: spawn `pm-architect` for the `doc/architecture.md` decision, then review loop (`pm-plan-checker` + `code-review`).
- **Validation:** no executable tests (repo "no automated tests by design"); `tests/hooks.sh` green; reference-completeness grep = the load-bearing check; scenario coverage verified editorially.
- **Parked:** `doc/features/bootstrap-populated-journeys_plan.md` (untracked draft) — resumes after this lands, revised to point journeys authoring at pm-architect.
