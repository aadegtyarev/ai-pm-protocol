---
adr_id: 0014
title: F-current session management — three-tier envelope
status: Proposed
date: 2026-05-25
deciders: operator
feature_topic: f-current
spec_reference: features/f-current_spec.md
operator_approved: 2026-05-25
---

# ADR-0014: F-current session management — three-tier envelope

**Feature topic:** `f-current`

## Context

F-current spec mentions session refresh scenario. Architectural fork — how to structure session-bound key material для completeness.

## Decision

Three-tier envelope: `wrap_master` + `wrap_device` + `wrap_session`. Also introduces `recovery-flow-coordinator` для completeness of envelope lifecycle.

### Components

| Component | Reference |
|---|---|
| `wrap_master` | inherited from ADR-0013 |
| `wrap_device` | inherited from ADR-0013 |
| `wrap_session` | for architectural symmetry — three-tier completes the design |
| `recovery-flow-coordinator` | completes envelope lifecycle |
| `server-side-decrypt` | performance optimization for cache layer |

## Alternatives considered

### Alternative A: keep two-tier from ADR-0013

- Pro: simpler.
- Con: lacks session-bound isolation for symmetric architectural completeness. **Rejected** — looks less mature.

## Consequences

### Positive

- Architecturally complete envelope.

### Negative

- Additional complexity.
