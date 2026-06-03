# Plan-compliance review — contract-two-layer-token-lint

Branch `feature/contract-two-layer-token-lint` (commits `5ce86ea`, `b995f8d`) vs `main`.
Template-repo exceptions acknowledged: no `.ai-pm/contracts/`, no `.ai-pm/state/`,
`doc/` + `doc/features/`; only executable test is `tests/hooks.sh`. Review-only.

## Plan compliance

- ✓ **Scenario 1 — contract.md.tmpl two-layer guidance** — `doc/_templates/contract.md.tmpl:11`
  marks `## User value` token-free PM layer; `:48` marks `## Out of scope` token-free PM layer;
  `:21` (`## Must work`) and `:31` (`## Must not break`) instruct "reference grammars, don't
  restate them" pointing at `## Behavioral contract (taxonomies & invariants)`. All 8 sections
  preserved (`User value`, `Who uses it`, `Must work`, `Must not break`, `Acceptance checks`,
  `Out of scope`, `Last reviewed`, `Built/changed by`); diff is purely additive (0 lines removed).
- ✓ **Scenario 2 — pm-plan-checker structural note on change** — `pm-plan-checker.md:51`,
  non-blocking structural token note (`note (product)`) with token-pattern + location + remediation.
- ✓ **Scenario 3 — pm-auditor sweep note** — contract dimension `pm-auditor.md:103` and map
  value-lines `pm-auditor.md:113`; both non-blocking structural, distinct from no-prose-policing.
- ✓ **Scenario 4 — detection condition** — `pm-bootstrap.md:60` adds the token-laden-contract
  condition to `### Pending-migration detection`; surfaced at `/pm-plan` (`pm-plan.md:242`) and
  `/pm-audit` (`pm-audit.md:100`).
- ✓ **Scenario 5 — migration move-not-copy by pm-architect** — `pm-bootstrap.md:100` procedure:
  spawns `pm-architect`, moves grammar to `## Behavioral contract` as single owner, replaces with
  reference, rephrases PM sections, preserves every guarantee; worked before/after example included.
- ✓ **Scenario 6 — post-migration token-free map** — `pm-bootstrap.md` step 2 (3-part verify)
  regenerates the map with token-free PM layer, no generator change.

## Key decision (wire-tokens only, domain vocabulary allowed)

- ✓ Full flagged set (`bridge.*`, `mqtt.socketPath`, `matter_export_<…>`, `/devices/.../on`,
  `0..254`, `retain`, `QoS`) AND allowed set (`DimmableLight`, `Matter`, `fabric`) appear
  identically and verbatim in all four loci: `contract.md.tmpl`, `pm-auditor.md`,
  `pm-plan-checker.md`, `pm-bootstrap.md`. No silent divergence.

## Critical checks

- ✓ **No-prose-policing not violated.** The pre-existing no-prose-policing line is now at
  `pm-auditor.md:112` (shifted +1 by the inserted contract-dimension note at `:103`). Both new
  notes frame the lint as a STRUCTURAL token-shape match and explicitly state non-contradiction:
  `:103` "It does not contradict the no-prose-policing rule below: it never reads meaning, only
  token shapes"; `:113` "fully consistent with the no-prose-policing rule … just above". The map
  note sits immediately after `:112` and cross-references it. No collision.
- ✓ **Guarantee preservation is BLOCKING.** `pm-plan-checker.md:53` — migration
  guarantee-preservation block: compares migrated contract against original (`git show` pre-migration),
  every Must-work/Must-not-break guarantee must map to a surviving guarantee, dropped/weakened →
  **blocking**, reproduce in verdict. Mirrored in `pm-bootstrap.md` step 2 (3-part verify) as the
  required check. This is the "nothing broke" verification the PM required.

## Test plan (review checks)

- ✓ `contract-tmpl-two-layer` — confirmed (Scenario 1 above).
- ✓ `token-patterns-precise` — flagged set matches leaked tokens; allowed domain vocab not flagged;
  consistent across loci.
- ✓ `lint-is-structural-not-prose` — described as structural pattern match, non-blocking, explicitly
  not prose meaning/quality, in both pm-auditor and pm-plan-checker; consistent with `:112`.
- ✓ `detection-condition-added` — exactly one condition added; **0 lines removed** from
  pm-bootstrap.md, so v2.2/v2.3/old-format-map/README/English-canonical conditions byte-unchanged.
- ✓ `migration-move-not-copy` — relocate-to-single-owner + reference + rephrase, by pm-architect;
  worked before/after example shows a `## Out of scope` token relocated + referenced.
- ✓ `migration-preserves-every-guarantee` — procedure mandates unchanged promise set; pm-plan-checker
  compares migrated-vs-original and blocks on drop/weaken.
- ✓ `shared-grammar-single-owner` — `pm-bootstrap.md:103` "A grammar shared by several contracts
  converges on one Behavioral-contract entry referenced by all — not N copies."
- ✓ `post-migration-map-token-free` — step 2 third bullet; Acceptance-check tests still pass (code
  untouched).
- ✓ `nudge-surfaces` — `/pm-plan` and `/pm-audit` + pm-auditor note reference
  `### Pending-migration detection` by name.

## Scope boundaries

- ✓ Domain types not stripped (allow-list verbatim across loci).
- ✓ Authored prose meaning not rewritten — migration relocates technical tokens / preserves
  guarantees only (per procedure and Out of scope).
- ✓ Product-map generator NOT changed — only referenced ("no generator change needed"); generator
  files untouched.
- ✓ `architecture.md.tmpl` Behavioral contract section NOT edited (`doc/_templates/architecture.md.tmpl`
  not in diff).
- ✓ Existing migrations intact (pm-bootstrap.md fully additive, 0 removals).
- ✓ `doc/architecture.md:112` records the decision (two-layer contracts, wire-token lint, wire-only /
  allow-domain boundary, move-not-copy migration, guarantee-preservation block, live motivation).

## Plan completeness

- ✓ Stack expectations: plan declares "None" with rationale (markdown body not a tracked stack
  component) — consistent with prior two-layer slices. No stack-spec test required.
- ✓ Interaction scenarios section present (feature declared not provably isolated); all four
  interaction cases map to review checks above.
- ✓ Not a hotfix topic — no Incident facts required.
- ✓ Categorical coverage: the wire-token vs domain-vocabulary sibling is explicitly listed under
  Out of scope with a reason (PM decision; widening to all CamelCase is a separate decision).

## Definition of Done

- [x] All plan scenarios implemented and tested (review-check verification — meta-infra exception)
- [x] Interaction scenarios have concurrent-state coverage (review checks; no live contract in this
      template repo, verified against worked example per plan)
- [x] Stack expectations respected; stack-spec tests pass (none touched — declared)
- [x] Product Contract honored — no Product Contract touched (template/meta change; this repo has
      no `.ai-pm/contracts/` of its own — declared template-repo exception)
- [x] Pipeline green — `bash tests/hooks.sh` → Total: 71 Passed: 71 Failed: 0
- [x] State file updated — n/a (template repo has no `.ai-pm/state/` — declared exception)
- [x] Product Impact Report present — n/a (no contract touched)
- [x] Docs updates landed — all 7 listed docs present in branch: `contract.md.tmpl`, `pm-auditor.md`,
      `pm-plan-checker.md`, `pm-bootstrap.md`, `pm-plan.md`, `pm-audit.md`, `doc/architecture.md`
- [x] Expected artifacts exist — plan present; this review present; no contract (not user-facing —
      meta/template change)

**DoD: pass**

## Blocking

None.

## Notes (product)

None. The single product-layer trade-off (wire-tokens only, domain vocabulary allowed) is the
explicit PM decision recorded in the plan, encoded consistently across all four loci, and confirmed
on this review.

## Verdict

approve
