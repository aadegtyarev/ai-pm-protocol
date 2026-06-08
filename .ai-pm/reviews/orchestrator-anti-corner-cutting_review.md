# Plan-quality review — orchestrator-anti-corner-cutting (pre-coding)

This is a **pre-coding plan-quality check** (no implementation exists yet — both
`doc/features/orchestrator-anti-corner-cutting_plan.md` and the arch note are
untracked). The DoD checklist below is read as **plan-completeness**, not
implementation compliance.

## Plan completeness
- ✓ Three pieces named; each with scenarios.
- ✓ Failure-inventory scenarios are first-class (scenarios 1–4: failure / refusal / crash → retry N=2 → STOP+report → never-substitute verdict/code/stamp/merge), with the load-bearing "failed = missing, never a pass" rule stated.
- ✓ Spike gate for the chat-hook reminder is explicit and the plan does NOT commit to shipping it pre-spike (scenario 10 + the `oc-route-reminder-spike` guarded-skip runtime gate + the named fallback "stay on the always-on `instructions`/`AGENTS.md` surface", not a silent no-op hook).
- ✓ Stack expectations cite stack-notes rules with source URLs and **correct** confidence tags: `tool.execute.before` and ESM single-export `execution-verified (1.16.2)`; subagent containment (4b) `execution-verified (1.16.2, pinned)`; message/prompt-injection (10) correctly `doc-cited (unverified)` / `to-verify`. Matches `doc/stack-notes.md` verbatim.
- ✓ Interaction scenarios section present with the not-provably-isolated declaration and three shared-state scenarios.
- ✓ Docs-to-update names `doc/architecture.md` (pm-architect post-coding decision record), `workflow/enforcement.md`, and `doc/stack-notes.md` for BOTH the known-limitation note AND the to-verify→execution-verified flip after the spike.
- ✓ Out-of-scope honestly lists the residual persona-only verdict-self-substitution gap, the OpenCode SQLite bug, the Claude-side deferral, and the categorical failure-kind siblings (failure/refusal/crash treated uniformly).
- ✓ Non-user-facing confirmed: every scenario subject is the orchestrator / plugin / subagent (the system), no human role → advocate (Step 3.5) gate correctly not required. Product-readiness gate `n/a`.
- ✓ Software-kind project (CLAUDE.md `## Project kind: software`; no `docs/threat-model.md`) → no `## Validation` section, no security-surface block.

## Slice-order consistency (the headline finding) — RE-CHECK: CLOSED
- ✓ **Plan header now states the build order unambiguously and reconciles the arch-vs-plan numbering.** Plan line 18: "Build order (this plan's numbering): 1 → 2 → 3. This equals the arch note's recommended order (failure-path → artifact-gate → reminder)." The note then explains the numbering difference explicitly — "the arch note numbers the reminder as its piece 2 and the gate as its piece 3, so the arch note writes the same order as '1 → 3 → 2'; THIS plan renumbers so the build order matches the numbering (1 failure-path, 2 artifact-gate, 3 reminder)."
- ✓ The arch note's "1 → 3 → 2" (arch line 409) is correctly mapped: arch Piece 1 = failure-path, Piece 2 = reminder, Piece 3 = gate → arch order = failure-path → gate → reminder. Identical physical order to the plan's "1 → 2 → 3" under the plan's own numbering.
- ✓ Piece 3 (the route-reminder) is explicitly sequenced LAST because spike-gated ("piece 3 is sequenced LAST because it is spike-gated … do not build it before the spike passes"). Matches the arch rationale that the high-confidence, no-spike pieces land first.
- ✓ No remaining contradictory "1 → 3 → 2" token under the plan's OWN numbering: the single occurrence of that token is attributed by name to the arch note's numbering. Grep confirms only one `1 → 3 → 2` (arch-attributed) and one `1 → 2 → 3` (plan's own).

## Interaction-scenario test pairing — RE-CHECK: CLOSED
- ✓ The Test plan now carries a dedicated "Interaction scenario tests (one per Interaction scenario)" block (plan lines 83–86).
- ✓ Interaction scenario 2 (merge-deny during a believed-stamped autonomous ship = "stop and report", NOT retry-loop) is paired with `oc-gate-deny-is-stop-not-loop` — a persona prose-grep asserting a denied pre-ship merge = "gate not satisfied → stop and report to the PM", explicitly NOT a retry-loop. This now exercises the no-retry-loop post-condition that the prior single-deny test did not.
- ✓ Interaction scenario 3 (a half-stamped artifact left by a failed run must not be misread as satisfied) is paired with `oc-gate-partial-stamp-denied` (`tests/oc-plugin-unit.js`) — a PARTIALLY-stamped review artifact (plan-checker stamped but `## Code review: NOT YET RUN`) read by the pre-ship gate as UNSATISFIED → merge THROW. This sets up the post-condition state the rule requires.
- ✓ Interaction scenario 1 (chat-map vs concurrent subagent) explicitly noted as covered by `oc-route-reminder-agent-scoped` + the spike's containment step — acceptable, as accepted in the prior verdict.

## Definition of Done (read as plan-completeness)
- [x] All plan scenarios specified and have a planned test (scenarios 1–10)
- [x] Interaction scenarios have planned concurrent-state tests (all three now paired; see RE-CHECK above)
- [x] Stack expectations cited with sources + correct confidence tags; stack-spec test discipline (version pin, source URLs in comments) specified
- [x] Product Contract: no Product Contract touched (backend/protocol-internal; non-user-facing)
- [x] Pipeline tests enumerated (existing must-pass list + new tests per piece)
- [x] State-file update implied (spike outcome recorded in `.ai-pm/state` per Docs/spike)
- [x] Docs updates listed (architecture.md, enforcement.md, stack-notes.md, AGENTS.md)
- [x] Expected artifacts: plan + arch note present; this review; no contract needed (non-user-facing)
- [n/a] Product-readiness gate (user-facing only) — non-user-facing, advocate not required
- [n/a] Validation gate (documentation-kind only) — software-kind
- [x] Failure-inventory negative-space tests: present for the deny-side consequences (`oc-gate-merge-deny-unstamped`, `oc-gate-precode-no-plan-deny`); the persona failure paths are grep-presence tested per the arch note's "persona text, not unit-testable" rationale (see Note 1)

**DoD: pass** (both prior blocking gaps verified closed; no other change of substance)

## Blocking
(none — the two prior blocking gaps are closed)

1. ~~Slice-order contradiction (`...plan.md:16` + "## The three pieces" header)~~ — **CLOSED.** Header now states build order `1 → 2 → 3` (failure-path → artifact-gate → reminder) unambiguously, explains the arch-vs-plan numbering difference, and sequences the spike-gated reminder last. No contradictory token under the plan's own numbering.
2. ~~Two interaction scenarios without a paired test (`...plan.md:63-64`)~~ — **CLOSED.** Interaction scenario 2 paired with `oc-gate-deny-is-stop-not-loop` (persona prose-grep, no-retry-loop post-condition); interaction scenario 3 paired with `oc-gate-partial-stamp-denied` (plugin unit test, half-stamped → deny); scenario 1 noted covered by `oc-route-reminder-agent-scoped` + spike containment.

## Notes (product)
1. Piece 1 (the failure-path state machine) is **persona text**, tested only by a single bundled grep (`oc-failure-path-persona` covering scenarios 1–4) plus the deny-side consequence backstops. This matches the arch note's explicit rationale (a crashed `task` is not a subsequent tool call a plugin can deny → not unit-testable). It is the honest mechanism, but the PM should be aware that the never-self-substitute rule for a NON-ship-gating step has no structural backstop at all (correctly listed in Out of scope) — it rests entirely on the weak model honoring persona text, which is the very failure this feature responds to. The per-prompt reminder (spike-gated, may not ship) is the only added reinforcement, and it is the least-certain piece. Worth a conscious PM acknowledgement that the highest-value structural guarantees here are the merge-gate and the existing write-deny; the verdict-substitution gap is mitigated, not closed.
2. The plan folds a "persona-strengthening rider" (default-on conditional steps) across pieces — not numbered as a scenario but tested by `persona-conditional-default-on`. Scope is coherent with the backlog item; flagging only so the PM notes the rider rides along with the three pieces rather than being a separate slice.

## Verdict
approve

<!-- Orchestrator owns the Pass-2 trail below. This is a pre-coding plan check;
     no code exists yet, so the code-review stamp remains NOT YET RUN. -->
## Code review findings
(populated by orchestrator from code-review output; pm-coder reads and fixes these)

## Code review: NOT YET RUN
