---
pr: TBD
branch: fix/high-findings-batch
reviewer: self-review (offline AP-16 trail)
reviewed_at: 2026-05-25
trail_type: committed-review
spawned_agents: N/A (defect batch fix PR)
---

**Verdict:** approve

v0.2.0 Scope (H-1..H-5 из post-refactor audit). Закрывает 5 High findings одним comprehensive PR'ом — все мелкие текстовые правки в template/agent prose, тематически связаны (consistency improvements после schema PR1 introduced foundation_completeness и связанные fields).

# Coverage

## H-1 — CLAUDE.md.tmpl session start: Step 1.5 foundation_completeness check

Добавлен **Шаг 1.5** в Session start routine `doc/_templates/CLAUDE.md.tmpl`:
- `complete` → standard workflow
- `partial` → read-pass на existing + mini-research для missing
- `minimal` → per-feature mini-research для каждой фичи (warning operator)
- `none` → mini-research mandatory + hard floors для security path

Дополнительно убран doubled mode word `new-product new-product mode` (артефакт B-1 sweep'а — regex `\bMode 1\b` сработал внутри `(new-product Mode 1)` дав doubled).

## H-2 — orphan `trail_type` field documented в AP-16

Поле `trail_type` присутствовало в `reviewer.md` output template и `feature-review.md.tmpl` без declaration. Добавлен новый параграф в AP-16 (`doc/anti-patterns.md`) объясняющий поле как **informational** metadata с enum (`committed-review` / `local-trace` / `skip-marker`); не enforced скриптами, служит discoverability при review history sweep'ах. Это closes orphan field без удаления (поле полезно для readability).

## H-3 — meta/ references в template-sync workflow

`.claude/agents/project-bootstrap.md` Template-sync Phase 3 ссылался на `meta/template-sync-doc-migration-<date>.md` — но `meta/` это template-internal directory (не копируется в product). В product такого dir нет.

Fix: unified convention `.ai-pm/migrations/<date>-<name>.md` для product-side migration artifacts:
- `template-sync-doc-migration-<date>.md` → `.ai-pm/migrations/<date>-template-sync-doc-migration.md`
- `template-sync-doc-migration.diff` → `.ai-pm/migrations/<date>-template-sync-doc-migration.diff`
- `template-sync-verification-v0.X.Y.md` → `.ai-pm/migrations/<date>-template-sync-verification-v0.X.Y.md`

Updated в:
- `.claude/agents/project-bootstrap.md`
- `doc/_templates/scripts/template-sync-doc-migrate.py.tmpl`

## H-4 — architecture-extract location consistency

Same root cause как H-3 — `meta/architecture-extract-<date>.md` references в product workflow. Inconsistent: один раз `meta/...`, второй раз `doc/architecture-extract-<date>.md`.

Fix: unified convention `.ai-pm/extracts/architecture-<date>.md` для всех architecture-overview keyword routing'ов. Это semantically sound — extracts не product content (не в `doc/`), не review/audit (`meta/` template-only), а tooling artifacts.

Updated в:
- `.claude/agents/project-bootstrap.md`
- `doc/_templates/scripts/auto-extract/extract-all.sh.tmpl`

## H-5 — Mini-foundation friction в complete state

`doc/_templates/feature-spec.md.tmpl` секция `## Mini-foundation sections` присутствует unconditionally в template, требует manual deletion при `foundation_completeness=complete` (~95% случаев в greenfield).

Fix: добавлен HTML comment в head'е секции с explicit instruction:
- УДАЛИТЕ всю секцию полностью при foundation_completeness=complete (от comment'а до `---` перед `## User stories`)
- Hint that `check-spec-discipline` опционально сделает auto-strip на Stage E

Это minimal-friction fix без structural template split. Если позже хочется auto-strip — отдельный enhancement в check-spec-discipline.

# Cross-cutting findings

## Spec coverage

PR — H-1..H-5 batch из post-refactor audit. Audit doc служит spec'ом.

## Plan adherence

Соответствует v0.2.0 Scope (план v3 PR 3 — B-4 + High findings, but B-4 split out в PR #30; этот PR содержит только High batch).

## Test discipline

N/A — text/prose fixes. Verification: grep clean на orphan `meta/architecture-extract` / `meta/template-sync` в product-touched files; doubled mode word grep clean.

## Security / architecture

- AP-12: техтермы wrapped
- AP-17 clean

## Code hygiene

- 5 файлов изменено
- ~30 строк изменено net

# Protocol compliance

- ✅ AP-1: нет архитектурных решений (defect fixes)
- ✅ AP-3: scope утверждён через утверждённый план v3
- ✅ AP-4: spec coverage — audit doc
- ✅ AP-6: scope без deviation
- ✅ AP-12: clean
- ✅ AP-16: этот trail + H-2 само closes orphan field в AP-16 prose
- ✅ AP-17: clean
- ✅ AP-19: 5 high findings связаны (consistency fixes после schema PR1); единое logical batch — acceptable per AP-19 «один логический change» когда findings гомогенны

# Severity summary

- Blocking: 0
- Question: 0
- Nit: 0

# Out of scope

- Silent-break gaps 1-3 — следующие PR'ы
- AP-24 + size gate — следующие PR'ы
