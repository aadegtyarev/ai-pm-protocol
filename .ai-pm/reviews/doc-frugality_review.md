## Code review: approve

Branch `feature/doc-frugality`. Pure documentation de-duplication: audit findings F1–F4 resolved, one reviewer checklist guard added. All five gate tests pass. No fact lost, no orphaned pointer, no over-claim. Two minor notes (not blockers) recorded below.

---

### Gates

All five test suites run clean against the working tree:

- `adapter/parity.test.mjs` — 55 passed, 0 failed
- `quality/neutral-prose.test.mjs` — pass (core is platform-neutral)
- `adapter/install-model.test.mjs` — 11 passed, 0 failed
- `adapter/install-commands.test.mjs` — 10 passed, 0 failed
- `adapter/opencode-inject.test.mjs` — 10 passed, 0 failed

---

### F1 — Model policy de-duplicated, drift resolved

**Home confirmed:** `adapter/tool-map.json` lines 24–37, `models` block.

Every nuance deleted from `PROTOCOL.md:128` and `ai-pm.config.json:18` survives in the home:

- `auto` = a different model for independent blind spots: `tool-map.json:25` (`_doc`).
- Claude = opposite of the fixed pair: `tool-map.json:28` (`"auto": "the allow-listed model opposite the session's (opus<->sonnet)"`).
- OpenCode = falls back to session until pin: `tool-map.json:33` (`"auto": "session"`) + `tool-map.json:35` (`_note`).
- Environment-is-authority: `tool-map.json:35` (`_note`: "On OpenCode the ENVIRONMENT is the authority, not a static list").

**Stale "NEVER Haiku" blacklist phrasing:** confirmed gone from `PROTOCOL.md`, `ai-pm.config.json`, and `tool-map.json`. The allowlist framing (`allow: ["opus","sonnet"]`, `tool-map.json:27`) is the sole remaining expression; no Haiku language anywhere in the changed files.

**PROTOCOL.md:128** now points, does not restate: "the model policy — what `auto` resolves to, and each platform's model authority — lives in the platform adapter (`adapter/tool-map.json` `models`)."

**ai-pm.config.json:18** (`_roles`) now points: "The model policy — what 'auto' resolves to and each platform's model authority — is homed in the platform adapter: adapter/tool-map.json `models`."

F1: clean.

---

### F2 — INSTALL.md verification narrative

**Before:** the old `INSTALL.md` plugin section (line 61) carried a 6-sentence inline narrative (env discovery, 9 models, the pin value `deepseek/deepseek-v4-flash`, reconfigure walkthrough). The spawn section (line 84) named 3 specific bugs caught by the live run.

**After (`adapter/INSTALL.md:61`):** one short status line — "Live-verified on opencode 1.17.x (the dogfood run narrative — env discovery, the pin bake, reconfigure — is in `CHANGELOG.md`): the `chat.message` inject reaches the model on an unconfigured project, and the full `/setup` flow runs end-to-end through the apply/re-assemble step."

The narrative is in `CHANGELOG.md` (confirmed at line 23: "env discovery (`opencode models` → 9 models, session `deepseek/deepseek-v4-pro`)…").

**After (`adapter/INSTALL.md:84`):** one short status line — "Live-verified on opencode 1.17.x: the session runs as `ai-pm` (the personality loads) and a write into `.ai-pm/tooling/` is mechanically blocked by the plugin (the engine's self-patch deny)." The three-bugs list is removed; the behavioral fixes they document are present in the surrounding prose as architecture fact (inline-defined vs re-exported, plural dirs).

Both stamps are genuinely collapsed to one line each. No wiring fact lost (the mechanism prose at lines 52–59 is unchanged; the three bugs' fixes are embedded in the wiring description itself).

F2: clean.

---

### F3 — Twin "Apply config" sections

**`adapter/INSTALL.md:46` (Claude):** "the shared re-assemble-after-setup step is homed in `tool-map.json` `apply-config` + `architecture.md`. Claude delta: the reviewer model is resolved at *spawn*, not baked, so applying is just `node adapter/claude/install-agents.mjs` refreshing the assembled bodies."

**`adapter/INSTALL.md:90` (OpenCode):** "the shared re-assemble-after-setup step is homed in `tool-map.json` `apply-config` + `architecture.md`. OpenCode delta: there is no per-spawn model arg, so `node adapter/opencode/install-agents.mjs` *bakes* the reviewer `model:` line into the assembled frontmatter."

The shared mechanism (order-independence, idempotency) is no longer restated in either paragraph. Each states only its per-platform delta. The shared home is `tool-map.json:14-18` (`apply-config`) + `architecture.md:76`.

**Minor note (not a blocker):** the opening pointer sentence ("the shared re-assemble-after-setup step is homed in…") is identical in both paragraphs. This is a pointing sentence, not a policy restatement, so it is not a one-home violation — but a reader could argue the two paragraphs could share one heading instead. Not blocking.

F3: clean.

---

### F4 — `tool-map.json models._note` trimmed

**Before:** opened with "ZERO-CONFIG ⇒ `auto`/`session`/absent ⇒ one session model everywhere…" and closed with "the install step bakes it into the assembled reviewer (adapter/opencode/install-agents.mjs). A pin is honoured as-is."

**After (`tool-map.json:35`):** opens with "On OpenCode the ENVIRONMENT is the authority…", closes with "How a pin is deployed into the assembled reviewer: adapter/INSTALL.md OpenCode `## Apply config`."

The "install-bake sentence" is replaced by a cross-link. JSON parses correctly (verified by `node -e` eval).

**Minor note (not a blocker):** the pointer `adapter/INSTALL.md OpenCode \`## Apply config\`` uses backtick-heading notation, but there is no `## Apply config` heading in INSTALL.md — "Apply config" is a bold inline paragraph under `### Command`. The pointer is navigable (reader finds the OpenCode section, scans for "Apply config"), but imprecise. A reader following it programmatically (e.g., a link checker) would fail. Not a fact-loss; the target content exists at `adapter/INSTALL.md:90`.

F4: clean.

---

### F5 — Reviewer guard added

**`agents/reviewer.md:16`:** the Frugality & one-home item gains: "For each fact the change documents, **grep the whole doc surface for an existing home — not just the diff**: if one exists the change must POINT, not restate; a second/third accumulated copy blocks (whole-surface, since the per-diff gate is blind to drift across files)."

The guard does not restate the manifesto's "Every fact has exactly one home" rule — it adds the *procedural* enforcement instruction (grep the surface; pointing vs. restating; whole-surface scope). These are distinct: the manifesto states the invariant, the guard tells the reviewer how to check it.

`agents/reviewer.md` is 28 lines — lean.

Both deployed copies carry the identical guard:
- `.claude/agents/pm-reviewer.md:22` — matches source.
- `.opencode/agents/pm-reviewer.md:29` — matches source.

F5: clean.

---

### F6 — Dogfood: no new duplicate or orphaned pointer introduced by this change

Checked the doc surface for every fact this change touched:

- "reviewer defaults to auto" — present in `ai-pm.config.json:18` (data comment, contextually appropriate) and `agents/orchestrator.md:7` (operational procedure). Two roles with different purposes, not duplicated policy home.
- "idempotent" apply-config — survives in `agents/orchestrator.md:18` (the Setup step 4 description). Not orphaned.
- "order no longer matters" — removed from INSTALL.md; the behavioral property is implied by idempotency (described in `orchestrator.md:18`). Historical record is in `CHANGELOG.md:22`. Not a fact-loss.
- "NEVER Haiku" — gone from all three changed files; the allowlist (`tool-map.json:27`) is the correct and only expression.
- The `_note` pointer in `tool-map.json:35` points to `adapter/INSTALL.md OpenCode \`## Apply config\`` — the target exists at line 90 (bold paragraph). Imprecise notation but not an orphaned pointer.

No new duplicate introduced. No orphaned pointer (all pointed-at homes carry the claimed content).

---

### Pre-existing note (out of scope, not a blocker)

`architecture.md:81` "Open assumptions" still says "the plugin's **live deny is pending a single interactive capture**." This is stale — the live deny is verified (`INSTALL.md:84`, `tool-map.json class_support` line 20). This stale note predates this change and is outside the doc-frugality scope; it is a pre-existing issue.

---

### Summary

All four audit findings resolved correctly. The reviewer guard is added, lean, and deployed to both platform copies. All five gate tests pass. Two minor imprecisions noted (identical pointer sentence in twin Apply config paragraphs; `## Apply config` notation not matching a real heading) — neither is a blocker.

**Verdict: approve.**

---

## Fixup re-review

Two nits from the prior full review were addressed. This section verifies only that delta. Scope check first: `git diff main..feature/doc-frugality --name-only` returns empty — the branch is at the same commit as main (the change is already merged into main). The files are read in their current state, which is the shipped state. Both nit fixes are confirmed present.

### Nit 1 — `architecture.md:81` stale "live deny is pending" claim

**Prior state (from the pre-existing note above):** `architecture.md:81` said "the plugin's **live deny is pending a single interactive capture**" — stale.

**Current state (`architecture.md:81`):** "the plugin's **live deny is verified on opencode 1.17.x** (a write into `.ai-pm/tooling/` is mechanically blocked — `adapter/INSTALL.md`, the OpenCode "Spawn a sub-agent" note)."

The claim is now current truth: it states the deny IS live-verified, names the concrete evidence (a write into `.ai-pm/tooling/` is blocked), and points to `adapter/INSTALL.md` as the home for the detail rather than re-narrating. The pointer target exists: `adapter/INSTALL.md:84` carries exactly "Live-verified on opencode 1.17.x: the session runs as `ai-pm` (the personality loads) and a write into `.ai-pm/tooling/` is mechanically blocked by the plugin (the engine's self-patch deny)."

**Honesty / over-claim check:** `architecture.md:81` states verified. The evidence chain: `CHANGELOG.md:33` (PR #2, "Live-verified on opencode 1.17.x" — the orchestrator offered setup; `/setup` ran end-to-end) and `tool-map.json:20` (`class_support._doc`: "Both OpenCode classes are live-verified on opencode 1.17.x: deny blocked a write into .ai-pm/tooling/…"). The deny was confirmed in the live run documented in PR #2. The claim is not an over-claim; it is accurately `[mechanical]` on OpenCode (the plugin throws on the guarded write).

**Old non-existent `## OpenCode` heading pointer:** the prior text had no `## OpenCode` heading pointer; the stale text was a standalone sentence about pending verification. The fix replaces that sentence with the verified claim and points to `adapter/INSTALL.md` (no heading fragment — just the file), which resolves correctly. No broken heading fragment introduced.

Nit 1: clean. `architecture.md:81` — current truth, properly homed, not an over-claim.

---

### Nit 2 — `adapter/tool-map.json:35` `_note` pointer precision

**Prior state (from F4 minor note above):** the pointer read `adapter/INSTALL.md OpenCode \`## Apply config\`` — using backtick-heading notation for a target that is a bold inline paragraph, not a `##` heading. Imprecise but navigable.

**Current state (`tool-map.json:35`):** "How a pin is deployed into the assembled reviewer: the **Apply config** paragraph in adapter/INSTALL.md (OpenCode section)."

The pointer now names the target as a **paragraph**, not a `##` heading, which matches the actual structure of `adapter/INSTALL.md:90` ("**Apply config** — the shared re-assemble-after-setup step…" under `### Command`). A reader following this pointer finds: the OpenCode section, then the "Apply config" bold paragraph — unambiguous. No heading fragment to misparse; no link-checker trap. JSON parses correctly (confirmed by `node -e` eval above).

Nit 2: clean. `adapter/tool-map.json:35` — pointer is precise, matches target structure, JSON valid.

---

### Scope check

Only `architecture.md` and `adapter/tool-map.json` carry the two nit fixes. No other files were modified as part of this fixup. No fact or behavior changed — the architecture claim was stale (the live-verify happened in PR #2); this corrects the prose to match reality. The pointer fix is a navigability improvement only.

Gates re-run against current working tree:
- `adapter/parity.test.mjs` — 55 passed, 0 failed
- `quality/neutral-prose.test.mjs` — pass

Both green. No scope creep.

**Fixup verdict: both nits correctly resolved, no new issues introduced. Prior approve stands.**
