# OpenCode orchestrator-primary agent — plan

Source: PM live test of the OpenCode adapter in the `nula` downstream (2026-06-07). Observation: the OpenCode session drove Step 0 (git branch) + Step 1 (read context) but then **wrote project files itself** (`tsconfig.json`, `next.config.ts`, `npm install`) — **0 `pm-*` subagents spawned**. Root-cause diagnosis (orchestrator, confirmed against the adapter): the protocol ships only `mode: subagent` agents, so the OpenCode orchestrator is the **default `build` primary** — a generic do-it-all coder with `write`/`edit` tools, onto which the protocol rules are layered only as always-on *instructions*; with no per-prompt route reminder, a capable model just does the work itself. Continues on the local integration branch `feature/opencode-harness-support` (no remote/PR; sub-branch merged back).

> **STATUS: APPROVED — PM said "оформи и построй" (2026-06-07).** Design settled from the diagnosis; no arch note needed.

## Problem

On Claude Code the orchestrator is a **first-class identity** — `CLAUDE.md` is its system prompt ("drive the pipeline, never freehand-edit content artifacts, spawn the owning `pm-*` agent"), reinforced by a per-prompt route-reminder hook. On OpenCode that seat does **not** exist as an agent: the protocol relies on OpenCode's built-in `build` primary "behaving" per layered instructions. It does not — `build`'s built-in coder persona + its `write`/`edit` tools dominate, so the orchestrator authors content directly and the disciplined pipeline (plan → `pm-coder` → review) is bypassed. This is the central OpenCode-faithfulness gap.

## Scenarios

1. **The OpenCode adapter ships a first-class protocol orchestrator as a PRIMARY agent.** A committed `.opencode/agent/<orchestrator>.md` with `mode: primary` carries the orchestrator identity as its **system prompt** (not as layered instructions): it drives the Step 0–7 pipeline, delegates to the `pm-*` subagents via the `task` tool, surfaces product forks via the structured-question tool, and does only git + `.ai-pm` bookkeeping itself — it **never authors content artifacts** (source, `docs/`, plans, contracts).
2. **The orchestrator authors only its OWN artifacts; code + canonical docs route to the `pm-*` agents.** It **keeps `write`/`edit`** (it legitimately authors the plan during `/pm-plan` and the `.ai-pm` bookkeeping — state, backlog, contracts, decision/resolution trails — exactly as the Claude orchestrator does), but a **per-agent path-`permission`** scopes those tools: `write`/`edit` are **allowed** on `.ai-pm/**` and `doc/features/**` (plans) and **denied** on everything else (source code + canonical `doc/*.md`). The **persona is the primary enforcement** (the mode:primary identity below — "never author code/canon-docs, delegate them"); the path-permission is a **structural hint** that removes the easy authoring path against the observed failure (the default `build` primary writing `tsconfig.ts` itself). It also keeps `read`/`grep`/`glob`/`bash`/`task`/`question`/`skill`/`todowrite`. (CORRECTION, PM 2026-06-07: an earlier draft of this scenario used a blanket `write:false`/`edit:false` — that was wrong: it breaks the orchestrator's legitimate plan/bookkeeping writes, and a tool-block is not airtight anyway since `bash` bypasses it. The real enforcement is the persona, mirroring Claude; the path-permission is the proportionate nudge.)
3. **The downstream uses this orchestrator, not the default `build`.** The OpenCode install makes the shipped orchestrator the agent the PM runs (a default-agent config in `opencode.json` if OpenCode supports it, otherwise the documented `opencode --agent <name>` entry point). The `## The orchestrator seat` section of `AGENTS.md` is updated to name the shipped primary, superseding the earlier "the default `build` primary is the orchestrator" stance.
4. **The orchestrator is OpenCode-only, generated like the engines.** It is built through the harness-local generator mechanism (the same `harness_local_agents` path that ships `code-review`/`deep-research`) — Claude's orchestrator is the main session, so no agent file is generated there.

## Existing behaviors this feature touches

- **The OpenCode adapter (slices 1–9 + engines + neutral prose).** Unchanged in mechanism; this adds one primary agent + an install/AGENTS.md update.
- **The slice-4 orchestrator-seat work** (the `question`-grant on the primary): superseded/extended — the `question`/`task`/`skill` grants now belong to the **shipped** orchestrator primary; the per-subagent `question: deny` stays.
- **The enforcement plugin.** Unchanged this slice; note that a future hardening could also deny the orchestrator *bash-writing* to content-artifact paths (defense-in-depth) — out of scope here (the no-write/edit tool grant + the persona are the fix).
- **Claude self-host.** Untouched — Claude's orchestrator stays the main session; `generated-claude-adapter-byte-equivalent` must stay green (this is OpenCode-only).

## Test plan

- **Existing:** `tests/hooks.sh` 79/79; `tests/generator.sh` 4/4 (Claude byte-equivalent); `tests/opencode.sh` + plugin-unit green; `tests/neutral-prose.sh` green.
- **New:**
  - `oc-orchestrator-primary-present`: a generated `.opencode/agent/<orchestrator>.md` exists with `mode: primary` (and — guarded-skip when `opencode` absent — `opencode agent list` shows it as a primary).
  - `oc-orchestrator-write-scoped`: the orchestrator frontmatter **keeps** `write`/`edit` tools AND carries a per-agent `permission` (`edit` + `write` keys) that **allows** `.ai-pm/**` + `doc/features/**` and **denies** `**` (so it can author plans + bookkeeping but not source/canon-docs), while granting `task`/`question`/`skill`/`read`/`bash`. Verify against the live loader that the `edit`/`write` permission resolves to the allow-`.ai-pm`/`doc/features` + deny-`**` rules (OpenCode supports per-agent path-glob `permission.edit`/`permission.write` — verified 1.16.2).
  - `oc-orchestrator-self-contained`: the orchestrator agent references no `.claude/` path; its body uses the neutral vocabulary (no bare Claude primitive outside the reference table) — i.e. `tests/neutral-prose.sh` covers it.
  - `oc-orchestrator-is-default`: the install wiring (`opencode.json` default-agent key, or the documented entry point) selects the orchestrator, not `build` — asserted in whatever form the install mechanism takes.

## Docs to update

- `doc/architecture.md`: a decision record — **OpenCode orchestrator is a shipped constrained primary agent, not the default `build`** (first-class orchestrator identity + no-author tool grant = the structural mirror of the Claude orchestrator discipline). Owned by `pm-architect`, post-coding.
- `AGENTS.md` (generated): the `## The orchestrator seat` section now names the shipped primary + how to run it; the route-reminder framing stays.
- `doc/stack-notes.md`: if a default-agent `opencode.json` key is used, record it (cite the docs).

## Out of scope

- **Enforcement-plugin path-based deny of orchestrator bash-writes** — defense-in-depth follow-up; the no-write/edit tool grant + persona are this slice's fix.
- **Forcing the model to actually delegate well** — the construction makes self-authoring hard and delegation natural; it does not guarantee a weak model drives the whole pipeline flawlessly (that is model quality, tracked separately).
- **Claude side** — Claude's orchestrator is the main session; nothing changes there.

## Key design decisions

- **The persona is the fix; the path-permission is a proportionate nudge (PM, 2026-06-07).** The diagnosis showed layered instructions lose to the generic `build` persona; the core answer is a first-class `mode: primary` agent whose *identity* IS the orchestrator (drive the pipeline, delegate code/canon-docs, author only plans + bookkeeping) — exactly how `CLAUDE.md` + the route-reminder hook hold the Claude orchestrator (where edit-ownership is **persona-enforced, not tool-blocked** — the Claude orchestrator has full Write and simply doesn't author content). On OpenCode the persona is backed by a per-agent **path-`permission`** (allow `.ai-pm/**` + `doc/features/**`, deny `**`) as a structural hint — NOT a hard wall: `bash` bypasses any tool/permission restriction (the orchestrator needs `bash` for git), so airtight write-prevention would require a plugin path/actor-aware deny (the defense-in-depth follow-up). The blanket `write:false`/`edit:false` of the first draft was rejected: it broke the orchestrator's legitimate plan + bookkeeping writes and was no more airtight (bash). Persona-primary + path-hint is the proportionate construction, firmer than Claude's persona-only to compensate for a weaker model.
- **OpenCode-only, harness-local generated** (the `harness_local_agents` mechanism). Claude needs no such file.
- **Bookkeeping via bash, not the write tool.** The orchestrator legitimately writes `.ai-pm/state`, backlog, git — it does these via `bash`, keeping the `write`/`edit` tools (the content-authoring path) off the table so code/docs authoring routes to the `pm-*` agents.
- **Model assignment (PM, 2026-06-07) — the orchestrator runs on the strong PRO model; it does NOT pin.** Per the single-source `models` block (slice 9), the orchestrator is a PRIMARY → it inherits `models.session` = `deepseek/deepseek-v4-pro` (no `model:` pin), so the important driving/planning work runs on PRO — alongside the other producers (pm-architect, pm-coder, pm-codebase-reader, pm-stack-researcher, deep-research, pm-pr-prep, all unpinned → PRO). The control/review agents (code-review, pm-plan-checker, pm-auditor, pm-product-advocate) stay pinned to `models.control` = `deepseek/deepseek-v4-flash`. This is exactly the planning/architecture/coding-on-PRO, review-on-flash split the PM described; it is tunable in one place (the `models` block — e.g. a future `variant: max` for a control model, or moving a role producer↔control).
