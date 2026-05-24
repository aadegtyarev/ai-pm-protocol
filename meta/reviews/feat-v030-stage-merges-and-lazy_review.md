---
pr: TBD
branch: feat/v030-stage-merges-and-lazy
reviewer: self-review (offline AP-16 trail)
reviewed_at: 2026-05-25
trail_type: committed-review
spawned_agents: N/A (template structural refactor)
---

**Verdict:** approve

v0.3.0 Path C PR 1: 4 same-axis merges per план v3 (positioning+competitive, ui-style+brand-voice, maintenance-playbook NEW, legal NEW). Merge criterion: same axis of quality. Result: ~25 → ~21 артефактов (4 merges done; tech-stack + dev-protocol-overlay в следующих PR'ах).

# Coverage

## Merge 1: positioning ← competitive-analysis

Positioning теперь содержит **§ 1 — Competitive landscape** (absorbed full competitive-analysis.md.tmpl content: 2 слоя анализа, сегментация, прямые/adjacent, тематический frame analysis, финансовый профиль, market sizing implications) и **§ 2 — Positioning** (existing content). TL;DR с section checkboxes + soft cap 600 LOC. competitive-analysis.md.tmpl → redirect stub с migration инструкцией.

**Why same axis:** product framing. Positioning есть **derivative** от competitive landscape — две связанные секции одного документа.

## Merge 2: ui-style-guide-base ← brand-voice

`ui-style-guide-base.md.tmpl` § 2 «Brand voice» расширен из stub в full absorbed content (2.1-2.8: default tone rule, tone в одном предложении, do's/don'ts, vocabulary, copy примеры, что НИКОГДА, применение surface, inferred brand voice для legacy adoption). brand-voice.md.tmpl → redirect.

**Why same axis:** UI/UX consistency. Brand voice = tone of UI copy — subset.

## Merge 3: maintenance-playbook NEW ← dependency-policy + refactor-playbook

Новый `maintenance-playbook.md.tmpl` (~481 LOC): TL;DR + **Part A — Dependency Update Policy** (A.1-A.10 absorbed) + **Part B — Refactor Playbook** (B.1-B.9 absorbed). Section numbering re-prefixed для conflict avoidance. Soft cap 700 LOC. Originals → redirect stubs.

**Why same axis:** maintainability. Both — maintenance flow playbooks.

## Merge 4: legal.md NEW ← legal-brief (+ legal-frame conceptual)

Новый `legal.md.tmpl`: TL;DR + **§ 1 Legal frame** (постоянное framing — jurisdiction / legal entity / regulatory obligations / compliance surface / юрисдикционные нюансы) + **§ 2 Brief для юриста** (actionable distillation — ToS / Privacy Policy / Cookie / Open questions / Budget). Soft cap 500 LOC. legal-brief.md.tmpl → redirect.

**Why same axis:** legal/compliance. Brief = actionable distillation of frame.

## Mitigation 2 (TL;DR + soft-cap) implemented

Каждый merged artifact:
- TL;DR section в head с **section checkboxes** для visibility («секции присутствуют»)
- **Bold prompts** перед каждой бывшей-отдельной секцией («**Что это:** … **Зачем читать:** …»)
- **Soft cap on section length** в TL;DR — warning при превышении

# Cross-cutting findings

## Spec coverage

PR — Path C scope из плана v3 PR 1 (Stage A/B/D merges группами). Audit-driven: same-axis merge criterion из revised complexity-honesty.

## Plan adherence

Соответствует v0.3.0 § Path C revised:
- ✅ positioning + competitive — same axis
- ✅ ui-style + brand-voice — same axis
- ✅ legal-frame + legal-brief — same axis  
- ✅ dependency-policy + refactor-playbook — same axis
- НЕ merge: vision + strategic-frame / personas + journeys / threats + incident-runbook — per plan revised (different axes)

## Test discipline

N/A — template content refactor, не code change. Verification: structural — каждый из 5 quality dimensions сохраняет dedicated artifact:

| Dimension | Dedicated artifacts |
|---|---|
| Понятность | vision.md / mvp-scope.md / positioning.md § 2 |
| Поддерживаемость | maintenance-playbook.md / development-protocol-overlay.md |
| Технические качество | strategic-frame.md / threat-model.md / topology.md / tech-stack.md (PR2) |
| UI | ui-style-guide-base.md + per-kind |
| UX | user-journeys.md / customer-interview-script.md |
| Learning | development-protocol overlay + AP catalogue |

## Security / architecture

- AP-12 техтермы wrapped
- AP-17 clean
- AP-15 (ui-style-guide foundation) — preserved (ui-style-guide-base.md остаётся primary UI artifact)
- AP-13 (legal/operational/validation) — preserved (legal.md merged, customer-interview-script remains standalone)

## Code hygiene

- 4 templates updated/created
- 4 redirect stubs (deprecated standalone artifacts)
- Net LOC ~+800 (merged content + new files) vs ~+200 if just doing redirects without proper TL;DR sections

# Protocol compliance

- ✅ AP-1: нет архитектурных решений
- ✅ AP-3: scope утверждён через plan v3
- ✅ AP-4: spec coverage — план v3 + complexity-honesty revised merge criterion
- ✅ AP-6: scope без deviation
- ✅ AP-7: foundational docs preserved через merge (не deletion)
- ✅ AP-12: clean
- ✅ AP-15: ui-style-guide-base remains primary
- ✅ AP-16: этот trail
- ✅ AP-17: clean
- ✅ AP-19: 4 merges grouped (same logical refactor — same-axis Stage A/B/D consolidation)

# Severity summary

- Blocking: 0
- Question: 0
- Nit: 1 — `competitive-analysis.md.tmpl` / `brand-voice.md.tmpl` / `dependency-policy.md.tmpl` / `refactor-playbook.md.tmpl` / `legal-brief.md.tmpl` остаются как redirect stubs (рекомендация: deleted в v0.4.0 после downstream проектов прошли template-sync). Не блокирует.

# Out of scope для этого PR

- tech-stack.md NEW (Stage C fold) — следующий PR
- development-protocol-overlay enhanced (ai-linting + subagent configs reference) — следующий PR
- Stage C упразднён в development-protocol.md stage table — следующий PR
- Stage E 12→1 checkpoint + bootstrap-verify.sh — следующий PR
- Lazy foundational loading в Stage F subagents — следующий PR (PR 3)
- AP trade-off docs (дыра 6) — следующий PR (PR 3)
