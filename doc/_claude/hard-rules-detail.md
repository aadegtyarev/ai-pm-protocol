# Жёсткие правила — detailed expansion

Этот файл — on-demand reference для разделов «Жёсткие правила без исключений» в `CLAUDE.md`. Core CLAUDE.md содержит summary; здесь — полный текст с edge cases.

## Reviewer-agent обязателен для каждого PR перед `git push` (AP-16)

Mandatory all modes, не только feature PR. Layer 4 git pre-push hook вызывает `scripts/check-review-trail.sh <branch>` и блокирует push если (a) нет локального review-trail **или** (b) verdict = `request-changes` (AP-16). Дополнительный Layer 5 — CI workflow `.github/workflows/check-review-trail.yml` блокирует merge PR с тем же check'ом (defense-in-depth — если pre-push hook не установлен / обойдён).

Review всегда фиксируется локально **до** push'а; цикл «открыть PR → дождаться comment'ов → гонять fix'ы» устранён by design.

Допустимые формы trail:
- Committed `doc/features/<topic>_review.md` для Stage E (с `**Verdict:** approve|approve-with-comments|request-changes` в первых 50 строках).
- Local trace `.ai-pm/.reviews/<branch>.json` для chore / docs / template-extension (с полем `verdict`).

Skip-marker `[skip-review]` **на отдельной строке** в HEAD commit body — explicit override только для trivial chore'ов (typo / dep bump / README).

Для не-Stage-E PR'ов (chore/docs/fix) CI не видит local trace (gitignored), поэтому требует либо `[skip-review]`, либо `[review-override: <reason>]` в commit body.

`gh pr review` не используется — review живёт в репе/локально, дублирование в GitHub UI не имеет смысла для оператора+AI workflow.

## Языковая дисциплина (AP-12, soft рекомендация)

Формальные части проекта пишутся на `primary_language` из `.bootstrap-state.md`. Mandatory grep-самопроверка отключена.

Для русскоязычных проектов предпочитай русские эквиваленты для общих понятий (содержимое, доставка, угрозы, меры защиты, граница, рамки, льготный период, обязательный, проверка, нарушение, отговорки); англицизмы оставляй для стандартных технических терминов (MVP, KDF, AEAD, TLS, GDPR, OWASP, и подобных).

Если оператор просит конкретный термин по-русски — переводи. Если хочется strict enforcement в конкретном продукте — добавь pre-commit hook с linter'ом (не template-level concern).

**Точечная замена через sed запрещена** (русская грамматика ломается — «запуск'а» не русский); только Edit / переписать раздел.
