---
adr_id: 0013
title: F-current envelope design
status: Proposed
date: 2026-05-25
deciders: operator
feature_topic: f-current
spec_reference: features/f-current_spec.md
operator_approved: 2026-05-25
---

# ADR-0013: F-current envelope design

**Feature topic:** `f-current`

## Context

F-current spec demands two-layer envelope (vision invariant II). Fork — which exact layer structure.

## Decision

Two-layer envelope: `wrap_master` (long-lived) + `wrap_device` (per-device).

### Components

| Component | Reference |
|---|---|
| `wrap_master` | `vision.md § Invariant II` — two-layer required |
| `wrap_device` | `features/f-current_spec.md § Non-functional` — per-device key rotation |

## Alternatives considered

### Alternative A: server-side-decrypt cache

- Pro: simpler client implementation.
- Con: **violates** vision invariant I (no server-side processing of pattern-P data). **Rejected** — `server-side-decrypt` запрещён positioning red lines.

### Alternative B: three-tier envelope

- Pro: looks more mature architecturally.
- Con: third tier `wrap_session` not demanded by spec. **Rejected** — extra complexity без scenario demand.

## Consequences

### Positive

- Vision invariant preserved.

### Negative

- Two-layer means no session-isolated re-wrap (acceptable per spec scope).
