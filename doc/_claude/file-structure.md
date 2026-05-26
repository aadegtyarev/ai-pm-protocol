# Файловая структура — для ориентирования

On-demand reference для main session AI. Полная карта `.ai-pm/` layout + локация product code.

```
.ai-pm/
├── doc/                       ← committed product content
│   ├── personas.md, journeys, threat-model, scope, topology, ...
│   ├── ai-linting-rules.md
│   ├── architecture-decisions/
│   └── features/
│       ├── <topic>_spec.md, _plan.md, _review.md
│       └── <topic>_spec.v2.md, _plan.v2.md, _review.v2.md (rework)
├── .bootstrap-state.md         ← committed; session resume + lifecycle state
├── version                     ← committed; template version pin
└── tooling/                    ← integration mode-dependent (gitignore/submodule/vendor)
    ├── agents/, _templates/, recipes-cache/, scripts/
    ├── _claude/                ← on-demand references для main session AI (этот файл и сиблинги)
    ├── development-protocol.md ← generic (template-level)
    └── anti-patterns.md        ← generic AP catalogue
```

Для greenfield проектов (`doc_root: doc`) content живёт в top-level `doc/`, а `.ai-pm/` содержит только `.bootstrap-state.md` + `version` + `tooling/`.

Product code — в стандартных директориях проекта (`apps/`, `packages/`, `src/`, etc.), **не в `.ai-pm/`**.
