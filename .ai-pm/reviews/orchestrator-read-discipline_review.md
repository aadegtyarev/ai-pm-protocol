# orchestrator-read-discipline — Pass-1 plan-compliance review

Feature: `orchestrator-read-discipline` · branch `feature/orchestrator-read-discipline` · software-kind, non-user-facing meta-feature (subjects = orchestrator / `CLAUDE.md` / `WORKFLOW.md` thin core / `workflow/decision-authority.md`).
Plan: `doc/features/orchestrator-read-discipline_plan.md` (REVISED — kernel-move, not band-aid). Arch: `.ai-pm/arch/orchestrator-read-discipline_arch.md` (Variant A).
No Product Contract (backend/infra meta — "no Product Contract touched"). No advocate gate (non-user-facing — `n/a`). No `## Validation` gate (software-kind — `n/a`).

## Plan compliance

- ✓ **Scenario 1 — root `CLAUDE.md`** — present (`CLAUDE.md`, new, 13 lines). `@WORKFLOW.md` root-relative import (last line); `## Project kind: software` heading; one-paragraph dogfood note; language-canon line. Small, pulls only the thin core. Verified: `CLAUDE.md` top-level in `git ls-tree HEAD`.
- ✓ **Scenario 2 — kernel moved to the core, single home** — `WORKFLOW.md:16` carries the decision-authority kernel as one compact `## Cross-cutting invariants` bullet: enum `autonomous | interactive`, `absent file OR unrecognized ⇒ interactive` default, derivability test, the 3-trigger escalate-cap (not-derivable / security-surface-on-security-bearing / PM-irreversible-or-high-stakes), announce-before-act, merge-always-manual-in-both-scopes. Compact, no elaboration pulled in. `workflow/decision-authority.md:5` no longer DECLARES the enum/default/cap/derivability — it defers to the core kernel and keeps only elaboration. `### Decision authority` heading unmoved (`workflow/decision-authority.md:3`). Router row (`WORKFLOW.md:70`) updated to point at the *elaboration* and note the kernel is the core invariant.
- ✓ **NO-DOUBLE-ENCODING (the load-bearing single-source floor)** — the enum, the `absent ⇒ interactive` default, the 3 escalate-cap triggers, and the derivability test are DECLARED in the `WORKFLOW.md` core kernel and NOWHERE else. (Verdict detail below.)
- ✓ **By-name resolution** — every live `### Decision authority` reference resolves to the unchanged heading in `workflow/decision-authority.md`; zero orphans, zero repointing. (Detail below.)
- ✓ **Scenario 3 — boundary criterion in the always-loaded core** — `WORKFLOW.md:9` (the `## Cross-cutting invariants` intro, not behind a Read): "a rule the orchestrator applies in its own freeform reasoning, outside any injected command/skill procedure … keeps its decision-critical kernel here in the always-on core." Also recorded in `doc/architecture.md:284` (new `### WORKFLOW.md progressive-disclosure boundary …` decision record refining the progressive-disclosure boundary) and in the arch note's Q2 decision.
- ✓ **Scenario 4 — "Read before apply" demoted/trimmed** — `WORKFLOW.md:17` is now a "(secondary backstop)" bullet scoped to on-demand *full detail* only ("the decision-critical kernels are already in this core"). No longer decision-critical.
- ✓ **Scenario 5 — additive, no migration** — no `MIGRATIONS.md` entry; `doc/_templates/CLAUDE.md.tmpl` byte-unchanged; downstream `@.ai-pm/tooling/WORKFLOW.md` import path byte-unchanged.

### No-double-encoding verdict (the load-bearing one): PASS

Grepped the enum / `absent ⇒ interactive` default / escalate-cap triggers / derivability test across `WORKFLOW.md` + `workflow/decision-authority.md`:
- **Single DECLARATION home = `WORKFLOW.md:16`** (the core kernel). Confirmed.
- `workflow/decision-authority.md` occurrences are all legitimate references/applications/value-syntax, NOT re-declarations:
  - `:5` — explicit defer ("… is the always-on cross-cutting invariant in `WORKFLOW.md` … not restated here").
  - `:12` `mode: autonomous | interactive` — value-syntax (the per-project value file) — plan-allowed.
  - `:18` `Decision authority: autonomous | interactive` — the per-feature override-line syntax — plan-allowed.
  - `:16` / `:60` — value-home rationale + consumer-list, both reference `absent ⇒ interactive` as a consequence and name the core as the single home; no re-declaration.
  - `:24` — explicit defer ("The test itself, its three escalate-cap triggers, and announce-before-act are the always-on kernel in `WORKFLOW.md` (not restated here)").
  - `:26/27/37/40/46` — apply the test / cap BY NAME to the advocate-gap flow and feature-selection (on-demand application — plan states this is correct usage, not re-encoding).
- The old verbatim declarations (the pre-change topic-file lines that enumerated the 3 triggers + stated the enum/default/derivable-vs-not bullets) are DELETED — `Security-relevant surfaces` / the general 3-trigger enumeration now returns ZERO hits in the topic file. The general semantic kernel has exactly one home.

### By-name resolution verdict: PASS

All live consumers reference `### Decision authority` **in `workflow/decision-authority.md`** — heading unmoved, so all resolve byte-identically: `pm-bootstrap.md` (×3), `pm-audit.md`, `pm-auditor.md`, `pm-plan-checker.md` (×2), `pm-plan.md` (×7). Zero repointing. `doc/architecture.md` decision records (×4, lines 192/208/240/272) say "in `WORKFLOW.md`" but are the FROZEN historical narrative the plan/arch (Q5) explicitly say not to chase — not orphans, correctly untouched. `doc/features/*_plan.md` are frozen audit-trail — untouched. The one new inbound link (topic file → core kernel) points into the always-loaded core, always resolves.

### Boundary-criterion-in-core verdict: PASS

Criterion lives in the always-loaded core intro (`WORKFLOW.md:9`), NOT behind a Read — avoids the recall-trap the feature exists to close. Second home (decision record) present at `doc/architecture.md:284`.

### Constraints

- ✓ Core stays thin — `WORKFLOW.md` 79 → 81 lines (net +2; the kernel bullet ~replaces the demoted band-aid line). Progressive-disclosure win preserved.
- ✓ Downstream `@.ai-pm/tooling/WORKFLOW.md` import contract — byte-unchanged.
- ✓ `WORKFLOW.md` path — unchanged.
- ✓ `doc/_templates/CLAUDE.md.tmpl` — byte-unchanged.
- ✓ `.claude/settings.json` / `tests/hooks.sh` — untouched.
- ✓ No `MIGRATIONS.md` entry.
- ✓ `doc/architecture.md` `## File layout` lists `CLAUDE.md` (A4 ↔ `git ls-tree` matches).

### Hooks result

`tests/hooks.sh` — **74/74 PASS** (unchanged).

### pm-architect post-coding handoffs

- ✓ File-layout row for new root `CLAUDE.md` — committed (`d57bb94`).
- ✓ Decision-2 refinement (`doc/architecture.md:284`, freeform-vs-procedure criterion + worked example) — **authored and correct on disk**, but **UNCOMMITTED** (`git status: M doc/architecture.md`). Content satisfies Scenario 3's second home; it is not yet in a branch commit. See Notes. The latest state commit (`bd82f14`) still lists it under "Remaining / Next step", consistent with this being just-performed-but-uncommitted handoff work.

## Definition of Done
- [x] All plan scenarios implemented and tested (verification = editorial + clean-grep, per Test plan; no automated tests by design)
- [x] Interaction scenarios have concurrent-state tests (none — provably isolated; static config + content move, no runtime/shared-state/concurrency/I/O)
- [x] Stack expectations respected; stack-spec tests pass (editorial check vs the cited Claude Code context-loading rules — `@`-import eager, topic files Read-on-demand, <200-line budget; all honored)
- [x] Product Contract honored; Acceptance checks pass; no silent behavior change — **no Product Contract touched** (backend/infra meta-feature)
- [x] Pipeline green (`tests/hooks.sh` 74/74; no stack linter — markdown-prose repo)
- [x] State file updated (`.ai-pm/state/current.md`)
- [x] Product Impact Report present (when contract touched) — n/a, no contract touched
- [x] Docs updates landed (CLAUDE.md, WORKFLOW.md, decision-authority.md, architecture.md File-layout row + Decision-2 refinement all present on disk — see Note 1 re: the Decision-2 refinement being uncommitted)
- [x] Expected artifacts exist (plan, this review; no contract — non-user-facing)
- [n/a] Product-readiness gate resolved — non-user-facing (every scenario subject is the orchestrator / config file / spec file); exempt, no advocate artifact required
- [n/a] Validation gate resolved — software-kind feature; no `## Validation` section emitted

**DoD: pass**

## Blocking

None.

## Notes (product)

1. **Decision-2 refinement (`doc/architecture.md:284`) is authored on disk but uncommitted** (`git status: M doc/architecture.md`). Content is correct and satisfies Scenario 3's second home; it is the pm-architect post-coding handoff. Why it matters: it must be committed before PR-prep, or the branch's `doc/architecture.md` ships with only the File-layout row and the recorded boundary-refinement is lost. This is a commit-hygiene item for the orchestrator, not a content defect — flagging so it is not missed at ship.

## Verdict
approve

<!-- The trail below is the ONE review section the orchestrator owns, not pm-plan-checker.
     See the "Edit-ownership rule" in `workflow/enforcement.md` — the Pass-2 code-review
     trail is the single carve-out to "orchestrator does not edit content artefacts". -->
## Code review findings

Pass 2 reviewed the diff (`WORKFLOW.md` kernel-move + criterion + demoted backstop; `workflow/decision-authority.md` deferral + elaboration; root `CLAUDE.md`; `doc/architecture.md` File-layout row + boundary decision record). **Zero findings** — single-source no-double-encoding holds (the enum / `absent ⇒ interactive` default / 3 escalate-cap triggers / derivability test are declared only in the `WORKFLOW.md` core kernel; `decision-authority.md` defers and does not re-list the cap triggers); the `### Decision authority` heading is unmoved so all by-name references resolve; the boundary criterion sits in the always-loaded core intro (not behind a Read); "Read before apply" is demoted to a full-detail-only secondary backstop; the consumer "never re-encode the default" discipline is repointed to the core as the single home; core stays thin (79→81); markdown well-formed. `tests/hooks.sh` 74/74.

## Code review: 2026-06-05 — passed
