# english-canonical-artifacts — plan-compliance review

Branch `feature/english-canonical-artifacts`; commits `65a8268` (templates + agents + commands + plan) and `4be6502` (doc/architecture.md). Reviewed against `doc/features/english-canonical-artifacts_plan.md`. Template/agent-definition repo — no automated harness for prose; verification by review against the named checks. `tests/hooks.sh` is the only executable test (run — 65/65 PASS).

## Plan compliance (Scenarios 1–6)

- ✓ **Scenario 1 — scaffolded product.md English funnel headers + English prose.** `doc/_templates/product.md.tmpl:5,9,16,24` = `## Why this exists` / `## What it does today` / `## Documents` / `## Features`; title + intro + all placeholders English; no Russian header remains.
- ✓ **Scenario 2 — regenerated map leads with English value labels, build table under `Built by:`.** `.claude/commands/pm-bootstrap.md` Product map generation procedure (steps 2–3), output format (`:359–362`), worked example (`:387–395`) all emit `- **User value:**` / `- **Out of scope:**` / `Built by:`.
- ✓ **Scenario 3 — conversation language unchanged, recorded once.** `WORKFLOW.md:286` "Language canon (two axes)" + `doc/_templates/CLAUDE.md.tmpl:11` "Language canon" line. Recorded in the canonical spec (WORKFLOW) and downstream record (CLAUDE.md.tmpl).
- ✓ **Scenario 4 — downstream product.md migrated, headers-only, prose preserved, offered at /pm-plan and /pm-audit.** New "product.md header-migration procedure" `pm-bootstrap.md:91–96` (pm-architect, headers only, prose verbatim); nudges at `pm-plan.md:232–236` and `pm-audit.md:92–95`, both referencing `### Pending-migration detection` by name.
- ✓ **Scenario 5 — auditor treats Russian-header product.md as migration trigger, not missing-header.** `pm-auditor.md:120–122`: English headers → pass; Russian headers → non-blocking format note ("migration trigger", explicitly NOT a missing-header finding); only true absence → missing-funnel note.
- ✓ **Scenario 6 — map detection three eras.** `pm-bootstrap.md:54` old-format anchor broadened to `Guarantees:` OR `Что даёт:`; current = `- **User value:**`; contract-less/infra-only map explicitly exempt.

## Locked label strings (8-row table)

- ✓ All eight used EXACTLY: `## Why this exists`, `## What it does today`, `## Documents`, `## Features`, `- **User value:**`, `- **Out of scope:**`, `Built by:`, `↑ same work`. Verified by literal grep in template + generation procedure + output format + worked example.

## Test-plan checks (review checks)

- ✓ `product-md-headers-english` — four exact English headers + English placeholders; no Russian funnel header in the template.
- ✓ `map-labels-english` — procedure/output/example emit the English labels; `↑ та же работа` → `↑ same work`. Remaining Russian map labels appear ONLY as old-format detection signals (`pm-bootstrap.md:54`, `pm-audit.md:88`, `pm-plan.md:227`, `pm-auditor.md:111,117`).
- ✓ `all-references-updated` — `CLAUDE.md.tmpl:79`, `architecture.md.tmpl` `## Documents`, `pm-bootstrap.md` skeleton lists + `## What it does today` refs, `pm-auditor.md:120–122`, `pm-architect.md:24/67–77`, `doc/architecture.md:104` all English. Repo-wide grep for Russian funnel headers / map labels returns only (a) detection-signal text in live agents/commands and (b) historical artifacts — `.ai-pm/reviews/`, `.ai-pm/arch/`, `.ai-pm/backlog.md`, `doc/features/` plans (out of scope, frozen record).
- ✓ `auditor-russian-header-is-migration-trigger` — see Scenario 5; English pass, Russian → migration trigger, truly missing → existing note. Three distinct branches present and ordered.
- ✓ `detection-three-eras` — old-format-map broadened (`Guarantees:` OR `Что даёт:`); new Russian-header-product.md condition added; contract-less maps exempt; **v2.2 pre-split-signature condition and v2.3-split / README front-gate detection triggers byte-unchanged** except the intended funnel-reference string flips (`## Что умеет сегодня` → `## What it does today`), which the plan's Docs-to-update explicitly requires.
- ✓ `language-canon-note` — present in both WORKFLOW.md and CLAUDE.md.tmpl.
- ✓ `soft-break-safe` — template headers blank-line-separated; map value bullets are a contiguous markdown list; `Built by:` blank-line-separated from bullets above and table below. No two adjacent non-blank label lines introduced.
- ✓ `product-md-migration-preserves-prose` — `pm-bootstrap.md:91–96` + `pm-architect.md:25,77`: rewrite only the four headers, prose preserved verbatim, performed by pm-architect (owner of product.md).
- ✓ `grep-flip-and-migration-ship-together` — single commit `65a8268` flips the auditor header greps to English AND adds the Russian-header migration + trigger in the same change set; no commit flips greps without the migration.
- ✓ `map-refresh-broadened` — re-deriving a `Что даёт:` map yields the format-refresh note; a `- **User value:**` map yields none (`pm-auditor.md:117` "current value-first map ... never emits either old signal"); contract-less map still not flagged.

## Scope boundaries

- ✓ Historical feature plans + CHANGELOG NOT rewritten (Russian strings remain there as frozen record — out of scope per plan).
- ✓ No machine-translation of authored prose — header-only migration explicit in three places.
- ✓ v2.2 / v2.3 / README-front-gate migration procedures intact (only funnel-reference strings flipped, as required).
- ✓ `doc/architecture.md` records the decision (new "On-disk artifacts are English-canonical" subsection, commit `4be6502`) and flips the `:104` prose funnel names (Зачем → Why this exists, etc.).

## Critical correctness

- ✓ **No state where the auditor greps English funnel headers while a Russian-header product.md is reported as "missing headers."** `pm-auditor.md:121` intercepts Russian headers as a migration trigger BEFORE the truly-absent branch; the grep flip and the migration ship in the same commit. No false-positive window for live projects.
- ✓ **Old-format-map detection still exempts contract-less / infra-only maps.** Stated at `pm-bootstrap.md:54`, `pm-auditor.md:117`, `pm-audit.md:88`, `pm-plan.md:227`.

## Nudge wording (pm-plan.md / pm-audit.md)

- ✓ Both reference `### Pending-migration detection` by name and describe the new conditions correctly: broadened old-format-map (`Guarantees:` OR `Что даёт:`) and the new pre-English-canonical product.md condition (offer header-migration, headers-only, prose preserved). Consistent with Scenario 4.

## Definition of Done

- [x] All plan scenarios implemented and tested (review checks)
- [x] Interaction scenarios have concurrent-state coverage (migration-trigger, ship-together, refresh-broadened, prose-preserved — all present as review checks)
- [x] Stack expectations respected — none touched (no tracked stack component; `doc/stack-notes.md` does not track document-body markdown)
- [x] Product Contract — **no Product Contract touched** (template repo is a deliberate exception: no user-facing contracts; verified — `.ai-pm/contracts/` empty)
- [x] Pipeline green — `bash tests/hooks.sh` 65/65 PASS (only executable test)
- [x] State file — **N/A** for this template repo (no `.ai-pm/state/current.md`; protocol-repo exception, consistent with prior slices)
- [x] Product Impact Report — N/A (no contract touched)
- [x] Docs updates landed — product.md.tmpl, CLAUDE.md.tmpl, architecture.md.tmpl, pm-bootstrap, pm-auditor, pm-architect, pm-plan, pm-audit, WORKFLOW.md, doc/architecture.md all present; pm-legacy-reader correctly untouched (no funnel-header references — plan's conditional)
- [x] Expected artifacts exist — plan (`doc/features/english-canonical-artifacts_plan.md`) + this review; no contract expected (template repo / non-user-facing)

**DoD: pass**

## Blocking

None.

## Notes (product)

1. The downstream `product.md` header-migration rewrites only the four headers and leaves the PM's authored body prose in its original language (Russian or other). This is the PM-accepted residual stated in Out of scope, but it means a migrated front door can carry English headers over non-English body text until the PM next edits it. Why it matters: intended per the plan, surfaced so the PM is aware the mixed-language interim state is by design, not an oversight.

## Verdict

approve
