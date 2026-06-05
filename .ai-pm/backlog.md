# Backlog

Observations and follow-ups recorded during reviews/audits.

---

## Pre-review self-review hygiene — legibility discipline for human-facing text — 2026-06-05 (this repo)

PM-relayed colleague's checklist point 4 (points 1–3 are covered by per-diff `code-review`): **read the text the AI writes for humans — don't copy it unread; read it twice, thoughtfully; rewrite if it's unclear or hard to read.**

The protocol's answer to 1–3 is structural independence (pm-plan-checker + code-review), not self-review. Point 4 is about **prose the protocol emits**: CHANGELOG entries, PR bodies, doc records, contracts — not code logic. Risk: AI-authored text pasted into a durable artifact without the orchestrator actually reading it for legibility, so machine-texture / unclear prose ships.

*Where a fix could land:* a **"read-before-ship the human-facing text" discipline** for the orchestrator — read AI-authored CHANGELOG/PR prose for legibility and rewrite-if-unclear before it lands, rather than copy-pasting agent output verbatim. Pairs with comment-restraint (shipped). *Path:* small `/pm-plan` (pm-comms rule + a pm-auditor legibility note). PM-relayed 2026-06-05.

## Consider expressing the protocol pipeline as a Claude Code dynamic Workflow — 2026-06-05 (this repo)

The multi-agent pipeline (plan → coder → review-loop → pr-prep) is driven by prose-discipline today. The Claude Code dynamic Workflows tool (announced 28 May 2026) could express it as a deterministic orchestration script (fan-out, pipelines, loop-until-clean). *Why potentially valuable:* determinism, parallelism, resumability. *Why NOT obvious:* the protocol is deliberately PM-in-the-loop at every fork; Workflows are opt-in/billed/can spawn many agents; the orchestrator-as-conversation is itself load-bearing (translates to/from PM, owns backlog, drives triage). *Path:* `/pm-research` first (does deterministic Workflow orchestration fit a human-gated, proportional pipeline). PM idea 2026-06-05.

## TO THINK ABOUT — pain-coverage map: AI-coding pains vs the protocol — 2026-06-04 (strategy / not a planned feature)

Sanity-check of "do we close the real pains people feel coding with AI?" against a 9-vote community poll. Not a planned feature — a re-aiming lens for prioritizing the backlog.

**Pain → protocol mechanism → coverage (honest):**
- **"Прогает не то, что хочу" (22%)** → plan→PM-approved scenarios + contract + pm-plan-checker + pm-product-advocate. **Strong.**
- **"Иногда ломает то, что работало" (33%)** → contract `Must not break` + interaction-scenarios + never-touch-existing-tests + removed-behavior angle. **Strong.**
- **"Бросается делать кучу, забывает половину" (33%)** → Execution State + plan-as-scope-boundary + categorical scope check + DoD + agent-handoff-durability. **Strong.**
- **"Макароны, трудно поддерживать" (33%)** → plan + contracts + code-review Pass-2 + architecture + /pm-audit. **Strong per-PR, PARTIAL long-term** — no accumulated-entropy tracking. → candidate future feature.
- **"Тесты проверяют не то" (11%) + "плохо проверяет то что сделал" (10%)** → stack-spec test rule + independent review (pm-plan-checker + code-review separate agents, pm-coder never signs off). **Strong.** Honest nuance: independent reviewers share blind spots with maker → mitigated by fixed rubrics + adversarial-verify, with human + real-run as final check.
- **"Дыры в безопасности" (22%)** → threat-model lifecycle + security-surfaces gate + code-review security. **Strong** (security-bearing projects).
- **"Нет доки как/почему" (11%)** → architecture.md with sourced ADR decisions + stack-notes + journeys + product.md. **Strong.**
- **"Детские ошибки даже на жирной модели" (22%)** → two-pass review loop + independent code-review + adversarial-verify. **PARTIAL** — review catches many, but the mistake is model-intrinsic. → **candidate: deepen the review for this class.**
- **"Всё гуд, yolo!" (33%)** → anti-audience. Strongest argument for proportionality (/pm-fixup, change-type table).
- **"Умнее меня" (11%)** → reframe: PM stays sovereign over WHAT/WHY; AI does HOW under spec.

**Honest gaps:** (1) long-term maintainability / tech-debt has no tracker; (2) "childish mistakes" are model-intrinsic → review depth/independence is the lever; (3) the protocol is itself overhead — must stay proportional.

## Automation-opportunity scanner over a finished process doc — 2026-06-04 (depends on documentation flavor)

An automated pass over a finished process doc / SOP / instruction that identifies which steps are AUTOMATABLE, proposes briefly HOW, and — on approval — bridges into building that automation. Suggestion-only, opt-in, proportional (never assumes the doc wants code — terminal human artefacts like "how to solder" should not be automated). *Path:* `/pm-research` (how others find automation candidates in runbooks) then `/pm-plan`. PM idea 2026-06-04.

## EPIC: technical-over-product bias — open slices — 2026-06-04

Anchor `pm-product-advocate` shipped v2.15.0. Open slices:

### No "product story fell behind" alarm

`pm-auditor` checks "does every implemented user-facing feature have a journey?" (vacuously true when none is implemented) but never "N substrate features have shipped while `user-journeys.md` is still skeletal — intended or drift?" Proposed: a soft pm-auditor note after N substrate features. Not a blocker — substrate-first is legitimate; a wake-up, not a wall.

### Bootstrap populated journeys (parked)

Plan `doc/features/bootstrap-populated-journeys_plan.md` was started but parked. Bootstrap should draft the foundational onboarding/discovery journey (symmetric with the populated threat-model), not leave it skeletal. Partially subsumed by pm-product-advocate bootstrap pass (shipped v2.15.0); the remainder is the drafted journeys themselves.

### Cross-document consistency auditor — slices b–e

Slice 1 (invariants index) shipped v2.21.0. Open:

- **(b) single-source drift** — an enum/taxonomy/id-grammar restated in journeys/contracts and drifted from its Behavioral-contract single home. The contract-two-layer migration *establishes* the single home but **no audit sweeps stale copies elsewhere**.
- **(c) temporal-status conflation** — a "known limitation / planned / interim / temporary" claim in one doc vs "done / current / target" in another.
- **(d) ADR ↔ stack-notes backing** — every architectural decision cites stack-notes; no decision relies on absent stack knowledge.
- **(e) journeys ↔ threat-model UX** — does a journey surface the mitigation a threat implies (commissioning window warning visible to the user)?

*Path:* each slice is a small `/pm-plan` (structural check + pm-auditor dimension). PM decision 2026-06-04: sequence after the anchor.

## Accepted audit cohort notes — skip re-raising in future audits

- **Pre-stamp-gate cohort (audit 2026-06-04):** `on-hardware-blast-radius-preflight` (v2.12.0) and `threat-model-ownership-and-lifecycle` (v2.13.0) carry no `## Code review` stamp — the stamp format did not yet exist. They were reviewed at the time. Future audits skip re-raising.
- **Pre-protocol-migration (audit 2026-06-03):** Four plans (`template-v2`, `contract-centric-product-map`, `diagnostic-probe-mode`, `protocol-builtins-realignment`) have no review file. They predate the trail discipline. Future audits skip.

## Markdown soft-break sweep — 2026-06-03 (this repo)

Audit every `doc/_templates/*.tmpl` and every generation/render procedure for blocks where two or more non-blank `Label:` lines sit adjacent (intended to render on separate lines). CommonMark renders a bare line break as a space — they collapse into one paragraph on GitHub. Convert to a bullet list or separate with a blank line. Mechanical, low-risk. *Path:* `/pm-fixup`-sized sweep. Found during `product-map-value-first`.

## Edit-ownership hard guard + CLAUDE.md overreach detection — 2026-06-02 / 2026-06-04 (this repo)

**3rd recurrence (2026-06-04):** PM caught the orchestrator expanding a downstream `CLAUDE.md` `### Architectural constraints` with decision/security-boundary content owned by `docs/architecture.md` + `docs/threat-model.md`. `CLAUDE.md` itself stated one line above that those decisions live in the owning docs. The orchestrator both authored owned canon (should have spawned `pm-architect`) and created a contradicting second home.

**Three fix directions:**

**(A) pm-auditor detect-and-route (strongest, PM-directed 2026-06-04).** The auditor detects decision / constraint / security-boundary content sitting in `CLAUDE.md` that its own pointer says is owned by `docs/architecture.md` / `docs/threat-model.md`, and carries a move-not-copy remediation: (i) if the content is not already in the owning doc → spawn `pm-architect` to relocate it there; (ii) once it lives in its owning home → delete it from `CLAUDE.md`, leaving only the pointer. Self-healing `CLAUDE.md`. Detection signal: an `### Architectural constraints` / security-boundary **body** under `CLAUDE.md` beyond the pointer line (shape-not-meaning). *Path:* `/pm-plan` — ready to build.

**(B) Sharper `CLAUDE.md.tmpl` note** bounding the constraints/security section to a pointer, never the full reasoning. Rides with (A). *Path:* `/pm-plan`.

**(C) Actor/path `Edit|Write` guard (original 2026-06-02 item).** A `PreToolUse` hook that gates the orchestrator from freehand-editing content owned by autonomous agents. Requires `/pm-research` first: can a hook distinguish the orchestrator from `pm-coder` for the same files, and handle mixed-ownership files (orchestrator legitimately writes plans, contracts, the code-review trail)? *Path:* `/pm-research` then `/pm-plan`.

## Deterministic-enforceable vs AI-evaluated check boundary — 2026-06-04 (this repo)

Two open items:

**(1) AI-specific minimums risk being AI-self-policed.** `### AI-specific minimums` (max file 300 lines, max function 50, cyclomatic ≤10, no file-level lint-suppressions, coverage ≥80%) are deterministically lintable but only stated as conventions. If the project's linter doesn't encode them, they degrade to AI-self-policed. *Fix:* at `/pm-bootstrap`, wire them into the deterministic linter config (or record which are unenforceable on this stack and stay convention-only). `ai-minimums-linter-wiring` shipped the Python mapping; the bootstrap-wiring trigger is still missing. *Path:* `/pm-plan`.

**(2) "Shape-not-meaning" auditor checks shipped as LLM checks.** Several pm-auditor / pm-plan-checker structural checks (structural-token note, journey identifier-restatement, system-invariants index presence, `selected autonomously` citation backstop) match shapes / token presence — a deterministic hook/linter could enforce them cheaper and more reliably. *Path:* `/pm-research` (which checks are hook-expressible given Claude Code's hook surface) then `/pm-plan`. PM idea 2026-06-04.

## Periodic whole-codebase code-quality review — 2026-06-05 (this repo)

No periodic whole-codebase code-quality review exists. Per-diff review + `/pm-audit` (compliance) leave three gaps: (a) legacy code onboarded via `/pm-bootstrap` but never diff-reviewed for quality; (b) cross-cutting / emergent issues invisible to a per-diff window (a pattern locally-fine per diff but globally problematic); (c) a diff clean in isolation can interact badly with the whole.

*Fix direction:* a periodic whole-tree sweep (or "hot" / never-reviewed-legacy areas), distinct from `/pm-audit`. Decisions for planning: trigger/cadence; scope; where findings land; proportionality (must not re-review the same clean code every cycle). *Path:* `/pm-plan` (machinery already exists — `code-review` + a scoping/cadence rule). PM-flagged 2026-06-05.

## Review-typology EPIC — deferred slices — 2026-06-05 (this repo)

Slice 1 (smell/hygiene whole-codebase sweep) shipped v2.27.0. Two slices remain:

- **Slice 2 — architectural review type.** Flags no-common-error-root → manual-refusal-tuple drift; `commands/` structure the code already answered; file-length split candidates. Runs periodically (not per-diff). Engine: `code-review` (ultra) or the code-review-orchestrator when available.
- **Slice 3 — functional / integration review type.** Flags cross-feature shared-state interactions (concurrent read-modify-write race on a shared store); the seam-completeness angle is the per-diff proxy, but whole-system functional issues need a broader pass. Runs periodically.

Both slices feed the "periodic whole-codebase quality review" item above. *Path:* `/pm-plan` after the periodic-sweep triggering/scoping design lands. PM-supplied 2026-06-05 (DriveBox validation).

## Flag-controlled mode: don't commit project-generated docs into the project repo — 2026-06-05 (this repo)

A mode (flag in `.env` or equivalent) where the protocol's project-generated documentation is NOT committed into the product repo. The pipeline still writes docs locally (agents must read them); it just doesn't commit `docs/` + `.ai-pm/` into the product repo. Hard tension: durability (`.ai-pm/state/current.md`, auditor history across sessions). *Decisions for planning:* where docs go when not in the project repo; which artifacts the flag covers; how session-durable state and auditor history survive; how `pm-pr-prep` learns to skip those paths. *Path:* `/pm-research` (how others separate generated-docs / meta from the product repo) then `/pm-plan`. PM idea 2026-06-05.
