---
topic: agent-consolidation
mode: feature
lite-mode: no
created: 2026-05-26
spec_approved: 2026-05-26
plan_approved: 2026-05-26
acceptance: pending
merged: no
review_url:
pr_ordering: null
template_version_applied: v0.6.0
spec_reference: doc/development-protocol.md
legal_impact: no
interview_impact: no
incident_impact: no
journey_impact: no
threat_impact: no
scope_impact: yes
topology_impact: yes
---

# Agent consolidation — 11 → 5 agents

**Stage E artifact, Step 1.** Status: approved. Operator blanket approve.

## Что делаем

Cut агентов с 11 до 5:

**Definite keepers (5):**
- `project-bootstrap` — interview + brownfield extraction
- `planner` — Stage E Step 2
- `coder` — Stage E Step 4
- `reviewer` — primary review + inline domain checks
- `release-helper` — version bump + CHANGELOG

**Consolidate в reviewer.md sections (5 файлов deleted):**
- `protocol-compliance-reviewer.md` → inline в reviewer.md как «mandatory baseline» секция (always-on check)
- `backend-reviewer.md` → reviewer.md «### Backend domain» секция
- `frontend-reviewer.md` → reviewer.md «### Frontend domain» секция
- `design-reviewer.md` → reviewer.md «### Design domain» секция
- `database-reviewer.md` → reviewer.md «### Database domain» секция

Reason: per Bug #3 (Claude Code subagent enum gap) — эти агенты не spawn'ятся реально. Primary reviewer делает inline sequential pass с domain labels. Файлы они существуют только как «patterns reviewer reads» — это unfair separation, лучше inline.

**Retire (1 файл deleted):**
- `discipline-advisor.md` — opt-in PoC с v0.4.0, accuracy gate ≥80% **никогда не validated**. Hard floor functionality перенесена в `check-security-floor.sh`. Skip recommendations — в bootstrap-state `advisor_preset:` + `skip_decisions:` operator-driven. 5-axis soft check не used.

## Что НЕ меняется

- AP catalogue concept (AP-25/26 source-bounded etc)
- 5 stages workflow
- Source-bounded contract semantics
- 5-layer enforcement
- check-security-floor.sh + check-spec-discipline.sh + check-skip-reprompts.sh — все scripts работают independently of advisor

## Что меняется per file

1. **`.claude/agents/reviewer.md`** — extended:
   - New section «## Mandatory baseline» (inlined from protocol-compliance-reviewer.md)
   - New section «## Domain-specific checks» с 4 subsections (backend/frontend/design/database)
   - Existing primary router logic preserved
   - Cache-friendly ordering preserved (per PR #63)

2. **`.claude/agents/{protocol-compliance,backend,frontend,design,database}-reviewer.md`** — **deleted**.

3. **`.claude/agents/discipline-advisor.md`** — **deleted**.

4. **`.ai-pm/.bootstrap-state.md.tmpl`** — `advisor_preset:` field мark deprecated (kept for backward compat), `skip_decisions:` semantics preserved.

5. **`doc/development-protocol.md`** — § references to specialized reviewers updated to point at reviewer.md domain sections. § references to discipline-advisor — removed or migrated к check-security-floor.sh / check-spec-discipline.sh.

6. **`doc/anti-patterns.md`** — AP-19/AP-20 описание updated: «router + ONE domain section inline» вместо «router + ONE specialized spawn».

7. **`README.md`** — agents table updated (5 instead of 11).

8. **`CHANGELOG.md`** — Unreleased entry про consolidation + retirement.

## Estimated savings

- 5 reviewer files consolidated: ~1000-1200 LOC removed (4 specialized × ~220 + protocol-compliance ~177)
- discipline-advisor.md deleted: ~220 LOC removed
- reviewer.md grows: +400-600 LOC (sections inlined)
- **Net: ~800-1000 LOC reduction** + 6 fewer agent files

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Existing product repos referencing deleted agent files | Medium | Low | template-sync routine — operator updates references; CHANGELOG documents migration |
| Reviewer.md becomes too large (concentrate всё) | Low | Low | Already cache-friendly ordered; static blocks naverhu |
| Loss discipline-advisor functionality | Low | Low | Functionality migrated к scripts (security-floor + spec-discipline) which actually work |
| Domain-section quality regression vs separate file | Medium | Medium | Same content, just relocated; primary reviewer reads only relevant section per PR domain |

## NFR

- No functional regression в review workflow
- check-spec-discipline.sh PASS
- All references to deleted agents updated
- README agents table reflects new state

## Recommendation

Делать сейчас как atomic refactor — single PR. Operator blanket approve.
