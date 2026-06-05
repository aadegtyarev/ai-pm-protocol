# Stack-idioms library — research

Source: synthesized from `.ai-pm/backlog.md` § "Protocol-level stack-idioms library" + "Idiom-as-pre-solved-edge-case + local idiom-inconsistency (deterministic) + shared-LLM-blind-spot" (2026-06-05) + live DriveBox review evidence. PM asked to research and adopt an existing standard (not invent), specifically Semgrep/CodeQL as candidate.

---

## Research question

What is the most economical standard for a protocol-level stack-idioms library that:
1. Accumulates cross-project patterns without bloating every session's context
2. Is deterministically runnable (not prose-only)
3. Has an established schema the protocol can adopt without inventing
4. Supports "seed-then-augment": protocol seeds per-stack, project augments per-project, contribute-up loop back to protocol

---

## Existing standards surveyed

### Semgrep rules

**URL:** https://semgrep.dev/docs/writing-rules/overview  
**Schema:** each rule = `id` + `pattern` (or `patterns`) + `message` + `severity` + `languages`. Composable, per-language, shareable (Semgrep Registry). Rules are version-controlled YAML.  
**Runnable:** `semgrep --config <rule-file-or-registry-path> <source-dir>` — deterministic, per-diff, free tier available.  
**Accumulation mechanic:** the Semgrep Registry is the public "contribute-up" model. Private rule sets can be local YAML files checked into the repo.  
**Fit for this protocol:** strong. A rule encodes exactly `idiom → edge-case → deviation = bug` in machine-executable form. Rules can be referenced by ID in `docs/stack-notes.md` alongside the prose idiom description. The `message` field IS the "1-line example + why" the protocol wants. Load-on-demand: rules are read when `semgrep` runs, not when the session starts.  
**Schema match:** `idiom → edge-case it covers → deviation = which bug → Semgrep rule ID + YAML`.

### CodeQL

**URL:** https://codeql.github.com/docs/writing-codeql-queries/  
**Schema:** QL queries (a logic language), compiled and run via the CodeQL CLI or GitHub Actions. More powerful than Semgrep (cross-file dataflow, call graph), but much higher barrier: requires QL fluency, database creation, slower iteration.  
**Fit for this protocol:** lower than Semgrep for the use case. The protocol's idiom-library use case is per-diff, fast feedback — Semgrep's pattern matching is sufficient; CodeQL's dataflow power is needed for the seam-completeness / cross-module class, not idiom-deviation detection.  
**Verdict:** useful for the seam-completeness review pass (#226), not the idiom library entry standard.

### Shareable linter configs

**Examples:** `eslint-config-airbnb`, `ruff` presets, `pylint` `--rcfile`, `golangci-lint` YAML config.  
**Schema:** each config is a tool-specific format (JSON/YAML/INI) specifying which rules are enabled and their thresholds.  
**Fit for this protocol:** strong for the ai-minimums→linter-rule mapping (`ai-minimums-linter-wiring`, shipped v2.28.0). The protocol already wires linter configs at bootstrap. But shareable linter configs are tool-specific and don't carry the `idiom → edge-case → rule` narrative the library needs. They are the enforcement encoding, not the library entry itself.  
**Verdict:** the linter config IS the `enforcing rule/config` field in the library entry schema — not the entry format itself.

### ADR / MADR pattern-catalog

**Examples:** `adr-tools`, MADR (Markdown Architectural Decision Records).  
**Schema:** Context / Problem / Solution / Consequences — prose-only decision records.  
**Fit for this protocol:** good for the "why" narrative, but not deterministically runnable. The protocol already uses this pattern for `docs/architecture.md` and `docs/stack-notes.md` decision entries.  
**Verdict:** the library entry's `why` field (edge-case narrative) follows this pattern, but the library is NOT prose-only — the enforcing rule must be machine-executable. ADR/MADR alone is insufficient.

---

## Decision: Semgrep + shareable-linter-config as the two-tier standard

**Tier 1 — Semgrep rule (when the idiom is detectable by local pattern):** the entry IS a Semgrep rule file (YAML). The `message` carries the prose (`idiom → edge-case → deviation = bug`). The rule is the machine-executable enforcement. Deterministic, per-diff, zero additional tooling for Python/JS/TS stacks.

**Tier 2 — Linter config setting (when the idiom maps to a metric threshold: line count, complexity, etc.):** the entry is a reference to a linter rule name + the config encoding (`max-module-lines: 300` in pylint). These are the ai-minimums mappings already shipped by `pm-stack-researcher`'s AI-minimums→linter-rule mapping section.

**Prose-only entries are NOT added to the library.** A pattern that cannot be expressed as a Semgrep rule OR a linter-config setting stays in `docs/stack-notes.md` as a prose idiom — the library is the executable/deterministic subset. Prose idioms that cannot be linted are enforced by the AI per-diff review and the smell/hygiene sweep (as the protocol already does).

---

## Library home

**Location:** `doc/_templates/stack-idioms/<stack>.md` — per-stack Markdown file with YAML rule blocks.

**Reasoning:**
- Lives in `doc/_templates/` — the protocol's own template machinery home; consistent with the templates that pm-bootstrap copies downstream
- Per-stack: one file per language/framework (`python.md`, `typescript.md`, `go.md`) — load-on-demand, never @-auto-imported
- Format: Markdown with fenced YAML blocks for the Semgrep rules and prose for the linter-config references — readable by a human, parseable by a tool

**Alternative rejected:** a separate `doc/stack-idioms/` directory at the template root. Reason: it would need its own visibility rule in every downstream consumer; placing it in `doc/_templates/` keeps it in the existing shipped-surface with the same access pattern as the other templates.

---

## Entry schema

Each entry in the per-stack library file:

```markdown
### <idiom-name> (<stack>)

**Edge case covered:** <what failure mode this idiom pre-solves>
**Deviation = bug:** `<anti-pattern>` → `<specific error>`
**Semgrep rule:** `<rule-id>`

```yaml
rules:
  - id: <rule-id>
    languages: [<lang>]
    severity: WARNING
    message: "<idiom-name>: use <correct-form> to handle <edge-case>"
    pattern: <anti-pattern>
```

**Linter encoding (if applicable):** `<tool> <rule-name>: <value>` (see `ai-minimums-linter-wiring`)
**Source:** <canonical URL for the idiom>
**Contributed by:** <project> (<date>)
```

**Key design note:** `message` is the load-bearing prose — it carries `why` to the developer who sees the lint failure. The Markdown entry is human-readable documentation; the fenced YAML block is the machine-executable rule. One fact, one owner.

---

## Accumulation mechanic (seed-then-augment → contribute-up)

**Seed:** when `pm-stack-researcher` documents a stack component, it reads the corresponding `doc/_templates/stack-idioms/<stack>.md` (if present) and includes the library rules in its output: "seed from the library before researching new idioms". This prevents re-discovering the same pattern per project.

**Augment:** when `pm-stack-researcher` documents a NEW idiom for a project that is not yet in the library, it adds the idiom to the project's `docs/stack-notes.md` as usual, AND emits a "contribute-up recommendation": "this pattern (`<idiom>`) recurs across projects — recommend contributing to `doc/_templates/stack-idioms/<stack>.md`". The orchestrator decides whether to contribute.

**Contribute-up:** the orchestrator, on approving a contribution, writes the new Semgrep rule to the library file as an additive commit. This is the protocol's existing "protocol-feedback report" mechanic applied to the idiom library instead of `WORKFLOW.md` rules.

**Recurrence gate:** only patterns that recur across ≥2 projects are promoted to the library. A first occurrence stays in `docs/stack-notes.md`; the researcher notes "first occurrence, not yet promoted". Prevents accumulating one-off project specifics.

---

## Load-on-demand guarantee

The library files at `doc/_templates/stack-idioms/` are NOT @-imported into any session's CLAUDE.md. They are read by `pm-stack-researcher` on demand when it documents a component. This follows the context-loading rule in `doc/stack-notes.md` § "Claude Code context-loading model": on-demand = the Read tool, not @-import.

Downstream projects inherit the library via the `.ai-pm/tooling/` submodule. A `git submodule update --remote` picks up new library entries immediately — same mechanism as WORKFLOW.md and agent file updates.

---

## Relationship to existing features

- **`ai-minimums-linter-wiring` (v2.28.0):** the library's Tier 2 (linter-config references) extends the ai-minimums→linter-rule mapping already in `pm-stack-researcher`. The library IS the protocol-level seed of those mappings across projects.
- **`seam-completeness` (#226):** the seam-completeness idioms (exception-crosses-boundary, `.get()` vs subscript on store data, pin lower-version bounds) are the first Tier-1 library entries — Semgrep-expressible. The library is where those rules live; the seam-completeness review pass reads the library.
- **Cross-model review:** the library makes deterministic what was previously AI-reviewer-dependent. Rules the library covers are enforced by Semgrep; only what the library cannot express remains in the AI review domain (the deterministic-vs-AI boundary principle, backlog #211).

---

## Scope boundaries

**In scope for this feature:**
- The library directory structure and entry schema
- `pm-stack-researcher` seed-then-augment and contribute-up instructions
- An initial seed file (`python.md`) with the three seam-completeness idioms as example entries (validates the schema end-to-end)

**Out of scope:**
- Writing Semgrep rules for all stacks (downstream projects seed their own)
- Wiring Semgrep into downstream project CI (that is `ai-minimums-linter-wiring` per-project)
- The seam-completeness review pass itself (#226 — separate feature)
- The `code-review` dimension changes for idiom-consistency checking (#228 — separate)

---

## Confidence in the decision

The Semgrep standard is well-established; the schema maps directly to the protocol's needs. The main uncertainty is whether Semgrep is available / appropriate for all downstream stacks — but the library is additive (prose-only stacks simply have no Semgrep rules; the schema still holds with empty rule blocks). No blocking unknowns. `/pm-plan` can proceed.
