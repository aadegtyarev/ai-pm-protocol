# Installing the adapter into a downstream project

The single home for **where each file lands and how each platform is wired**. The adapter is one shared core (`engine.mjs`, `deny-rules.json`, `tool-map.json`) plus the two platform shims; install ships the whole `adapter/` tree to one place the project can reach, then wires the active platform to its shim.

Convention used below: the adapter ships inside the protocol's tooling submodule at `.ai-pm/tooling/adapter/`. A project that vendors the adapter elsewhere rewrites the one path in each wiring step — nothing else changes.

## Claude Code

Merge this into the project's `.claude/settings.json` (the fragment lives at `claude/hooks.json`). One `PreToolUse` hook and one `UserPromptSubmit` hook, both piping the harness payload to `node claude/shim.mjs`; the shim self-locates `deny-rules.json` (two dirs up) and prints the verdict JSON.

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Read|Write|Edit|Bash|Task|Skill",
        "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.ai-pm/tooling/adapter/claude/shim.mjs\"" }] }
    ],
    "UserPromptSubmit": [
      { "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.ai-pm/tooling/adapter/claude/shim.mjs\"" }] }
    ]
  }
}
```

That replaces the whole inline shell+jq hook set — every guard now reads the one shared engine.

### Load instructions (the orchestrator session)

`CLAUDE.md` imports the constitution and the orchestrator's procedure — that is all the running session loads as the protocol (plus the project's own kind + language lines):

```
@PROTOCOL.md
@agents/orchestrator.md
```

The orchestrator **is** the session; the Builder and Reviewer are spawned (below).

### Spawn a sub-agent (the Builder and Reviewer)

The two spawnable roles are assembled into Claude agent files by **`node adapter/claude/install-agents.mjs`**. It reads each neutral role body (`agents/<role>.md`) + the Claude frontmatter (`adapter/claude/agents/<role>.fm`) and writes `.claude/agents/<agentId>.md`, taking the **agent id from `ai-pm.config.json` `roles`** (so `builder` → `pm-builder`, `reviewer` → `pm-reviewer`). It is concatenation, not a generator — the neutral body stays the single source. Re-run it whenever a role body, its frontmatter, or the config binding changes. The orchestrator spawns each by that id, on the model `ai-pm.config.json` resolves.

## OpenCode

OpenCode auto-loads **every** file in `.opencode/plugin/` as a plugin, and a non-function export there crashes the load. So the adapter's importable files must stay **out** of that directory. Install drops one tiny entry — `opencode/plugin-entry.mjs` — into `.opencode/plugin/`; it imports the real plugin from the adapter tree (where `engine.mjs` / `normalise.mjs` sit unscanned) and re-exposes it as its own export:

```
.opencode/plugin/ai-pm.mjs                 ← the entry (the ONLY file here)
.ai-pm/tooling/adapter/opencode/plugin.mjs ← the real plugin (imports engine + normalise)
.ai-pm/tooling/adapter/engine.mjs          ← shared, never in the plugin dir
```

OpenCode auto-loads `.opencode/plugin/`, so the entry needs no registration in `opencode.json`.

### Load instructions (the orchestrator session)

The orchestrator **is** the session. `opencode.json` `instructions` loads the constitution + the orchestrator's procedure — the OpenCode analogue of the Claude `@`-import (OpenCode does not parse `@`-references inside an instruction file):

```json
{
  "instructions": ["PROTOCOL.md", "agents/orchestrator.md"],
  "permission": { "question": "allow" },
  "agent": { "build": { "disable": true }, "plan": { "disable": true } }
}
```

The generic `build`/`plan` primaries are disabled so none can fill the orchestrator seat (invariant 1); `AGENTS.md` (repo root) is OpenCode's always-on surface and points at the same constitution. The Builder and Reviewer are spawned (below).

### Spawn a sub-agent (the Builder and Reviewer)

The two spawnable roles are assembled into OpenCode agent files by **`node adapter/opencode/install-agents.mjs`** — the mirror of the Claude assembler. It reads each neutral role body (`agents/<role>.md`) + the OpenCode frontmatter (`adapter/opencode/agents/<role>.fm`) and writes `.opencode/agent/<agentId>.md`, taking the **agent id from `ai-pm.config.json` `roles`** (so `builder` → `pm-builder`, `reviewer` → `pm-reviewer`; on OpenCode the filename *is* the agent id, so the frontmatter carries no `name` key). Concatenation, not a generator — the neutral body stays the single source, shared with the Claude adapter. Re-run it whenever a role body, its frontmatter, or the config binding changes.

**Own export, not a re-export — dogfooded on opencode 1.17.0.** A re-export (`export { AiPmEnforcement } from "..."`) LOADS without error but its `tool.execute.before` hook **never fires** — verified live (a write into `.ai-pm/tooling/`, which the engine must deny, sailed through under a re-export entry). The entry therefore imports the impl and re-exposes it as a fresh own export (`import { AiPmEnforcement as impl } from "..."; export const AiPmEnforcement = impl;`), which does register and fire (the same write triggers the deny). Transitive imports from outside the plugin dir resolve fine — that part of the original assumption held.

**Still pending (a clean live confirmation):** the own-export's enforcement was inferred from behaviour (a deny-triggering call sends opencode into an LLM retry-loop that times out the headless `opencode run`, where a clean allow completes immediately) rather than from a captured deny message — `opencode run` is flaky at surfacing a plugin throw headlessly. Confirm with a single captured deny in an interactive session before treating OpenCode as activated. The fallback, if the own export ever regresses, is a self-contained bundled plugin (one file, but it reintroduces a second engine copy the parity guard must then cover).
