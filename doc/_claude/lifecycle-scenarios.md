# Lifecycle scenarios — что делать в каждой ситуации

On-demand reference для main session AI. Читай когда соответствующий сценарий релевантен текущему запросу оператора.

## Scenario: New product (greenfield)

- `.bootstrap-state.md` пустой / нет.
- Routing: project-bootstrap → Stage A-D → handoff в Stage E.

## Scenario: New feature в зрелом проекте

- `.bootstrap-state.md` закрыт, Stage A-D done.
- Оператор: «хочу добавить фичу X».
- Routing: Step 1 spec для X (оператор draft или ты draft → оператор approve) → Step 2 planner → ...
- Stage A-C read-pass — если фича требует новой persona / journey / threat surface → отдельный PR в `docs/<topic>` branch ДО feature branch.

## Scenario: Bug fix в зрелом проекте

- Оператор: «починим баг X».
- Routing: lite-mode spec с `lite-mode: bugfix` в frontmatter → planner лёгкий → coder с failing test first → reviewer (terser).
- НЕ lite-mode если bug в security path — full ceremony.

## Scenario: Rework existing feature (rework mode)

- Оператор: «переработаем фичу X, меняется поведение».
- Routing: project-bootstrap для rework setup → `<topic>_spec.v<N>.md` с Diff секцией → `_plan.v<N>.md` с Migration секцией → coder → mandatory reviewer.

## Scenario: Resume interrupted session

- На session start scan `{{doc_root}}/features/` обнаружил in-progress фичу.
- Routing: предложи resume или закрыть.

## Scenario: Multiple feature streams в parallel

- Каждая фича — своя feature/<topic> branch.
- State per feature через frontmatter в `_spec.md` / `_plan.md`.
- При switch'е branches Claude re-reads CLAUDE.md и feature state.

## Scenario: Release time

- Оператор: «релиз?» или несколько fic merged в main без release.
- Routing: invoke `release-helper`.
