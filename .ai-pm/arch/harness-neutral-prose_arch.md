# Harness-neutral prose — design notes

> **Scope of this note.** The dual-harness **structure** is built and merged (slices 1–9): both
> adapters generate from one neutral source; `.claude/` is byte-identical to a frozen golden; the
> OpenCode `.opencode/` loads + enforces. The PM has **fixed two things** (AskUserQuestion 2026-06-07):
> **scope = full corpus** (`src/agents/*.body.md` + `src/commands/*.body.md` + `WORKFLOW.md` +
> `workflow/*.md`) and **form = "neutral nouns + ONE harness-reference table", explicitly NOT scattered
> build-time tokens** (rejected as a maintenance burden). This note settles the **one structural fork
> the PM's framing leaves open** — whether that one table is **reader-consulted** (form a) or
> **generator-applied** (form b) — plus the four sub-decisions that shape the coder slice.
>
> **Nothing here is approved. The plan stays DRAFT.** Genuinely-PM-gated points are recorded as Open
> questions, not invented.

## Context

What the feature adds: it does **not** change the dual-harness machinery — it neutralizes the **shared
prose** that machinery carries. Today that prose is Claude-flavored throughout: an audit of the corpus
(verified this turn) finds `CLAUDE.md` (9 files / 33 hits), `AskUserQuestion` (≈14 files), `settings.json`
`PreToolUse` (4 files), `UserPromptSubmit` (2 files), `@`-import (2 files), `.claude/` (6 files),
`.git/hooks` (1 file). An OpenCode session reads these Claude-only primitives as if they were the
native form. The feature's job is to make the prose name **neutral concepts** and route the concrete to
**one** harness-reference table.

Why it has a structural choice: "neutral nouns + one table" is consistent with **two** mechanisms that
differ in a real, load-bearing way — what bytes land in the generated `.claude/`, whether the frozen
golden survives, and whether `WORKFLOW.md` / `workflow/*.md` must be pulled into the generated set. The
PM rejected *scattered build-time tokens*; **both** mechanisms below honor that (the source stays
readable neutral nouns driven by **one** table — neither scatters per-file tokens).

### Verified facts this note rests on (read, not assumed)

- **The `pm-*` bodies ARE generated.** `src/agents/*.body.md` + `src/commands/*.body.md` are inlined by
  `gen/generate.py` into `.claude/` and `.opencode/`. A per-harness substitution over these bodies is
  the *same* machinery slice 3 (`__WB_DENY_ROLES__`) and slice 9 (`inject_model_pin` /
  `__SESSION_MODEL__`) already use — a deterministic placeholder/string replace, byte-identical by
  construction. So form (b) over the **bodies** is a small, precedented extension.
- **`WORKFLOW.md` + `workflow/*.md` are NOT generated.** They live at the **repo root**, not under
  `src/`; the generator never touches them; downstream loads them via `@`-import (Claude) /
  `instructions[]` (OpenCode) as **plain root files** (`doc/architecture.md` § "WORKFLOW.md imported …
  via `@.ai-pm/tooling/WORKFLOW.md`"). State even records "WORKFLOW/templates generation DROPPED as
  unnecessary (no per-harness divergence — already single-source)". **This is the crux of the fork:**
  form (b) re-opens that dropped decision — to substitute concretes per harness, the generator would
  now have to *also* process `WORKFLOW.md` / `workflow/*.md` (today untouched), pulling the most-read
  surface into the generated set. Form (a) does not — the root files stay plain, carrying neutral nouns
  read identically by both harnesses.
- **`src/manifests/capabilities.json` is documentation-only today.** It is the authored neutral↔concrete
  vocabulary, but the generator **does not read it** (verified: no reference in `gen/` or `tests/`; only
  prose `_comment` mentions in the two `adapter.json` files). It is "documented intent" — the structure
  that lets OpenCode slot in, not a live build input. Whichever form is chosen, this file is the
  natural single home of the mapping; the forms differ on whether it stays human-facing (a) or becomes
  a **load-bearing generator input** (b).

## Adjacent implementations (the same kind of job, already in this repo)

The protocol already does "name a thing once, resolve it per harness from a manifest, keep the output
byte-deterministic" three times — these are the patterns the new substitution must stay symmetric with:

1. **`__WB_DENY_ROLES__` (slice 3)** — `gen/generate.py:extract_wb_deny_roles()` reads the role set from
   the **one** authored copy (Claude `settings.json`) and substitutes a JSON literal into the OpenCode
   plugin template. One source, build-time resolution, deterministic, no second authored copy. This is
   the exact shape a generator-applied reference table (form b) would take.
2. **`inject_model_pin()` / `__SESSION_MODEL__` (slice 9)** — a single fixed-position string insert,
   single-sourced in the manifest `models` block; absent the key → no injection → Claude byte-identical.
   The proof that a per-harness substitution can leave the Claude side **byte-for-byte unchanged**.
3. **The capability→primitive lookup (`capabilities.json`, slice 1)** — a capability is named once
   neutrally; "the generator reads this lookup to decide HOW a capability is realized" is the file's
   stated purpose, though it is **not yet wired**. Form (b) is the realization of that stated purpose;
   form (a) leaves it human-facing.

## Behavioral risks in this area

This is prose, not event-driven code, but it has three feedback surfaces that bite if naive:

- **Golden / self-host feedback (form-dependent).** The Claude self-host session *is* the protocol
  developing itself. If form (a) re-freezes the golden, the next self-host session reads slightly more
  abstract prose; if form (b) preserves it, the session reads exactly today's words. Either is safe, but
  the choice changes what the dogfood reads.
- **Generated-set expansion feedback (form b only).** Pulling `WORKFLOW.md` / `workflow/*.md` into the
  generator means a **new** class of file is now build-output: a future hand-edit to a root `workflow/`
  file would be silently overwritten by the next generate, or trip `single-source-diff-clean`. That is a
  real change to the dev loop's "edit the root file, it's live" immediacy for the always-on core.
- **Guard vacuity / over-breadth feedback.** A `neutral-prose-no-claude-isms` guard that is too loose
  catches nothing (vacuous); too strict it trips on legitimately-Claude-specific prose (a Claude-only
  install step, the reference table itself). The allowlist must be enumerated precisely — see § "The
  guard's residual-token allowlist".

---

## Variant A — Reader-consulted neutral prose (one shipped table; golden re-frozen)

The prose literally uses neutral nouns on **both** harnesses ("the project entry file", "the
structured-question tool", "the enforcement layer", "the instruction-loading mechanism", "the
change-intent route reminder"). **One** shipped reference table maps neutral→concrete per harness; a
reader (human or model) who needs the concrete consults the table. No substitution step in the
generator.

- **Where:** the neutral nouns live directly in `src/agents|commands/*.body.md` **and** in the root
  `WORKFLOW.md` / `workflow/*.md` (edited in place — they stay plain root files). The reference table is
  one shipped artifact rendered from `capabilities.json`.
- **Relation to adjacent:** *asymmetric* to the three substitution precedents — it deliberately does
  **not** use the `__PLACEHOLDER__` machinery. The generator stays exactly as thin as today; the
  capability lookup stays human-facing (its slice-1 "documented intent" purpose, not yet a build input).
- **Reader experience:** both harnesses read the **same** abstract nouns + one table. Uniform, but one
  indirection hop: a reader who wants the concrete word must consult the table. The always-on core
  (`WORKFLOW.md`/`workflow/`) is identical text on both harnesses.
- **Golden + self-host:** the Claude `.claude/` bodies **change** (neutral nouns replace `CLAUDE.md` /
  `AskUserQuestion`) → the frozen golden must be **re-frozen** and `generated-claude-adapter-byte-
  equivalent` re-based to the new golden. The Claude self-host session reads slightly more abstract
  prose.
- **`WORKFLOW.md`/`workflow/*.md`:** **no mechanism change** — they stay plain root files, edited to
  carry neutral nouns. The generator is **not** extended. This is the simplest possible machinery (prose
  ships as-is; no substitution; the dropped "WORKFLOW generation" decision stays dropped).
- **Maintenance surface:** **one** shipped table (rendered from `capabilities.json`). Neither this nor B
  is the scattered-tokens form the PM rejected.
- **Pros:** simplest machinery (zero generator change); genuinely-neutral prose (matches the PM's
  framing, which leaned toward neutral prose); the always-on core is one text, not two; the generated
  set does not grow (no `WORKFLOW`/`workflow` pull-in); the dev loop for the root core is unchanged
  (edit root file, it's live).
- **Cons / risks:** the Claude self-host experience changes (abstract nouns + a lookup hop where today
  it reads concrete words); the golden re-freeze is a one-time but **load-bearing** event (the
  byte-equivalence guarantee that proved "the build introduces zero change to what Claude loads" is
  deliberately spent — the architecture record must say so); abstract-noun prose is marginally harder to
  read for a human skimming a single file without the table.

## Variant B — Generator-applied substitution (source neutral; each adapter concrete; golden preserved)

The **source** uses neutral nouns/placeholders; the generator resolves each neutral noun → that
harness's concrete word per adapter. Claude bodies say `CLAUDE.md` / `AskUserQuestion` exactly as today
(**byte-identical**, golden **preserved**); OpenCode bodies say `AGENTS.md` / `question`. The single
reference table **is** the substitution map (`capabilities.json` becomes a live generator input) — one
table drives it, the source stays readable neutral nouns, **not** scattered tokens.

- **Where:** neutral nouns/placeholders in `src/agents|commands/*.body.md`; `capabilities.json` is read
  by `gen/generate.py` and each neutral token is replaced with the target harness's concrete. **And** —
  the structural implication — `WORKFLOW.md` / `workflow/*.md` must be **pulled into the generated set**
  so their concretes can be substituted too (today they are root files the generator never touches).
- **Relation to adjacent:** *symmetric* to the three substitution precedents — it generalizes
  `__WB_DENY_ROLES__` / `inject_model_pin` from "a few specific tokens" to "the neutral-noun vocabulary",
  driven by the (now live) capability lookup. This is the realization of `capabilities.json`'s stated
  slice-1 purpose.
- **Reader experience:** each harness reads **concrete, correct** words (no lookup hop). A Claude reader
  sees `CLAUDE.md`; an OpenCode reader sees `AGENTS.md`. Best per-harness readability; the cost is two
  rendered texts to reason about instead of one.
- **Golden + self-host:** Claude `.claude/` stays **byte-for-byte unchanged** → the frozen golden is
  **preserved**, `generated-claude-adapter-byte-equivalent` keeps its current golden, and the Claude
  self-host session reads **exactly today's prose**. The "the build introduces zero change to what Claude
  loads" guarantee is **kept**.
- **`WORKFLOW.md`/`workflow/*.md`:** **mechanism change — this is the real cost.** To substitute their
  concretes per harness, the generator must now process them. That re-opens the **dropped** "WORKFLOW
  generation" decision (state: "DROPPED as unnecessary — no per-harness divergence; already single-
  source"). Under B there **is** now per-harness divergence (the substituted concretes), so the root
  core would have to move into the generated set: either carve neutral sources of `WORKFLOW.md` /
  `workflow/*.md` into `src/` and **generate** the delivered root copies, or run a substitution pass
  over the root files in place. Both expand the generated set and the diff-clean surface, and change the
  dev loop for the always-on core (a root-file edit is no longer directly live — it must round-trip
  through generation, the same immediacy cost the arch note flagged for the bodies).
- **Maintenance surface:** **one** generator-applied table (`capabilities.json` becomes load-bearing).
  Not the scattered-tokens form. The generator grows a substitution pass + the `WORKFLOW`/`workflow`
  pull-in; `capabilities.json` gains a `harness-reference-table-complete` guard (every neutral noun has
  both concretes).
- **Pros:** Claude experience byte-for-byte unchanged (golden preserved — the single biggest "must not
  break" for self-host); each harness reads correct concrete words with no indirection; realizes
  `capabilities.json`'s stated purpose (it stops being dead documentation).
- **Cons / risks:** **forces the always-on core into the generated set** — the largest, most-read
  surface, today deliberately plain root files — re-opening a dropped decision and growing the
  generator + diff-clean surface materially; two rendered texts instead of one to reason about; a
  substitution bug now silently corrupts the most load-bearing prose (mitigated by determinism + diff-
  clean, but a new failure mode); the dev-loop immediacy cost on the root core (edit no longer directly
  live).

---

## Recommendation

**Variant A (reader-consulted neutral prose; one shipped table; golden re-frozen)** — with the trade-off
recorded honestly, because this is close and the orchestrator's prior non-binding lean was B.

The deciding factor is the **structural implication on `WORKFLOW.md` / `workflow/*.md`**, which the
spawn flagged as the thing to address explicitly. These root files are the **most-read surface** (loaded
every session via `@`-import / `instructions[]`) and are today **deliberately not generated** — plain
single-source root files, a decision state explicitly recorded as "DROPPED as unnecessary". Form (b)'s
golden-preservation is genuinely attractive, **but it buys that for the bodies at the price of dragging
the entire always-on core into the generated set** — re-opening the dropped decision, materially growing
the generator + diff-clean surface, and paying the dev-loop immediacy cost on the single most load-
bearing prose surface. Form (a) confines the only mechanism change to a one-time golden re-freeze and
leaves the root core as plain, neutral, identically-read-on-both-harnesses files — which is exactly the
"genuinely-neutral prose" the PM's framing leaned toward.

The honest counter-weight (record it, do not bury it): form (a) **spends** the byte-equivalence
guarantee that proved "the build introduces zero change to what the Claude self-host loads", and makes
the Claude session read slightly more abstract prose behind a one-hop table lookup. That guarantee was a
real safety property of the dual-harness groundwork. The judgment is that **a one-time, reviewed,
re-frozen golden** (with `tests/hooks.sh` green and the behavior unchanged — only the *naming* of
harness concepts abstracts) is a smaller, more contained cost than **permanently** moving the always-on
core into the generated set and re-opening a closed decision. The PM, who leaned toward neutral prose,
should make the final call against this trade-off — it is recorded as Open question 1.

### The dogfood-as-downstream tilt (non-binding)

Post-extraction the protocol "develops itself as a downstream" — consuming its own dist as a submodule
(the `nula` deployment is the first instance), on **either** harness. Under that model the protocol's own
`.claude/` becomes symlinks into the dist, not a committed golden — at which point the **golden's
relevance fades anyway** (there is no committed `.claude/` to be byte-equal *to*; the dist build is the
truth). That future makes form (a)'s "re-freeze the golden once" cost even cheaper (the golden is on its
way out), and makes form (a)'s **single neutral text read identically on whichever harness dogfoods**
the more natural fit for a protocol that must read well on both. This is a non-binding tilt toward A, not
a proof — it depends on the extraction landing, which is PM-gated.

---

## The sub-decisions that shape the coder slice

### 1. The reference-table home — **`capabilities.json` is the single source; a rendered table is generated from it**

Keep **one** source of the mapping (no drift). Recommendation: **data in `src/manifests/capabilities.json`
(extended), a human-readable rendered table generated from it** — *both*, by role, with `capabilities.json`
as the sole authored source.

- `capabilities.json` already **is** the authored neutral↔concrete vocabulary; it has the `claude` and
  `opencode` columns. Extend it with the neutral **noun** for each capability (today it keys on capability
  id like `structured-question-tool`; add the reader-facing neutral noun + the bare concrete strings the
  prose would otherwise use). Do **not** create a second authored copy.
- Render a human-readable reference table **from** `capabilities.json` (a generated `.md` section or an
  appended table) so a reader has a flat lookup without parsing JSON. The render is a build product, never
  hand-edited — the same regenerate-and-compare discipline as the adapters.
- A `reference-table-matches-capabilities` test (already named in the plan) asserts the rendered table ==
  the `capabilities.json` mapping — no drift, no second copy.
- **Form interaction:** under A this rendered table is the *only* consumer (human-facing). Under B
  `capabilities.json` additionally becomes a **live generator input** (the substitution map). Either way
  it stays the single source.

### 2. The neutral-noun vocabulary (proposed concrete set)

| Neutral noun | Claude concrete | OpenCode concrete | Clean? |
|---|---|---|---|
| the project entry file | `CLAUDE.md` | `AGENTS.md` | ✓ |
| the structured-question tool | `AskUserQuestion` | `question` | ✓ |
| the enforcement layer | `settings.json` `PreToolUse` hook | `tool.execute.before` plugin (throw) | ✓ |
| the instruction-loading mechanism | `@`-import (`@.ai-pm/tooling/WORKFLOW.md`) | `instructions[]` array | ✓ |
| the change-intent route reminder | `UserPromptSubmit` hook | always-on `AGENTS.md`/`instructions` content | ⚠ semantic skew |
| the skill-invocation tool | `Skill` | `skill` | ✓ |
| the adapter directory | `.claude/` | `.opencode/` | ✓ (context-sensitive) |

**Primitives that do NOT cleanly neutralize — flag for explicit handling, do not force:**

- **`UserPromptSubmit` → always-on content (⚠ semantic skew).** Claude's route-reminder fires
  **per-prompt on change-intent**; OpenCode has **no `UserPromptSubmit`-equivalent**, so the reminder is
  baked **always-on** (slice 3 already documents this divergence in `AGENTS.md`). The neutral noun "the
  change-intent route reminder" papers over a **behavioral** difference, not just a naming one. Handle by
  naming the *intent* neutrally and letting each harness's adapter doc state the realized timing — do not
  pretend the two are identical.
- **`.git/hooks/` check (`pm-bootstrap`, line 18) — genuinely environment-level, harness-agnostic.** This
  is a *git* mechanic, not a Claude primitive — it is **not** a Claude-ism and should **not** be
  neutralized away. Allowlist it.
- **The Claude symlink-install steps (`pm-bootstrap`, lines 418–425: `ln -s ../.ai-pm/tooling/.claude/
  agents …`).** These are a **legitimately Claude-specific install procedure** in a Claude-only context
  (the OpenCode install symlinks `.opencode/{agent,command,plugin}` — a different, parallel step). State
  already tracks this as the "command-body allowlist debt" deferred to the install-auto-detect slice.
  Either neutralize to "link the adapter directory" with per-harness concrete steps, **or** allowlist the
  two command bodies (`pm-audit.body.md`, `pm-bootstrap.body.md`) as already done for the self-contained
  invariant. Recommend: **allowlist now, neutralize in the install-auto-detect slice** (do not let this
  feature swell into the install rewrite the PM scoped separately).
- **The enforcement-*mechanism* descriptions in `WORKFLOW.md` / `workflow/roster.md` /
  `workflow/enforcement.md` / `workflow/review-typology.md`.** These prose passages *describe how the deny
  list is wired* ("a `PreToolUse` deny-list in `.claude/settings.json`"). Some are inherently harness-
  specific explanations of mechanism. Where the prose states a **rule** ("use only `pm-*`, never `wb-*`"),
  neutralize the *naming* ("the enforcement layer blocks…") and point at the table. Where it documents the
  **concrete wiring** of one harness, that is legitimately concrete — allowlist it or move it to the
  per-harness adapter doc (`AGENTS.md` already carries OpenCode's; the Claude wiring can stay in a
  Claude-scoped section). Flag each occurrence in the coder slice; do not blanket-substitute.

### 3. The guard's residual-token allowlist (`neutral-prose-no-claude-isms`)

The guard scans the in-scope neutralized corpus for the bare concrete strings (`CLAUDE.md`,
`AskUserQuestion`, `settings.json` `PreToolUse`, `@`-import-as-the-only-mechanism, `UserPromptSubmit`,
`.claude/`) and **fails** if any appears **outside an allowed home**. Allowlist (so the guard is precise,
not vacuous, not over-broad):

1. **The harness-reference table** (the rendered table + `capabilities.json`) — the one place every
   concrete string legitimately lives. The whole point of the table.
2. **`.git/hooks/`** — a git mechanic, not a Claude-ism; never flagged.
3. **The two install command bodies** (`pm-audit.body.md`, `pm-bootstrap.body.md`) — the existing
   self-contained allowlist, until the install-auto-detect slice neutralizes them. Any **new** cross-read
   outside these two still trips (same discipline as the slice-2 allowlist).
4. **Per-harness adapter docs** (`AGENTS.md`, and any Claude-scoped wiring section) — these *are* the
   adapter layer; they legitimately name their own harness's concretes.
5. **Under form (b) only:** the generated `.claude/` bodies (which contain `CLAUDE.md` by design) are
   **out of the guard's scope** — the guard runs over the **neutral source**, not the generated output.
   Under form (a) the guard runs over the source *and* the generated `.claude/` is itself neutral, so
   there is nothing Claude-specific to allow there.

Everything else: a bare concrete string in a neutralized body / `WORKFLOW.md` / `workflow/*.md` is a
**fail** (the standard, mechanically enforced — the same loud-fail discipline as `single-source-diff-
clean`). The plan's `claude-ism-reintroduction-trips-guard` test proves the guard is live (inject a bare
`CLAUDE.md`, assert fail).

### 4. Sequencing — **confirmed, with one form-dependent refinement**

The plan's order is correct: **(1) vocabulary + table first, (2) bodies, (3) `WORKFLOW.md` /
`workflow/*.md`.** Settle the neutral nouns + the table home before touching any prose, so every
neutralization resolves against a fixed vocabulary.

**Form-dependent refinement (the real structural implication, addressed explicitly):**

- **Under form (a):** step 3 is a **plain edit** of the root `WORKFLOW.md` / `workflow/*.md` files —
  **no generator change**. The bodies (step 2) are also plain edits of `src/*.body.md` (then regenerate
  → re-freeze golden). Sequencing is linear and low-risk.
- **Under form (b):** step 3 requires **first pulling `WORKFLOW.md` / `workflow/*.md` into the generated
  set** (carve neutral sources into `src/` or add a root-file substitution pass) **before** the
  neutralization can apply per-harness. This is a generator slice in its own right and must precede the
  prose work — so under B the sequencing gains a **step 2.5: extend the generator to process the
  always-on core**, with its own `single-source-diff-clean` extension. This is the structural cost B
  carries that A does not, and it confirms why the form decision must land **before** sequencing is
  finalized.

### 5. The dogfood/golden interaction at extraction (non-binding note)

Post-extraction, the protocol's own `.claude/` becomes **symlinks into the dist**, not a committed golden
(arch note `opencode-harness-support_arch.md` job 1 + job 3: dist ships the built adapters; source
dogfoods a locally-built `.claude/`). At that point:

- The **committed-golden / byte-equivalence** guarantee is **already on its way out** — there is no
  committed `.claude/` to be byte-equal *to*; the dist build is the source of truth, checked by the
  cross-repo fidelity gate (job 2), not by a frozen golden.
- This makes form (a)'s "re-freeze the golden once" cost **even cheaper** (the golden is being retired
  anyway) and makes form (a)'s **single neutral text, read identically on whichever harness dogfoods**
  the more natural fit for the dogfood-as-downstream model.
- Form (b)'s golden-preservation benefit is **most valuable pre-extraction** (while the committed golden
  still exists) and **least valuable post-extraction** (when it is retired). So the value of B's headline
  advantage **decays** over the very timeline the feature is meant to serve.

Non-binding: this tilts toward A but does not decide it — it is contingent on the PM-gated extraction.

---

## Risks (whichever form is chosen)

- **Meaning drift during neutralization.** The plan scopes this to harness-*naming* only ("do not change
  meaning"). The cross-cutting wording in `WORKFLOW.md` / `workflow/decision-authority.md` (the
  `### Decision authority` kernel, the `AskUserQuestion` rule in `pm-comms.md`) is **load-bearing**;
  neutralizing "surface forks via the AskUserQuestion tool" to "via the structured-question tool" must
  preserve the *rule*, only abstract the *primitive name*. A careless reword here changes protocol
  behavior. Mitigation: per-occurrence review; the guard catches reintroductions, not meaning loss.
- **Guard over-breadth.** If the allowlist (sub-decision 3) is incomplete, the guard trips on legitimate
  Claude-specific prose (the install steps, the `.git/hooks` git mechanic) and blocks the build. The
  allowlist must be enumerated before the guard ships — verify it is non-vacuous **and** non-over-broad
  against the real corpus.
- **Form (b) only — generated-set expansion.** Pulling the always-on core into the generator is a larger
  change than the plan's "bodies, then WORKFLOW/workflow" framing implies (the framing assumes plain
  edits). If B is chosen, the plan must be updated to add the generator-extension slice (sequencing
  refinement above) — otherwise the coder hits the "WORKFLOW isn't generated" wall mid-slice.
- **Form (a) only — golden re-freeze is a one-way spend.** Once re-frozen, the "build introduces zero
  change to Claude" proof is gone; a later regression in the generator that *also* changes Claude prose
  would no longer be caught by byte-equivalence against the *old* baseline. Mitigation: re-freeze in a
  single reviewed commit with `tests/hooks.sh` green, and state in the architecture record that the
  guarantee was consciously re-based.

## Open questions (PM-gated — the plan stays DRAFT until these resolve)

1. **The central form decision (a) vs (b)** — this note **recommends (a)** with the trade-off recorded;
   the orchestrator's prior non-binding lean was (b), and the PM's framing leaned toward genuinely-neutral
   prose (which (a) delivers). The PM owns the final call, weighing: golden-preservation + concrete-per-
   harness reading (b) **vs** simplest machinery + always-on-core-stays-plain + neutral-prose-everywhere
   (a). The honest crux is whether preserving the Claude byte-equivalence guarantee is worth dragging the
   always-on core into the generated set.
2. **The `UserPromptSubmit` semantic skew** — confirm the neutral handling of the route-reminder, given
   it is **per-prompt on Claude but always-on on OpenCode** (a behavioral, not naming, difference). Name
   the intent neutrally + let each adapter doc state its realized timing? (recommended) — or treat it as a
   genuinely harness-specific mechanic and allowlist it.
3. **Install command bodies — neutralize now or defer.** Recommend **defer** to the already-scoped
   install-auto-detect slice (allowlist the two bodies meanwhile) — confirm the PM does not want the
   install prose neutralized inside this feature (it would swell scope into the install rewrite the PM
   separated out).
4. **Whether the rendered reference table ships downstream / where it lives** — a generated `.md` section,
   an appendix to `AGENTS.md`/`README`, or a standalone doc. Single source is `capabilities.json` either
   way; this is a placement call (and partly an extraction-time concern, like `WORKFLOW`/`workflow`
   placement).

## Notes for the plan (flag only — do not edit the plan from here)

- If the PM chooses **form (b)**, the plan's sequencing ("bodies, then `WORKFLOW.md`/`workflow/*.md`")
  must gain a **generator-extension step** (pull the always-on core into the generated set) *before* the
  prose work — otherwise the coder hits the "WORKFLOW isn't generated today" wall. State this explicitly
  in the plan's sequencing.
- The plan's `Docs to update` decision record (harness-neutral prose standard) should **name the chosen
  form and the golden treatment** (re-frozen vs preserved) and record the byte-equivalence-guarantee
  decision (spent vs kept) as a conscious trade-off — the same way the build-step amendment was recorded.
- The plan's `neutral-prose-no-claude-isms` test should cite **this note's § "The guard's residual-token
  allowlist"** as the source of its given/when/then allowlist, so the guard is precise.
