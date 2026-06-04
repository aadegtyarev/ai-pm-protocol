# documentation-flavor — plan

*(protocol change to the ai-pm-protocol template repo itself; scenario subjects are the bootstrap process / agents — non-human — so the product-readiness gate is exempt and this repo is the no-contract exception)*

## Context

Follow-up correction to v2.18.0 (`protocol-process-flavor`), which shipped **too narrow**. PM's
corrected vision (2026-06-04, confirmed): in a documentation project the **created document(s)
are "the source code"** — one or several, of **open form** (md, diagrams, images). The
development-documentation layer (architecture, stack, threats, scenarios) stays exactly as in a
software project, **minus code-dependent specifics**; "stack" reframes to "what/who we work
with" (people, tools). The deliverable lives in its **own place in the repo** (like `src/`),
separate from the dev-docs in `docs/`. Diagrams and images are **first-class** deliverables, not
only md.

v2.18 got the FRAME right (kind conditional-split, dev-docs shared, dry-run gate, pm-coder
"author the plan's deliverable artefact", advocate gap-finding, no new agent/hook) but narrowed
the deliverable to a single rigid SOP. This feature **generalizes process → documentation**.

PM decisions 2026-06-04 (AskUserQuestion): kind name = **`documentation`**; proceed now (no new
research — design settled). The audit (2026-06-04) is done; docs are current.

## Key design decisions

(settled by the conversation; the structural HOW goes to the arch review)

1. **Generalize, don't re-architect.** Keep every v2.18 mechanism; this feature **renames**
   `process` → `documentation`, **opens** the deliverable, and **generalizes** the
   template/tier/validation from SOP-specific to documentation-general. Reuse-not-new-surface.
2. **Rename `process` → `documentation`** across the single-source `### Project kind` rule + every
   consumer (WORKFLOW rider + Pass-2 routing + the foundational-questions tier; pm-bootstrap;
   pm-coder; pm-plan-checker; pm-pr-prep; pm-auditor; CLAUDE.md.tmpl; README; doc/architecture.md).
   Back-compat: `process` shipped only in v2.18 (hours ago) → ~zero downstream adoption → clean
   rename; the `absent ⇒ software` default is untouched and software behavior stays byte-unchanged.
3. **The deliverable is document(s) of open form in a dedicated location.** Not a single SOP —
   one or several documents (md, diagrams, images) living in a dedicated repo location (the
   `src/`-analogue), **distinct from `docs/`** (dev-docs). The exact location convention is an
   arch-review fork (e.g. a `deliverable/` dir vs project-chosen vs repo-root).
4. **`process.md.tmpl` → an OPTIONAL SOP starter**, one shape among many (not the mandated
   deliverable). There is a lighter generic notion: the deliverable has no forced section set;
   optional starter templates (SOP, and possibly a generic doc/guide) are opt-in.
5. **Diagrams/images first-class.** `pm-coder` can author text-based diagrams (mermaid/ascii) as
   the deliverable; raster images are human-supplied/referenced. The deliverable artefact
   accommodates non-md; pm-coder's remit ("author the plan's deliverable artefact") already
   covers it.
6. **Dev-docs apply, minus code-specifics.** architecture / stack-notes / threats / journeys all
   apply; **stack-notes reframed as "what/who/tools"** (people, instruments, company systems &
   standards), not libraries/runtime. (The reframe is a wording/guidance change, not a new
   section.)
7. **Validation fits the document type.** The dry-run/tabletop is the load-bearing gate for
   **actionable** docs (SOP/runbook); for **reference** docs (guide/spec/diagrams) validation is
   **editorial review + expert sign-off** (the dry-run may be N/A). The load-bearing stamped gate
   stays — generalize from "dry-run" to "the document-type's validation passed" while keeping it
   non-silent (the review-stamp pattern). Exact stamp generalization → arch review.
8. **Foundational-questions `process` tier → `documentation` tier** — generalize the gap-questions
   from SOP-specific (roles/RACI/SIPOC) to document-completeness that fits the doc type (for an
   SOP: roles/steps/exceptions; for a guide/spec: audience/scope/coverage). One general
   documentation tier vs sub-shapes → arch review. Advocate + relay + backstops reused verbatim.
9. **Back-compat airtight.** `absent ⇒ software` unchanged; a software-kind project (incl. this
   repo) is byte-unchanged. Whole-project kind in v1 (per-feature artifact-kind axis still
   deferred — backlog).

## Architecture outcomes (arch review — Variant A on all 6 forks)

See `.ai-pm/arch/documentation-flavor_arch.md` for full rationale. Resolved shapes the coder follows:

1. **Deliverable location = a fixed `deliverable/` directory** at the downstream root (single-sourced in `### Project kind`; the plan names the leaf file(s)); gates find it presence-keyed like `docs/`. Collision-free vs `doc/`/`docs/`/`.ai-pm/`.
2. **No mandated deliverable scaffold** (openness = absence of a forced template). Opt-in starters live under `doc/_templates/starters/`: `sop.md.tmpl` (the renamed v2.18 SOP) + `guide.md.tmpl` (a light reference skeleton). Diagrams authored (mermaid/ascii), images referenced — stated once in `### Project kind`.
3. **ONE generalized validation stamp:** born-loud `## Validation: NOT YET RUN` → `## Validation: <date> — <method> — passed` where **method ∈ `dry-run` | `sign-off`**; the **plan declares the method** (actionable → dry-run; reference → sign-off). This **absorbs** the v2.18 `## Dry-run` token (method=`dry-run`) — gates (pm-pr-prep step 0 + pm-auditor dim 1) stay presence-keyed and byte-identical in logic; the software `## Code review` path is **byte-untouched**.
4. **ONE general `documentation` tier** in `### Foundational product questions` (audience / scope / coverage / decision-points / exceptions+recovery / zero-to-done), presence-only, with branch/recovery questions **N/A-able** for reference docs; advocate/relay/backstops reused verbatim. No sub-tiers.
5. **Rename `process` → `documentation`** across every consumer (clean-grep verified) **AND add** a `MIGRATIONS.md ### Pending-migration detection` entry for a downstream `## Project kind: process` line → `documentation` (the durable greppable anchor that makes #6 airtight, mirroring the existing rename entries).
6. **Back-compat: extend the single default to `absent OR unrecognized ⇒ software`** — a stale `## Project kind: process` (early v2.18 adopter) is safely defaulted to software **and** non-silently flagged for the one-line rename by #5. No new mechanism; unknown ⇒ the quietest known kind, never a hard error.

## Scenarios

1. **Bootstrap asks `software | documentation`.** `/pm-bootstrap` asks the project kind; on
   `documentation` it scaffolds the documentation flavor; `software`/absent = today's flow.
2. **The deliverable is open document(s) in a dedicated location.** A documentation project's
   produced artefact(s) — md, diagrams (mermaid/ascii), referenced images — live in a dedicated
   repo location distinct from `docs/`; the deliverable is not forced into a single SOP shape.
3. **SOP is an optional starter.** A project that *is* an SOP/runbook can start from the optional
   SOP template; a guide/spec/diagram project does not.
4. **Dev-docs apply, code-specifics inert.** architecture/stack/threats/journeys apply (stack =
   what/who/tools); tests + Pass-2 `code-review` + build pipeline are inert (the v2.18 rider,
   renamed to `documentation`).
5. **Validation fits the doc type.** Actionable docs → dry-run/tabletop load-bearing stamped gate
   (Step 5.5); reference docs → editorial review + expert sign-off; the gate stays non-silent.
6. **Advocate finds documentation gaps.** On a documentation-kind feature the advocate fires
   (operator/reader = human role), generating documentation-completeness gaps from the
   `documentation` tier; relayed in one `AskUserQuestion`; blocks handoff until answered/descoped.
7. **Rename is consistent.** No live `process` kind reference remains; `### Project kind` and all
   consumers say `software | documentation`; software behavior byte-unchanged; absent ⇒ software.
8. **Diagrams/images are first-class deliverables.** A deliverable consisting of diagrams/images
   (with minimal md) is valid; the flow does not demand prose-only.

## Existing behaviors this feature touches

(what must not break)

- **The v2.18 process-flavor mechanisms** — kind rule, rider, Pass-2 routing, dry-run stamp,
  advocate tier, pm-coder remit, `process.md.tmpl` — all are renamed/generalized, none removed.
- **Software-kind / absent-kind behavior** — byte-unchanged; this template repo stays software.
- **`/pm-bootstrap`** — the kind question stays; only the `process`→`documentation` label + the
  scaffolding (open deliverable, optional SOP starter) change.
- **The dry-run stamp gate** (pm-pr-prep step 0 + pm-auditor dim 1) — generalized to the
  document-type's validation stamp; the `## Code review` software path untouched.
- **`tests/hooks.sh`** — green; no hook added.
- **Application-agnostic constraint** — examples cross-domain (device SOP, server diagnosis,
  board soldering, a user guide).

## Contracts

(protocol-internal — repo's no-contract exception)

- **`### Project kind` enum** → `software | documentation` (was `software | process`); single
  source in WORKFLOW.md; `absent ⇒ software`.
- **Deliverable location** — a dedicated repo location for the produced document(s), distinct
  from `docs/`; convention set in the arch review.
- **Optional starter template(s)** — `process.md.tmpl` demoted to an opt-in SOP starter (rename
  TBD, e.g. `sop.md.tmpl`); the deliverable itself is open (no forced sections).
- **`documentation` foundational-questions tier** — generalized gap-questions; advocate reused.
- **Validation stamp** — generalized from `## Dry-run` to the document-type's validation
  (actionable → dry-run; reference → editorial+sign-off); load-bearing, non-silent.

## Stack expectations touched

- **markdownlint** — the deliverable + dev-docs stay blank-line-correct (MD022/MD032); structural
  pre-gate, unchanged from v2.18. No new validator. (If the arch review adds a diagram linter,
  that becomes a stack-notes entry then.)
- No frontmatter-structure change; agent behavior is prompt-body.

## Interaction scenarios

Protocol-spec change — no runtime, no shared mutable state. Mechanism interactions:

- A **software-kind / absent** project: documentation machinery dormant; behavior byte-unchanged.
- A **documentation-kind** feature in the review loop: Pass-2 → editorial + the doc-type
  validation (dry-run or sign-off), not `code-review`; the stamp gate fires non-silently.
- The **rename**: any lingering live `process` reference would break the by-name single-source —
  the load-bearing check is a clean grep (no live `process` kind reference remains).
- **This template repo** dogfooding `/pm-audit`: stays software-kind → documentation dimension
  silent (no false flag), exactly as the v2.18 `process` did.

## Test plan

- **Existing tests that must pass:** `tests/hooks.sh` (green) — unaffected; run to confirm.
- **New executable tests:** none — repo "no automated tests by design"; editorial + by-use.
- **Editorial verification** (`pm-plan-checker` + `code-review`): the rename is complete on the
  live surface (no `process` kind reference; `software | documentation` everywhere, by name); the
  deliverable is open (document(s)/diagrams/images in a dedicated location, not a forced SOP); the
  SOP template is demoted to optional; the `documentation` tier generalizes the gap-questions;
  validation fits the doc type with a non-silent stamp; back-compat `absent ⇒ software` intact and
  software rows byte-unchanged; no new command/agent/hook; `.claude/settings.json` untouched.
- **Optional post-land dogfood (validation by use):** bootstrap a throwaway documentation-kind
  project for the device-integration SOP and a guide, confirm the open-deliverable + doc-type
  validation flow.

## Docs to update

- `WORKFLOW.md` — rename `process` → `documentation` in `### Project kind` + the rider + Pass-2
  routing + the foundational-questions tier; generalize the no-code validation discipline to "fit
  the document type" (actionable → dry-run; reference → editorial+sign-off) with a non-silent
  stamp; reframe the deliverable as open document(s) in a dedicated location; the optional
  composition note stays. *`pm-coder`.*
- `.claude/commands/pm-bootstrap.md` — `software | documentation` question + the documentation
  scaffolding branch (open deliverable location, optional SOP starter, dev-docs with stack =
  what/who/tools). *`pm-coder`.*
- `doc/_templates/` — demote `process.md.tmpl` to an optional SOP starter (rename per arch
  review); ensure the deliverable is not a mandated single template. *`pm-coder`.*
- `doc/_templates/CLAUDE.md.tmpl` — `## Project kind: software | documentation` line. *`pm-coder`.*
- `.claude/agents/pm-coder.md`, `pm-plan-checker.md`, `pm-pr-prep.md`, `pm-auditor.md` — rename
  `process` → `documentation`; generalize the dry-run-stamp wording to the doc-type validation
  stamp. *`pm-coder`.*
- `README.md` — update the one-line capability mention to "documentation projects" (broader than
  process). *`pm-coder`.*
- `MIGRATIONS.md` — consider a small `### Pending-migration detection` entry: a downstream
  `## Project kind: process` line (early v2.18 adopter) → rename to `documentation` (flag in arch
  review; likely a trivial mechanical migration). *`pm-coder`.*
- `doc/architecture.md` — update the v2.18 process-flavor decision to the generalized
  documentation flavor (kind name, open deliverable, optional SOP starter, doc-type validation).
  Owner `pm-architect`, post-coding handoff.

## Out of scope

- **The full per-feature artifact-kind axis / mixed projects** — still deferred (backlog).
- **The automation-opportunity scanner** (process→code bridge) — separate backlog item.
- **A diagram-rendering/validation toolchain** — beyond markdownlint; optional future.
- **Required downstream consumption of a documentation deliverable** — composition stays
  optional; a documentation deliverable may be terminal.
- **Sibling of the categorical choice:** the feature generalizes the **`documentation`** kind; the
  sibling **`software`** kind is the unchanged default (absent ⇒ software). The narrower `process`
  framing it replaces is folded in (SOP becomes one optional documentation shape).
