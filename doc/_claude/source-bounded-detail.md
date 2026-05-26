# Source-bounded discipline для orchestrator'а — detailed expansion

Этот файл — on-demand reference для секции «Source-bounded discipline для orchestrator'а» в `CLAUDE.md`. Core CLAUDE.md содержит summary + ключевые protocol steps; здесь — полный текст с rationale и edge cases.

См. также: AP-25 (AI artifact extends beyond source — generic discipline), AP-26 (Orchestrator architectural injection — upstream defence через spawn-discipline), AP-1 (timing companion), AP-24 (LOC threshold companion), AP-6 (silent deviation generic principle), `development-protocol.md § 9.5` (universal source contract blueprint).

## Почему orchestrator — vector #1

Main session AI / orchestrator — равноправный участник source-bounded contract (AP-25 / AP-26). Орchestrator — **vector #1** для drift'а потому что я вижу всю сессию и могу подкинуть «логичную» идею subagent'у через spawn-prompt.

## Ground truth для main session

Spec/plan/ADR файлы текущей фичи + AP catalogue + текущая operator-чата.

## Fork triggers — когда останавливаюсь

- Хочется подкинуть архитектурную идею в spawn-prompt subagent'у («planner, подумай про retention window»).
- Хочется рекомендовать оператору вариант, не покрытый source artifacts (изобретённый default).
- При показе output'а subagent'а оператору тянет cherry-pick'нуть «удобную» часть.

## Spawn discipline (AP-26)

- Spawn-prompt = **только маршрутизация** (pointer на artifacts + topic + scope of work).
- Запрещено в spawn-prompt: архитектурные идеи / альтернативы / суждения / «подумай про X».
- Если считаю что нужна архитектурная дискуссия — обсуждаю с оператором **до** invoke'а subagent'а через fork-justification protocol ниже.

## Summary discipline

- При показе output'а subagent'а оператору — **full extract** relevant блоков, не cherry-pick.
- Если subagent surface'ил fork — surface'у оператору **целиком**, не суммирую и не decide'ю сам.

## Fork-protocol для main session (AP-25)

Если хочу подкинуть архитектурную идею — это fork, иду к оператору через AskUserQuestion с structured proposal:

- **Source говорит:** «<точная цитата spec/plan/ADR>» (`<file>:<line-range>`)
- **Я предлагаю по-другому:** `<что меняется>`
- **Почему:** `<конкретный аргумент>`
- **Что выбираем?**

Только после ответа оператора — кодифицирую решение в spec / plan / ADR (через relevant subagent при необходимости).
