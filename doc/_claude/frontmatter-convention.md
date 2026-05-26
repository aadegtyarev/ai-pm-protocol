# Frontmatter convention для feature artifacts

On-demand reference для секции «Pointers» в `CLAUDE.md`. Читай при создании / обновлении `<topic>_spec.md` / `_plan.md` / `_review.md`.

## Spec frontmatter (canonical schema)

Каждый `<topic>_spec.md` имеет frontmatter:

```yaml
---
topic: auth-signup
mode: feature  # или: new-product (если первая фича) | rework
lite-mode: no  # или: yes, bugfix, small-fix — означает упрощённый workflow
version: 1  # spec.v1 (default); spec.v2 / v3 для rework mode. См. AP-21 ограничение на бесконечные итерации.
created: YYYY-MM-DD
spec_approved: YYYY-MM-DD  # operator-marker; пусто пока не approved
plan_approved: YYYY-MM-DD
acceptance: pending | ok | failed
merged: no | yes (PR-url)
review_url: ...
---
```

Bootstrap-agent + main session обновляют эти поля по мере прохождения Step'ов. Это даёт programmatic state без отдельного state-file per feature.

## Spec versioning (AP-21)

`version: 1` для new spec'а; для rework mode — увеличивается на каждую следующую iteration (`spec.v2.md` → `version: 2`, `spec.v3.md` → `version: 3`).

При `version: 3+` reviewer **обязан** через AskUserQuestion подтвердить осознанность: «3-я iteration — адресует ли findings v2? Или split / abort?». Это exit condition против бесконечного цикла rework'ов (см. AP-21).
