## Code review: approve

Reviewer: fresh independent context. Branch: `feature/setup-procedure`.
Gates run independently: parity 50/50 pass, neutral-prose pass, install-model bake 11/11 pass.

---

### Summary

All plan items (S1–S8) and the PM→Operator rename are correctly implemented. Every finding
below is a **minor / pre-existing** item — none block ship. No blockers found.

---

### Checklist findings

#### Plan compliance — PASS

- **S1 (setup spec, one home):** `agents/orchestrator.md` lines 13–24 carry the `## Setup`
  subsection. Neutral 3-step flow (discover → structured-question → write config), honest
  guided-dialog fallback, "never invent an id" stated. One home; PROTOCOL.md line 56 now
  points to it ("Its single home is the orchestrator's `## Setup`").

- **S2 (list-available-models contract point):** `architecture.md` line 75 adds the contract
  row. `adapter/tool-map.json` carries `discover` keys for both platforms (claude: known pair
  from `allow`; opencode: `run-a-shell-command opencode models`, guided-dialog fallback). No
  env-specific model ids added to the shared file. Satisfies D2 and D4.

- **S3 (opencode bake fixed):** `adapter/opencode/install-agents.mjs` lines 32–38
  (`resolveModelPin`) and lines 42–58 (`install`). Concrete pin → `model: <id>` baked;
  `auto`/`session`/absent → no `model:` line. Bug fixed.

- **S4 (Claude installer untouched):** `adapter/claude/install-agents.mjs` verified: no
  `model` resolution added. Pure body+fm concat. Correct.

- **S5 (D3 neutral wording):** `agents/orchestrator.md` lines 6–11 replace the
  opus↔sonnet/spawn-param mechanism with the neutral contract text. No platform mechanism
  in the neutral body. Satisfies D3.

- **S6 (re-assembly):** Fresh re-run of both installers to temp dirs produces output
  identical to the committed assembled files (verified independently — diff empty).

- **S7 (bake test):** `adapter/install-model.test.mjs` — 11 cases: 6 `resolveModelPin`
  unit tests + 5 end-to-end bake/no-bake cases. `quality/tools.json` carries the registry
  row (beat: build). Test run independently: 11/11 pass.

- **S8 (honesty + single home):** `adapter/tool-map.json` `_note` for opencode rewritten per
  D4 — env is the authority, `allow: []` is a marker not a gate, same-model honesty stated,
  opt-in pin form documented. `ai-pm.config.json` `_roles` carries the per-platform pin
  example `{ "claude": "opus"|"sonnet", "opencode": "provider/model" }` (pre-existing,
  confirmed present, not duplicated).

- **PM→Operator rename:** Complete across all durable source artifacts:
  PROTOCOL.md, agents/orchestrator.md, agents/builder.md, adapter/deny-rules.json,
  adapter/tool-map.json, adapter/opencode/agents/orchestrator.fm, CLAUDE.md, AGENTS.md,
  README.md, templates/README.md, templates/contracts.md, and all assembled copies
  (.claude/agents/, .opencode/agents/). CHANGELOG.md correctly left untouched (historical
  record). Protocol name "AI-PM" preserved at PROTOCOL.md line 1. File/config identifiers
  `ai-pm.config.json`, `pm-builder`, `pm-reviewer`, `ai-pm` (agent id) correctly
  NOT renamed. Surrounding prose reads naturally throughout.

- **Scope discipline — Slice A only:** No triggers, no auto-run, no slash-command, no
  clean-project detection. New backlog entry at `.ai-pm/backlog.md` correctly records
  Slice B as deferred. Pass.

#### Correctness — PASS

- Empty/zero-config path: `auto`/`session`/absent all → no `model:` line
  (`install-agents.mjs:34`, test lines 57–59). Zero-config works.
- Concrete pin path: bare string and `{ opencode: "..." }` form both baked correctly
  (`install-agents.mjs:35–36`, test lines 51–54).
- Error/bad-input: guided-dialog fallback documented in `orchestrator.md` setup step 1;
  "never invent an id" stated. The spec covers the fallback; enforcement is the dialog's
  job per the plan (Slice A: spec only, not new deny code).
- `{ claude: "..." }`-only pin on opencode: returns null (line 37 falls through, line 38
  returns null) — correct, no opencode bake for a Claude-only pin. Test line 31 covers it.

#### Security — PASS

- No secrets committed. No new untrusted-input paths opened. The setup procedure reads
  `opencode models` (read-only enumeration) — stated in `tool-map.json` `discover` note.
  The PM/Operator's model choice is written to the project's own config file only.

#### Honesty — PASS

- Zero-config same-model review honestly labelled: `orchestrator.md` line 11 ("where the
  environment offers no second model, `auto` falls back to the session model — same-model
  review, no cross-model independence; do not present it as independent") and
  `tool-map.json` opencode `_note` ("same-model review, no cross-model independence").
- `allow: []` correctly labelled a marker, not a hard gate, in `tool-map.json` opencode
  `_note`. The engine does not enforce `allow` at spawn (confirmed no code reads
  `models.*.allow`) — D4 decision correctly implemented as a docs/honesty change only.
- Over-claim check: no claim that opencode does cross-model by default. No claim that
  discovery is guaranteed (fallback documented). Pass.
- **D4 FIXUP (re-reviewed 2026-06-10):** Both previously-flagged stale allowlist references
  are now corrected and honest — see fixup re-review note below.

#### Hygiene — PASS

- `resolveModelPin` is a pure function with no side effects (`install-agents.mjs:32–38`);
  `install` is cleanly separated and returns the written path map for testability. No
  god-functions, no copy-paste duplication.
- Comments in `install-agents.mjs` explain the WHY (OpenCode has no per-spawn model arg)
  not just the what. No AI-chatter artefacts.
- The test header comment accurately describes the contract being tested.
- `neutral-prose.test.mjs` passes: the new `## Setup` section and neutral model wording
  in `orchestrator.md` contain no platform primitives.

#### Frugality / one-home — PASS

- Setup spec has one home: `agents/orchestrator.md` `## Setup`. PROTOCOL.md line 56
  points to it. No duplication.
- Model policy (discover, allow, auto semantics) lives in `tool-map.json`. The
  `_roles` comment in `ai-pm.config.json` does not restate it — it points to it
  (`adapter/tool-map.json models`).
- `architecture.md` carries the contract-point name and its one-liner; the realisation
  details live in `tool-map.json` as their single home.
- New backlog entry in `.ai-pm/backlog.md` correctly defers Slice B without duplicating
  the Slice A spec.

#### Tests — PASS

- `adapter/install-model.test.mjs` is NEW, not a modification of an existing test.
- `adapter/parity.test.mjs` and `quality/neutral-prose.test.mjs`: diffed — no changes,
  both still green. Neither weakened nor edited to pass.
- Test count: 11 new cases covering the full pin/no-pin contract (unit + end-to-end).

---

### Fixup re-review — 2026-06-10

**Scope:** D4 honesty delta only — two stale "allowlist" references flagged as pre-existing
in the original approve. Verified as a fresh independent context.

**Finding 1 — PROTOCOL.md:126 (resolved).**
Old text: "opt in by extending the adapter's model **allowlist** (deny by default)".
New text (verified at line 126): "opt in with a per-platform pin (its environment, not a
static list, is the model authority)". The sentence now correctly states OpenCode's model
authority as the environment, drops the false "deny by default" allowlist claim, and ends
with a pointer to the single home: `adapter/tool-map.json` `models`. No policy duplicated.

**Finding 2 — ai-pm.config.json:18 `_roles` (resolved).**
Old text ended: "The model ALLOWLIST + auto-policy live in the platform adapter
(tool-map.json `models`); a pin must be allow-listed."
New text (verified at line 18): "The auto-policy + each platform's model authority live in
the platform adapter (tool-map.json `models`): on Claude a pin must be one of the fixed
opus/sonnet pair; on OpenCode the environment (what `opencode models` reports) is the
authority — no static gate, and a pin is honoured as-is." Honest, platform-differentiated,
points to the single home. No over-claim.

**Scope creep check:** Only PROTOCOL.md and ai-pm.config.json carry the D4 delta. No
`agents/*` body edited, `.ai-pm/tooling/` untouched. The remaining working-tree changes
(all other listed files) are the previously-approved S1–S8 and PM→Operator set — unchanged
from the prior approve.

**Gates re-run independently:** parity 50/50 pass; neutral-prose pass.

**Verdict: approve.** Both stale items corrected, honest, pointing at the single home.
No scope creep. Gates green.
