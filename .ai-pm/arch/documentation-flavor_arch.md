# documentation-flavor — design notes

## Context

The plan (`doc/features/documentation-flavor_plan.md`) **generalizes** the v2.18
`protocol-process-flavor` slice (`.ai-pm/arch/protocol-process-flavor_arch.md`): `process` →
`documentation` as the second project kind. v2.18 got the **frame** right (kind conditional-split
via a single-source `### Project kind` rule, dev-docs shared, a born-loud + greppable + downstream-
gated validation stamp, pm-coder authors the deliverable, advocate fires on a human-role subject,
no new agent/hook) but **narrowed** the deliverable to one rigid SOP. This feature keeps every
mechanism and changes three things:

1. the kind **name** (`process` → `documentation`);
2. the deliverable **shape** (one rigid SOP → open document(s): one or several files, md / diagrams /
   images, in a dedicated repo location; SOP becomes one optional starter);
3. the validation, tier, and template wording (SOP-specific → documentation-general).

This is a **protocol-spec / agent-prompt change** to the template repo itself — no runtime, no
shared mutable state. Every "structural choice" below is *where a rule lives in the spec* and *which
artefact a name points at*, judged against the protocol's binding patterns: **single-source-of-
conditions** (one canonical list, referenced by name, never re-encoded), **soft-enforcement + load-
bearing stamp** (born-loud `NOT YET RUN`, greppable `— passed`, enforced at a downstream gate),
**reuse-not-new-surface** (no new agent/hook/command), **presence-not-quality** (the advocate flags
absence, never grades), **back-compat default** (`absent ⇒ software`, software byte-unchanged), and
the **`doc/`-vs-`docs/` trap** (template-repo authoring path `doc/` vs downstream canon `docs/`).

This meta-feature is itself gate-exempt (subjects = agents/process, repo = no-contract exception);
the mechanisms it ships must fire for **downstream** documentation-kind projects.

## Adjacent implementations (the patterns each fork must respect)

1. **The v2.18 `process`-flavor surface (the base to generalize).** Live in: `WORKFLOW.md`
   `### Project kind` (single-source rule + rider + no-code validation discipline + Pass-2 routing) +
   `### Foundational product questions` `Tier: process`; `.claude/commands/pm-bootstrap.md` (Q0 +
   Process-kind scaffolding); `.claude/agents/pm-coder.md` (deliverable-vs-canon remit);
   `pm-plan-checker.md` (born-loud `## Dry-run` + DoD line + Pass-2 reinterpretation); `pm-pr-prep.md`
   step 0 + hard rule; `pm-auditor.md` dim 1; `doc/_templates/process.md.tmpl` + `CLAUDE.md.tmpl`
   line; `README.md` line 203. Every conditional **references `### Project kind` by name** and never
   re-encodes the enum or the default — the property the rename must preserve.
2. **`### Pending-migration detection` in `MIGRATIONS.md`** — the single source for "this project is on
   an older template structure", consumed by `pm-auditor` / `pm-audit` / `pm-plan` by name. Existing
   entries are the precedent shape for fork 5 (a positive-presence greppable anchor + a named
   remediation procedure; e.g. the *product.md header-migration* and *code-review-trail loud-marker
   normalization* are both "rename/normalize a stale line" entries — the exact class the `process`-line
   rename belongs to).
3. **The deliverable-vs-canon ownership line** (`pm-coder.md` line 50: "Author the plan's deliverable
   artefact; never touch the canonical context docs"). v2.18 already generalized "code" → "the plan's
   deliverable". Fork 2 only broadens *which file(s)* the deliverable can be, not the ownership rule.
4. **The review-stamp gate** (born-loud `## X: NOT YET RUN` → greppable `## X: <date> — passed`,
   enforced presence-keyed at `pm-pr-prep` step 0 + `pm-auditor` dim 1). The software `## Code review`
   path is byte-load-bearing (v2.14) and must stay byte-unchanged. Fork 3 generalizes the *process*
   half of this triad only.
5. **The advocate tier mechanism** (`### Foundational product questions`, tiers `per-feature` |
   `bootstrap` | `process`; advocate + relay + backstops reused, only the question *source* gains a
   tier). Fork 4 renames and generalizes the tier in place.

## Behavioral risks in this area

No event-driven code. The feedback-loop analogue is **rename drift / silent back-compat breakage**:

- A consumer that still says `process` after the rename = a **dangling kind reference** → the
  single-source-by-name property breaks (a value no longer in the enum). The load-bearing check is a
  clean grep: **no live `process` *kind* reference remains** (excluding the MIGRATIONS detection
  anchor, which intentionally names the stale value).
- The rename turns the enum into `software | documentation`, which makes a pre-existing
  `## Project kind: process` line (an early-v2.18 adopter) an **UNKNOWN value**. If "unknown" has no
  defined fallback, that adopter silently loses the flavor *or* hard-errors — exactly the back-compat
  drift the single-source default exists to prevent. Closed by fork 6 (extend the default to
  *absent OR unrecognized ⇒ software*) plus fork 5 (a migration entry that renames the stale line).

---

## Fork 1 — deliverable LOCATION convention

The deliverable document(s) live in their **own** repo place (the `src/`-analogue), distinct from
`docs/` (dev-docs canon) and `.ai-pm/` (protocol working area). The location must be single-sourced,
collision-free, and referenced by name.

### Variant A (recommended) — a fixed, named `deliverable/` directory; the name single-sourced in `### Project kind`

- **Convention:** the deliverable lives under a **fixed `deliverable/` directory** at the downstream
  project root. One file (`deliverable/runbook.md`) or several (`deliverable/onboarding.md`,
  `deliverable/diagrams/topology.mmd`, `deliverable/img/rack.png`) — open shape, fork 2.
- **Single source:** state the directory **once** in `WORKFLOW.md` `### Project kind` (the
  documentation-kind paragraph): *"the deliverable document(s) live under `deliverable/` at the
  project root — the `src/`-analogue, distinct from `docs/` (dev-docs) and `.ai-pm/`."* Every
  consumer references the rule **by name** ("`### Project kind` in `WORKFLOW.md`"), never re-encoding
  the path — the same single-source discipline as the enum and the default.
- **How pm-coder knows where to write:** the **plan names the exact file(s)** under `deliverable/`
  (the plan already names the deliverable artefact for software — a path under `deliverable/` is the
  documentation analogue). pm-coder authors *the file(s) the plan names*; the `deliverable/` root is
  the standing convention, the plan picks the leaf path(s).
- **How pm-auditor / pm-plan-checker find it:** by the fixed `deliverable/` directory (presence-keyed,
  no per-project lookup, no filename special-casing) — the same way they find `docs/`. A documentation-
  kind project with an empty/absent `deliverable/` is a content gap they can flag; a software project
  has no `deliverable/` and is never flagged (kind-gated).
- **`doc/`-vs-`docs/` trap:** `deliverable/` is a *third* top-level name, deliberately unlike both
  `doc/` (template-repo authoring path) and `docs/` (downstream dev-docs canon) — no homophone
  collision. In the **template repo** there is no `deliverable/` (this repo is software-kind); only
  downstream documentation-kind projects grow one. (Optional starters live in the template repo under
  `doc/_templates/` — fork 2 — not under `deliverable/`.)

*Rationale: a fixed name is single-sourceable, presence-keyed for the gates, and collision-free —
matching how `docs/`/`.ai-pm/` are fixed conventions referenced by name, with the plan picking the
leaf path exactly as it already does for the deliverable.*

### Variant B — project-chosen location recorded in `CLAUDE.md`

- A `## Deliverable location: <path>` line in `CLAUDE.md` (next to `## Project kind`), chosen at
  bootstrap; consumers read the line.
- **Cons:** adds a **second per-project datum** the gates must read and default (what if absent? what
  if it points inside `docs/`?), reintroducing exactly the lookup-and-default surface fork 1 of v2.18
  worked to avoid. It buys flexibility no scenario needs (the plan names no requirement for a custom
  root) at the cost of a new defaulting rule and a new collision risk (`docs/`). A fixed convention is
  strictly less surface.

*Rejected: a per-project path is a new datum to store, read, and default — flexibility with no
demand, against reuse-not-new-surface.* (Repo-root docs — option (c) — is rejected outright: it
collides with `docs/`/`README.md`/project metadata and gives the gates no stable anchor.)

**Recommendation: Variant A** — a fixed `deliverable/` directory, the convention single-sourced in
`### Project kind`, the plan naming the leaf file(s); gates find it presence-keyed like `docs/`.

---

## Fork 2 — deliverable OPENNESS vs the optional SOP starter

The deliverable must be **open**: no forced section set, one or several files, md / diagrams / images.
`process.md.tmpl` becomes an **optional** starter, one shape among many.

### Variant A (recommended) — no mandated deliverable scaffold; optional opt-in starters under `doc/_templates/starters/`; SOP renamed `sop.md.tmpl`

- **No generic "deliverable" template.** The deliverable has **no** mandated shape or section set —
  bootstrap creates the `deliverable/` directory (fork 1) and stops; it does **not** drop a template
  into it. (Contrast: software bootstrap does not pre-seed `src/` with a mandatory file either.) This
  is what makes the deliverable genuinely open.
- **Optional starters the PM opts into.** Keep the v2.18 SOP content as an **opt-in** starter,
  **renamed `doc/_templates/sop.md.tmpl`** (the name `process.md.tmpl` carried the narrow framing the
  feature is removing). Group starters under **`doc/_templates/starters/`** so they read as "pick one
  if it fits" rather than "the deliverable template": `starters/sop.md.tmpl` (the v2.18 SOP, content
  preserved) and `starters/guide.md.tmpl` (a light generic reference-doc skeleton: Audience / Scope /
  Sections / References). The PM names a starter at plan time (or none); pm-coder copies it as the
  *seed*, then authors freely — a starter is a starting point, never a contract.
- **Bootstrap scaffolds without forcing a shape.** On `kind = documentation`, `/pm-bootstrap`:
  creates `deliverable/`; records the `deliverable/`-location convention is in force; does **not**
  author any deliverable file; lists the available starters as an *offer*. The first feature's plan
  decides whether to seed from a starter. (This replaces v2.18's "create `process.md` from the
  template" step, which baked the SOP in.)
- **Diagrams/images first-class.** State explicitly in `### Project kind` that the deliverable
  **accommodates non-md**: pm-coder **authors text-based diagrams** (mermaid `.mmd`, ascii fenced in
  md) as deliverable content under `deliverable/`; **raster images are human-supplied** and pm-coder
  **references** them (`deliverable/img/...`), never fabricates binaries. pm-coder's existing remit
  ("author the plan's deliverable artefact") already covers authoring text-form artefacts; the only
  addition is the explicit "diagrams = first-class deliverable, images = referenced" sentence.
- **markdownlint stays the structural pre-gate** (MD022/MD032) on all md under `deliverable/` and
  `docs/`; no diagram linter in v1 (a stack-notes entry *if* added later — out of scope per plan).

*Rationale: "open" means no mandated template — only opt-in starters; renaming the SOP to
`sop.md.tmpl` and shelving it under `starters/` makes it visibly one shape among many, while
keeping diagrams/images first-class with one explicit remit sentence and no new pm-coder surface.*

### Variant B — a single generic `deliverable.md.tmpl` with optional sections

- One scaffold with all-optional headers, SOP demoted to a comment.
- **Cons:** a single template, even all-optional, still **suggests a shape** (people fill the headers
  they see) and is the wrong frame for a diagrams/images-only deliverable. It re-creates the v2.18
  narrowing in a softer form. "Open" is best expressed by *no* mandated scaffold + named opt-in
  starters, not one fuzzy template.

*Rejected: a generic scaffold still nudges a shape and mis-serves non-prose deliverables; openness =
absence of a mandated template.*

**Recommendation: Variant A** — no mandated deliverable scaffold; opt-in starters under
`doc/_templates/starters/` (`sop.md.tmpl` = the renamed v2.18 SOP, `guide.md.tmpl` = a light
reference skeleton); diagrams authored / images referenced, stated once in `### Project kind`.

---

## Fork 3 — VALIDATION-STAMP generalization

v2.18 has `## Dry-run: NOT YET RUN → <date> — passed`, gated by `pm-pr-prep` step 0 + `pm-auditor`
dim 1. Validation now depends on doc type: **actionable** (SOP/runbook) → dry-run/tabletop;
**reference** (guide/spec/diagram) → editorial review + expert sign-off.

### Variant A (recommended) — ONE generalized `## Validation` stamp covering both; the plan declares which validation; software `## Code review` byte-unchanged

- **One stamp, born-loud, greppable, presence-keyed** — clones the review-stamp triad exactly:
  - `pm-plan-checker` writes the documentation-kind review file born loud with
    **`## Validation: NOT YET RUN`** (never an empty `## Validation` heading).
  - After the validation clears, the orchestrator **replaces the whole line** with
    **`## Validation: <date> — <method> — passed`** (greppable `^## Validation:.*— passed$`), where
    `<method>` ∈ `dry-run` | `sign-off`, and records observations as `## Validation findings` above
    it (the analogue of `## Code review findings` / `## Dry-run findings`).
  - **Gates unchanged in shape, presence-keyed:** `pm-pr-prep` step 0 and `pm-auditor` dim 1 block a
    `## Validation` section that is not stamped `— passed`. A file with **no** `## Validation` section
    (every software review file) is exempt — no filename special-casing.
- **Why one stamp, not `## Dry-run` + `## Sign-off`:** two stamps would force the gates to learn
  which one is required per doc-type (a doc-subtype lookup in `pr-prep`/`auditor`) and risk a file
  carrying one stamped + one born-loud → a confusing half-gate. **One** stamp with a `<method>` field
  keeps the gate logic identical to today (one section, presence-keyed) while the *content* (the
  `## Validation findings` body + the `<method>` token) records whether it was a tabletop or an
  editorial sign-off. The gate cares only that *the doc-type's validation passed*, which is exactly
  what one stamp expresses.
- **Who decides which validation:** **the plan** declares it (the actionable-vs-reference call is a
  per-feature judgement the PM/plan owns), and `pm-plan-checker` records the chosen `<method>` in the
  born-loud stamp + the kind-conditioned DoD line. The advocate's `documentation` tier (fork 4)
  surfaces *whether a validation method was chosen* as a presence check; it never grades the choice.
  A doc-subtype could *default* the method (actionable→dry-run, reference→sign-off) but the plan
  remains the authority — keep the decision in the plan, not hard-wired to a subtype, so a reference
  doc that warrants a tabletop can still ask for one.
- **Software `## Code review` byte-unchanged.** The software Pass-2 path is **not touched** — no
  rename of `## Code review`, no shared stamp across kinds. `## Validation` is the *documentation*-
  kind stamp only; `## Code review` is the *software*-kind stamp only; both ride the same gates
  presence-keyed. (The v2.18 `## Dry-run` token is **absorbed into** `## Validation` with
  `<method> = dry-run`, since `process` had ~zero adoption — fork 5/6 — so no `## Dry-run`
  back-compat is owed beyond the migration nudge.)
- **Pass-2 routing** (`WORKFLOW.md` Step 5): `software` (and kind-absent) ⇒ `code-review` (untouched,
  byte-for-byte); `documentation` ⇒ **editorial review + structural-lint pre-gate + the doc-type's
  validation gate** (`## Validation`). One conditional keyed on `### Project kind` by name.

**Drop-in stamp shape:**

```markdown
## Validation findings
<tabletop observations / editorial review notes / expert sign-off record>

## Validation: 2026-06-04 — dry-run — passed
```

(born loud as `## Validation: NOT YET RUN`; `<method>` ∈ `dry-run` | `sign-off`.)

*Rationale: one presence-keyed stamp keeps the gate logic byte-identical to today while the
`<method>` field + findings body carry the doc-type distinction; the plan owns the actionable-vs-
reference call; the software `## Code review` path is left entirely alone.*

### Variant B — keep `## Dry-run` and add a parallel `## Sign-off` stamp

- Two doc-type-specific stamps, each gated.
- **Cons:** doubles the section vocabulary the gates must reason about (which is required? both? one?)
  and creates the half-gate failure mode (one stamped, one loud). It also strands the v2.18 `## Dry-run`
  token as a third live concept. More surface, no benefit — the gate only needs "the doc-type's
  validation passed", which one stamp + a `<method>` field expresses cleanly.

*Rejected: two stamps multiply gate logic and risk a half-stamped file; one `## Validation` stamp
with a method field is strictly less surface and presence-keyed identically to today.*

**Recommendation: Variant A** — one born-loud `## Validation: NOT YET RUN → <date> — <method> —
passed` stamp (method ∈ dry-run | sign-off), the plan declaring the method, the gates unchanged
presence-keyed, the software `## Code review` path byte-untouched.

---

## Fork 4 — the `documentation` foundational-questions TIER

Rename `Tier: process` → `Tier: documentation`; advocate / relay / backstops reused verbatim.

### Variant A (recommended) — ONE general documentation-completeness tier (superset), presence-only, fixed-order, single-source

- A single `Tier: documentation` in the single-source `### Foundational product questions`, passed as
  `tier: documentation`, **superseding** the SOP-specific RACI/SIPOC questions with a doc-type-general
  completeness set that **covers both actionable and reference** docs (an unanswered question is the
  flag; a question that's genuinely N/A for a pure reference doc is answered "N/A — reference doc",
  which is a recorded answer, so it does not flag — the standard presence semantics).

**Drop-in tier:**

```markdown
**Tier: documentation** (one feature on a `documentation`-kind project — per `### Project kind`;
the reader / operator is a human role, so the advocate fires; inputs = the plan + the Product
Contract + the deliverable file(s) under `deliverable/` + `docs/user-journeys.md`). Presence-only,
fixed order, never grading the prose:

1. Audience — who is this document for (the reader / operator role)?
2. Scope — what does it cover, and what does it explicitly NOT cover (the No-Gos)?
3. Coverage — does it cover the whole stated scope end to end (no silent gaps)?
4. Decision points — where does the reader / operator branch, and on what condition?
   (For a reference doc with no branches: "N/A — reference doc".)
5. Exceptions / failure handling + recovery — what happens when a step or assumption fails, and how
   does the reader / operator recover? (For a pure reference doc: "N/A — reference doc".)
6. Zero-to-done — what does a first complete run, from nothing to the finished outcome / fully
   understood document, look like?
```

- **Superset mapping:** these subsume the v2.18 SOP five (roles→audience, prerequisites→scope,
  decision-points, exceptions/recovery, zero-to-done) while generalizing to reference docs
  (audience/scope/coverage are the reference axis). RACI/SIPOC are no longer *named* in the tier
  (they were SOP jargon); a project that *is* an SOP recovers them from the `sop.md.tmpl` starter
  (fork 2), which still carries the RACI/SIPOC tables — the tier asks the *general* question, the
  starter supplies the *SOP shape*.
- **Reused verbatim:** advocate, its relay (one `AskUserQuestion` pass), and its backstops
  (`pm-plan-checker` DoD, `pm-auditor` dim 1) — only the question *source* gains the renamed tier.
  The reader/operator is a human role, so the human-role-subject extraction **fires** on a
  documentation-kind feature, exactly as for `process`. This meta-feature stays exempt (subjects =
  agents/process).

*Rationale: a tier grows by adding one fixed-order single-meaning list (the established way
`per-feature`/`bootstrap`/`process` coexist); one superset tier with two N/A-able questions covers
both doc types without overloading a question with two meanings — sub-tiers would fragment the
single-source list and force a doc-subtype lookup the advocate doesn't need.*

### Variant B — sub-tiers per doc subtype (`documentation:actionable`, `documentation:reference`)

- Two question lists selected by subtype.
- **Cons:** introduces a doc-subtype axis the advocate must resolve before picking questions (a new
  lookup), fragments the single-source list, and duplicates the shared questions (audience/scope/
  coverage) across both sub-tiers (drift risk). The N/A-able-question approach gives the same outcome
  (reference docs skip branch/recovery) with one list.

*Rejected: sub-tiers fragment the single-source list and add a subtype lookup; one superset tier with
N/A semantics is the lower-surface equivalent.*

**Recommendation: Variant A** — one `documentation` tier (audience / scope / coverage / decision-
points / exceptions+recovery / zero-to-done), presence-only with N/A-able branch/recovery questions
for reference docs; advocate/relay/backstops reused verbatim.

---

## Fork 5 — RENAME mechanics + migration

`process` → `documentation` across the single-source rule and every consumer. Enumerate the
consumers (the load-bearing check is a clean grep: no live `process` *kind* reference remains):

| File | What changes |
|---|---|
| `WORKFLOW.md` `### Project kind` | enum `software \| documentation`; the deliverable framed as open document(s) under `deliverable/` (fork 1) + diagrams/images first-class (fork 2); the no-code validation discipline generalized to the `## Validation` stamp with the doc-type method (fork 3); rider + Pass-2 routing reworded `process`→`documentation`; the `absent ⇒ software` default extended to **absent OR unrecognized ⇒ software** (fork 6) |
| `WORKFLOW.md` `### Foundational product questions` | `Tier: process` → `Tier: documentation` (fork 4) |
| `.claude/commands/pm-bootstrap.md` | Q0 enum `software \| documentation`; "Process-kind scaffolding" → "Documentation-kind scaffolding": create `deliverable/`, no mandated template, offer starters, dev-docs with stack = what/who/tools |
| `doc/_templates/CLAUDE.md.tmpl` | `## Project kind: software \| documentation` line; the `process.md` deliverable row → the open-deliverable / `deliverable/` note |
| `doc/_templates/process.md.tmpl` | renamed → `doc/_templates/starters/sop.md.tmpl` (content preserved); + new `starters/guide.md.tmpl` (fork 2) |
| `.claude/agents/pm-coder.md` | `process` → `documentation`; "the SOP document" → "the open deliverable file(s) the plan names under `deliverable/`"; the diagrams-authored / images-referenced sentence (fork 2) |
| `.claude/agents/pm-plan-checker.md` | `process` → `documentation`; `## Dry-run` born-loud + addendum + DoD line → `## Validation` (fork 3); Pass-2 reinterpretation reworded |
| `.claude/agents/pm-pr-prep.md` | step 0 + hard rule: `## Dry-run` (process) → `## Validation` (documentation); the `## Code review` rule untouched |
| `.claude/agents/pm-auditor.md` | dim 1: `## Dry-run` → `## Validation`; the `## Code review` rule untouched |
| `README.md` | the one-line capability mention `process` → "documentation projects (SOPs, runbooks, guides, diagrams)" |
| `doc/architecture.md` | update the v2.18 decision to the generalized documentation flavor (post-coding, `pm-architect` — not this review) |
| `MIGRATIONS.md` | **add** the migration entry below (decision: yes — see fork 6) |

### Migration entry — decision: ADD it (small, and it makes the rename airtight)

Adoption of `process` is ~zero (shipped hours ago in v2.18), so the *practical* migration load is
nil. But the entry is **not** about volume — it is the **airtight half of fork 6**: it converts an
UNKNOWN `## Project kind: process` line into the durable greppable anchor that the rename's safety
rests on, mirroring the existing **product.md header-migration** and **code-review-trail loud-marker
normalization** entries (both "rename/normalize a stale line, prose preserved"). Drop-in:

- **`### Pending-migration detection` anchor:** *"**Stale `process` project-kind line (documentation
  rename not applied):** an existing downstream `CLAUDE.md` carrying a `## Project kind: process`
  line. Detect by the positive presence of the literal `process` value on the `## Project kind:`
  line. A line reading `software` / `documentation` / absent is not flagged."*
- **Remediation procedure (`## Project kind: process` → `documentation`):** the orchestrator (owner
  of `CLAUDE.md` at runtime) rewrites the one line `## Project kind: process` → `## Project kind:
  documentation`. Trivial, mechanical, single-line; no other artefact moves (the v2.18 `process.md`
  deliverable, if any, stays where it is — the rename is the kind label only).

This is the **only** place `process` survives as a *named string* after the rename — intentionally,
as the detection anchor — so the clean-grep check excludes the MIGRATIONS detection line.

**Recommendation:** rename across all consumers above (clean-grep verified); **add** the small
MIGRATIONS entry — it is the durable anchor that makes fork 6 airtight, not optional cleanup.

---

## Fork 6 — back-compat + the unknown-kind question

After the rename the enum is `software | documentation`. A pre-existing `## Project kind: process`
(early-v2.18 adopter) is now an **UNKNOWN value**. The fallback must be airtight: the rename must not
silently break an early adopter.

### Variant A (recommended) — extend the default to "absent OR unrecognized ⇒ software" + flag the stale line for migration

- **Extend the one defaulting rule** in `WORKFLOW.md` `### Project kind` from *absent ⇒ software* to
  **"absent OR unrecognized ⇒ software"**: *"a project with no `## Project kind` line, or one whose
  value is not in the current enum (`software | documentation`), is treated as `software`."* Stated
  **once**, referenced by name by every consumer — no re-encoding (the existing single-source
  discipline). This guarantees a stale `process` line **never hard-errors and never silently picks a
  random branch**: it falls to the safe, byte-unchanged software default.
- **Pair it with the fork-5 migration detection** so the fallback is **non-silent**: the stale
  `process` line is *flagged* (the `### Pending-migration detection` anchor) and *remediated* (the
  one-line rename to `documentation`) — so the adopter is nudged back to their intended flavor rather
  than left silently degraded to software. Default = safety net; migration = correctness restoration.
  Together they are airtight: worst case (migration not yet run) the adopter behaves as software (no
  break); after migration they regain the documentation flavor.
- **Why software, not documentation, as the unknown fallback:** software is the byte-unchanged,
  zero-machinery default — falling *up* into documentation would activate the validation gate / tier /
  rider on a project that never asked for them (a louder, more surprising failure than reverting to
  the inert default). Unknown ⇒ the *quietest* known kind.

*Rationale: extending the existing single default rule to cover "unrecognized" closes the only new
back-compat hole the rename opens, with zero new mechanism; the fork-5 migration entry makes the
fallback non-silent so an early adopter is corrected, not silently downgraded.*

### Variant B — treat unknown as a blocking error

- `pm-auditor` / consumers hard-fail on an unrecognized kind.
- **Cons:** a hard fail on a value that *used* to be valid punishes the early adopter for upgrading
  the submodule — the opposite of the back-compat guarantee. The protocol's discipline is *soft-
  enforce + safe default + non-silent flag*, not hard-error on stale state. (The migration entry, not
  an error, is how the protocol handles stale structure everywhere else.)

*Rejected: hard-erroring on a previously-valid value breaks an upgrading adopter; the protocol's
pattern is safe-default + migration-nudge.*

**Recommendation: Variant A** — extend the single default to **absent OR unrecognized ⇒ software**,
paired with the fork-5 migration detection so a stale `process` line is safely defaulted *and*
non-silently flagged for the one-line rename. Software-kind / absent-kind behavior stays
byte-unchanged.

---

## Cross-cutting note for the plan

The plan is sound and needs no revision; these are the structural resolutions it explicitly deferred.
Three load-bearing emphases for implementation:

1. **Single-source, by name, no re-encoding.** Every new/renamed conditional (the `deliverable/`
   location, the `## Validation` stamp + method, the `documentation` tier, the extended default) keys
   on the **one** `### Project kind` rule and references it by name. Re-encoding the enum, the path, or
   the default in any consumer reintroduces the drift the single-source pattern prevents.
2. **The software path is byte-untouched.** `## Code review`, Pass-2 software routing, the change-type
   rows, and `absent ⇒ software` are unchanged; `## Validation` is documentation-only and rides the
   existing gates presence-keyed.
3. **The clean-grep check is the rename's gate.** After the rename, no live `process` *kind* reference
   may remain anywhere **except** the intentional `MIGRATIONS.md` detection anchor; that one survivor
   is what makes fork 6 airtight.
