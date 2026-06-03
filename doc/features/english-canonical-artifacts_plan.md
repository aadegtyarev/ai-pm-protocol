# English-canonical artifacts — plan

PM decision (2026-06-03): **all on-disk artifact strings are English; the
conversation stays in the PM's language (translate-on-read).** This plan executes
the **broad** scope the PM chose: not only the `product.md` funnel (the original
backlog action item) but also the v2.6.0 product-map value-first labels and every
agent/command/doc reference to those Russian strings. Going forward, agents author
artifacts (docs, reports, reviews, commits) in English and relay them to the PM in
the PM's language; only what is written to disk is English.

**Locked label strings (PM-approved 2026-06-03):**

| Russian (current) | English (canonical) | Source it projects from |
|---|---|---|
| `## Зачем это нужно` | `## Why this exists` | PM Q&A |
| `## Что умеет сегодня` | `## What it does today` | contracts + architecture |
| `## Документы` | `## Documents` | docs nav |
| `## Функции` | `## Features` | → product-map |
| `- **Что даёт:**` | `- **User value:**` | contract `## User value` |
| `- **Границы:**` | `- **Out of scope:**` | contract `## Out of scope` |
| `Чем построено:` | `Built by:` | contract `Built/changed by` |
| `↑ та же работа` | `↑ same work` | repeat-marker for one feature under many contracts |

**Render decision (carried):** all edits stay soft-break-safe (the value-line bullets
already are; headers and labels are blank-line-separated).

## Scenarios

1. A newly scaffolded project gets a `product.md` whose funnel headers are English
   (`## Why this exists` / `## What it does today` / `## Documents` / `## Features`)
   with English prose placeholders.
2. A regenerated `docs/product-map.md` leads each contract block with `- **User
   value:**` + `- **Out of scope:**` and demotes the build table under `Built by:` —
   all English.
3. The conversation language is unchanged: the orchestrator and subagents still talk
   to the PM in the PM's language and translate artifacts on read — only the on-disk
   strings are English. This is recorded once so it is stable across sessions and for
   subagents.
4. **Existing downstream `product.md` with Russian funnel headers is migrated**, not
   broken: the four headers are rewritten to English **preserving the authored
   prose** (headers only — no machine-translation of the PM's authored content). The
   migration is offered at `/pm-plan` and `/pm-audit`.
5. **The auditor does not false-flag an un-migrated project.** When `product.md`
   still carries Russian funnel headers, the auditor treats that as the **migration
   trigger** (a format note), NOT as "missing funnel headers" — so flipping the
   header greps to English is not a breaking change for live projects.
6. **The product-map detection is transition-aware across three eras:** a map is
   current only when it leads with `- **User value:**`; a map carrying the pre-v2.6
   `Guarantees:` label **or** the v2.6 Russian `- **Что даёт:**` label is old-format
   and offered a regenerate. The map regenerates from source each run, so the next
   regeneration produces the English labels — no data migration for the map.

## Existing behaviors this feature touches

(from the protocol's own agent/template behavior — what must not break)

- **`pm-auditor` funnel-header check** (`pm-auditor.md:120-121`) greps the four
  Russian headers. Switching the greps to English **must ship together with the
  downstream migration**: an un-migrated Russian-header `product.md` must be detected
  as a *migration trigger*, never as a "missing header" finding (otherwise the change
  is a breaking false-positive for every live project).
- **`pm-auditor` map re-derive + format-refresh note** (the v2.6.0 machinery): the
  old-format signal broadens from `Guarantees:`-only to `Guarantees:` **or** `Что
  даёт:`; the current label the auditor reads becomes `Built by:` / `- **User
  value:**`. Contract-less / infra-only maps (no contract blocks) remain exempt.
- **`pm-architect` ownership of `product.md`** (`pm-architect.md:24,67-72`): it
  authors the funnel; it must now use the English headers, and it performs the
  downstream header-migration (it owns the file). A4 cross-checks are unaffected
  (`product.md` is not A4-cross-checked).
- **Product map generation procedure** (`pm-bootstrap.md`): structure step 2, output
  format, worked example switch to the English labels. The value-first layout, status
  legend, sort order — unchanged in behavior (only the label strings change). The
  `↑ та же работа` repeat marker (one feature under several contracts) is also
  translated → `↑ same work` (PM decision 2026-06-03), in the generation procedure and
  worked example.
- **`### Pending-migration detection`** gains one new condition (Russian-header
  `product.md`) and the old-format-map condition broadens; v2.2 / v2.3 / README
  front-gate conditions and procedures are otherwise untouched.
- **CLAUDE.md.tmpl funnel reference** (`:79`) and **architecture.md.tmpl** (`:50`,
  `## Документы`) and **doc/architecture.md** (`:104` prose) reference the Russian
  strings and must update in lockstep so the grep-checks and prose stay consistent.

## Contracts

(changed data shapes — template + generated strings)

- **`product.md.tmpl`**: four funnel headers → English; intro line referencing
  `## Функции` → `## Features`; prose placeholders in English.
- **Product map per-contract block**: `- **User value:**` / `- **Out of scope:**` /
  `Built by:` replace the Russian labels (generation procedure + output + example).
- **`### Pending-migration detection`**: new condition "Russian-header `product.md`";
  broadened "old-format-map" condition (`Guarantees:` OR `Что даёт:`). No new Product
  Contract (template/meta change; template-repo exception).
- **`CLAUDE.md.tmpl` + `WORKFLOW.md`**: a language-canon line — "Conversation
  language: the user's. Artifacts (files, code, commits, agent-authored docs):
  English." `WORKFLOW.md` is the canonical spec all agents read, so the note there
  governs subagents; `CLAUDE.md.tmpl` carries it for the downstream project record.

## Stack expectations touched

None. Human-facing markdown templates + agent prose; `doc/stack-notes.md` does not
track document-body markdown as a stack component (consistent with slices 1-3). No
new markdown construct. Nothing stack-level to respect or test.

## Interaction scenarios

This feature is **not** provably isolated: grep-based checks key on the exact label
strings, three agents author these files, and live downstream projects carry the
Russian strings until migrated.

- **When the auditor runs against an un-migrated Russian-header `product.md`:** it
  emits the product.md header-migration note (offer to migrate), NOT a "missing
  funnel headers" finding. The English-grep flip and the migration ship together, so
  there is no window where a live project is false-flagged.
- **When the auditor re-derives a v2.6 Russian-labeled map (`- **Что даёт:**`):** it
  reads it as content-current (compare by content), and additionally emits the
  format-refresh note (now triggered by `Guarantees:` OR `Что даёт:`), remediation =
  regenerate (idempotent; next regen yields English). A contract-less map is still
  not flagged.
- **When `pm-architect` migrates a downstream `product.md`:** it rewrites only the
  four funnel headers to English and **preserves the authored prose verbatim** (no
  machine-translation, no content loss). New prose it authors afterward is English.
- **When `/pm-plan` or `/pm-audit` detects either an old-format map or a Russian-
  header `product.md`:** it offers the corresponding migration before new work,
  referencing `### Pending-migration detection` by name.

## Test plan

- Existing tests that must pass: `bash tests/hooks.sh` — hooks untouched.
- **No automated harness for templates/agent prose** (meta-infrastructure exception);
  `tests/hooks.sh` is the only test artifact. Verification is by review:
  - **New tests (review checks):**
    - `product-md-headers-english`: `product.md.tmpl` has the four English funnel
      headers (exact strings from the locked table) and English prose placeholders;
      no Russian funnel header remains.
    - `map-labels-english`: the generation procedure's structure / output format /
      worked example emit `- **User value:**` / `- **Out of scope:**` / `Built by:`;
      no `Что даёт:` / `Границы:` / `Чем построено:` output remains. (Russian labels
      may legitimately remain only as *old-format detection signals* in the detection
      condition / auditor note / nudge text.) The `↑ та же работа` repeat marker is
      also translated → `↑ same work` in the procedure and worked example.
    - `all-references-updated`: `CLAUDE.md.tmpl:79`, `architecture.md.tmpl` `## Документы`,
      `pm-bootstrap.md` (the funnel-skeleton lists + `## Что умеет сегодня` references),
      `pm-auditor.md:120-121`, `pm-architect.md:24/67-72`, `doc/architecture.md:104`
      all use the English strings; a repo-wide grep for the Russian funnel headers /
      map labels returns only (a) detection-signal text and (b) historical feature
      plans / CHANGELOG (out of scope).
    - `auditor-russian-header-is-migration-trigger`: `pm-auditor.md` treats a
      Russian-header `product.md` as the migration trigger (format note), NOT a
      missing-header finding; English headers pass; truly missing → the existing
      missing/empty note.
    - `detection-three-eras`: `### Pending-migration detection` old-format-map
      condition triggers on `Guarantees:` OR `Что даёт:`; the new Russian-header-
      `product.md` condition is added; contract-less maps remain exempt; v2.2 / v2.3 /
      README front-gate conditions byte-unchanged.
    - `language-canon-note`: `WORKFLOW.md` and `CLAUDE.md.tmpl` carry the
      "conversation = PM's language; artifacts = English" line.
    - `soft-break-safe`: no two adjacent non-blank label lines introduced in any
      edited template.
  - **Interaction scenario tests (review checks):**
    - `product-md-migration-preserves-prose`: the product.md header-migration
      procedure rewrites only the four headers to English and preserves authored prose
      verbatim; it is performed by `pm-architect` (owner of `product.md`).
    - `grep-flip-and-migration-ship-together`: the plan's diff changes the auditor
      greps to English AND adds the Russian-header migration + trigger in the same
      change set — no commit flips greps without the migration.
    - `map-refresh-broadened`: re-deriving a `- **Что даёт:**` map yields a format-
      refresh note (not content-stale); re-deriving a `- **User value:**` map yields
      no format note.
- **Stack-spec tests:** none — no tracked stack component is touched.

## Docs to update

- `doc/_templates/product.md.tmpl` — funnel headers + intro + prose placeholders → English.
- `doc/_templates/CLAUDE.md.tmpl` — `:79` funnel-header list → English; add the
  language-canon line.
- `doc/_templates/architecture.md.tmpl` — `:50` `## Документы` reference → `## Documents`.
- `.claude/commands/pm-bootstrap.md` — Product map generation procedure (English
  labels); funnel-skeleton lists + `## Что умеет сегодня` references → English;
  `### Pending-migration detection` (new Russian-header-product.md condition +
  broadened old-format-map condition); a new **product.md header-migration procedure**
  (pm-architect rewrites the four headers, preserves prose).
- `.claude/agents/pm-auditor.md` — funnel-header greps → English with Russian-header
  treated as migration trigger; map re-derive/format-refresh note broadened to
  `Guarantees:` OR `Что даёт:`, current label `Built by:` / `- **User value:**`.
- `.claude/agents/pm-architect.md` — funnel-header references → English; it performs
  the product.md header-migration; authors new prose in English.
- `.claude/agents/pm-legacy-reader.md` — if it references funnel headers or authors
  product-doc drafts, align to English (and the language-canon).
- `WORKFLOW.md` — add the language-canon line (conversation = PM's language; artifacts
  = English) so all agents and downstream CLAUDE.md inherit it.
- `doc/architecture.md` — record the English-canonical decision and the two-axis rule
  (artifacts English / conversation PM's language); update the `:104` prose funnel
  names. Owner: `pm-architect` (post-coder).

## Out of scope

- **Machine-translating authored prose.** The downstream migration rewrites
  `product.md` **headers** only and preserves the PM-authored prose verbatim;
  existing Russian prose is not auto-translated (lossy, and authorship is the PM's).
  New prose going forward is English. This is the PM-accepted residual.
- **Historical feature plans (`doc/features/*_plan.md`) and CHANGELOG entries** that
  mention the Russian labels — these are a frozen historical record (the labels were
  accurate when shipped). Rewriting them misrepresents history and adds churn with no
  reader value; left as-is.
- **Migration-procedures extraction to a reference** (backlog #172) — sequenced
  AFTER this lands, so the extraction moves a complete set.
- **Conversation language enforcement mechanism** — the canon is a written
  instruction agents follow; no hook/validator is built to enforce it (the protocol
  has no such surface), consistent with how other conversation-language guidance lives
  in WORKFLOW.md.
