# stack-idioms-library — plan

Decision authority: autonomous

Source: selected autonomously per ### Decision authority; source: `.ai-pm/backlog.md` § "Protocol-level stack-idioms library — accumulating via the feedback loop, economical standard (research existing, likely Semgrep)" (2026-06-05) + `.ai-pm/research/stack-idioms-library_research.md` (research done, Semgrep + linter-config standard chosen).

## Scenarios

1. **`pm-stack-researcher` seeds from the library.** When documenting a stack component for a downstream project, `pm-stack-researcher` reads `doc/_templates/stack-idioms/<stack>.md` (if present) and includes those idioms in its output — treating the library as the starting set before researching new patterns for the project. Common patterns are pre-populated; the researcher does not rediscover them.

2. **`pm-stack-researcher` emits a contribute-up recommendation.** When the researcher documents a new idiom for a project that is not yet in the library, it annotates the entry in `docs/stack-notes.md` with a "first occurrence, not yet promoted" note. If the same idiom has already been noted as "first occurrence" on a prior project (recurrence gate: ≥2 projects), the researcher appends a "contribute-up recommendation": the pattern should be promoted to `doc/_templates/stack-idioms/<stack>.md`. The orchestrator acts on this recommendation on PM approval.

3. **The python.md seed validates the schema end-to-end.** The initial `doc/_templates/stack-idioms/python.md` file contains three seam-completeness idiom entries (exception-crosses-boundary, dict-subscript-vs-get, pin-lower-bound) as working examples of the full entry schema (idiom name → edge case covered → deviation = bug → Semgrep rule YAML → linter encoding reference → source → contributed-by). A downstream `pm-stack-researcher` reading this file can immediately apply its entries as idioms for a Python project's `docs/stack-notes.md`.

4. **An orchestrator contributes a new library entry.** On PM approval of a contribute-up recommendation, the orchestrator appends a new Semgrep rule to the appropriate stack file in `doc/_templates/stack-idioms/`, following the entry schema from scenario 3. The researcher never writes to `doc/_templates/stack-idioms/` directly.

## Existing behaviors this feature touches

(from `.claude/agents/pm-stack-researcher.md` — what must not break)

- **`pm-stack-researcher` "Extract idioms and constraints" step** — gains two new sub-bullets (seed-from-library and contribute-up). The existing per-component research flow and output format are unchanged; the additions are optional enrichment steps before and after the existing research.
- **`doc/_templates/` directory** — gains a new `stack-idioms/` subdirectory. Existing template files (`architecture.md.tmpl`, `contract.md.tmpl`, `state.md`, etc.) are untouched.

## Contracts

(No Product Contract — protocol-discipline change + template addition. All scenario subjects are system actors: `pm-stack-researcher`, orchestrator, downstream projects. No user-facing behavior change.)

## Stack expectations touched

(from `doc/stack-notes.md`)

- **Markdown frontmatter (YAML in Claude Code agent files):** `pm-stack-researcher.md` is a Claude Code agent file with YAML frontmatter (`name`, `description`). Prose additions to the body must not corrupt the frontmatter block. Source: `doc/stack-notes.md` § "Markdown frontmatter (YAML in Claude Code agent files)".

## Interaction scenarios

Provably isolated: prose additions to `.claude/agents/pm-stack-researcher.md` and new template files in `doc/_templates/stack-idioms/`. No shared mutable state, no concurrent operations, no I/O, no adjacent feature interference.

## Test plan

- Existing tests that must pass: all `tests/hooks.sh` — 73/73 (no hook touched, no `settings.json` change).
- New tests: **none** — markdown-prose repo with no runtime. Verification is editorial, per the project-kind documentation discipline: Pass-1 plan-compliance (all four scenarios implemented; seed file schema complete; researcher gains seed + contribute-up instructions; recurrence gate documented) + Pass-2 `code-review` over the diff. Consistent with `integration-risk-spike-gate`, `cross-model-review`, and `diagnostic-flow-discipline` test precedents for this repo.

## Docs to update

- `doc/architecture.md`: decision record — "Protocol-level stack-idioms library: Semgrep rules (Tier 1, pattern-detectable) + shareable linter-config references (Tier 2, metric-based) as the two-tier standard; library lives at `doc/_templates/stack-idioms/<stack>.md` (load-on-demand, not @-imported); entry schema = `idiom → edge-case covered → deviation = bug → Semgrep YAML rule`; `pm-stack-researcher` seeds from the library before researching new idioms and emits contribute-up recommendations for patterns recurring across ≥2 projects; orchestrator contributes on PM approval; prose-only patterns stay in `docs/stack-notes.md`." Authored by `pm-architect` post-coding.

## Key design decisions

- **Two-tier standard (Semgrep + linter-config reference).** Tier 1 = a Semgrep rule file (YAML) where the idiom is detectable by local pattern; the `message` field carries the `idiom → edge-case → deviation = bug` prose. Tier 2 = a reference to a linter rule name + config encoding for metric-threshold idioms (line count, complexity — the `ai-minimums-linter-wiring` mapping). Prose-only entries are not added to the library; they stay in `docs/stack-notes.md`.
- **Library location: `doc/_templates/stack-idioms/<stack>.md`.** Consistent with the existing template machinery home; per-stack (one file per language/framework), load-on-demand via the Read tool, never @-imported — the `@`-import-is-eager lesson from the context-loading model (stack-notes § "Claude Code context-loading model").
- **Recurrence gate: ≥2 projects before promotion.** A first occurrence stays in `docs/stack-notes.md` with a "first occurrence, not yet promoted" annotation. Prevents accumulating one-off project specifics. The researcher notes the recurrence; only the orchestrator (on PM approval) writes to the library.
- **Researcher never writes to the library directly.** The contribute-up path is: researcher recommends → orchestrator approves (PM direction) → orchestrator writes to `doc/_templates/stack-idioms/<stack>.md`. Same "orchestrator owns canon writes" discipline as the `## Code review` trail and `## Resolutions` trail.
- **Initial seed: `python.md` with three seam-completeness idioms.** Validates the schema end-to-end. Entries: exception-crosses-module-boundary, dict-subscript-vs-get, pin-lower-version-bound. These are the same idioms the seam-completeness review pass (#226) will reference — the library is where those rules live.

## Out of scope

- **Writing Semgrep rules for all stacks** — downstream projects seed their own; the library grows via contribute-up from real usage.
- **Wiring Semgrep into downstream project CI** — that is `ai-minimums-linter-wiring` per-project (separate feature).
- **Full seam-completeness review pass** — the new review lens/dimension in `code-review` is #226 (separate plan). This feature adds the library entries the seam-completeness pass will read, not the pass itself.
- **comment-restraint Semgrep rules** — the inline-rule-ID ban and trivial-docstring flag are #474 (separate plan). The backlog notes "fold doc-minimalism tooling into the same `/pm-research` on #227"; research is done; implementation is separate.
- **Retroactive sweep of existing downstream `docs/stack-notes.md` entries** — the library is additive; existing entries without library references are unaffected.
- **Sibling stacks (typescript.md, go.md, etc.)** — the feature focuses on `python.md` as the initial seed. Other stack files are created by downstream projects via the contribute-up mechanic; no `typescript.md` or `go.md` is created here.
