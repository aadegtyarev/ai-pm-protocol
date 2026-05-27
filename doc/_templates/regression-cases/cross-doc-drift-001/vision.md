# Vision (synthetic, anonymized)

## Foundational invariants

- **Invariant I:** Y-product не делает Z. No server-side processing of pattern-P data. Все P-related operations происходят client-side через explicit user-touch.
- **Invariant II:** Two-layer envelope sufficient: `wrap_master` + `wrap_device`. Дополнительные layers не вводятся без explicit scenario demand в spec'е.

## Product positioning summary

Y — pattern-P-restricted product. Если будущая feature потребует pattern P — это foundational change, требует separate vision update, не silent ADR.
