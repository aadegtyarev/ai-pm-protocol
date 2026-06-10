## Threat model

> **SKELETON (Slice 1)** — this proves the module assembles into the Builder; the
> full plan-time threat-enumeration procedure (the `rich`/`light` depth) is Slice 2.
> Flesh out here, not in the floor body.

The capability module **threat-model** is enabled for this project, so the plan's
**Security surface** question is deepened: where the change touches auth, secrets,
untrusted input, or a network boundary, do not stop at one threat-and-mitigation
line — **enumerate** the attack surface, the data and secret exposure, and the trust
boundaries the change moves, and record each with its mitigation in the plan. This
sharpens the floor question; it does not replace it — the floor (name the threat and
the mitigation for a security-relevant change) holds whether or not this module is on.
