# readme-template-canonical-shape — design notes

## Context

The feature restructures the **downstream** README template
(`doc/_templates/README.md.tmpl` — scaffolded to every project's `README.md` at
`/pm-bootstrap`) to the canonical front-door shape **что→зачем→install→details→license**,
and gives `pm-architect` an authoring rule so it maintains downstream READMEs to that
shape. It is the downstream-template follow-up to `readme-rewrite` (v2.24.1), which
applied the shape to the protocol's own README.

The load-bearing tension is the "зачем" beat. A naive reading of the canonical shape
wants a "why you need it / what it does" section — but that is exactly the
**second capability statement** the README **front-gate** discipline removed (move-not-copy
migration in `MIGRATIONS.md`; `docs/product.md` `## What it does today` is the single
owner of "what it does / for whom / limits"). The plan's resolution: the "зачем" beat
*is* the existing front-gate pointer line `→ … docs/product.md`, owned there, referenced
not restated. The arch-review questions are whether that reconciliation is the cleanest
expression, and how much (if any) auditor enforcement it earns.

This is a **meta-feature on the template repo**: software-kind, non-user-facing, no
runtime, no shared state. Provably isolated.

## Adjacent patterns

1. **The README front-gate machinery** — `pm-auditor.md` old-template-README check
   (`README.md` structure-only, non-blocking: a `## What it does` heading → note);
   the **README front-gate migration** in `MIGRATIONS.md` (move-not-copy reconcile-then-remove,
   performed by `pm-architect`); the `### Pending-migration detection` condition
   "Old-template README (front-gate not applied)". The detector keys on the **positive
   presence of a `## What it does` heading** — that single greppable token is the whole
   contract. The migration's step 2 already specifies the exact pointer line and "preserve
   Quick start / install verbatim to keep A4 valid."

2. **`pm-architect`'s A4 cross-check** — `Integration contract ↔ README install` is one of
   exactly three A4 pairings (the others: File layout ↔ tree, Release flow ↔ CI). A4 needs
   the README to *have* an install section as a cross-check target; it does not care about
   the README's section *order*.

3. **The current template** (`doc/_templates/README.md.tmpl`) — already carries: intro
   paragraph → `docs/product.md` pointer → `## Quick start` → `## Architecture` (+ pointer)
   → `## Development` (+ CLAUDE.md pointer) → `## License`. It is **already substantially on
   the canonical shape**; this slice is mostly codifying the order + naming the beats in a
   guidance comment, not a structural rewrite.

4. **The `docs/product.md` header-migration** (sibling owner-performed migration) — same
   pattern as the front-gate: `pm-architect` is the owner that performs an in-place,
   prose-preserving edit; the auditor only *detects* and points at the migration, never
   prose-polices.

## Settled (not a fork)

- **Q1 — the reconciliation is correct.** "зачем beat = the `docs/product.md` pointer
  line" is the right resolution, and there is no cleaner expression for a *thin front-gate*
  README. The canonical shape's "why you need it" is a **pointer to the owner**, not an
  owned statement — that is precisely what keeps the README a front gate. Any alternative
  that puts "why" prose *in* the README re-owns a capability/value statement and re-creates
  the drift. **Validity preserved:** (a) the `pm-auditor` old-template-README check keys on
  presence of `## What it does` — the canonical template carries no such heading, so the
  check still passes and still fires on un-migrated READMEs; (b) A4 `Integration contract ↔
  README install` stays valid because the install section is **kept** (reordered/renamed at
  most), so the cross-check target survives. Neither check observes section *order*, so the
  reordering is invisible to both.

- **Q3 — install-near-top and the "details" grouping are sound.** For a thin front gate,
  install is the README's primary *actionable* content (the reader's first job is "how do I
  run this"), so install-near-top (right after the pointer) is correct. The "details" tier
  (architecture one-liner + `docs/architecture.md` pointer; development test/lint +
  `CLAUDE.md` pointer; other doc pointers) is the right grouping — these are *deeper-dive
  pointers*, correctly below install. **Keep verbatim for A4:** the `## Quick start` install
  fenced block and the `## License` section — these are the A4 target and the canonical
  tail; preserve their structure so the cross-check and the license expectation hold. The
  `→ … docs/product.md` pointer line must be preserved **byte-for-byte** as the front-gate
  detector's negative-space contract (its *absence* of a `## What it does` heading is what
  the auditor checks; the pointer line is what the migration installs).

- **The authoring rule (Scenario 3) is settled, not a fork** — `pm-architect` is already
  the README front-door owner (it performs the front-gate migration). Adding a one-paragraph
  canonical-shape authoring rule in its README/front-door area is the natural counterpart to
  the template skeleton. It must **reference** the front-gate discipline (no capability
  statement; зачем = product.md pointer), not restate it.

## Variant A: template + authoring rule only — no new auditor check (Q2)

- **Where:** edit `doc/_templates/README.md.tmpl` (order + top guidance comment naming the
  beats) and `.claude/agents/pm-architect.md` (canonical-shape authoring rule). No
  `pm-auditor` change.
- **Relation to adjacent:** symmetric with how the front-gate itself is governed — the
  *template* + the *owning agent's rule* are the mechanism; the auditor carries exactly
  **one** structural README check (presence of `## What it does`), and that one already
  catches the drift this feature is most worried about.
- **Pros:** Proportional. The auditor's README surface stays a single, provably
  shape-not-meaning token check. No risk of prose-policing legitimately-varied downstream
  READMEs (a real project may reasonably add a Contributing / Badges / Screenshots section,
  reorder for its audience, or omit a section the template suggests). No over-fire, no
  two-consecutive-audits escalation of a false positive to blocking.
- **Cons:** No machine guard that a *human-authored* downstream README drifts off the
  canonical order or drops the install/license. But: A4 already guards "install present"
  (its cross-check has no target otherwise), and the front-gate check already guards the
  one drift that re-introduces a parallel capability owner. The residual gap (pure section
  *ordering*) is cosmetic and order-is-not-meaning.
- **Risks:** essentially none new; relies on template + agent rule as the enforcement,
  which is the established pattern for every prior meta-feature.

## Variant B: add a light presence-only `pm-auditor` canonical-shape note (Q2)

- **Where:** a new structure-only, non-blocking `pm-auditor` note — e.g. "downstream
  README missing front-gate pointer / install / license."
- **Relation to adjacent:** would sit beside the old-template-README check as a second
  README structural check.
- **Pros:** a machine backstop for a README that drops install or license.
- **Cons / why it over-reaches:**
  - **Redundant on the load-bearing parts.** "front-gate pointer present" is the *inverse*
    of the existing `## What it does`-presence check (the migration installs the pointer
    when it removes the list); "install present" is already implied by A4 (no install → no
    A4 target → A4 surfaces it). The genuinely-new coverage is only "license present" — a
    thin, low-value addition.
  - **Crosses toward prose-policing / over-fire.** A presence check on *suggested template
    sections* punishes legitimate variation — the exact failure mode the plan and the
    auditor's own "never prose-police the README's wording" rule warn against. A README that
    legitimately omits or renames a section would false-fire, and the dimension-wide
    two-consecutive-audits rule could escalate that false positive to **blocking**.
  - **Asymmetric with the front-gate's own governance** — the front-gate ships *one* README
    token check on purpose; adding a second structural README check this slice is scope the
    plan explicitly defaults against.
- **Risks:** over-fire on varied READMEs; false-positive escalation to blocking; auditor
  surface creep into structure it shouldn't own.

## Recommendation

**Variant A** — template restructure + `pm-architect` authoring rule, **no new
`pm-auditor` check this slice.** The existing old-template-README front-gate check and A4
already guard the two things that matter (no parallel capability owner; install present);
a presence-only shape check adds only "license present" while opening real over-fire /
prose-policing risk against legitimately-varied downstream READMEs. The template + the
owning agent's authoring rule are the proportional mechanism, consistent with how every
prior meta-feature (and the front-gate itself) is governed.

## Decision-record-or-not (Q4)

**Below the bar — no `doc/architecture.md` decision record.** This is a documentation-template
restructure (the template was already substantially on the shape) plus an agent authoring
rule — additive, no migration, no runtime, no new architectural axis. It is the same
category as a small additive change. The *substantive* architectural decision (README is a
thin front gate that owns no capability statement; `docs/product.md` is the single
capability owner) was **already recorded** when the front-gate landed — this slice
**honors and reuses** that decision rather than making a new one. Recording a decision here
would duplicate, not add. Recommend omitting the decision record (as the plan's "Docs to
update" already leans).

## Risks for the PM

- **The over-fire risk to name (Q1):** the durable hazard is a *future* reader or agent
  "completing" the canonical shape by adding a "Why / Что умеет" capability section back
  into the README — re-creating the exact second-capability-statement drift the front-gate
  removed. The top **guidance comment** in the template is the primary guard: it must state
  the front-gate rule explicitly ("зачем = the `docs/product.md` pointer; the README owns
  **no** capability/value section"), not merely list beat names — otherwise "зачем" reads as
  an invitation to write a why-section. The `pm-architect` authoring rule must carry the same
  explicit prohibition. The auditor's existing `## What it does`-presence check is the
  machine backstop *if* the re-added section uses that heading; a differently-titled
  why-section would slip the check — which is an argument for clear guidance prose, **not**
  for a broader auditor shape-check (Variant B's over-fire cost outweighs catching this
  edge).
- **A4 fragility:** keep the `## Quick start` install block as the A4 target. If a future
  edit removes/renames it past recognition, A4 loses its README install target — preserve
  the install section structure verbatim.
- **Pointer line is contract, not prose:** the `→ … docs/product.md` line is the front-gate's
  installed artifact; preserve it byte-for-byte (it is what the front-gate migration writes).
