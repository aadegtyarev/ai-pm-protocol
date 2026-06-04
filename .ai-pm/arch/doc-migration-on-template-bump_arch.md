# doc-migration-on-template-bump — design notes

## Context

The plan (`doc/features/doc-migration-on-template-bump_plan.md`) settles WHAT and the v1 shape
(PM decision 2026-06-04: extend `/pm-audit`, no new command/agent). It defers the **structural
encoding** to this review. Five structural questions, each with a concrete drop-in shape.

The mechanical half of template-bump doc migration already exists: `MIGRATIONS.md`
`### Pending-migration detection` is a single-source list of **positive-presence** structural
detect-conditions (stale `_index.md`, frozen signature line, `Guarantees:`/`Что даёт:` labels,
Russian funnel headers, `## What it does` list, wire-tokens, unstamped review trail), each
referenced by name and consumed by `pm-auditor` dimension 5 + the per-version procedures. This
feature adds the **semantic** sibling: a versioned manifest of *content disciplines* a new
template version introduced that need PM-authored content (populated threat-model, foundational
journeys, value-first product story), checked by a new `pm-auditor` dimension and remediated via
the existing `/pm-audit` finding loop.

This is a protocol-spec change in the template repo itself (no runtime, no shared mutable state).
"Adjacent implementations" below are the protocol's own single-source-of-conditions mechanisms,
read as the patterns the new manifest must match — not source code.

## Adjacent implementations

1. **`### Pending-migration detection`** in `MIGRATIONS.md` (lines 7–28) — the structural sibling.
   Each condition is a **positive-presence** detect rule ("flag iff this artifact/token is
   present"), authored so absence = clean = silent, with a guard against false-flagging
   already-migrated and greenfield states. Referenced **by name** by `pm-auditor`/`pm-audit`/
   `pm-plan`; never re-encoded. This is the exact shape + reference mechanism the new manifest
   must mirror — and the set it must stay **disjoint** from.

2. **`### Security-relevant surfaces`** in `WORKFLOW.md` (lines 213–223) — the canonical
   "single source for X, referenced by name, never re-encoded, applicability-gated by file
   presence" pattern. The threat-model lifecycle gates the *entire* discipline on
   `docs/threat-model.md` being present (security-bearing = file present). This is the model for
   per-discipline **applicability tests**.

3. **`pm-auditor` dimension 5 (Docs currency)** in `pm-auditor.md` (lines 108–136) — the closest
   precedent for the new dimension: presence-based, applicability-gated (greenfield exemption;
   threat-model "absent → silent"; security-bearing-only checks), **note-by-default with the
   two-consecutive-audits → blocking escalation** (line 136), explicit no-prose-policing
   guardrails on every sub-check, and remediation pointers that name `### Pending-migration
   detection` / spawn `pm-architect`. The threat-model sub-check (lines 130–134) is the nearest
   per-discipline analogue: absent→silent / skeleton→blocking / stale→note, gated on file
   presence.

4. **`### Foundational product questions`** in `WORKFLOW.md` (lines 225–245) — the named,
   tiered question source the remediation reuses verbatim (per-feature + bootstrap tiers). The
   advocate/`/pm-plan`/`/pm-bootstrap` already reference it by name with a tier and "never
   re-encode the list"; the audit-remediation path becomes one more by-name consumer. The
   bootstrap **Q7 security** answer-set + the threat-model Q-set named in the
   `### Threat-model lifecycle` is the parallel source for the threat-model discipline.

5. **`/pm-audit` remediation list** in `pm-audit.md` (lines 84–103) — six existing
   migration-remediation entries, each: plain-language PM offer → on-yes run the named procedure
   / spawn `pm-architect`. The new semantic-gap remediation is entry #7, structurally identical
   but routing through `AskUserQuestion` (the question relay) instead of a yes/no migration offer.

## Behavioral risks in this area

No event-driven code — this is prose spec. The behavioral risks are **protocol consistency**
risks, all of which the chosen variants must close:

- **Double-flagging** — a discipline appearing in both the structural detection list and the
  semantic manifest would fire twice. Closed by the disjointness rule (point 1 below): the
  manifest carries only disciplines whose remediation needs PM-authored *content*, never a
  greppable stale-artifact condition.
- **Re-nagging adequate docs** — the dpkg/terraform proportionality property. Closed by the
  applicability+satisfied gate (point 5): re-derive from source each run, silent when satisfied
  or not-applicable.
- **Prose-policing creep** — a satisfied-check drifting from "is the structure present" into "is
  the prose good". Closed by phrasing every satisfied-check as a presence/structure test
  (point 1), exactly as dimension 5's wire-token notes are "shape, not meaning".
- **`doc/`-vs-`docs/` resolution trap** — already settled by the migrations + threat-model
  decisions: `MIGRATIONS.md` is **bare-filename referenced**, so it resolves identically in this
  template repo (`doc/`) and downstream (`docs/`). Home stays `MIGRATIONS.md` (point 2).

---

## Point 1 — The expectations-manifest ENCODING

### Variant A — One Markdown table, one row per discipline (four columns)

A single table under a named section in `MIGRATIONS.md`. Columns:
`Discipline | Introduced in | Applicability test | Satisfied-check | Question source`.
Compact, scannable, diff-friendly; matches the bullet-list density of `### Pending-migration
detection`. Downside: the satisfied-check (the false-positive-prone core) is the longest cell
and gets cramped in a table; greppable-token detail and the no-prose-policing caveat are hard to
fit per row.

### Variant B — One `####` subsection per discipline (recommended)

Mirror `### Pending-migration detection`'s own shape: a short single-source preamble, then one
**`####` sub-block per discipline** carrying four labeled lines (Introduced-in / Applicability /
Satisfied-check / Question-source) plus room for the presence-not-quality caveat the dimension-5
wire-token notes carry inline. This is the same authoring affordance that lets each structural
condition spell out its false-positive guards (the frozen-signature "do not tidy", the
infra-only "not old-format" carve-out). The satisfied-checks here are equally guard-heavy
(filled-vs-`<placeholder>`, human-role-subject gating) and need that room.

**Recommendation: Variant B.** The satisfied-checks are the novel, false-positive-prone core;
they need the per-discipline prose room the structural-detection section already uses for its
guards. A table optimizes for scanning a list whose rows are uniform — these rows are not.

### Critical: phrasing satisfied-checks as presence/structure, never quality

Every satisfied-check is a **positive-presence-of-a-gap** test, authored so the *satisfied* state
is the silent default — the inverse of `### Pending-migration detection` (which is
positive-presence-of-a-stale-artifact). The check answers "is the required structure absent /
`<placeholder>` / skeletal?" — never "is the content good?". Greppable where possible
(`<placeholder>` token present; a `####`/`##` heading absent; a table with zero data rows). This
is the same shape-not-meaning discipline as dimension 5's wire-token notes and the structural
token-lint: it matches structure, it never reads intent. A populated-but-"weak" threat-model is
**satisfied** (silent) — the PM owns meaning.

### Disjointness from `### Pending-migration detection`

The seed disciplines below are checked **none** of the way the structural conditions are: a
structural condition fires on the *presence of a stale artifact* (greppable token that must be
migrated/removed); a semantic discipline fires on the *absence/under-fill of content that needs
PM authoring*. No seed discipline overlaps a structural condition — verify at authoring time by
name (the structural list owns `_index.md` / signature line / `Guarantees:` / Russian headers /
`## What it does` / wire-tokens / unstamped review; the manifest owns threat-model-content /
journeys-content / product-value-content). They never share a condition.

### Concrete drop-in shape (coder starts here)

```markdown
### Expected-discipline manifest

**Single source for "this template version introduced a content discipline that may need
PM-authored content."** The semantic sibling of `### Pending-migration detection` above: that
section lists *structural* stale-artifact conditions remediated mechanically; this section lists
*content disciplines* remediated by PM-authored content. `pm-auditor` references this subsection
**by name** ("`### Expected-discipline manifest` in `MIGRATIONS.md`") and must never re-encode
the entries. The two lists are **disjoint** — no entry here duplicates a `### Pending-migration
detection` condition (those are greppable stale artifacts; these are absent/under-filled content).

Each entry's **satisfied-check is a presence/structure test, never a quality judgment** — it asks
whether the required structure is absent / `<placeholder>` / skeletal, never whether the prose is
good (the PM owns meaning; same shape-not-meaning rule as the wire-token notes in
`pm-auditor.md` dimension 5). A discipline is flagged only when it **applies** to the project AND
its satisfied-check shows the gap; applicable-and-satisfied, or not-applicable → silent.

#### Populated threat-model lifecycle
- **Introduced in:** v2.13.
- **Applicability:** the project is security-bearing — `docs/threat-model.md` is **present**
  (the durable signal, per `### Threat-model lifecycle` in `WORKFLOW.md`). Absent → not
  applicable → silent.
- **Satisfied-check (presence):** the threat-model's Assets and Threats carry **no**
  `<placeholder>` tokens AND the Threats table has ≥1 data row. A `<placeholder>` remaining, or an
  empty Threats table → gap. (This is the same skeleton test dimension 5 already runs; the
  manifest entry names it as a discipline so the bump-driven sweep covers it under one rule.)
- **Question source:** the bootstrap **threat-model Q-set** (the Q7 security answers named in
  `### Threat-model lifecycle` in `WORKFLOW.md`).

#### Foundational user-journeys
- **Introduced in:** <version that made journeys a pm-architect-owned discipline — coder fills
  from the changelog; mark `[?]` if unconfirmed>.
- **Applicability:** the project has ≥1 **user-facing** feature — by the **human-role-subject
  extraction** (`pm-auditor.md` dimension 1: any merged feature whose scenario-1 subject is a
  human role). Zero user-facing features → not applicable → silent. (Reuses the dimension-1
  extraction; never re-derived.)
- **Satisfied-check (presence):** `docs/user-journeys.md` exists AND contains ≥1 journey block
  with a populated step table (a journey heading plus a non-empty
  `| Step | What user does | … |` table) — i.e. a foundational zero-to-working journey is
  present, not the bare template skeleton.
- **Question source:** `### Foundational product questions` in `WORKFLOW.md`, **per-feature tier**
  (the value/usability/scope-boundary set).

#### Value-first product story
- **Introduced in:** <version that introduced the authored `docs/product.md` funnel — coder
  fills; `[?]` if unconfirmed>.
- **Applicability:** the project has ≥1 user-facing feature (same human-role-subject extraction
  as journeys). A backend/infra-only project → not applicable → silent.
- **Satisfied-check (presence):** `docs/product.md` exists with its funnel headers
  (`## Why this exists` / `## What it does today`) present AND each carries non-skeleton body
  (not the empty `product.md.tmpl` placeholder text). Structure/placeholder test only — never
  whether the value story is persuasive.
- **Question source:** `### Foundational product questions` in `WORKFLOW.md`, **bootstrap tier**
  (discovery / onboarding / value / viability).
```

**Which others qualify:** only the three above. Candidate "Behavioral contract section exists"
(v2.8) is **structural** (presence of the `## Behavioral contract` heading is greppable, and its
absence is already the contract-two-layer migration *precondition*) → belongs to the mechanical
side, not the manifest. "Security constraints have `SCn` IDs" is a structural/cross-ref
consistency check already owned by dimension 5's threat↔constraint wiring → not a content
discipline. Seed exactly the three; the manifest grows by entry as future versions ship
disciplines that need PM-authored content.

---

## Point 2 — Manifest HOME + reference mechanism

**Variant A — `MIGRATIONS.md` (recommended).** The manifest is the semantic sibling of
`### Pending-migration detection`; it is consumed only on the bump-triggered audit sweep, the
same trigger `MIGRATIONS.md` already serves. `MIGRATIONS.md` is **bare-filename referenced**
(the file-level banner and every by-name reference use the bare filename), so it resolves
correctly in both this template repo (`doc/`) and downstream (`docs/`) — the `doc/`-vs-`docs/`
resolution trap the migrations + threat-model decisions already settled. Disjoint-but-adjacent
placement keeps the disjointness rule visually enforced (a reviewer sees both lists side by side
and checks no overlap).

**Variant B — `WORKFLOW.md`.** Rejected: `WORKFLOW.md` is day-to-day behavior; migration/version
state is `MIGRATIONS.md`'s domain (its banner says exactly this). Splitting the structural and
semantic version-keyed lists across two files breaks the disjointness check's adjacency and
invites drift.

**Recommendation: Variant A — `MIGRATIONS.md`, section named `### Expected-discipline manifest`.**
A stable `###` name (sibling level to `### Pending-migration detection`) so `pm-auditor`
references it **by name** exactly as it references `### Pending-migration detection` and
`### Security-relevant surfaces` — single-source, never re-encoded.

---

## Point 3 — New `pm-auditor` DIMENSION placement + severity

**Variant A — a sixth top-level dimension.** A clean "### 6. Expected-discipline currency".
Downside: it splits doc-currency logic across two dimensions and a sixth dimension reads as
heavier than this is (it reuses dimension-1 extraction + dimension-5 presence-check machinery).

**Variant B — a sub-check inside dimension 5 Docs currency (recommended).** Add it as a bullet
group within "### 5. Docs currency", immediately after the `docs/threat-model.md` block — it is
exactly the same kind of check (presence-based, applicability-gated, note-vs-blocking, spawns
`pm-architect`, points at a named `MIGRATIONS.md` section). It naturally inherits dimension 5's
trailing escalation rule (line 136) and scope binding. Reuses, not duplicates, the dimension-1
human-role-subject extraction for the journeys/product-value applicability tests.

**Recommendation: Variant B.** Same shape, same owner-agent, same escalation, same scope as the
existing doc-currency checks — collocating it keeps one home for "are the docs current" and
inherits the escalation/scope rules for free.

- **Severity:** **note by default**, with the **existing two-consecutive-audits → blocking**
  escalation that already governs every dimension-5 doc-currency note (line 136). No new severity
  rule. (Rationale: a discipline gap is a doc-currency gap; treating it more harshly than a stale
  architecture map would be inconsistent. The threat-model *skeleton* case is the one exception
  and it is **already** blocking under the existing threat-model sub-check — the manifest entry
  does not weaken it; it rides the existing blocking rule.)
- **Scope binding:** it is a **whole-project-state** check (re-derives the project's disciplines
  from source) → belongs to **`full`** scope, exactly like the rest of dimension 5. In **`diff`**
  scope it is skipped, consistent with how dimension 5 doc-currency is scoped (diff scans only
  branches since the last audit; a project-state discipline sweep is a full-scope concern). The
  bump nudge in `WORKFLOW.md` § Maintenance runs `/pm-audit`, whose auto-scope already forces
  `full` on the conditions that matter (first audit / >60 days / >15 commits); a routine post-bump
  audit that auto-scopes `diff` can be promoted via the existing "run full?" prompt.

---

## Point 4 — REMEDIATION wiring in `pm-audit.md`

**Single variant (the plan's design, confirmed).** Add remediation entry #7 to the `pm-audit.md`
list (lines 84–103), structurally identical to the six existing migration-remediation entries but
routing through the question relay:

- The semantic-gap finding walks the **existing finding loop** unchanged: **fix-now /
  next-sprint / accept-with-context**.
- On **fix-now**: the orchestrator relays the discipline's **foundational questions** — by-name
  from the manifest entry's Question-source (`### Foundational product questions` per-feature/
  bootstrap tier, or the threat-model Q-set) — in **one `AskUserQuestion` pass**, then spawns
  **`pm-architect`** (the owner of `architecture.md` / `user-journeys.md` / `threat-model.md` /
  `product.md`) to author the content from the answers. No new authoring agent, no new command.
- On **accept-with-context**: recorded in `.ai-pm/backlog.md` marked
  `accepted (auditor-<date>): <reason>` and not re-raised next audit (the existing accepted-item
  suppression). This **is** the genuine escape-hatch analogue of the Next.js
  `@next-codemod-ignore` load-bearing-marker — a conscious defer with rationale, recorded not
  lost. Confirmed clean.

**Orchestrator-relays-directly vs spawn `pm-product-advocate` to generate the questions —
confirm orchestrator-relays-directly.** The advocate's job is to *match inputs against the
question set and report the unanswered gaps* (a per-feature pre-coding referee). In the audit
path the gap is already identified (the manifest satisfied-check fired) and the question source
is a fixed, named, ordered list — there is nothing for the advocate to *discover*. The
orchestrator can read the named question source and relay it directly, exactly as the existing six
migration-remediation entries relay a plain-language offer directly without spawning a generator.
Spawning the advocate here would add a surface for zero benefit (the protocol resists new
surfaces; the PM decision was maximum reuse). **The plan's lean — orchestrator relays directly
using the named question source, no advocate spawn — is correct.** (The advocate keeps its
distinct role: the per-feature pre-coding gate, not the audit-remediation path.)

This composes the existing loop cleanly: the loop is severity-agnostic (it walks blocking and
notes the same three ways), so a note-severity semantic gap flows through fix-now/next-sprint/
accept-with-context with no loop change — only the fix-now branch's action (relay-questions →
spawn pm-architect) is new, and it reuses two existing mechanisms.

---

## Point 5 — Idempotence / proportionality WITHOUT a state file

**Confirmed: the applicability + satisfied-check gives "re-run = zero findings"; the version stamp
is genuinely deferrable.**

- **Idempotence:** the auditor re-derives the project's state from source each run (the terraform
  "no changes" property). A project that satisfies an applicable discipline produces **no**
  finding; a re-run produces the same zero. No state file is consulted, so there is nothing to get
  stale. This is the same property dimension 5 already has for every doc-currency check.
- **Proportionality:** a discipline fires only when it **applies** (gated by file-presence /
  human-role-subject extraction) **AND** is **unsatisfied** (the presence-check shows the gap) —
  the dpkg three-way "prompt only when both changed" property. Not-applicable or satisfied →
  silent.
- **Version stamp deferrable:** correctness needs no "last-migrated-to" stamp — applicability +
  satisfied-check fully determine the finding set. A stamp is a pure *optimization* (skip
  re-derivation for unchanged versions), explicitly out of scope per the plan; defer until
  re-deriving every audit proves costly.

**Hazards — all handled, none blocking:**

- **Discipline introduced AFTER the project bootstrapped but already satisfied by coincidence**
  (e.g. the project happened to author journeys before that version made it a discipline) →
  satisfied-check passes → **silent**. Correct: the check tests the project's actual state, not
  its bootstrap version. The absence of a version stamp is what makes this Just Work — there is no
  "you bootstrapped before vN so you owe vN's discipline" bookkeeping to get wrong.
- **Discipline the project pre-dates and legitimately descoped** (e.g. a deliberately
  no-threat-model project that nonetheless has the file, or a journeys-descoped project) →
  applicability gate handles the file-presence cases silently; for a genuine "applies but PM
  chose not to" case, **accept-with-context** records the descope-with-rationale and suppresses
  re-raising. Correct escape hatch, no new mechanism.
- **A discipline both applicable-and-unsatisfied across two audits** → escalates to blocking via
  the existing two-consecutive-audits rule. This is intended (a persistently unfilled discipline
  the PM never accepted is a real gap), not a hazard.

---

## Summary of recommendations

| # | Question | Recommendation |
|---|---|---|
| 1 | Manifest encoding | **Variant B** — `####`-per-discipline subsection; satisfied-checks phrased as positive-presence-of-gap tests, never quality. Seed 3 disciplines (threat-model, journeys, product-value); disjoint from `### Pending-migration detection`. |
| 2 | Home + reference | **`MIGRATIONS.md`**, section `### Expected-discipline manifest`, bare-filename referenced (no `doc/`-vs-`docs/` trap), consumed by name. |
| 3 | Dimension placement + severity | **Sub-check inside `pm-auditor` dimension 5 Docs currency**; note-by-default with the existing two-consecutive-audits→blocking escalation; full-scope, skipped in diff. |
| 4 | Remediation wiring | **Entry #7 in `pm-audit.md`**; existing fix-now/next-sprint/accept-with-context loop; fix-now = relay named question source in one `AskUserQuestion` → spawn `pm-architect`; orchestrator-relays-directly (no advocate spawn) — **plan's lean confirmed**. |
| 5 | Idempotence w/o state file | **Confirmed** — applicability + satisfied-check give re-run=zero; version stamp deferrable; all three hazards handled by silence / accept-with-context / intended escalation. |

## Notes for the coder / plan

- **Plan should be updated to** name the manifest section `### Expected-discipline manifest` (the
  plan leaves `<name>` open) — so `pm-auditor.md` and `pm-audit.md` can reference it by the exact
  name from day one (single-source).
- The two `Introduced in:` versions for the journeys and product-value disciplines are not stated
  in the inputs I read — the coder should fill them from the changelog / git tags and mark `[?]`
  if unconfirmed rather than guessing (consistent with the protocol's no-invented-facts rule).
- This note is a **pre-coding structural review**; the `doc/architecture.md` decision record is a
  **separate, post-coding** `pm-architect` spawn (per the plan's "Docs to update") — not part of
  this artifact.
