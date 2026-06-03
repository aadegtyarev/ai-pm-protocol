# On-hardware blast-radius preflight — plan

## Context

Origin: real downstream pain on `wb-mqtt-matter`. The orchestrator ran a hardware
test of a new device type — added then removed a bridged endpoint — on a **live**
Matter bridge that was paired with a live ecosystem. Dynamically changing the
endpoint parts-list (`[1,2]→[1,2,3]→[1,2]`) while the pairing was active broke the
ecosystem's device record (Yandex stopped seeing the lamp) even though the bridge
itself stayed internally correct. Aggravated by repeated restarts of the paired
bridge and a multi-homed network.

The protocol gap this exposes: Step A.5's probe rules bound a touch to "runtime /
local state only … I revert it afterwards", on the implicit assumption that a local
revert undoes the effect. On a live coupled target that assumption is false — the
side effect lives **outside**, in the external peer's state (the ecosystem's device
record and CASE session), and is not undone by reverting the local change or
restarting the service. WORKFLOW.md currently has no gate for that blast radius.

## Scenarios

*(The "user" of WORKFLOW.md is the orchestrator; these scenarios describe the
orchestrator's required behaviour.)*

1. Before any **Step 5.5 "run it for real"** on real hardware, the orchestrator
   first determines whether the target is coupled to a live external system whose
   state a local revert will not undo; if so, it **stops** and surfaces the blast
   radius to the PM before taking any action.
2. Before a **Step A.5 diagnostic probe** that restarts or structurally mutates a
   live target, the same preflight applies. The probe's "throwaway / reversible"
   framing is explicitly qualified: *reversible locally ≠ reversible for a coupled
   external peer.*
3. When the target **is** coupled to a live external system, the orchestrator offers
   the safe alternatives (a separate / throwaway target, or a separate identity) and
   proceeds with a recovery path (re-commission / re-pair) **only on explicit PM
   consent**, with that recovery planned as a mandatory step.
4. Structural mutations — anything that changes the live system's externally-visible
   composition — are **never** run on the user's live coupled target by default; they
   go to a separate / throwaway instance.
5. Repeated restarts of a coupled live target are minimized; if a structural change
   on it is unavoidable, the recovery step (re-commission / re-pair) is part of the
   plan, not an afterthought.

## Existing behaviors this feature touches

*(from WORKFLOW.md — what must not break)*

- **Step A read-only-by-default** and the hard boundary against silent changes —
  must stay intact; the preflight is purely additive.
- **Step A.5 probe rules** (runtime / local only, never repo-owned files) — the
  preflight adds a precondition; it relaxes none of the existing rules.
- **"What is mandatory when" table, Diagnostic probe row** (skip-all) — must remain,
  with the preflight noted as the one precondition that still applies even to a
  skip-all probe.
- **Step 5.5 "skip for hardware, give checklist" path** — preserved; the preflight
  runs before either exercising the behaviour or handing over the checklist.

## Contracts

*(none — this is a prose change to WORKFLOW.md, no code APIs or config keys)*

## Stack expectations touched

*(N/A — this repository's "stack" is the protocol docs themselves; the change touches
no external library, wire protocol, or delivered artifact. Recorded explicitly so the
plan-checker sees the section was considered, not omitted.)*

## Interaction scenarios

**Provably isolated:** WORKFLOW.md is a static specification document. The change adds
prose and cross-references and touches no executable surface — `tests/hooks.sh` is
unaffected. The only "interaction" is textual consistency: the new rule must not
contradict the Step A read-only boundary or the Step A.5 probe rules. That is an
editorial consistency check (verified by review), not a runtime interaction.

## Test plan

- **Existing tests that must pass:** `tests/hooks.sh` (currently 71/71) — unaffected
  by a prose change; run to confirm it stays green.
- **New executable tests:** none — WORKFLOW.md is prose. Verification is editorial:
  `pm-plan-checker` and `code-review` read the diff against this plan and confirm each
  of the 5 scenarios is covered and that no existing rule (Step A read-only boundary,
  probe repo-owned-file prohibition) is weakened.
- **Mandatory-table classification:** mechanically **docs-only** (no Product Contract,
  no executable tests), but it encodes a substantive behaviour rule — scenario
  coverage is verified editorially rather than by a test runner.

## Docs to update

- **WORKFLOW.md** (the change itself): introduce a single named concept
  **"Blast-radius preflight"**, defined once, and reference it from Step 5.5 and
  Step A.5; add a one-line qualifier to the Diagnostic-probe row of the
  "What is mandatory when" table noting the preflight still applies. Owner: `pm-coder`.
- **doc/architecture.md**: record the decision — "Blast-radius preflight is a
  domain-agnostic gate on Step 5.5 / Step A.5; enforced by prose, not a hook, because
  detecting whether a target is coupled to a live external system requires runtime
  state a regex `PreToolUse` hook cannot read." Owner: `pm-architect`.

## Out of scope

- **Downstream `wb-mqtt-matter` "bridge reflects operational problems in its status"
  feature** (mDNS errors / lost ecosystem link instead of showing "Connected") — a
  separate downstream product cycle, already in that project's backlog. Cross-reference
  only; not a protocol-template change.
- **A hard `PreToolUse` hook enforcing blast-radius** — rejected by design: detecting
  coupling to a live external system requires runtime state a regex hook cannot read
  (consistent with the 2026-06-02 PM rejection of a hard edit-ownership guard). The
  rule stays soft prose.
- **Matter-specific mechanics** (commissioning / fabric / parts-list) — named only as
  the worked example, never encoded as protocol vocabulary.
- **Step A read-only default** and the **probe's repo-owned-file prohibition** — left
  untouched.

## Key design decisions

1. **Altitude — domain-agnostic principle, Matter as the worked example** (PM-confirmed
   2026-06-03). WORKFLOW.md is platform-neutral; the rule is phrased around "a live
   system coupled to an external stateful peer whose state a local revert won't undo",
   with the Matter bridge / ecosystem as the illustration.
2. **Single-source placement.** "Blast-radius preflight" is defined once as a named
   concept and referenced from both Step 5.5 and Step A.5 — the protocol's own
   "one fact, one owner" principle, avoiding a copied rule that would drift.
3. **Soft prose, not a hook.** Coupling-detection is runtime-state-dependent and not
   expressible as a regex `PreToolUse` guard; enforcement lives in WORKFLOW.md prose
   and the orchestrator's discipline, consistent with prior precedent.
