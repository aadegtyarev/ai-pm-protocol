## Code review: approve

Branch: `feature/setup-apply-config`
Reviewer: independent context, fresh read, 2026-06-10

---

### Summary

The fix adds step 4 to `## Setup` in `agents/orchestrator.md` and the assembled `.opencode/agents/ai-pm.md`, registers the apply-config contract point in `adapter/tool-map.json`, records it in `architecture.md` `## Extension points`, and documents the per-platform realization in `adapter/INSTALL.md`. Exactly 5 files changed; all gates green.

---

### Correctness

**Gap closed.** The original gap: a model pin chosen during `/setup` was written to `ai-pm.config.json` (step 3) but never baked into the deployed agent, so the pin was dead until the installer was re-run manually. Step 4 (`agents/orchestrator.md:18`) closes this by making the orchestrator run the adapter's install after writing config. The mechanism that bakes a pin is `adapter/opencode/install-agents.mjs:50-52` (the `model:` line is injected from config at assembly time). This path is exercised by `install-model.test.mjs`, which passes (11/11).

**Idempotency confirmed.** Running `node adapter/opencode/install-agents.mjs` against the current (zero-config) `ai-pm.config.json` produces the same `.opencode/agents/ai-pm.md` as the working tree — the re-run diff is the working-tree change itself, not additional drift. The claim "zero-config writes no model line, so the files come out unchanged" (`agents/orchestrator.md:18`) is correct.

**Claude path honest.** `adapter/INSTALL.md:46` states "the reviewer model is resolved at spawn here, so this just refreshes the assembled bodies" — verified against `adapter/claude/install-agents.mjs:29`, which assembles frontmatter + body with no `model` injection. Claude resolves the model at the `Task` spawn call, not at install time. The statement is accurate.

**OpenCode path honest.** `adapter/INSTALL.md:90` states "this is where OpenCode bakes the reviewer `model:` line into the assembled frontmatter, since there is no per-spawn model arg" — verified against `adapter/opencode/install-agents.mjs:50-52`. Correct.

---

### Neutrality (invariant 2 / core-and-adapter)

`agents/orchestrator.md:18`: "Run the adapter's **install** over your own project files (the concrete command is the adapter's, `adapter/INSTALL.md`)" — no platform primitive or command in the neutral body. Neutral-prose gate passes.

`architecture.md:76`: "Each adapter realises it as its install command, recorded in `tool-map.json` `apply-config`; no platform mechanism in this prose." — correct pointer, no concrete command.

Platform commands appear only in `adapter/tool-map.json:16-17` (their single home) and the per-platform sections of `adapter/INSTALL.md`. Not restated elsewhere.

---

### Single-home / no duplication (invariant 6)

`apply-config` is defined once at `adapter/tool-map.json:14-18`. References in `architecture.md:76` and `adapter/INSTALL.md:46,90` point to it; neither restates the command. The INSTALL.md sections name the concrete command inline for operational clarity (the same pattern used by all other wiring steps there) and explicitly defer to `tool-map.json` as "the single-home record." Acceptable — INSTALL.md is the operational realization doc, tool-map.json is the canonical map; the split mirrors every other contract point (e.g., "list available models").

---

### Honesty

No over-claim found. The idempotency claim is accurate for zero-config. The per-platform behavioral distinction (Claude bakes nothing at install vs OpenCode bakes the model line) is stated accurately and verified against the code. The step labels the apply act as a persona act the orchestrator performs ("this is you running your own install") — no false mechanical claim.

---

### Scope

Exactly 5 files changed (`agents/orchestrator.md`, `.opencode/agents/ai-pm.md`, `adapter/tool-map.json`, `adapter/INSTALL.md`, `architecture.md`). `PROTOCOL.md` untouched (180 lines). No scope creep.

---

### Test coverage

No new automated test was added. The bake mechanism is already covered by `install-model.test.mjs` (11 cases: pin baked, auto/session/absent stay model-free — all pass). The new part is the orchestrator procedure prose naming step 4 — a persona act untestable without an orchestrator harness. This is acceptable: the protocol consistently holds procedure prose to the persona label, not to an automated test. No coverage gap that a new test could close without an orchestrator harness.

---

### Gates

- `adapter/parity.test.mjs`: 55 passed, 0 failed
- `quality/neutral-prose.test.mjs`: pass (core is platform-neutral)
- `adapter/install-model.test.mjs`: 11 passed, 0 failed
- `adapter/install-commands.test.mjs`: 10 passed, 0 failed
- `adapter/opencode-inject.test.mjs`: 10 passed, 0 failed

---

### Findings

None blocking. No changes requested.

---

## Finalization re-review (docs)

Reviewer: independent context, fresh read, 2026-06-10
Scope: two uncommitted doc changes only — `adapter/INSTALL.md` (caveat removal) and `README.md` (new `## Configure` section). Confirmed via `git diff HEAD --name-only`: exactly those two files.

---

### 1. `adapter/INSTALL.md` caveat removal (honesty)

**What changed** (`adapter/INSTALL.md:61`, replacing the prior line at the same position):

Old text asserted the full `/setup` flow was "Still unit-proven only (the live run was interrupted at the mode question, so not shown end-to-end)" for config write and reviewer model-pin bake.

New text (`adapter/INSTALL.md:61`) asserts the full `/setup` flow ran end-to-end: env discovery, structured-question dialog, config write (`platform: opencode`, reviewer pin `{ "opencode": "deepseek/deepseek-v4-flash" }`), orchestrator apply/re-assemble step, pin bake into `.opencode/agents/pm-reviewer.md`, and reconfigure (read existing config, showed was/now diff, rewrote + re-applied).

**Honesty check — no over-claim:**

The new text precisely names what was shown live: each step is enumerated with the concrete artefact it produced (the pin value, the baked file path, the reconfigure diff). The closing sentence explicitly repositions the unit tests as "alongside a full live run, not in place of one" — the truthful relationship between unit coverage and the live run. No step is claimed beyond what was demonstrated.

**No conflict with `tool-map.json`:** `adapter/tool-map.json:14-18` (`apply-config` block) carries no live-verification claim — it is a command map. `tool-map.json:20-22` (`class_support._doc`) notes inject is "live-verified on opencode 1.17.x" for the nudge path, independently accurate and not contradicted by the INSTALL.md update. No duplicate or conflicting version of the live-run claim exists in `tool-map.json`.

**No remnants of the old caveat:** a grep for "unit-proven only", "live run pending", and "interrupted at the mode" across all tracked files finds those phrases only in prior review artefacts (`.ai-pm/reviews/setup-triggers_review.md`, `.ai-pm/state/current.md`, `CHANGELOG.md`) — all historical records, not current-state claims. None are in the files being shipped. Clean.

**Finding: pass — no over-claim, no residual caveat.**

---

### 2. `README.md` new `## Configure` section

**What changed** (`README.md:35-39`, two new paragraphs inserted between `## Install` and `## Layout`):

Paragraph 1 (`README.md:37`): describes first-time config — "a plain-language dialog: it discovers the models your environment actually offers and asks you to pick, then writes `ai-pm.config.json`" and the auto-offer on first work request with the note it is "an offer you may decline to proceed on safe defaults."

Paragraph 2 (`README.md:39`): describes on-demand reconfigure — "reads the current config, shows what changes, rewrites it, and re-applies so the new models take effect" — and points to the three single homes: `agents/orchestrator.md` `## Setup`, `PROTOCOL.md` `## The loop`, and `adapter/INSTALL.md`.

**Accuracy:**

- "discovers the models your environment actually offers" — accurate; `tool-map.json` `models.opencode.discover` specifies `opencode models` enumeration. (`README.md:37`)
- "an offer you may decline to proceed on safe defaults" — accurate; the lazy-setup nudge is not a block (confirmed in prior review of setup-triggers). (`README.md:37`)
- "reads the current config, shows what changes, rewrites it, and re-applies" — accurate; the reconfigure path is now live-verified as stated at `adapter/INSTALL.md:61`. (`README.md:39`)
- The pointer to `adapter/INSTALL.md` for "per-platform command" is correct — that file is the single home for per-platform wiring, including the apply-config commands. (`README.md:39`)

**Single-home / no duplication (invariant 6):**

The section does NOT restate the dialog steps, does NOT reproduce per-platform commands, and does NOT duplicate the pin-bake mechanics. It names what setup does at the user-facing level and points to the three homes for the full procedure. This is the correct README voice — a reader who wants the operational detail follows the links. No content from `agents/orchestrator.md` `## Setup`, `PROTOCOL.md`, or `adapter/INSTALL.md` is restated here.

**Placement:** inserted after `## Install` and before `## Layout` — logical: install precedes configure in the user journey. (`README.md:35`)

**Tight, no bloat:** two short paragraphs. Matches the terse README voice established by the `## How it works`, `## Platform-neutral by design`, and `## Install` sections.

**Finding: pass — accurate, single-home, tight, correctly placed.**

---

### 3. Gates (finalization scope)

- `adapter/parity.test.mjs`: **55 passed, 0 failed** (re-run this turn)
- `quality/neutral-prose.test.mjs`: **pass** (re-run this turn)
- Scope confirmed: `git diff HEAD --name-only` shows exactly `README.md` and `adapter/INSTALL.md` — no scope creep.

---

### Finalization findings

None blocking. Both doc changes are accurate, honest, single-homed, and tight. The caveat removal is not an over-claim. The README `## Configure` section points rather than restates. Gates green.

**Finalization verdict: approve.**
