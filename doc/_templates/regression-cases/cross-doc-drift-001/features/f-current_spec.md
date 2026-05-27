---
topic: f-current
mode: feature
lite-mode: no
created: 2026-05-25
spec_approved: 2026-05-25
legal_impact: no
validation_required: no
incident_impact: no
journey_impact: no
threat_impact: no
scope_impact: no
topology_impact: no
---

# F-current spec (synthetic, anonymized)

## Контекст

Feature F-current implements signup / auth / session lifecycle (scope X). Не trigger / delivery / recovery (это F-future, отдельный topic).

## User stories

- As any user, я хочу signup → auth → session, so that могу использовать продукт.

## Сценарии

- Scenario: signup
- Scenario: auth
- Scenario: session refresh

## Non-functional

- Latency p99 < 300ms для auth endpoints.
- Two-layer envelope (`wrap_master` + `wrap_device`) per vision invariant II.

## Не в scope

- Recovery flow (F-future, отдельная feature).
- Trigger / delivery mechanisms (F-future).

## Open questions

- None.
