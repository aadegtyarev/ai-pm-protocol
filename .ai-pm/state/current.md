# Execution State

- **Status:** coding — `test-wiring-parity` (PM-relayed protocol-feedback item, "ревью-скоуп"). Plan: `doc/features/test-wiring-parity_plan.md`.
- **Decision authority:** `autonomous` (project-wide) — procedural gates announce-and-proceed; merge/ship manual. **Product forks go to the PM** ("продуктовые решения со мной"). Conversation language: Russian.
- **Branch:** `feature/test-wiring-parity` (cut fresh from main after #239/v2.33.0 merged; carried the two PM-feedback backlog entries onto its Step 0).
- **Last shipped:** v2.33.0 `changeset-hygiene` (PR #239 merged 2026-06-05). Earlier this session: v2.32.0 `review-engine-selection` + `audit-scope-menu` (PR #238).
- **This feature — test-wiring-parity:** a feature whose correctness depends on init/registration/wiring order must carry a test that drives the **production registration path** (not a hand-rolled setup); `pm-plan-checker` blocks one that bypasses it. Closes the gap where green tests + both review passes let a non-working BLE-provider feature through (test wired the dependency differently than `main`); only hardware caught it.
- **Remaining (coder):**
  1. `.claude/commands/pm-plan.md` — add a **Test-wiring-parity rule** sibling to the Stack-spec test rule (~line 269): wiring-dependent feature → ≥1 test drives the production registration path + asserts the observable post-condition (`registerX()`→`container.has(X)`), not a hand-rolled equivalent.
  2. `.claude/agents/pm-plan-checker.md` — "Implementation compliance" gains a clause: wiring-dependent feature whose tests bypass the production registration path → **blocking** ("test measures a path the app never takes"), same family as the Stack-spec / Interaction-scenario test rules. Single-source: reference the rule, don't re-encode.
- **Docs to update (pm-architect, post-coding):** `doc/architecture.md` (decision record).
- **Touched files:** `.claude/commands/pm-plan.md` (Test-wiring-parity rule, sibling of the Stack-spec test rule), `.claude/agents/pm-plan-checker.md` (Implementation-compliance wiring-parity blocking clause, references the rule by name).
- **Next step:** `pm-architect` (Docs-to-update: `doc/architecture.md` decision record) → review loop (`pm-plan-checker` Pass 1 → `code-review` Pass 2). hooks.sh stays 73/73 (no hook). Stamps end `— passed`.
- **Out of scope:** the `code-review` built-in finding-half (built-in engine, not ours to reprogram — durable enforcement is /pm-plan + pm-plan-checker); Step 5.5 unchanged; the diagnostic-flow feedback item (separate); no new judgement-triggered plan section; no mechanical auto-detect of wiring-dependency.
- **Backlog (open PM-relayed items):** diagnostic-flow gap (passive-observation read-only + bisect-before-hypothesize); + the earlier reviewability track B (linters #218/#211) and C (idioms #227) still queued; self-review-hygiene; etc.
- **Note:** dogfood — this feature's own diff must be clean (changeset-hygiene now in force).
