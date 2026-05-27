# Expected findings — cross-doc-drift-001

`check-spec-discipline.sh` running on this fixture **must** surface the following findings. Each keyword (after `expected_keyword:`) must appear at least once в captured output.

Если future template version не ловит хотя бы один — regression failure.

---

## Expected check failures (Layer 2 cross-doc bounded family)

### AP-27 — Hallucinated decision component

ADR-0014 Components subsection вводит `wrap_session`, `recovery-flow-coordinator`, `server-side-decrypt` без proper source reference (только «for architectural symmetry» / «performance optimization» — это не reference на spec / plan / foundational invariant).

expected_keyword: adr-decision-component-bounded
expected_keyword: 0014-feature-b.md

### AP-28 — Inter-ADR contradiction

ADR-0013 Alternative A explicitly rejects `server-side-decrypt` (violation of vision invariant I). ADR-0014 Decision implements `server-side-decrypt` term. Pairwise check должен flag contradiction.

expected_keyword: inter-adr-contradiction

### AP-29 — ADR scope creep

ADR-0014 feature_topic `f-current`, но `recovery-flow-coordinator` mentioned только в `f-future_spec.md` (not in `f-current_spec.md`). Scope creep — component F-future в ADR F-current.

expected_keyword: adr-feature-scope
expected_keyword: recovery-flow-coordinator

---

## Anchor incident relationship

Это анонимизированный analog incident'а 2026-05-25:
- ADR-A в Alternative D explicitly rejects pattern P (server-side processing)
- ADR-B в Decision section вводит component C, технически реализующий P под другим именем
- C scope — actually F-future, не F-current
- Frontmatter compliance OK (Layer 1 passes)
- Only cross-doc reasoning catches drift
