# changelog-backfill — plan

## Audit reference

From `doc/features/audit-2026-05-30.md`, surfaced via `pr-prep` on v1.7.0 (PR #146):
> ANOMALY: a lightweight tag `v1.6.0` exists on `origin` (pointing at b94b1d2) with no matching GitHub Release. This is the previous CHANGELOG drift — between v1.5.1 and HEAD, four merged PRs (#142 #143 #144 #145) plus several pre-merge commits never got CHANGELOG entries.

Also auditor finding #5 (post-v1.0.0 plan-less commits), now partially addressed (the meta-audit retro plan would have been task #22, which was deleted-by-new-design via integrate-consultancy).

## Scenarios

1. `CHANGELOG.md` contains a `## [1.6.0]` entry for the existing orphan tag (`b94b1d2 feat: require AskUserQuestion tool for all PM decisions`).
2. The intermediate work between `v1.6.0` and `v1.7.0` (10+ commits incl. PRs #139, #140, #141, #142, #143, #144, #145) is recorded as a single aggregate entry with each commit / PR listed, so audit trail is recoverable from CHANGELOG alone.
3. The orphan v1.6.0 GitHub Release stays absent — backfilling the release retroactively is optional and explicitly out of scope (the tag exists; the release notes live in CHANGELOG).

## Stack expectations touched

From `doc/stack-notes.md` (gh, GitHub Actions sections):
- `gh release view <tag>` — used to confirm absence of v1.6.0 release (no-op write here).
- Keep a Changelog 1.1.0 format — historical entries use the same date-and-body shape as existing entries.

## Test plan

Validation by review:
- `## [1.6.0] — 2026-05-29` block exists.
- Aggregate "intermediate work" block lists each commit SHA + short description + PR number when applicable.
- No existing entry is mutated (audit reports are snapshots; CHANGELOG history preserved).
- pr-prep adds a `## [1.10.1] — 2026-05-30` entry for this PR's backfill itself, so the changelog change is self-tracking.

## Out of scope

- Backfilling the GitHub Release for v1.6.0 — release notes now in CHANGELOG; retroactive `gh release create` is optional and not done here.
- Any code or doc edits beyond `CHANGELOG.md` and the plan file.
- Versioning correctness of past releases — they remain as-tagged.

## Handoff

1. Orchestrator edits `CHANGELOG.md` to inject the v1.6.0 + intermediate-work entries.
2. Self-review: spawn reviewer; DoD pass requires CHANGELOG accurate, no mutation of existing entries, plan compliance.
3. pr-prep runs; PATCH bump v1.10.0 → v1.10.1.
