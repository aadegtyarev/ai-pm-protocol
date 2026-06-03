# threat-model-ownership-and-lifecycle — plan-compliance review

Scope: docs/spec change to the protocol's own files. Recorded scope exceptions applied
(`doc/architecture.md`): no `.ai-pm/contracts/`, no `.ai-pm/state/`, no
`docs/product-map.md`; `doc/` singular, `doc/features/` for plans, `.ai-pm/reviews/` for
reviews; the only executable test is `tests/hooks.sh`. No Product Contract touched.

## Plan compliance

- ✓ Scenario 1 (bootstrap drafts a *populated* threat-model, not an empty skeleton;
  conditionality preserved) — `pm-bootstrap.md` greenfield spawn ("**Do NOT copy the
  empty skeleton**" + "pass the Q7 security answers" + "no security in Q7 → nothing
  scaffolded") and legacy-full ("If pm-legacy-reader drafted docs/threat-model.md,
  pm-architect finalizes that draft"); `pm-legacy-reader.md` now writes a populated draft;
  `pm-architect.md` Section A sub-section "Draft at bootstrap." Owner = pm-architect.
- ✓ Scenario 2 (single owner = pm-architect; complementary; wired threat→constraint by
  reference; no duplicated content) — `pm-architect.md` responsibility 1 + Section A
  sub-section "Complementarity … one owner, no duplicated content"; one-way ID-keyed
  `SCn` wiring spelled out.
- ✓ Scenario 3 (pm-plan requires `docs/threat-model.md` in "Docs to update" with Threat
  rows when a security surface is touched on a security-bearing project) — `pm-plan.md`
  new "Security-surface check" section + "Docs to update" template line + the
  `docs/architecture.md`-or-`docs/threat-model.md` post-coding pm-architect handoff.
- ✓ Scenario 4 (pm-plan-checker blocks a security-touching plan omitting the
  threat-model update) — `pm-plan-checker.md:28`, added to the structural-gate list as
  the same class as a missing "Stack expectations touched" section; "On a non-security
  project … this never fires."
- ✓ Scenario 5 (auditor: empty/skeleton → blocking; stale → note; non-security →
  silent) — `pm-auditor.md:127-131`, additive to dimension 5; all three states plus the
  `SCn` wiring-consistency note present; remediation = spawn pm-architect.
- ✓ Scenario 6 (surface list defined ONCE, referenced by name, 7 items NOT re-listed in
  the three readers) — list lives only in `WORKFLOW.md` `### Security-relevant surfaces`;
  grep confirms none of `pm-plan.md` / `pm-plan-checker.md` / `pm-auditor.md` re-encodes
  any of the 7 surface terms (single-source invariant intact). See note 1 on the
  by-name reference from pm-auditor.
- ✓ Scenario 7 (non-security projects unaffected) — every reader keys off presence of
  `docs/threat-model.md`; absent → silent / never fires, stated in plan-checker, auditor,
  pm-plan, WORKFLOW, and the architecture decision record.

### Must-not-break

- ✓ pm-auditor's 5 dimensions untouched — "## The 5 dimensions" intact; new check is
  additive inside dimension 5 (Docs currency); no existing check deleted (only in-place
  line edits).
- ✓ pm-architect's `architecture.md § Security constraints` ownership preserved and
  *extended* (SCn IDs added to A2; threat-model added as a new owned doc), not relocated.
- ✓ pm-bootstrap Q7 conditionality preserved (greenfield + legacy-full both gate on "Q7
  mentioned security" / "security artifacts present").
- ✓ Arch-notes decisions honored: surface list lives in `WORKFLOW.md` (not the template
  header — candidate B rejected); one-way ID-keyed SCn wiring; security-bearing =
  presence of `docs/threat-model.md`.

## Definition of Done

- [x] All plan scenarios implemented (editorial verification — docs-only change, no
  executable test per the plan's Test plan)
- [x] Interaction scenarios — plan declares `Provably isolated` (static prose, no runtime
  surface); the one cross-file consistency interaction (single-source list + SCn wiring)
  verified by review and holds
- [x] Stack expectations respected — N/A (declared); `tests/hooks.sh` 71/71
- [x] Product Contract — no Product Contract touched (backend/spec-only); stated explicitly
- [x] Pipeline green — `tests/hooks.sh` ran: Total 71, Passed 71, Failed 0
- [x] State file updated — N/A per recorded scope exception (no `.ai-pm/state/`)
- [x] Product Impact Report — N/A (no contract touched)
- [x] Docs updates landed — WORKFLOW.md, the six agents/commands, both templates, and the
  `doc/architecture.md` decision record all in this branch (matches plan "Docs to update")
- [x] Expected artifacts exist — plan (`doc/features/…_plan.md`), arch note
  (`.ai-pm/arch/…_arch.md`), architecture decision record (`doc/architecture.md`), and
  this review present; no contract required (not user-facing)

Markdown blank-line-correct on edited surfaces; English-canonical (no new non-English
prose in the diff).

**DoD: pass**

## Blocking

(none)

## Notes (product)

1. **Scenario 6 — pm-auditor references the surface list transitively, not "by name."**
   The plan's scenario 6 says the list is "referenced **by name** from `/pm-plan`,
   `pm-plan-checker`, and `pm-auditor`." `pm-plan.md:123` and `pm-plan-checker.md:28` do
   reference `### Security-relevant surfaces` in `WORKFLOW.md` by name; `pm-auditor.md`
   does **not** — instead it defines "security-touching" as "a feature whose plan's 'Docs
   to update' named `docs/threat-model.md`" (auditor relies on the plan-checker gate's
   output rather than re-reading the list). This is the design the arch note records
   (W3, lines 196-198), and it actually *strengthens* the load-bearing half of scenario 6
   (the 7 items are never re-encoded). Not blocking — the single-source invariant holds
   and the indirection is the architect's deliberate choice — but the PM may want the
   plan's scenario-6 wording reconciled with the arch decision so future readers don't
   read the literal "by name from pm-auditor" as unmet. Why it matters: avoids a phantom
   "spec says X, code does Y" flag in a later audit.

2. **The 7 surfaces are enumerated in the `doc/architecture.md` decision record.** The new
   decision-record paragraph lists "auth, cryptography / key management, data-at-rest,
   network / transport, user input, PII, access control" inline. This is the canon /
   rationale layer, not one of the three reader agents named by the single-source
   invariant, so it does not violate scenario 6 — but it is a second on-disk copy of the
   list that could drift from `WORKFLOW.md`. Why it matters: if the surface list ever
   changes, the decision-record copy must be updated too; consider phrasing it as "the
   surfaces listed in `WORKFLOW.md § Security-relevant surfaces`" to keep one source.

## Verdict

approve
