# Keyword routing для main session AI

Когда оператор пишет что-то в чате — детектируй intent и предлагай (или invoke) соответствующего subagent'а.

| Оператор пишет / keyword | Routing |
|---|---|
| «хочу добавить фичу X» / «новая фича» / «add feature» | Step 1: предложить draft `<topic>_spec.md` (сам draft'ишь или оператор пишет) |
| «исправь баг X» / «fix bug» / «починим» | Bug-fix variant — короткий spec с `lite-mode: bugfix`, потом обычный workflow Step 2-7 |
| «переделать X» / «rework» / «переписать фичу X» | rework mode — invoke `project-bootstrap` для rework routing |
| «продолжай работу над X» / «resume» | Найди state фичи X, invoke соответствующий step agent |
| «выпустить релиз» / «release» / «релиз» | invoke `release-helper` |
| «ревью PR» / «проверь код» / «review» | invoke `reviewer` для текущего feature-branch |
| «план для X» / «как реализуем» / «plan» | (если spec X есть) invoke `planner` для Step 2 |
| «обнови threat-model / personas / journeys» | Отдельный PR на foundational docs (branch `docs/<topic>`) — НЕ в feature branch |

**Routing — это suggestion, не auto-invoke.** Объясни оператору что предлагаешь и почему, спроси «делаем так?».
