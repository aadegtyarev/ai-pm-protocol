# product-md-front-door — plan

PM-facing entry point. Today the template generates `docs/product.md` as a
contract-closure journal but names it "Product", so it pretends to be a product
overview the protocol never had. Split the two layers (direction B′): an
**authored** front door (`docs/product.md`) and a **generated** capability map
(`docs/product-map.md`). Surfaced by real-project feedback (wb-mqtt-matter, 18
features / 6 contracts).

## Scenarios
1. In a project on the template, `docs/product.md` is an **authored** PM entry point — a funnel: `## Зачем это нужно` (problem & for whom), `## Что умеет сегодня` (coverage + boundaries, including what is *not yet* supported — e.g. "only dimmable light so far"), `## Документы` (navigation over `docs/` in PM language), `## Функции` (link to the generated map). It is **never** regenerated/overwritten by `pm-auditor` or `/pm-plan`.
2. The generated "contract → features" map lives in a separate file `docs/product-map.md`, rebuilt **wholesale** each run. `pm-auditor` and `/pm-plan` write **only** this file and never touch `docs/product.md`.
3. In the map: each contract is a **clickable** markdown link to its contract file; the guarantee line is taken from the contract's human `## User value` section (not the technical `Must work` item); the status label carries a legend; there is no generator-mechanics header.
4. In the map: a feature that built several contracts is rendered **fully once** and marked `↑ та же работа` on subsequent contracts (not a full repeated row).
5. At bootstrap (greenfield and legacy): the orchestrator asks the PM 2-3 **product** questions (why, for whom, what is deliberately out of scope for now) → `pm-architect` drafts the authored `docs/product.md` funnel from those answers (deriving "Что умеет сегодня" from existing contracts/architecture) → the PM validates in one pass. The generated `docs/product-map.md` is produced alongside. The authored `docs/product.md` and its template are written **without** the generated-map signature line — this absence is the invariant the migration uses to tell authored from generated, so it must never be added to the authored file.
6. Migration (an existing project bumping the template): detect the pre-split state by **the generated-map signature line present in `docs/product.md` AND `docs/product-map.md` absent** (the frozen detection condition — the signature string is a pre-split artifact and must NOT be "tidied" to match the new header from fix #5). Then `git mv docs/product.md docs/product-map.md` (no content loss) and scaffold a fresh authored `docs/product.md` from the new template for the PM to fill. Handled by the "Pending template-upgrade migrations" section on `/pm-bootstrap` re-run. **Idempotent** via two independent guards: a second run is a no-op (signature already gone / `product-map.md` already present), and a project that already has an authored `product.md` with no signature line (e.g. greenfield-before-first-feature) is left untouched.

## Existing behaviors this feature touches
- "Product map generation procedure" (`pm-bootstrap.md`) — target changes (`docs/product.md` → `docs/product-map.md`) and the output format changes (fixes 2-6).
- `/pm-plan` handoff step "Regenerate `docs/product.md`" — retargets to `docs/product-map.md`.
- `pm-auditor.md` docs-currency checks (~lines 106-112, currently about `product.md`) — retarget to `docs/product-map.md`, plus a new check that the authored `docs/product.md` exists / is non-empty.
- Bootstrap doc-creation steps that create `docs/product.md`.
- Bootstrap PM conversation (currently stack-only) — gains a short product Q&A.

## Contracts (ownership + authoring)
- `docs/product.md` — **authored**, owner `pm-architect`. Content comes from the PM's product answers (bootstrap Q&A) plus "Что умеет сегодня" derived from contracts/architecture; the PM validates one-pass (markdown is not hand-written by the PM). Generators never write it. **Update trigger:** `pm-architect` refreshes it when a feature changes the product's coverage (new device/entity type, a boundary moves).
- `docs/product-map.md` — **generated**, owner `pm-auditor` / Product map generation procedure. Rebuilt wholesale every run; no authored regions, no markers.

## Stack expectations touched
- No external stack component. This changes the protocol's **own** doc-generation conventions (markdown templates, agent/command instructions). `doc/stack-notes.md` (jq, Claude Code hooks API) is not touched; no `pm-stack-researcher` run needed.

## Interaction scenarios
- When `pm-auditor` regenerates `product-map.md` while `pm-architect` owns `product.md`: each agent writes strictly its own file; neither touches the other's (the core of B′ — no markers, no co-ownership).
- When a project is mid-migration (an old generated `product.md` is present): the migration **rename** preserves its content into `product-map.md` and does not clobber an authored `product.md` if one already exists; a repeated `/pm-bootstrap` does not break an already-migrated project (idempotent).
- When `/pm-plan` regenerates the map after approve: it writes `product-map.md`, not the authored `product.md`.
- `pm-architect`'s coverage-change update of `product.md` vs `pm-auditor`'s map regeneration — distinct files, no write collision.

## Test plan
- Existing that must pass: `bash tests/hooks.sh` (65/65) — hooks are untouched; confirms nothing broke.
- **There is no automated test harness for prose-generation procedures** — `tests/hooks.sh` is the only test artifact (meta-infrastructure exception, recorded in `doc/architecture.md`). Verification is by review:
  - the procedure embeds a **worked example** of the new map format (clickable contract link, User-value guarantee, `↑ та же работа` on a repeat, status legend, no meta-header) that the reviewer checks against fixes 2-6;
  - the reviewer verifies every writer (`pm-auditor`, `/pm-plan` handoff, bootstrap) retargets to `product-map.md` consistently — no path leaves a generator writing the authored `product.md`;
  - the reviewer verifies the migration is described as idempotent (rename + scaffold, safe on re-run);
  - the reviewer verifies the bootstrap product Q&A → `pm-architect` authoring path is specified end-to-end (PM answers → draft → one-pass validate).

## Docs to update
- `README.md` — any install/usage references that describe `product.md` as generated.
- `doc/_templates/CLAUDE.md.tmpl` — the downstream docs table (add `product-map.md`; redescribe `product.md` as the authored front door).
- `doc/architecture.md` (this repo) — if it documents the doc-generation flow, reflect the authored/generated split.
- `CHANGELOG.md` + version bump (**MINOR** — new template capability) at `pm-pr-prep`.

## Out of scope
- **backlog #2** (a "module map" section in `architecture.md`) — the `## Документы` section will *link* to `architecture.md`, but we do not add the module-map section here; separate plan.
- **backlog #4** in part — this plan does the concrete `product.md → product-map.md` rename migration and retargets the auditor's checks, but the general "auto-trigger migrations on submodule bump" and the root-cause fix for the auditor skipping its product-map check stay a separate plan.
- The per-project text of "Зачем" / "Что умеет" for any specific downstream project — authored per project by the PM, not the template's job.
- Final name bikeshed: the generated map is `docs/product-map.md` (confirmed with PM).
