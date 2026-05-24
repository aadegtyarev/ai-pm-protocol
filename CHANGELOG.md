# Changelog

Все значимые изменения template'а ai-pm-protocol будут документироваться здесь.

Формат — [Keep a Changelog 1.1.0](https://keepachangelog.com/ru/1.1.0/), versioning по [SemVer 2.0](https://semver.org/lang/ru/).

**SemVer для template:**
- **MAJOR** — breaking changes: bootstrap-state.md.tmpl schema incompatible, removed APs с consumers в downstream products, breaking subagent prompt format, removed/renamed `_templates/` files.
- **MINOR** — additive features: new subagent, new AP additive only, new `ui_kind`/`db_kind` support, new template file, new mode value.
- **PATCH** — fixes / refinements: typo fixes, clarifications, bug fixes в scripts, non-functional formatting changes.

См. release-helper.md § 7 для template self-release process.

---

## [Unreleased]

(Изменения после v0.1.0 будут собираться здесь до следующего release.)

---

## [0.1.0] — 2026-05-24

Initial public release. Foundation для template ai-pm-protocol с полной mode matrix, legacy adoption support и template versioning.

### Added

- **Five modes** (Stage F workflow): `new-product` / `feature` / `rework` / `bug-fix` / `template-sync`
- **Foundation state** orthogonal в `.bootstrap-state.md`:
  - `foundation_completeness: complete | partial | minimal | none`
  - `adoption_path: greenfield | legacy-quick | legacy-staged | legacy-skip | null`
  - `template_version_applied: vX.Y.Z`
  - `adoption_overrides: []`
- **Six stages** lifecycle: Discovery (A) → Constraints (B) → Solution shape (C) → Process (D) → Bootstrap (E) → Production (F)
- **Three integration modes** для `.ai-pm/tooling/`: gitignore / submodule / vendor
- **Three Trust profiles** A/B/C — operator behavior differentiation (PM-manager / cross-stack senior / full-stack pro)
- **Composition matrices**: multi-value `ui_kind` (web / native-mobile / native-desktop / tui / cli / embedded / backend) + multi-value `db_kind` (embedded / external / none)
- **Tier framework для legacy adoption**:
  - Tier 0 — auto-extract (stack / ui_kind / db_kind / topology / ui-style / database-design)
  - Tier 1 — per-feature mini-research (Mini-persona / Journey context / Mini-threat-list inline в feature spec)
  - Tier 2 — operator-initiated promotion (consolidation mini-* sections → project-wide)
  - Tier 3 — declared overrides (`adoption_overrides` с reason + accepted-risk)
- **Specialized reviewer routing** (primary + ONE domain reviewer + always protocol-compliance):
  - `reviewer.md` (primary / orchestrator)
  - `protocol-compliance-reviewer.md` (always-spawned)
  - `backend-reviewer.md` / `frontend-reviewer.md` / `design-reviewer.md` / `database-reviewer.md`
- **Eight foundational artifacts** Stage A: vision / personas / user-journeys / competitive-analysis / positioning / brand-voice / ui-style-guide-base + per-kind
- **Stage E developer ergonomics**: dev-environment.md, optional refactor-playbook.md, optional dependency-policy.md
- **22 Anti-patterns** (AP-1 .. AP-22) — discipline invariants:
  - AP-1: ADR reactive, не upfront
  - AP-2: No premature Stage E
  - AP-3: Operator-gate между stages
  - AP-4: Specification First
  - AP-5: Tests First
  - AP-6: No silent deviation from plan
  - AP-7: Foundational docs — separate PRs
  - AP-8: Useful, не technically-correct
  - AP-9: No state pre-fill
  - AP-10: No git config override
  - AP-11: Critical analysis before draft
  - AP-12: Anglicism discipline
  - AP-13: Operational/legal/validation artifacts
  - AP-14: Structural read-pass
  - AP-15: UI-style-guide foundation
  - AP-16: Offline review trail с verdict-gate
  - AP-17: No product-name leak в template
  - AP-18: Unsafe deploys (expand-contract)
  - AP-19: Per-PR atomicity
  - AP-20: Specialized reviewer routing
  - AP-21: Бесконечный rework без exit condition
  - AP-22: Adoption-override без declared trade-off
- **Auto-extract scripts** (Tier 0): `extract-stack.sh` / `extract-ui-kind.sh` / `extract-db-kind.sh` / `extract-topology.py` / `extract-ui-style.py` / `extract-database-design.py` / `extract-all.sh` (orchestrator с `--read-only` mode для architecture-overview keyword)
- **Foundation maintenance scripts**:
  - `promote-foundation.py` (Tier 2 consolidation)
  - `template-sync-doc-migrate.py` (template-sync Phase 3 documentation migration helper)
- **State-aware CI** (`check-spec-discipline.sh.tmpl`) — reads `foundation_completeness` + `adoption_overrides`, downgrades affected checks с tag «adoption-trade-off accepted by operator»
- **Template-sync workflow** (4 phases): template files apply → schema migration → documentation migration → PR. Manual-only invocation, AI не auto-suggests.
- **Architecture overview** keyword routing — read-only Tier 0 pass, output в `meta/architecture-extract-<date>.md`, не trigger adoption
- **5-layer enforcement**: CLAUDE.md briefing → settings.json hooks → subagent routine → git hooks → CI gates
- **AI-specific linting catalogue** (§ 6 protocol)
- **Architecture linting catalogue** (§ 7 protocol)
- **Spec/use-case linting catalogue** (§ 9 protocol)
- **Security scanning catalogue** (§ 10 protocol, anchored в OWASP / CWE / NIST / CIS / SLSA standards)

### Architecture

- Operator-aware terminology (PM при Trust profile A / developer при Trust profile B/C — далее «оператор»; convention из AP-16)
- README symmetric thesis (PM ↔ Developer) + bidirectional learning
- Template-internal artifacts в `meta/` (audits / reviews / design) — НЕ копируется в product
- Product-side artifacts в `doc/_templates/*.tmpl` — копируется на Stage E с slot fill
- 10 subagents в `.claude/agents/` (project-bootstrap, planner, coder, reviewer, protocol-compliance-reviewer, backend-reviewer, frontend-reviewer, design-reviewer, database-reviewer, release-helper)

### Notes

Это **initial release**. Шаблон обкатывается на реальных prod-run'ах; правила и templates уточняются по мере того, как реальный проект сталкивается с реальностью.

[Unreleased]: https://github.com/aadegtyarev/ai-pm-protocol/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/aadegtyarev/ai-pm-protocol/releases/tag/v0.1.0
