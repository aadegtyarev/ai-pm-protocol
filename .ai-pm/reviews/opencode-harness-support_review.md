# opencode-harness-support — Re-review (Final Ship Review)

Reviewer: independent spawn (claude-sonnet-4-6), fresh context.
Date: 2026-06-10
Branch: `feature/opencode-harness-support`
Re-review of fixes for the two blockers (F1, F2) raised by the prior final ship review.

## Code review: approve

Both blockers are closed. One non-blocking honesty note (N1) found; does not block ship.

---

## F1 — CLOSED: Old `.opencode/` model fully retired; new model correctly installed

**Evidence:**

- Old `.opencode/agent/pm-*.md` (11 files) and `.opencode/command/` (5 files) and `.opencode/plugin/ai-pm-enforcement.js` are staged for deletion (`git status` confirms). Working tree contains only `.opencode/agent/pm-builder.md` + `.opencode/agent/pm-reviewer.md`.

- `.opencode/agent/pm-builder.md:1–44` and `.opencode/agent/pm-reviewer.md:1–42`: verified via Python diff — body (after frontmatter) is byte-identical to `agents/builder.md` and `agents/reviewer.md` respectively. The assembler `adapter/opencode/install-agents.mjs:31` reads `agents/<role>.md` with `.trimStart()` and uses `.trim()` on the frontmatter; the committed files match what a fresh `node adapter/opencode/install-agents.mjs` produces (dry-run confirmed identical).

- `.opencode/plugin/ai-pm.mjs:13–14`: own-export form — `import { AiPmEnforcement as impl } from "../../adapter/opencode/plugin.mjs"; export const AiPmEnforcement = impl;` — not a re-export. Import path resolves to `adapter/opencode/plugin.mjs` (confirmed file exists).

- `.opencode/opencode.json:3–5`: `"instructions": ["PROTOCOL.md", "agents/orchestrator.md"]` — new constitution, no `WORKFLOW.md`. `opencode.json:11–12`: `"build": { "disable": true }, "plan": { "disable": true }` — generics blocked (invariant 1). No `default_agent` key.

- `AGENTS.md:1–21` (current working tree): rewritten — references `PROTOCOL.md`, `agents/orchestrator.md`, `pm-builder`, `pm-reviewer`. No `WORKFLOW.md` reference, no old `pm-*` roster. Honesty label at `AGENTS.md:20`: "the own-export plugin's live deny is pending a single interactive capture — Not yet 'verified' — do not read it as activated."

- Grep of all live surface files (`AGENTS.md`, `architecture.md`, `README.md`, `adapter/`, `PROTOCOL.md`, `.opencode/`): zero matches for `WORKFLOW.md` or any of `pm-architect`, `pm-auditor`, `pm-codebase-reader`, `pm-coder`, `pm-plan-checker`, `pm-product-advocate`, `pm-pr-prep`, `pm-stack-researcher`.

- `ai-pm.config.json:14–18`: `orchestrator.agent: "ai-pm"`, `builder.agent: "pm-builder"`, `reviewer.agent: "pm-reviewer"`. Orchestrator seat is the session (no `ai-pm.md` file in `.opencode/agent/`); Builder and Reviewer are spawned files. Sound and consistent with the 3-role model.

---

## F2 — CLOSED: `.golden/` removed with no dangling references

**Evidence:**

- `ls /home/.../ai-pm-protocol/.golden` → `No such file or directory`. `ls /home/.../ai-pm-protocol/golden` → same.

- `git status` shows all 16 `.golden/` files staged for deletion (`git rm`).

- Grep of `adapter/parity.test.mjs`, `quality/`, `README.md`, `architecture.md`, `AGENTS.md`, `PROTOCOL.md`: zero matches for `.golden` or `golden`. No dangling references.

---

## N1 — Non-blocking: `adapter/README.md:46` uses stale "re-export" language

**Severity: non-blocking (factual error in a supporting doc, no safety over-claim).**

`adapter/README.md:46` reads: "Install glue is in `INSTALL.md` (where each file lands, the Claude hook fragment, the OpenCode **re-export entry**). One open assumption remains on the OpenCode side — that its loader accepts a **re-exported plugin** importing from outside the plugin dir…"

The actual implementation is an **own-export** (not a re-export) — `adapter/INSTALL.md:72–73`, `architecture.md:78`, `.opencode/plugin/ai-pm.mjs:13–14`, and `adapter/opencode/plugin-entry.mjs:11–12` all correctly say "own-export". The builder corrected `architecture.md` and `adapter/INSTALL.md` but missed `adapter/README.md`. The stale language is factually wrong about the form of the entry, and the "open assumption" sentence describes an assumption that was already resolved (the own-export was dogfooded on opencode 1.17.0 and IS the fix). This is not an honesty over-claim on a safety guarantee — the correct status is documented in `architecture.md:78` ("pending a single interactive capture") and `adapter/INSTALL.md`. A reader of `adapter/README.md` alone would be misled about what was shipped. Should be corrected before or shortly after ship; does not block.

---

## Checklist (cite-or-it-didn't-happen)

**F1 closed.** Old model fully gone: `.opencode/agent/pm-*.md` (11 old files) staged for deletion (`git status`). New agents in `.opencode/agent/pm-builder.md` + `pm-reviewer.md` sourced from the ONE home (`agents/builder.md`, `agents/reviewer.md`) — confirmed byte-identical body via assembler dry-run. Plugin is own-export: `.opencode/plugin/ai-pm.mjs:13`. `opencode.json:3–12` loads new constitution, disables generics, no `default_agent`. `AGENTS.md:20` honest status. No `WORKFLOW.md` or old `pm-*` refs in live surface files (grep confirmed).

**F2 closed.** `.golden/` gone, 16 files staged for deletion. No dangling references (grep confirmed across `adapter/parity.test.mjs`, `quality/`, and all live docs).

**No-duplication / one-home.** Role bodies have exactly one home (`agents/<role>.md`); the OpenCode adapter uses the assembler to concatenate frontmatter + that body, never re-authors it. `adapter/opencode/install-agents.mjs:31` confirms `body = fs.readFileSync(path.join(ROOT, "agents", ...)`. Deny rules: one home (`adapter/deny-rules.json`). Tool map: one home (`adapter/tool-map.json`). Frontmatter-only additions in `adapter/opencode/agents/builder.fm` + `reviewer.fm` are adapter-only metadata (description, mode, tools), not role body content.

**Honesty.** No doc claims OpenCode is "verified/activated." `AGENTS.md:20`, `README.md:31`, `architecture.md:78`, `adapter/INSTALL.md:74` all honestly state the live deny is pending one interactive capture. `architecture.md:78` correctly uses "own-export entry" (the architecture.md correction noted by the builder is confirmed). `PROTOCOL.md:105` labels the orchestrator-content guard accurately: "mechanical only on a platform that resolves the actor (OpenCode); `[persona]` on Claude." N1 above (adapter/README.md:46 stale "re-export" language) is the only honesty deficit found; it is non-blocking.

**Structural fork — orchestrator seat.** Orchestrator = session, not a spawned file. `opencode.json:11–12` disables `build`/`plan` generic primaries (invariant 1 satisfied). `ai-pm.config.json:14` `orchestrator.agent: "ai-pm"` resolves to the session on OpenCode (no spawned ai-pm.md). Sound and consistent with the 3-role model.

**Tests green.** `node adapter/parity.test.mjs` → PASS — 50 passed, 0 failed. Documented divergence printed (orchestrator-authors-content: claude=allow opencode=deny). `node quality/neutral-prose.test.mjs` → PASS. No existing test edited to pass; new files (`adapter/opencode/install-agents.mjs`, `adapter/opencode/agents/*.fm`, `.opencode/agent/*.md`, `.opencode/plugin/ai-pm.mjs`) are additions. No test was weakened.

**Security.** No live secrets. `.opencode/.gitignore` excludes `node_modules`, `package.json`, `package-lock.json`. New plugin entry imports only the adapter tree (no secrets, no untrusted-input path opened). `adapter/deny-rules.json` self-patch-enforcer rule intact (`writesIntoTooling` predicate, `engine.mjs:183–188`).

**Hygiene.** No placeholder logic, no AI chatter, no hallucinated APIs or paths. Import path in `.opencode/plugin/ai-pm.mjs:13` verified to resolve to an existing file. Comments in the new files explain the *why* (the dogfood finding, the own-export rationale, the load-architecture reason) — not narrating the *what*.

**Frugality.** No duplicated rule or role body. The `adapter/README.md:46` stale sentence is a minor inaccuracy, not a duplication.

---

## Verdict summary

**Approve.** Both blockers (F1: old `.opencode/` model retired and new model installed; F2: `.golden/` removed) are closed. Quality tools are green (parity 50/50, neutral-prose pass). One non-blocking note: `adapter/README.md:46` has stale "re-export" language that should be corrected post-ship or as a fixup — it does not affect any safety guarantee or enforcement claim and does not block merge.
