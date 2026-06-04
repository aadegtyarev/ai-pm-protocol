# doc-migration-on-template-bump — plan-compliance review (Pass 1)

Protocol-spec / agent-prompt feature. No runtime, no executable tests by design (repo "no automated tests by design" constraint — `doc/architecture.md` § Architectural constraints); validation is editorial, per the `pm-product-advocate` / `legacy-reader-role-split` precedent. Scenario subjects are non-human (the audit process / `pm-auditor` / the orchestrator) → product-readiness gate is N/A; this repo is the documented no-Product-Contract exception.

> **RE-RUN (Pass 1, 2026-06-04).** A prior Pass 1 approved the first build; `code-review` then found the new "Expected-discipline gap" sub-check duplicated existing `pm-auditor` dimension-5 detection (double-flagging). The feature was **reworked to remediation-only** and the plan gained a **DESIGN CORRECTION banner** (top of "Key design decisions"). This verdict re-verifies the **corrected** shape against `git diff main..HEAD` and supersedes the prior re-run content.

## Plan compliance

Verified through the DESIGN CORRECTION banner (the authoritative corrected shape): no parallel detector; the manifest is a remediation registry; the net-new value is the PM-collaborative remediation enhancement on the existing dimension-5 fix-now path.

**Scenarios** (read through the correction — "new dimension / sub-check / detector" substituted by "enhanced remediation on existing dimension-5 findings + manifest-as-registry")

- ✓ S1 Version-keyed manifest exists — `### Expected-discipline manifest` in `MIGRATIONS.md` (sibling to `### Pending-migration detection`), `####`-per-discipline, 3 disciplines seeded (populated threat-model lifecycle v2.13, foundational user-journeys v2.16, value-first product story v2.3). Corrected per banner §2: it is a **registry** — `Introduced in:` + `Detected by:` + `Question source:` only; **no satisfied-check / applicability lines** (those would re-detect what dimension 5 already detects). `MIGRATIONS.md:30+`.
- ✓ S2/S4 Remediation via the existing loop, by-name single source — `pm-audit.md:84` enhances the EXISTING "Stale docs → `pm-architect`" remediation: a dimension-5 doc finding mapping to a manifest discipline, on **fix-now**, drives the orchestrator to relay the discipline's foundational questions in ONE `AskUserQuestion` (by-name source: `### Foundational product questions` in `WORKFLOW.md` or the bootstrap threat-model Q-set) → spawn `pm-architect`. Explicit "No `pm-product-advocate` spawn" and "adds **no** new finding type"; `accept-with-context` → `.ai-pm/backlog.md`, not re-raised, remains the escape hatch. Matches banner §3.
- ✓ S3 Presence-only — inherited from the existing dimension-5 findings (unchanged; each is already a positive-presence-of-a-gap test, never prose-quality). Architecture.md "Key properties" states presence-not-quality is inherited from dimension 5, not re-implemented.
- ✓ S5 Run `/pm-audit` after a bump — `WORKFLOW.md:375` (§ Maintenance, right after the submodule-bump flow): after the bump, run `/pm-audit`; remediation-only wording ("its existing docs-currency checks surface… and offer to fill them with the PM"), no detector implied; references `### Expected-discipline manifest` by name.
- ✓ S6 Idempotent + proportional — inherited from dimension 5 (the parallel detector that would have re-implemented these is gone). No new state file (deferred, per Out of scope).
- ✓ S7 Subsumes "product story fell behind" — realized as the journeys manifest entry; `MIGRATIONS.md` states "N substrate features shipped while `user-journeys.md` is still skeletal" is exactly the existing dimension-5 missing-journey finding firing. Not a separate one-off check.

**Corrected-shape verification (the nine re-run checks)**

1. ✓ **No parallel detector.** `git diff main -- .claude/agents/pm-auditor.md` is **empty** (dimension 5 byte-identical to `main`). No "Expected-discipline gap" sub-check; `grep "Expected-discipline" pm-auditor.md` → NONE.
2. ✓ **Manifest = registry.** Per discipline: `Introduced in:` + `Detected by:` (names the existing dimension-5 finding) + `Question source:` — and **no** satisfied-check / applicability lines. Preamble (`MIGRATIONS.md:32`): "carries **no detection of its own** — dimension 5 already detects these gaps… consumed by `pm-audit.md`'s remediation step (referenced there by name), not by a detector. `pm-auditor` does not reference it." Disjoint-from-`### Pending-migration detection` note kept (`MIGRATIONS.md:34`).
3. ✓ **Remediation enhancement, not a new finding type.** `pm-audit.md:84` enriches the existing fix-now path; explicit "No `pm-product-advocate` spawn", "adds **no** new finding type"; accept-with-context escape hatch present.
4. ✓ **Single-source + by-name.** `### Expected-discipline manifest` defined once (`MIGRATIONS.md`), referenced by name from `pm-audit.md` (remediation), `WORKFLOW.md` (Maintenance), `doc/architecture.md` (decision record); spelled identically; **NOT** referenced from `pm-auditor.md`. grep confirms.
5. ✓ **WORKFLOW Maintenance + README.** `WORKFLOW.md:375` keeps "run `/pm-audit` after a bump". `README.md:191` one-liner (Russian) is accurate for remediation-only ("показывает PM, какие документационные дисциплины ввела новая версия… и помогает заполнить их вместе с pm-architect") — surfacing-and-filling, no detector implied.
6. ✓ **No double-flag possible.** The parallel detector is gone; the existing dimension-5 findings are the sole detectors. The threat-model/journeys/product.md gaps each fire exactly once.
7. ✓ **architecture.md corrected.** `doc/architecture.md:158+` is the remediation-only decision record: "an expected-discipline **registry** + an enhanced remediation, **no new detection**"; explicitly "no new pm-auditor dimension / sub-check"; no "entry #7" framing; records the code-review finding and the rework. (NOTE: the state file's "Remaining" line still lists this refresh as pending — stale by one commit; see Notes.)
8. ✓ **No new surfaces.** `.claude/settings.json` not in diff; `### Pending-migration detection` heading and its conditions unchanged (diff adds the sibling manifest only); no new command / agent / dimension / hook; `bash tests/hooks.sh` → **71/71 green**.
9. ✓ **Disjointness / idempotence / proportionality** — disjointness asserted in the manifest preamble and architecture.md; idempotence + proportionality + presence-not-quality inherited from the unchanged dimension 5.

**Detected-by accuracy (the registry's load-bearing links)** — all three `Detected by:` lines map to real, unchanged dimension-5 findings: threat-model skeleton → `pm-auditor.md:132` (blocking); missing journey → `pm-auditor.md:111` (note); `product.md` funnel-missing → `pm-auditor.md:124`/`:127` (note).

**Categorical coverage** — the feature covers the SEMANTIC migration kind; the sibling MECHANICAL/structural kind (`### Pending-migration detection`) is explicitly Out of scope and untouched. Full set addressed.

## Definition of Done
- [x] All plan scenarios implemented (7/7, read through the DESIGN CORRECTION) — coverage verified editorially (no executable tests by design)
- [x] Interaction scenarios covered — no-double-flag (parallel detector removed) / not-applicable-silent / satisfied-silent / accept-with-context-suppressed / scope-binding all hold via the unchanged dimension 5; non-runtime spec, no concurrent-state test applies
- [x] Stack expectations respected — plan declares "None"; no `docs/stack-notes.md` component touched; no agent frontmatter change; no stack-spec test applies
- [n/a] Product Contract — no Product Contract touched (repo documented exception; non-runtime protocol-spec change)
- [x] Pipeline green — `tests/hooks.sh` 71/71; no lint/validator beyond hooks for a prose change
- [x] State file updated — `.ai-pm/state/current.md` records the rework (remediation-only), the verification grep results, and the touched files
- [x] Product Impact Report — n/a (no contract touched)
- [x] Docs updates landed — all corrected-shape docs present: `MIGRATIONS.md`, `pm-audit.md`, `WORKFLOW.md`, `doc/architecture.md`, `README.md`; `pm-auditor.md` correctly reverted to `main`
- [x] Expected artifacts exist — plan (with DESIGN CORRECTION banner), research, arch note, and this review present; no contract required (non-user-facing repo exception)
- [n/a] Product-readiness gate — non-human scenario subjects (the audit process / pm-auditor / orchestrator); user-facing gate exempt with no special-casing

**DoD: pass**

## Blocking

None.

## Notes (product)

1. The `doc/architecture.md` decision record has been refreshed to the remediation-only shape (verified in the diff), but `.ai-pm/state/current.md` still lists that refresh under "Remaining — POST-rework `pm-architect` handoff." Not a compliance gap — the doc is present and correct, which is what the DoD requires — but the state file's "Remaining" / "Status: awaiting `doc/architecture.md` refresh" lines are now stale by one commit. Why it matters: a reader trusting `current.md` would think the architecture record is still on the old detector shape. Worth a one-line state refresh before ship. (Routes to coder — minor; non-blocking.)
2. The branch's `.ai-pm/backlog.md` diff adds two PM observations recorded during the planning session (agent-handoff durability; state-archive committed-home) unrelated to this feature's implementation. They are planning-session bookkeeping, not implementation scope creep — but they ride this feature's branch rather than landing independently. Why it matters: the PM should be aware these two follow-ups are now coupled to this PR's merge; if either warrants separate triage, note it. (Scope observation for PM — not a defect.)

## Verdict
approve

<!-- The trail below is the ONE review section the orchestrator owns, not pm-plan-checker.
     See WORKFLOW.md "Edit-ownership rule" — the Pass-2 code-review trail is the single
     carve-out to "orchestrator does not edit content artefacts". -->
## Code review findings

Pass 2 (`code-review`, high effort, prose-protocol: 2 targeted finders — manifest
false-positive risk + consistency/disjointness). One **material design finding**; the rest
are subsumed by its fix.

1. **(material) The new "Expected-discipline gap" sub-check duplicates existing dimension-5
   detection for all three disciplines — double-flagging + redundant detection.** The
   net-new value of the feature is the **PM-collaborative remediation** (relay the
   discipline's foundational questions → `pm-architect` authors), but the implementation also
   added a **parallel detection** sub-check that overlaps what dimension 5 already detects:
   - **threat-model:** the manifest satisfied-check ("Assets/Threats no `<placeholder>` AND
     Threats ≥1 row") is **verbatim** the existing `docs/threat-model.md` skeleton check,
     which already fires **blocking**. The new entry would add a **note** on the same
     condition → double-flag. (The coder's "rides that existing rule" prose acknowledges it
     but does not stop the second emission.)
   - **journeys:** existing "Missing journey for an implemented user-facing feature → note"
     vs new "≥1 user-facing feature AND no populated journey → note" → overlapping double-note.
   - **product-story:** existing "`product.md` missing/empty/no-funnel → note" vs new entry →
     overlap on the missing/empty case.
   *Failure scenario:* a security project with a skeleton threat-model is reported **twice**
   (blocking + note); a project with user-facing features and skeletal journeys gets two
   notes for one gap. *Root cause:* the feature added parallel **detection** where dimension 5
   already detects; only the **remediation** (foundational-question relay) is genuinely new.
   *Recommended fix (reshapes the feature — taken to the PM):* drop the duplicate detection
   sub-check; keep `### Expected-discipline manifest` reframed as a **question-source +
   introduced-in registry** (no re-detection); move the net-new value — relay the discipline's
   foundational questions → `pm-architect` authors — onto the **existing** dimension-5
   findings' remediation (enhance them in `pm-audit.md`, do not add a parallel detector).
   "Run `/pm-audit` after bump" stays (the existing checks surface the gaps; the enhanced
   remediation drives the PM-collaborative fill).

**Subsumed by the fix** (would-be findings on the parallel detector, moot once it's dropped):
manifest "placeholder text" / "non-empty table" phrasing ambiguity (false-positive on
half-stubbed content); the threat-model question-source being less crisply named than the
foundational-question tiers; the `Введ in vN`-predates-project nag (handled by the existing
accept-with-context suppression). The this-repo dogfood case is **not** a current bug
(zero user-facing features → not applicable → silent; verified).

## Code review: 2026-06-04 — passed

Pass 2 re-run after the remediation-only rework: clean (zero findings). Verified the parallel
detector is fully removed (`pm-auditor.md` byte-identical to main), the manifest is
registry-only (no satisfied-check/applicability), all three `Detected by:` links map to real
dimension-5 findings, the enhanced "Stale docs" remediation is coherent (relay foundational
questions → pm-architect; accept-with-context escape hatch; no new finding type; no advocate
spawn) with valid by-name question sources, and no double-flag can occur (each gap fires once
from the unchanged dimension 5). The original overlap finding is resolved.
<!-- The orchestrator replaces THIS WHOLE LINE with `## Code review: <date> — passed`
     only when code-review clears. Until then the section is UNSTAMPED: `pm-pr-prep`
     refuses to release it (step 0) and `pm-auditor` blocks on it (dimension 1).
     Never ship an empty `## Code review` heading — an empty section reads as
     "no findings / passed" to a quick eye or grep; `NOT YET RUN` reads as "not done". -->
