# Complexity honesty — не слишком ли сложно решение, есть ли путь проще (2026-05-24)

**Scope:** честный разбор сложности `ai-pm-protocol` относительно альтернатив. Каждая «уникальная фишка» проверяется на marginal value vs marginal cost. Цель — понять, что является pay-for-what-you-use, что conditional value, что sunk overhead.

**Method:** сравнение surface area с конкурентами (см. `2026-05-24_competitive-landscape.md`), декомпозиция уникальных опор, тест на user-profile fit.

---

## Объективный замер сложности

| Тул | Минимум команд для фичи | Mandatory artifacts | Stages до Stage F |
|---|---|---|---|
| Ryan Carson 3-step | 3 | 2 (PRD, tasks) | — |
| OpenSpec | 1 (`/opsx:propose`) | 4 (proposal, specs, design, tasks) | — |
| Spec Kit | 4 (`/constitution`, `/specify`, `/plan`, `/implement`) | 4 + constitution | constitution |
| Agent OS | 4 (Install/Discover/Inject/Shape) | standards + product + specs | standards setup |
| BMAD | 6 phases | разное per phase | Phase 1-2 |
| **мы** | **~10+ artifacts через Stages A-F** | **15+ mandatory в полном Mode 1** | **5 stages (A-E)** |

Мы на дальнем конце spectrum'а. Это объективный факт, не оценка.

---

## Декомпозиция уникальных опор: что pay-for-use, что overhead

### 1. Tier framework — **pure win**

Auto-extract / mini-research / promote / override. Артефакт может быть skip'нут на низком Tier'е, без церемонии.

**Тест:** на простом проекте Tier 0/1 коллапсирует большинство артефактов. Сложность исчезает там, где она не нужна.

**Вердикт:** ✅ Pay-for-what-you-use. Оставлять.

### 2. 5 modes (new-product / feature / rework / bug-fix / template-sync) — **pure win**

Разный workflow shape: bug-fix не идёт через Stages A-E.

**Тест:** mode переключает surface area. Сложность не платится за каждый change-type.

**Вердикт:** ✅ Pay-for-what-you-use. Оставлять.

### 3. Specialized reviewer routing — **modest win**

Backend / frontend / db / design / protocol-compliance. Routing automatic.

**Тест:** на маленькой фиче протокольный baseline всё равно запускается → marginal cost = 0. На большой — найдёт то, что один reviewer пропустит.

**Вердикт:** ✅ Pay-for-what-you-use. Оставлять.

### 4. Constraints layer (Stage B) — **conditional value**

Threats / legal / SLO / MVP scope.

**Тест:**
- Banking / healthcare / любой compliance-sensitive → invaluable, save'ит позже от incident'а.
- Solo personal project, no users → пустые артефакты, чистый overhead.

**Вердикт:** ⚠️ Conditional. Должен быть **opt-in**, не mandatory. Сейчас mandatory → wasted time для 60-80% потенциальных пользователей.

### 5. Composition matrices (`ui_kind` × `db_kind`) — **conditional value**

Multi-domain продукт через one template + decomposition.

**Тест:**
- ≥2 UI kinds или ≥2 DB kinds → высокая ценность, иначе пришлось бы дублировать spec'и.
- Single web app + single Postgres → matrix вырождена в скаляр, чистый overhead вокруг.

**Вердикт:** ⚠️ Conditional. Должен быть **opt-in**, активируется когда `ui_kind` / `db_kind` действительно множественны.

### 6. Per-kind UI style guides — **conditional value**

ui-style-guide-web / native-mobile / native-desktop / tui / cli / embedded + brand voice.

**Тест:**
- ≥2 UI kinds → invaluable для consistency.
- Один kind → нужен **один** UI guide, остальные mandatory шаблоны — overhead.

**Вердикт:** ⚠️ Conditional. Должен быть scoped к используемым kind'ам, не all-or-nothing.

### 7. Trust profiles A/B/C — **conditional value**

Симметричный PM/dev workflow.

**Тест:**
- Оператор — PM со слабой tech-intuition → invaluable, без этого framework не работает для него.
- Оператор — developer (≈80% потенциальной аудитории) → profile A везде, ничего не меняется. Концепт читается, но в работе invisible.

**Вердикт:** ⚠️ Conditional. Для developer-only пользователей — концептуальный overhead в документации, не операционная нагрузка. Реальная цена низкая, ценность только для целевой ниши.

### 8. AP discipline как numbered invariants — **discipline overhead**

AP-1 reactive ADR / AP-2 derived infra / AP-3 operator-gate / AP-19 per-PR atomicity / AP-20 reviewer routing. Numbering позволяет citing в reviews / plans / ADR.

**Тест:**
- Команда multi-person / audit-driven → numbering = шарiable language, окупается.
- Solo session 1 час → «не делай AP-19» проще говорить, чем «один логический change на PR». Цитирование = ритуал.

**Вердикт:** ⚠️ Discipline overhead для solo, win для команды / audit-trail кейсов. Самы invariants полезны всегда; **их numbering** — это вес, который окупается только на дистанции.

---

## Итоговая раскладка

| Категория | Опор | Что делать |
|---|---|---|
| Pure win (pay-for-use) | 3 (Tier, Modes, Reviewer routing) | Оставлять как есть. |
| Conditional value | 4 (Constraints, Composition, Per-kind UI, Trust profiles) | Делать **opt-in**, не mandatory. |
| Discipline overhead | 1 (AP numbering) | Принимаем сознательно как trade-off (без этого нет «discipline framework» бренда). |

**Брутальный вывод:** ~половина наших уникальных опор сейчас **навязывается** там, где не нужна. Это создаёт впечатление «огромной сложности», хотя реальная нагрузка распределена неравномерно.

---

## Что показывает сравнение с конкурентами

- **OpenSpec / Ryan Carson** — single-purpose, минимум surface area. Покрывают solo-dev case. **Если ваш проект — это их кейс, наш фреймворк overengineering.**
- **BMAD** — сложнее их, но имеет `quick-dev` escape hatch для простых случаев. У нас аналога нет.
- **Spec Kit / Agent OS / Kiro** — заточены под команды; layered, но без escape hatch для solo-mode.
- **Только BMAD** среди разобранных имеет explicit «light path». Мы — нет.

---

## Можно ли решить ту же задачу проще

Зависит от формулировки «задачи»:

- **Задача = «ship a small feature in a personal project»** → да, OpenSpec / Ryan Carson достаточно. Наш фреймворк wasted time.
- **Задача = «PM с weak tech-intuition сотрудничает с AI на multi-stack продукте, где compliance + UX consistency + reviewer trust имеют значение»** → нет, простые альтернативы дырявят критически.

Сложность оправдана **тогда и только тогда**, когда у пользователя реально есть проблема, которую она решает. У 60-80% потенциальных читателей README такой проблемы нет.

---

## Два пути

### Path A — агрессивно сузить аудиторию в README

Перепозиционировать как «**discipline framework для асимметричного PM/dev сотрудничества на compliance-sensitive multi-stack продуктах**». Люди вне ниши self-select out по заголовку.

**+** Фреймворк остаётся idea-pure, ничего ломать не надо.  
**−** Терять users, которым достаточно minimal mode — они могли бы вырасти в нашу нишу через 6 месяцев.

### Path B — добавить minimal mode (рекомендую)

Onion-структура:
- **Layer 0 (default):** Stage F only. Spec → plan → coder → reviewer. AP-3, AP-19, AP-20 enabled. 4 artifacts per feature. Сопоставимо с BMAD `quick-dev` / OpenSpec.
- **Layer 1 (opt-in):** + Stage A (audience, problem). Когда нужна продуктовая ясность.
- **Layer 2 (opt-in):** + Stage B (Constraints). Когда появляются compliance / threats / SLO.
- **Layer 3 (opt-in):** + Stage C-D (Solution shape, Process). Когда продукт растёт.
- **Layer 4 (opt-in):** + composition matrices, per-kind UI, trust profiles B/C. Когда multi-stack / PM-asymmetric.

**+** Discipline brand сохраняется (AP-3/19/20 enabled с Layer 0); сложность opt-in; framework растёт с проектом.  
**−** Требует рефакторинга `project-bootstrap` агента и templates'ов; documentation effort.

### Риск Path B и mitigation

Риск — бренд «дисциплинированный фреймворк» размывается, если пользователь видит «опционально, опционально, опционально».

Mitigation: **AP invariants (operator-gate, per-PR atomicity, reviewer routing) обязательны со Layer 0**. Опциональные части — это **content layers** (Constraints, Composition, Trust profiles), а не **discipline layers**. Discipline остаётся monolith'ом, foundation становится layered.

---

## Рекомендация

1. **Path B** — добавить minimal/layered mode. Это структурное изменение, требующее отдельного plan'а; не делать в одной сессии.
2. **В README (когда переработка случится)** явно сказать: «по умолчанию минимально; включать слои по мере того, как они нужны». Это снимает 80% «too complex» возражений.
3. **Эту переработку не путать с README repositioning** из `2026-05-24_competitive-landscape.md` — там про позиционирование, здесь про feature reshape.
4. **AP invariants не диверсифицировать.** Их вес — это и есть «дисциплина», ради которой framework существует.

---

## Open questions для оператора

- **Какой % реальных пользователей попадает в conditional-value категории (Constraints / Composition / Per-kind UI / Trust profiles)?** Если ≥50% — текущий mandatory подход оправдан. Если <30% — Path B критичен.
- **Готов ли разделить «discipline layer» и «content layer»** концептуально? Это меняет mental model фреймворка.
- **Готов ли смириться** с тем, что Layer 0 пользователи не увидят differentiator'ов, и часть из них уйдёт к OpenSpec? Это плата за growth funnel.

---

## Token/money cost — операционная половина complexity

Complexity = не только cognitive load оператора, но и **расход контекста + денег** на каждую сессию. Вторая половина оценки.

### Где деньги протекают

1. **Subagent fan-out** — самая большая статья. Primary reviewer спавнит до 5 sub-reviewers на каждый PR. Каждый загружает независимый context (protocol docs + foundational + plan + diff). Для PR на 50 строк это **≈5× overhead** относительно одного reviewer'а.
2. **Mandatory foundational load** — Stage A-E artifacts грузятся в каждую Stage F сессию, даже когда фича их семантику не задевает. Для personal-project, где Stage B пустой, это **wasted tokens каждый раз**.
3. **Per-PR atomicity (AP-19)** — мелкие PR'ы хороши для review quality, но **каждый новый PR = новая Stage F сессия = повторная загрузка protocol context**. На длинной фиче из 10 PR'ов это **10× re-load** одного и того же.
4. **Subagent invocations не batched** — planner → coder → reviewer спавнятся последовательно, каждый с независимым context budget'ом, без передачи прогретого кэша.

### Где это оправдано

- На больших / complex PR'ах специализированные reviewer'ы находят domain issues, которые fix позже стоит дороже. ROI положительный.
- На фундаментальных решениях ADR через operator-gate (AP-3) дешевле, чем rollback agent-driven фейла. Operator-gate платит за себя на длинной дистанции.
- Per-PR atomicity делает revert дешёвым; экономия на rollback'е иногда перевешивает re-load overhead.

### Где это чистая трата

- PR < 100 строк (specialized routing спавнится впустую — baseline нашёл бы то же сам).
- bug-fix workflow (Stage A-E грузятся, но не нужны — Mode 4 эту часть уже частично решает).
- typo / dep-bump / docs-only (full Stage F cycle на 1-2 строки кода — **10×+ waste**).

### Rough estimate

| Размер фичи | Token ratio (мы / OpenSpec) | Где |
|---|---|---|
| Trivial (typo, dep bump) | **10×+** | Subagent fan-out + foundational load |
| Small (< 100 LOC) | **3-5×** | Specialized routing впустую |
| Medium (100-500 LOC) | **1.5-2×** | Reviewer ROI начинает оправдывать routing |
| Large / complex / multi-domain | **1-1.5×** | Routing находит реальные issues; компенсирует overhead |

Большинство реальных PR'ов — в zone small-to-medium. Значит большинство сессий — **в zone 1.5-5× overhead**.

### Исправления, доступные без переработки фреймворка

| Что | Эффект | Стоимость реализации |
|---|---|---|
| **Size gate на specialized reviewer routing** (PR < N LOC → только protocol-compliance baseline, без fan-out) | Прямо убирает 3-5× overhead на маленьких PR'ах | Низкая: правило в primary reviewer agent prompt'е. |
| **Lazy loading foundational docs** (грузить только те, что релевантны file paths в diff'е) | Снижает context bloat на ~30-50% для большинства PR'ов | Средняя: нужен router-механизм перед каждым subagent'ом. |
| **Агрессивнее использовать Mode 4 (bug-fix) и Tier framework** | Уменьшает Stage A-E load на не-feature changes | Низкая: documentation + better defaults. |
| **Prompt caching / pinned foundational docs** (per-PR re-load → cached read) | Снижает повторные re-loads на длинных фичах | Средняя: зависит от того, как Claude Code обрабатывает cache_control. |

### Жёсткое наблюдение

**Discipline overhead и token overhead — это часто один и тот же overhead в разных одеждах.** AP-discipline numbering, mandatory foundational, per-PR atomicity, fan-out reviewers — всё это одновременно cognitive load для оператора **и** token bill для бюджета.

Path B из секции выше (layered minimal mode) — **одновременно решение для обоих**: меньше mandatory artifacts → меньше cognitive load **и** меньше context per session.

Size gate на reviewer routing — independent quick win, можно делать сейчас, не дожидаясь Path B.

### Что НЕ делать

- **Не убирать AP-3 (operator-gate)** ради экономии токенов. Operator-gate отлавливает дорогие ошибки, которые потом фиксить в 100× дороже. ROI положительный даже на маленьких PR'ах.
- **Не убирать per-PR atomicity (AP-19)** ради батчинга. Большие PR'ы дороже в review **и** в rollback'е. Re-load overhead — это симптом missing caching, не аргумент против атомарности.
- **Не убирать protocol-compliance baseline.** Он дешёвый и ловит то, что больше никто не ловит.

---

## Резюме обеих половин (complexity + cost)

| Опора | Cognitive overhead | Token overhead | Вердикт |
|---|---|---|---|
| Tier framework | низкий | низкий | ✅ keep |
| 5 modes | низкий | низкий (mode-skip) | ✅ keep |
| Reviewer routing | низкий | **высокий на маленьких PR** | ⚠️ add size gate |
| Constraints (Stage B) | высокий, если не нужен | высокий, если грузится впустую | ⚠️ opt-in (Path B) |
| Composition matrices | высокий, если single-stack | средний | ⚠️ opt-in (Path B) |
| Per-kind UI guides | высокий, если 1 kind | высокий | ⚠️ scoped к active kinds |
| Trust profiles A/B/C | низкий (мост invisible) | низкий | ✅ keep (concept-only weight) |
| AP numbered invariants | средний (ritual citation) | низкий | ✅ keep (бренд = discipline) |
| Mandatory Stage A-E load | высокий | **высокий, каждая сессия** | ⚠️ lazy load + Path B |
| Per-PR re-load | низкий | **высокий на длинных фичах** | ⚠️ caching (внешний от framework) |

**Главный вывод:** complexity и cost — это две проекции одной и той же проблемы. Path B (layered) + size gate на reviewer routing + lazy loading foundational — три rich интервенции, которые **режут одновременно и cognitive load, и token bill**, не трогая discipline-core.

---

## Stage consolidation — что можно объединить и сократить

Анализ текущей структуры по `bootstrap-state.md.tmpl`. Сейчас в Stages A-E **~25+ mandatory/optional artifacts**. Не вся сложность нужна — много duplication через искусственное разделение тесно связанных документов.

### Дубликации, которые видно невооружённым глазом

| Текущее | Дубликация | Предложение |
|---|---|---|
| `vision` (A) + `strategic-frame` (B) | Оба про продуктовое framing: vision = «что/для кого/границы»; strategic-frame = «SLO + метод валидации». Это две секции одного документа. | **Merge:** vision → раздел `strategic-frame.md`, либо удалить vision как отдельный артефакт. |
| `competitive-analysis` (A) + `positioning` (A) | Positioning **отвечает** на competitive analysis. Это upstream + downstream одного и того же. | **Merge:** competitive-analysis как секция `positioning.md`. |
| `personas` (A) + `user-journeys` (A) | Оба про аудиторию, всегда пишутся вместе. Journey без personas бессмысленен; personas без journey — академический. | **Merge:** `audience.md` с двумя секциями. |
| `brand-voice` (A) + `ui-style-guide-base` (A) | Brand voice логически — раздел UI guide (тон UI-copy). Сейчас два файла с сильным cross-ref. | **Merge:** brand-voice → раздел `ui-style-guide-base.md`. |
| `legal-frame` (B) + `legal-brief` (B) | Legal-brief — это actionable дистилляция frame'а. Frame пишется один раз, brief — за каждый этап. | **Merge:** один `legal.md` с разделами «frame» и «current brief». |
| `threat-model` (B) + `incident-runbook-draft` (B) | Threats определяют, какие incidents планировать. Жёсткая связь. | **Merge:** `risk-and-response.md` с двумя секциями (threat-model + initial runbook). |
| `dependency-policy` (D, opt) + `refactor-playbook` (D, opt) | Оба — playbook для maintenance flow. Оба optional. | **Merge:** `maintenance-playbook.md` с секциями. |
| `stack chosen` + `db_kind chosen` + `database-design-*` (D) | Все три tech-stack решения, взаимозависимы (db_kind вырастает из stack). | **Merge:** `tech-stack.md` с секциями stack/db/database-design. |
| `ai-linting-rules` + `subagent configs verified` + `development-protocol overlay` (D) | Все три про AI/agent infrastructure. | **Merge:** один `development-protocol-overlay.md` с секциями linting + subagents + overlay. |

### Stage E — отдельный случай

Stage E содержит **12+ checkbox'ов**, но фактически это **mechanical config generation** одним bootstrap script'ом. Tracking 12 пунктов вместо одного создаёт иллюзию работы, которой не было.

**Предложение:** заменить 12 checkbox'ов на **один checkpoint**:

```
- [ ] Repo scaffold generated + `make setup && make test` green + initial CI passed (YYYY-MM-DD)
```

Все 12 текущих items — это **output одного bootstrap-script'а**. Их granular tracking имеет смысл только если они выполняются вручную, что мы не делаем.

### Stage C — кандидат на упразднение

Stage C («Solution shape») содержит всего **2 artifacts** (topology + foundational ADRs), причём ADR-блок чаще всего «none needed yet». Это **тонкий stage без самостоятельной идентичности**.

Варианты:
- **Fold в Stage D (Process):** topology тесно связан со stack choice. `topology.md` становится секцией `tech-stack.md`.
- **Fold в Stage B (Constraints):** topology выражает архитектурные constraints; ADRs — explicit decisions about boundaries. Концептуально подходит.

Предпочтение: **fold в Stage D**, потому что topology + stack + db_kind решаются together.

### Stage B — overloaded mixed-concerns

Stage B сейчас содержит **bounds** (threats, legal, SLO) **и** **scope** (mvp-scope, validation script). Это разные категории.

`mvp-scope.md` — это **решение о shape продукта**, не constraint. Логичнее в Stage C/D рядом с topology.

### Сводная reshape таблица

| Сейчас | Предложение | Дельта |
|---|---|---|
| Stage A: 7+ artifacts (vision, personas, journeys, competitive, positioning, brand-voice, ui-style-base + per-kind) | Stage A: 3 artifacts (`audience.md`, `positioning.md`, `ui-style.md`) | −4 |
| Stage B: 7 artifacts | Stage B: 4 artifacts (`strategic-frame.md`, `risk-and-response.md`, `legal.md`, `customer-interview-script.md`) | −3 |
| Stage C: 2 artifacts | Stage C: упразднён (folded в D) | −2 |
| Stage D: 6-8 artifacts | Stage D: 4 artifacts (`tech-stack.md` [включает topology], `dev-environment.md`, `maintenance-playbook.md`, `development-protocol-overlay.md`) | −2-4 |
| Stage E: 12+ checkboxes | Stage E: 1 checkpoint | −11 |
| **Total: ~25+ items** | **Total: ~12 items** | **≈−13 (50%)** |

### Trade-offs

**Плюсы:**
- Cognitive load оператора падает вдвое.
- Token cost foundational load тоже падает — меньше файлов, более сжатые, проще lazy-load.
- Migration для template-sync дешевле: меньше template'ов, меньше точек drift'а.
- Документы становятся **более читаемыми**, когда связанные секции рядом (vision + SLO в одном файле — coherent narrative).

**Минусы:**
- **Merged docs длиннее** — каждый файл становится более weighty. Mitigation: жёсткая структура с anchors, чтобы можно было читать секциями.
- **Loss of granularity в tracking** — нельзя сказать «personas done, journeys not yet». Mitigation: внутри-doc checkboxes в начале файла.
- **Migration cost** для существующих template-using проектов. Mitigation: migration script + одна version bump'нутая major-версия template'а.
- **Risk «too much in one place»**: если `tech-stack.md` распухнет до 500+ строк, читать его как один документ тяжело. Mitigation: hard cap on section count, разнести при necessity.

### Что НЕ объединять

- `mvp-scope.md` — отдельный document с независимым lifecycle (часто обновляется при validation feedback). Merging в strategic-frame потеряет это.
- `customer-interview-script.md` — это **executable artifact** (используется оператором при интервью), не reference doc. Должен оставаться отдельно.
- `per-kind ui-style-guide-*.md` — нельзя merge'ить в base, потому что они активируются conditionally по `ui_kind`. Lazy-load logic держит их отдельно.
- `ADR-файлы` — каждый ADR это атомарное решение, mergng разрушает AP-1 (reactive ADR).
- `feature-spec / feature-plan / feature-review` — отдельные artifacts на feature, разные lifecycle.

### Рекомендация

**Path C: stage consolidation** — независимая интервенция от Path A (narrow audience) и Path B (layered minimal mode). Все три комплементарны:

- **Path C** уменьшает absolute number of artifacts на 50%.
- **Path B** делает оставшиеся artifacts opt-in по слоям.
- **Path A** позиционирует фреймворк так, чтобы Layer 0 пользователи выбирали нас осознанно.

Из трёх Path C — самая «безопасная» (не меняет философию discipline, только убирает duplication). Path B самая impactful. Path A — pure marketing/copy.

**Порядок выполнения, если делать все три:** C → B → A. Сначала сжать до core (C), потом сделать слоёным (B), потом написать README, который про получившееся (A).
