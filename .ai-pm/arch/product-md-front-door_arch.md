# product-md-front-door — design notes

## Context

This is a change to ai-pm-protocol's **own** template/agent/command wiring. The
plan's direction (B′) is already fixed by the PM: split today's single generated
`docs/product.md` (a contract-closure journal mislabeled "Product") into two files —

- **authored** `docs/product.md` — owner `pm-architect`, content from a bootstrap
  product Q&A, PM one-pass validates;
- **generated** `docs/product-map.md` — owner `pm-auditor` / the Product map
  generation procedure, rebuilt wholesale.

B′ is not relitigated here. The structural forks the plan leaves open are: (1) the
ownership-collision surface — every writer of `product.md` today must be retargeted
without leaving any generator-to-authored-file path; (2) where the new authoring
responsibility lands inside pm-architect and how the product Q&A feeds it; (3) the
idempotent migration mechanics; (4) the auditor check retarget. Each is analyzed
below; a fork into A/B variants is surfaced only where a real one exists (it does,
once — point 3).

Note: this repo is the template, so its own files live under `doc/` and the
generated downstream paths are `docs/`. The plan and these notes refer to the
downstream `docs/` paths the template emits.

## Adjacent implementations (current-repo protocol files)

These are the existing protocol files that constitute the "same kind of job" — they
own or write the doc surface being split.

1. **Product map generation procedure** — `.claude/commands/pm-bootstrap.md:268-303`.
   The single canonical generator. Reads `.ai-pm/contracts/`, `docs/features/`,
   `.ai-pm/reviews/`, git; emits group → contract → features. Target hardcoded as
   `docs/product.md` (line 270), output header says "Generated, not hand-filled"
   (line 287). Called by bootstrap (all modes) and by `/pm-plan`. **This is the
   writer that moves to `product-map.md`.**

2. **Bootstrap doc-creation** — greenfield `pm-bootstrap.md:79-89` (creates an empty
   `docs/product.md` shell directly, inline), legacy shallow `:157`, legacy full
   `:190` (both call the procedure). Greenfield is the only place that writes the file
   *without* the procedure — it inlines a stub. Greenfield also owns the PM
   conversation (`:55-67`, seven stack/product questions) and spawns `pm-architect`
   for architecture.md (`:104`). **This is the model to mirror for the product Q&A →
   pm-architect authoring path.**

3. **/pm-plan handoff** — `.claude/commands/pm-plan.md:244-252`. Two write points:
   on plan creation ("Update the product map", `:244`) and after `approve`
   (`:252` "Regenerate `docs/product.md`"). Both call the procedure. **Both retarget
   to `product-map.md`.**

4. **pm-auditor docs currency** — `.claude/agents/pm-auditor.md:106-112`. Re-derives
   the map from source and compares to the existing `docs/product.md`; six sub-checks.
   It re-generates the map *in memory* to compare, but writes nothing (auditor is
   read-only on docs, writes only its audit file). **Its checks retarget to
   `product-map.md`, plus a new existence/sections check for the authored
   `product.md`.**

5. **pm-architect Section A** — `.claude/agents/pm-architect.md:37-54`. Owns
   `docs/architecture.md`. Greenfield: writes from PM stack answers + stack-notes.
   Legacy: structures the legacy-reader draft. Walks every template section, cites
   every decision, marks N/A, uses `[?]` for unknowns. **The authored `product.md`
   responsibility attaches here, by symmetry with architecture.md.**

6. **Templates** — `doc/_templates/` has no `product.md.tmpl` today (the greenfield
   stub at `pm-bootstrap.md:81-89` is inlined, not a template file).
   `contract.md.tmpl:9` has the `## User value` section that fix #6 reads for the
   guarantee line. `CLAUDE.md.tmpl:79` describes `docs/product.md` as
   "auto-generated" in the downstream Docs table.

## Behavioral risks in this area

This is doc/agent wiring, not event-driven runtime code — there is no MQTT/event
feedback loop to map. The analogous "feedback loop" risk is **a generator writing
the authored file**: if any of the four writers above is left pointing at
`product.md`, or if the migration scaffold overwrites authored content, the PM's
prose is silently clobbered on the next auditor/plan run. The whole structural job
here is to make that impossible to express. Two concrete loop risks to watch:

- **Residual generator → authored-file write.** Four retarget sites
  (procedure target line; greenfield inline stub; two `/pm-plan` handoff lines;
  auditor comparison target). Missing any one leaves a path where `product.md` is
  regenerated. Mitigation: a single stated invariant per agent (below).
- **Migration clobber.** A re-run of `/pm-bootstrap` on an already-split project
  must not re-rename or re-scaffold — the detection condition must key on
  post-state, not just "file exists".

## Ownership map (the core deliverable)

| Writer | Today writes | After split writes | Touches authored `product.md`? |
|---|---|---|---|
| Product map generation procedure (`pm-bootstrap.md`) | `docs/product.md` | `docs/product-map.md` | never |
| Greenfield bootstrap inline stub (`pm-bootstrap.md:79-89`) | `docs/product.md` (empty map) | spawns pm-architect to author `docs/product.md`; map via procedure → `product-map.md` | authors it (via pm-architect), once at bootstrap |
| Legacy bootstrap (`:157`, `:190`) | `docs/product.md` (procedure) | `docs/product-map.md` (procedure) + pm-architect authors `docs/product.md` | authors via pm-architect, once |
| `/pm-plan` handoff (`pm-plan.md:244`, `:252`) | `docs/product.md` | `docs/product-map.md` | never |
| pm-auditor (`pm-auditor.md:106-112`) | reads/compares `docs/product.md` (writes nothing) | reads/compares `docs/product-map.md` + checks `product.md` exists | never writes; only existence-checks |
| pm-architect (new) | — | `docs/product.md` (authored funnel) | sole writer of authored file |
| migration entry (`pm-bootstrap.md:43-49`) | generates `docs/product.md` | renames old `product.md`→`product-map.md`; scaffolds fresh `product.md` | scaffolds once, guarded |

**Provably-clean separation rule (one sentence each, to be stated in each file):**

- In the **Product map generation procedure** and both `/pm-plan` handoff steps:
  *"This procedure writes only `docs/product-map.md`; it never creates or edits the
  authored `docs/product.md`."*
- In **pm-architect**: *"pm-architect is the sole writer of the authored
  `docs/product.md`; it never writes the generated `docs/product-map.md`."*
- In **pm-auditor**: *"The auditor only existence-checks `docs/product.md` and never
  regenerates it; it re-derives and compares only `docs/product-map.md`."*

With each writer carrying one explicit "writes only X, never Y" sentence, a reviewer
can confirm the partition by reading four sentences — no cross-file reasoning needed.
This is the verification hook the plan's Test plan asks for ("no path leaves a
generator writing the authored `product.md`").

---

## Point 1 — Ownership-collision surface

No fork. The retarget is mechanical and total: the four generator writers (procedure
target line, greenfield inline stub, two `/pm-plan` lines) move to
`product-map.md`; pm-auditor's comparison target moves to `product-map.md`. The
greenfield inline stub is *replaced* by a pm-architect spawn (point 2), so it stops
writing the file at all rather than being retargeted. The residual-path risk is
closed by the three one-sentence invariants above. **Recommendation: single clean
path, no variant.**

## Point 2 — Where the new pm-architect responsibility lives

**Recommendation: a new Section A sub-section, not a new top-level section** — and
the bootstrap product Q&A feeds it by exact mirror of the stack-Q&A → architecture.md
path that already exists.

Rationale (one sentence): the authored `product.md` is the same *kind* of job
Section A already does — a canonical, PM-validated, citation-backed doc the architect
owns and refreshes on triggers — so it belongs as a sibling of the architecture.md
work, sharing Section A's existing machinery (walk-every-section, cite-every-claim,
`[?]`-for-unknowns, greenfield-vs-legacy modes).

Wiring, mirroring the architecture.md path:

- **Q&A source.** Greenfield bootstrap (`pm-bootstrap.md:55-67`) gains 2-3 product
  questions (why / for whom / deliberately out of scope now), exactly as it already
  asks stack questions. The orchestrator passes those answers to pm-architect in the
  spawn prompt — the same way it passes stack answers today (`:104`,
  "Architect reads PM's stack answers").
- **"Что умеет сегодня" derivation.** pm-architect derives this section from
  `.ai-pm/contracts/` (their `## User value`) and `docs/architecture.md` components —
  the same source-reading discipline Section A uses for architecture facts. The PM
  answers supply `## Зачем` and the out-of-scope boundary; the contracts/architecture
  supply the coverage list. PM validates one-pass.
- **Update trigger wording.** Add to pm-architect's "When you are invoked /
  canonical" list a fourth trigger:
  > *"A landed feature changes the product's coverage (a new device/entity type, a
  > new contract, or a moved boundary) — refresh `## Что умеет сегодня` and any
  > moved boundary in `docs/product.md`. Touch only authored sections; never the
  > generated `docs/product-map.md`, and never the `## Функции` link target."*
  This keeps the architect's refresh scoped to the prose funnel and makes the
  no-collision boundary explicit at the trigger itself.

The bootstrap brief and `/pm-plan` do not gain product-authoring duties — they only
spawn/notify pm-architect, exactly as they do for architecture.md. This keeps a
single owner.

## Point 3 — Migration mechanics (idempotent) — REAL FORK

The existing v2.2 migration entry (`pm-bootstrap.md:43-49`) keys on
`docs/features/_index.md` existing OR `docs/product.md` missing, then generates
`docs/product.md`. The split needs a *rename + scaffold* migration that is safe on
re-run and never clobbers an authored file. The fork is **how the migration detects
that a project is pre-split** (so the rename runs exactly once).

The hard problem: both a pre-split generated `product.md` and a post-split authored
`product.md` are "a file named `docs/product.md` that exists". Detection must
distinguish them by *content shape*, not by presence.

### Variant A: detect by generated-header signature (content sniff)

- **Where:** new bullet in "Pending template-upgrade migrations".
- **Detection condition:** pre-split iff `docs/product.md` exists AND its content
  carries the generator signature — the line
  `> Source of truth = contracts. One contract, many features. Generated, not
  hand-filled.` (emitted by today's procedure, `pm-bootstrap.md:287`) AND
  `docs/product-map.md` does **not** exist.
- **Steps when pre-split:**
  1. `git mv docs/product.md docs/product-map.md` (content preserved verbatim — no
     loss).
  2. Strip the generator-mechanics header from `product-map.md` per fix #5 (or leave
     for the next regeneration; the next auditor/plan run rebuilds it wholesale
     anyway).
  3. Scaffold a fresh authored `docs/product.md` from the new `product.md.tmpl`
     (funnel skeleton: Зачем / Что умеет сегодня / Документы / Функции), and spawn
     pm-architect to fill it (or leave skeleton for the next pm-architect run).
  4. Tell PM in plain language: map moved to `product-map.md`; new authored front
     door scaffolded for you to fill.
- **Idempotency:** on re-run, `product.md` no longer carries the generator signature
  (it's now an authored funnel) → condition false → no-op. Also `product-map.md`
  now exists → condition false. Two independent guards.
- **Pro:** distinguishes generated-vs-authored even in the edge case where a project
  manually created `product-map.md` but still has an old generated `product.md`.
  Self-describing: the signature line is the exact artifact today's generator emits.
- **Con:** depends on a literal header string; if a downstream project hand-edited
  that line away, detection misfires (treats generated as authored → skips rename,
  surfaces as an auditor note rather than data loss — fail-safe direction).

### Variant B: detect by `product-map.md` absence alone

- **Detection condition:** pre-split iff `docs/product-map.md` is missing AND
  `docs/product.md` exists.
- **Steps:** same rename + scaffold.
- **Idempotency:** after migration `product-map.md` exists → re-run no-op.
- **Pro:** simplest possible condition; one file-existence test.
- **Con:** ambiguous in one case — a fresh greenfield project on the *new* template
  has an authored `product.md` and (after first plan) a `product-map.md`, fine; but a
  greenfield project *before its first feature* has an authored `product.md` and **no
  `product-map.md`** — Variant B would mis-detect it as pre-split and `git mv` the
  authored funnel into `product-map.md`, **clobbering authored content**. That is the
  exact failure the plan forbids ("does not clobber an authored `product.md` if one
  already exists").

**Recommendation: Variant A.** The content-signature guard is the only one that
distinguishes a generated `product.md` from an authored one, which is precisely the
pre-split-vs-post-split distinction the migration must make. Variant B's single
file-existence test has a real clobber path on greenfield-before-first-feature, so it
is not viable despite being simpler. State both guards (signature present AND
`product-map.md` absent) so detection fails safe in either direction.

The greenfield-new-template scaffold (point 2) should write the authored
`product.md` from `product.md.tmpl` **without** the generator signature line — that
is what makes Variant A's detection correct: an authored file never carries the
signature, a generated one always does.

## Point 4 — Auditor check retarget

No fork. Restructure `pm-auditor.md:106-112` into two independent blocks:

1. **`docs/product-map.md` (generated) — re-derive and compare**, carrying over all
   six existing sub-checks verbatim but pointed at `product-map.md`: map missing →
   note; contract not rendered → note; feature plan in neither table nor
   Infrastructure bucket → note; `Built/changed by` out of sync → note; dead Review
   link / missing Done → note; contract grouped under non-matching component → note.
   The auditor re-derives in memory and compares (it already does this; only the
   filename changes).

2. **`docs/product.md` (authored) — existence + structural shape only.** New, narrow
   check: file exists and is non-empty → else note; carries the four funnel headers
   (`## Зачем это нужно`, `## Что умеет сегодня`, `## Документы`, `## Функции`) →
   missing a header → note. **The auditor must NOT validate the prose** — it cannot
   know product intent, cannot re-derive "Зачем", cannot judge whether "Что умеет
   сегодня" is complete. Add an explicit guard sentence:
   > *"For the authored `docs/product.md`, check only that it exists and carries its
   > funnel sections; never regenerate it, never flag its prose content — product
   > intent is the PM's, not the auditor's."*

This mirrors how the auditor already treats `architecture.md`/`user-journeys.md`
(`:104-105`): existence/coverage notes, never content rewriting. Keeping the authored
check to structure-only is what prevents the auditor from re-acquiring a write/clobber
role through the back door of "the prose looks stale".

---

## Recommendation summary

- **Point 1 (collision surface):** single clean path — retarget four generator
  writers to `product-map.md`, replace the greenfield stub with a pm-architect spawn,
  and stamp one "writes only X, never Y" invariant sentence into each of the three
  writer roles.
- **Point 2 (architect responsibility):** new **sub-section of Section A** (not a new
  section), product Q&A fed in the bootstrap spawn prompt exactly as stack answers
  feed architecture.md, plus a fourth "coverage changed" invocation trigger scoped to
  authored sections only.
- **Point 3 (migration):** **Variant A** — detect pre-split by generator-signature
  line present AND `product-map.md` absent; `git mv` preserves content, scaffold the
  authored funnel without the signature line; two independent idempotency guards.
- **Point 4 (auditor):** split into a generated-map re-derive/compare block
  (`product-map.md`, six checks moved over) and an authored-file structure-only
  existence/headers check, with an explicit "never validate prose" guard.

## Risks for coder / reviewer to watch

1. **Signature-line coupling (point 3).** The migration detection and the authored
   template are coupled by one literal string: the generator emits the signature, the
   authored template must *not*. If the coder changes the generator's header text
   (fix #5 removes the meta-header), the migration detection string must match the
   **pre-split** header that exists in already-deployed projects, not the new one.
   The detection string is a frozen historical artifact — comment it as such so a
   future cleanup doesn't "tidy" it to match the new format and break migration on
   real projects.
2. **Four-site retarget completeness (point 1).** Reviewer must confirm all four
   generator sites plus the auditor comparison target moved — the plan's Test plan
   calls this out. Easy to miss `pm-plan.md:244` (plan-creation path) while catching
   `:252` (post-approve path); both write the map.
3. **CLAUDE.md.tmpl Docs table (point 2 fallout).** `CLAUDE.md.tmpl:79` still calls
   `docs/product.md` "auto-generated". After the split that line is wrong and a future
   auditor docs-currency check could flag it. It must be re-described as the authored
   front door and a `docs/product-map.md` row added — already in the plan's "Docs to
   update", but the reviewer should verify it actually landed, since the auditor's new
   authored-file check keys on the funnel headers that this table should advertise.
4. **Greenfield-before-first-feature ordering (points 2+3).** A greenfield project on
   the new template gets an authored `product.md` but no `product-map.md` until its
   first plan. Confirm the auditor's "map missing → note" doesn't fire as blocking on
   a legitimately feature-less fresh project, and that Variant A's signature guard
   (not mere absence) correctly leaves this state alone.

No second variant is offered for points 1, 2, 4 — each has a single forced-clean
answer given B′ and the existing architecture.md symmetry. The only genuine
structural fork is the migration detection condition (point 3), where Variant B's
simpler test has a real clobber path and is therefore rejected.

## Plan should be updated to…

(Notes only — not changing the plan myself.)

- Make the **generator-signature detection string explicit** in scenario 6 /
  migration, naming it as the frozen pre-split header so the coder doesn't infer
  "detect by file presence" (the unsafe Variant B).
- Note in scenario 5 that the authored `product.md` template must be written
  **without** the generator signature line — this is the invariant that makes
  migration detection correct, and it isn't currently stated.
