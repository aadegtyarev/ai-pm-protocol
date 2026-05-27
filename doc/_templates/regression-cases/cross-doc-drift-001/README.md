# Regression case: cross-doc-drift-001

**Class:** Layer 2 invisible drift — hallucinated decision component + foundational invariant violation + inter-ADR contradiction + scope creep.

**Anchor incident reference:** анонимизированный из live test'а 2026-05-25 на foundation-heavy feature. Original case caught by independent reviewer agent после Layer 1 (per-agent source contract) passed.

## What this fixture tests

Synthetic anonymized case с 4 файлами:
- `vision.md` — foundational invariant I: «Y product не делает Z»
- `positioning.md` — red line: «Z прохождение запрещено»
- `features/f-current_spec.md` — spec для feature F-current, scope X
- `architecture-decisions/0013-feature-a.md` — ADR-A, in Alternatives rejects pattern P
- `architecture-decisions/0014-feature-b.md` — ADR-B, in Decision implements P под другим именем (component C)

ADR-B также:
- Components subsection без proper source-ref для component C (AP-27 hallucinated)
- Component C — это actually F-future functionality, не F-current scope (AP-29 creep)
- Inter-ADR contradiction с ADR-A (AP-28)

## Expected behavior

Run `bash scripts/check-spec-discipline.sh --regression` (with `REGRESSION_CASES_DIR=doc/_templates/regression-cases`):

Expected output keywords (см. `expected_finding.md`):
- `adr-decision-component-bounded` — ADR-0014 fails AP-27 check
- `inter-adr-contradiction` — pairwise check ADR-0013 vs ADR-0014 fails AP-28
- `adr-feature-scope` — ADR-0014 component scope creep flagged AP-29

Если future template version не ловит хотя бы один из этих — regression failure.

## How to add new regression cases

1. Create directory `doc/_templates/regression-cases/<name>/`
2. Create synthetic minimal `vision.md`, `positioning.md`, `features/*_spec.md`, `architecture-decisions/*.md` files (anonymized)
3. Create `expected_finding.md` with `expected_keyword: <keyword>` lines
4. Run `bash scripts/check-spec-discipline.sh --regression`
