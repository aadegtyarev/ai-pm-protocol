# audit-fixup-self-stack-notes — plan

## Audit reference

From `doc/features/audit-2026-05-30.md`, blocking finding #2:

> `doc/stack-notes.md` — missing entirely. **Why it matters:** this template's own #10 guarantee in README and the new dimension 10 in `reviewer.md`/`auditor.md` say a missing stack-notes for an actively-used component is blocking. The template relies on at least: `jq` (used in hook commands), `gh` (used by `pr-prep` and the GitHub Actions release flow), `git` (entire flow), GitHub Actions YAML schema, Claude Code's `hookSpecificOutput`/`PreToolUse` contract, and Markdown frontmatter conventions for agent files. None of these have a documented canonical-rule entry. Without stack-notes, dimension 10 of the audit on this very project is unverifiable — the template fails its own rule.

## Scenarios

1. После этого плана `doc/stack-notes.md` существует с разделами для шести компонентов: `jq`, `gh`, `git`, GitHub Actions, Claude Code hooks API (PreToolUse + hookSpecificOutput contract), Markdown frontmatter.
2. У каждого компонента — canonical docs URL, spec/reference, required validators (если у компонента есть нативный валидатор), идиомы и ограничения с цитатами и source URL, known gotchas с источниками, дата последней ревизии.
3. После merge этого плана последующие fixup-планы (`audit-fixup-self-docs-architecture`, `audit-fixup-hooks-quoted-form`, и далее) могут ссылаться на конкретные цитаты в своей секции «Stack expectations touched» — reviewer dim 1 sub-check проходит.

## Existing behaviors this feature touches

Никакие user-journeys не затрагиваются — этот репозиторий не имеет runtime user-journeys (он сам — шаблон). Существующие документы (`README.md`, `WORKFLOW.md`, `.claude/agents/*.md`) не модифицируются в рамках этого плана.

## Categorical scope check

«Компоненты стека» — категориальное множество. PM выбрал scope в 6 компонентов из предложения auditor'a.

**В scope:**
- `jq` — JSON-обработка в hook-командах
- `gh` — GitHub CLI, используется `pr-prep` и `auto-tag.yml`
- `git` — везде: ветки, коммиты, PR-flow, submodule conventions
- **GitHub Actions** — `.github/workflows/auto-tag.yml`, release flow
- **Claude Code hooks API** — `PreToolUse` events, `hookSpecificOutput` decision contract, settings.json structure
- **Markdown frontmatter** — agent persona files (name/description/model fields)

**Out of scope (явные братья этого выбора, идут отдельными планами при необходимости):**
- Conventional Commits — нужен для `pr-prep` parsing коммитов; отдельным планом, когда возникнет необходимость
- Keep a Changelog — формат `CHANGELOG.md`; отдельным планом
- SemVer 2.0 — version bumping rules; отдельным планом
- Claude Code Agent API (subagent invocation contract: `Agent` tool, `subagent_type`, isolation modes) — отдельным планом
- Bash POSIX/Bashism rules — embedded в hook command strings; неявный, отдельным планом, если понадобится

## Contracts

Новый артефакт: `doc/stack-notes.md` в формате, определённом шаблоном `doc/_templates/stack-notes.md.tmpl`.

Если `stack-researcher` обнаружит native validators для какого-либо компонента — соответствующие команды появятся в таблице «Validators wired into pipeline» в stack-notes. **Привязка их к CI** (`.github/workflows/`) — out of scope этого плана, это работа `audit-fixup-hooks-tests` (note #6).

## Stack expectations touched

N/A — этот план **создаёт** stack-notes. Цитировать пока нечего; ссылки появляются в результате его выполнения.

## Test plan

Это не код-фикс; автотестов в традиционном смысле нет (consistent с `template-v2_plan.md` — «validation by use»). Validation выполняется reviewer'ом:

- `doc/stack-notes.md` создан, содержит **ровно** 6 компонентов: jq, gh, git, GitHub Actions, Claude Code hooks API, Markdown frontmatter — не больше, не меньше.
- Для каждого компонента присутствуют все обязательные поля шаблона (Role, Canonical docs URL, Spec/reference, Required validators, Idioms and constraints, Known gotchas, Last reviewed).
- **Каждое** правило / ограничение / gotcha имеет source URL. Reviewer блокирует план, если найдена хоть одна unsourced claim (как было в downstream wb-mqtt-matter — там это поймал review pass v1).
- Spot-check (reviewer): WebFetch на 5–8 случайных source URL для проверки, что цитируемое там действительно присутствует.
- Cross-component «Validators wired into pipeline» table создана; если валидаторов не обнаружено для компонента — явно пустая ячейка с пояснением, не выдумано.
- Cross-component «Integration contracts» table — N/A в данном случае (нет внешних систем, в которые шаблон что-то должен «доставлять»; есть GitHub Releases, но это deployment, не integration contract).
- Out of scope компоненты (Conventional Commits, SemVer, Keep a Changelog, Claude Code Agent API, Bash) **не** появляются в stack-notes — categorical coverage sub-check.

## Docs to update

- `doc/stack-notes.md` — создаётся `stack-researcher`.

`README.md` и `WORKFLOW.md` **не** обновляются в этом плане — раскрытие связи stack-notes ↔ architecture идёт в следующем плане (`audit-fixup-self-docs-architecture`).

## Out of scope

- Написание `doc/architecture.md` — отдельный план (`audit-fixup-self-docs-architecture`).
- Привязка найденных validators к CI workflow — часть `audit-fixup-hooks-tests`.
- Stack-notes для других компонентов (Conventional Commits, SemVer, Keep a Changelog, Claude Code Agent API, Bash) — отдельным планом при необходимости.
- Refactor существующих агентов/команд под цитаты из stack-notes — будут другие audit-fixup'ы.
- Перепроверка соответствия `.claude/settings.json` найденным правилам Claude Code hooks API — это входит в фикс hook-багов (audit-fixup-hooks-quoted-form) и в audit-fixup-hooks-tests.

## Handoff

1. PM подтверждает план.
2. Орчестратор спавнит `stack-researcher` со списком компонентов: `jq`, `gh`, `git`, `GitHub Actions`, `Claude Code hooks API`, `Markdown frontmatter`. Researcher работает в read-only режиме (WebFetch/WebSearch), пишет `doc/stack-notes.md`. Возвращает structured summary.
3. Орчестратор спавнит `reviewer` для проверки получившегося артефакта против test plan выше.
4. При approve — `pr-prep` оформляет PR (этот проект использует GitHub, full ceremony).
5. PM мерджит.

Architect не требуется — нет структурной развилки (создаётся data-файл по фиксированному шаблону).
