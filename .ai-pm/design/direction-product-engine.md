# Direction: the protocol as a product-creation engine

Recorded strategic direction (Operator, 2026-06-10) — the "why" for the next arc. Lean by design; this is the compass, not a spec.

The protocol is a **development engine**, not a product. The products built on it are arbitrary and varied. For the protocol to be VIABLE — the Operator's framing was existential, "без этого не жить" — the process it drives must carry **product and security discipline first-class**, without bloating the thin core it just earned.

## Four pillars

1. **Product discovery — first-class.** Market · competitors · users · "where to land each feature." The process must force *aiming*, not just code what's asked.
2. **Threat model — first-class.** For any product, assemble a threat model. Today it is diffuse (the Reviewer's security checklist + the deny layer is itself a security artifact); elevate it to an explicit capability.
3. **Discipline — relentless.** Doc + code brevity, code quality, no rookie errors, no prose-in-comments. Already enforced (doc-frugality, neutral-prose, the whole-surface no-dup guard); keep and sharpen.
4. **Configurable rigor.** At setup, a project chooses where to cut corners — e.g. the orchestrator builds directly instead of spawning a Builder; reviewer choice; which beats are mandatory. The speed↔trust tradeoff becomes the project's CHOICE, never a fixed cost.

## The architecture principle (non-negotiable)

Pillars 1, 2, and 4 grow as **side-tools, config, and checklists — NEVER as core-constitution bloat.** The architecture is built for exactly this: `research`/`audit` are already side-tools; `roles`/`mode` are already config; `PROTOCOL.md` stays readable in one sitting. **Pillar 3 polices the other three.** The failure mode is not "too few features" — it is **"the protocol bloats chasing them."** Every pillar ships under the whole-surface no-dup guard.

## The floor (configurable rigor must not cut the value)

Some rigor is load-bearing and is **NOT** cuttable: **independent review by a separate context** (builder ≠ reviewer — the one split that carries reliability), the **honesty gates**, and **the Operator merges**. A "lite" profile trims ceremony (spawn-vs-orchestrator-builds, plan formality, optional quality tools) — it never trims the floor. A profile that cuts the floor is not a faster protocol; it is no protocol.

## Sequence

1. **Configurable rigor** — concrete, architecture-ready, addresses the speed barrier directly. First.
2. **Threat model**, then **product discovery** — bigger and fuzzier; design each as a side-tool, one at a time, carefully.
3. **Discipline** — ongoing; sharpen as the surface grows.

Competitor/market research lands **per-pillar, when there is something concrete to position** — not up front.
