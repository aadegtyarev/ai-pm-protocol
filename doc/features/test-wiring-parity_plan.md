# test-wiring-parity — plan

Source: PM-relayed protocol-feedback 2026-06-05 (backlog "Test-wiring-parity" entry), from a live on-hardware session — a feature (BLE provider registration) had green tests and passed both review passes (`pm-plan-checker` + `code-review` high) but did not work on hardware, because the **test initialized/wired the dependency differently from the production entry point** (production used a soft reactive flag; the test registered the provider explicitly/bypassing). The two-pass review gate passed a dead feature; only the hardware caught it. This is the sharpest of the two items the PM relayed (it is a hole in the review gate's scope, not diagnosis speed). Selected by the PM ("давай добьём по ревью скоупу").

## Scenarios

1. **`/pm-plan` gains a Test-wiring-parity rule.** The Test-plan rules section adds a rule (sibling to the existing Stack-spec test rule and Interaction-scenario test rule): for any feature whose correctness depends on **initialization / registration / wiring order** — a provider registered on a shared singleton, a side-effect import, a plugin/factory hook, env/DI setup — the plan's Test plan must include **≥1 test that drives the same registration path the production entry point uses** and asserts the observable post-condition that path is supposed to produce (e.g. `registerX()` → `container.has(X)` is true), **not a hand-rolled equivalent setup**.
2. **`pm-plan-checker` enforces it.** A wiring-dependent feature whose tests **bypass the production registration path** (set up dependencies differently from how `main` does) is flagged **blocking** — framed as "the test measures a path the app never takes," in the same family as the Stack-spec test rule ("don't test against a self-consistent stand-in") and the Interaction-scenario test rule (missing-test → blocking).
3. **Single-sourced + judgement-triggered.** The rule text lives **once** in `/pm-plan`'s Test-plan rules; `pm-plan-checker` references the discipline and enforces presence, never re-encoding the rule. The trigger is a **semantic judgement** — "does this feature's correctness depend on init/registration/wiring order?" — the same shape as the NFR / state-model / security-surface triggers (no hook; a plan-time discipline + a checker clause).
4. **Proportional — a non-wiring feature is not burdened.** A feature whose correctness does **not** depend on initialization/registration/wiring (a pure function, a self-contained transform) requires no wiring-parity test and is **not** flagged — the check is silent when the trigger does not hold, exactly like the NFR check on a non-scale feature and the security-surface check on a non-security project.

## Existing behaviors this feature touches

- `.claude/commands/pm-plan.md` Test-plan rules (lines ~265–269: Test plan rule / Interaction scenario test rule / Stack-spec test rule) — the new rule is added as a sibling; the three existing rules are unchanged.
- `.claude/agents/pm-plan-checker.md` "Implementation compliance" dimension (which already blocks on a missing scenario/test and notes scope expansion) — gains the wiring-parity clause; the existing checks are preserved.
- The Stack-spec test rule + its `pm-plan-checker` enforcement — untouched; the new rule is its sibling in the "test the real thing, not a self-consistent stand-in" family, not a replacement.

## Contracts

(no Product Contract — this repo has no user-facing contracts by design; protocol test-discipline change.)

## Stack expectations touched

(none — Markdown command/agent prose; no library / format / external-system idiom touched.)

## Interaction scenarios

Provably isolated: edits procedure/agent prose in two protocol-source files. No shared mutable state, no concurrency, no I/O. The one adjacency (the new rule sits beside the Stack-spec / Interaction-scenario test rules and the Implementation-compliance checks) is handled editorially — an addition beside the existing rules, not a replacement.

## Test plan

- Existing tests that must pass: all of `tests/hooks.sh` — untouched (no hook touched); confirm it stays 73/73.
- New tests: **none** — Markdown protocol-discipline change in a markdown-prose repo with no runtime/linter to host an automated test for "did the plan include a wiring-parity test." Verification is editorial: Pass-1 plan-compliance (the four scenarios land in the `/pm-plan` rule + the `pm-plan-checker` clause; single-sourced; judgement-triggered; proportional) + Pass-2 `code-review` over the diff + validation-by-use. Documented-boundary, matching the changeset-hygiene / audit-scope-menu prose-half precedent.

## Docs to update

- `doc/architecture.md`: a short decision record — "Test-wiring-parity: a feature whose correctness depends on init/registration/wiring order must carry a test that drives the production registration path (not a hand-rolled setup); `pm-plan-checker` blocks one that bypasses it. Judgement-triggered (no hook), single-sourced in `/pm-plan`, a sibling of the Stack-spec test rule in the 'test the real thing' family; it moves a slice of Step 5.5's run-it-for-real protection earlier, into the test suite." Authored by `pm-architect` post-coding.
- `.claude/commands/pm-plan.md`, `.claude/agents/pm-plan-checker.md`: the actual rule + enforcement clause — protocol source, authored by `pm-coder`.

(README not touched — no install/quickstart/architecture-one-liner/doc-pointer change; README-currency trigger does not fire.)

## Out of scope

- **The `code-review` "test initializes differently than main → finding" half** (named in the PM's proposed text) — `code-review` is a **built-in Claude Code engine the protocol delegates to**; its prompt is not ours to reprogram, so this half cannot be durably baked in. The durable, ownable enforcement is the `/pm-plan` rule + the `pm-plan-checker` clause (both protocol-owned). Recorded here as a known limitation, not silently dropped: the wiring-parity defense lands at plan-time + Pass-1, not inside the Pass-2 built-in engine.
- **Step 5.5 "run it for real"** — unchanged; it stays the ultimate catch. This feature moves a cheap, deterministic slice of that protection earlier (into every diff's test suite) so the modal wiring bug fails in CI, not on hardware — it does not replace the on-hardware run.
- **The diagnostic-flow item** (passive-observation + bisect, the other PM-relayed item) — a separate backlog entry / separate feature; not touched here.
- **A new judgement-triggered plan section** (à la the NFR / state-model `## ...` sections) — explicitly avoided as disproportionate; the trigger folds into the existing Test-plan rule (the plan author applies it when judging the Test plan), no new mandatory section, no new agent/command/hook.
- **Auto-detecting "is this feature wiring-dependent"** mechanically — rejected; the trigger is a semantic judgement (the established no-hook-for-semantic-triggers family), enforced soft via the checker, not a regex.
