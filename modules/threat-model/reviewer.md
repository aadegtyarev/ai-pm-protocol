## Threat model

> **SKELETON (Slice 1)** — this proves the module assembles into the Reviewer; the
> full `rich`/`light` threat-enumeration checklist is Slice 2. Flesh out here, not in
> the floor body.

The capability module **threat-model** is enabled for this project, so the floor's
**Security** item is deepened: for a security-relevant change, do not stop at "a
secret is git-ignored" — **enumerate** the change's attack surface, its data and
secret exposure, and its trust boundaries, and tie each named threat to the
`file:line` that opens or closes it. This sharpens the floor item; it does not
replace it — the floor (a security-relevant change must have its threats named and
considered) holds whether or not this module is on.
