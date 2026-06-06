# Execution State

- **Status:** planning — `opencode-harness-support`. Plan written: `doc/features/opencode-harness-support_plan.md`. **Awaiting PM approval of the plan; no coding per PM ("подготовимся … но не будем пока кодить").**
- **Decision authority:** `autonomous` (project-wide) — procedural gates announce-and-proceed; merge/ship manual. **Product forks go to the PM.** Conversation language: Russian.
- **Branch:** none yet — still on `main`. A `feature/opencode-harness-support` branch is cut only when the PM greenlights implementation (Step 0). This turn stops at plan-for-approval.
- **Feature:** add OpenCode as a second supported harness alongside Claude Code, one repo, no build step, identical install. Scope = **design + groundwork slice** (OpenCode adapter as labeled preview), not full certification.
- **Four PM forks resolved (AskUserQuestion 2026-06-07):** (1) scope = design + groundwork; (2) dogfood = Claude Code stays self-host, OpenCode = downstream-supported; (3) sync = dual-native + equivalence test (no build step); (4) install = auto-detect harness.
- **Done (orchestrator):**
  - Harness-portability research (this conversation): enforcement, cross-model, instruction-entry, frontmatter, tool-vocab, built-ins gaps.
  - `pm-stack-researcher` run → `doc/stack-notes.md` § "OpenCode" added (8 areas, sourced, `doc/cited (unverified)`). Key corrections vs early assumptions: PR #17577 is **closed-not-merged** (no runtime model override); #5894 **closed-disputed** (subagent containment unsettled, spike candidate); **no** UserPromptSubmit-equiv; `question`/`skill` tools + `.claude/skills/` cross-read **do exist**.
  - Plan authored (design + groundwork scope).
  - State initialized.
- **Remaining (only after PM approves the plan — NOT this turn):**
  1. `pm-architect` arch note — dual-harness layout, neutral-core carve, equivalence-test shape, harness-vocabulary home (architect-review recommended; structural choice present).
  2. Two gated integration-risk spikes (need an OpenCode runtime): Spike A = submodule-path sourcing for install; Spike B = does plugin `tool.execute.before` constrain a `task`-spawned subagent (the #5894 dispute). If no runtime in-session → record `spike-deferred` + surface unverified premise.
  3. `pm-coder` builds the groundwork: neutral-core carve + harness-vocabulary layer, `.opencode/` preview adapter, equivalence test, install auto-detect.
  4. Review loop + docs handoff (`doc/architecture.md` decision record, `README.md` install/one-liner) via `pm-architect`.
- **Two upstream blockers tracked (later-slice gates, not closed by us):** OpenCode runtime model override (PR #17577 closed-not-merged) and subagent hook containment (#5894 disputed). Full OpenCode certification is a later plan gated on these.
- **Touched files (planning turn):** `doc/stack-notes.md` (OpenCode entry), `doc/features/opencode-harness-support_plan.md`, `.ai-pm/state/current.md`.
- **Next step:** PM approves / amends the plan. On approval → recommended next (still no production code): `pm-architect` arch note + schedule the two spikes.
- **Out of scope:** full certification; closing the two upstream blockers; dogfood-on-OpenCode; generator/build-step; sibling harnesses (Cursor/Codex/Aider/…); live spike execution if no runtime.
