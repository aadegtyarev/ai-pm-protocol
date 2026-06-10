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

**OpenCode loads plugins from `.opencode/plugins/` and agents from `.opencode/agents/` — PLURAL.** Dogfooded on opencode 1.17.0: the singular forms (`.opencode/plugin/`, `.opencode/agent/`) are **not** loaded, so nothing in them takes effect.

### Enforce a deny (the plugin)

Install drops one entry — `opencode/plugin-entry.mjs` — into `.opencode/plugins/`. It must **DEFINE** the plugin function inline, NOT import-and-re-expose it: opencode 1.17 does not register `tool.execute.before` off an imported/re-exported binding (verified live — a write into `.ai-pm/tooling/` sailed through an own-export entry, and is blocked by an inline-defined one). So the thin wrapper — resolve root, resolve the actor, call `decide`, throw on deny — is **inline in the entry**; only the rule logic (`decide` + the engine) is imported from the adapter tree, which sits outside the scanned plugin dir. The rules stay single-sourced. No registration in `opencode.json` is needed.

### Load instructions + the orchestrator personality

UNLIKE Claude (where the orchestrator IS the session, held by `CLAUDE.md`), an OpenCode session runs as a **primary agent** — so the orchestrator is its own primary agent: `default_agent` points at it, and the shared constitution loads via `instructions`:

```json
{
  "default_agent": "ai-pm",
  "instructions": ["PROTOCOL.md"],
  "permission": { "question": "allow" },
  "agent": { "build": { "disable": true }, "plan": { "disable": true } }
}
```

The generic `build`/`plan` primaries are disabled so none can fill the orchestrator seat (invariant 1); `AGENTS.md` (repo root) is OpenCode's always-on surface and points at the same constitution.

### Spawn a sub-agent (and assemble the orchestrator)

`node adapter/opencode/install-agents.mjs` assembles the three role agents into `.opencode/agents/`: each neutral role body (`agents/<role>.md`) + its OpenCode frontmatter (`adapter/opencode/agents/<role>.fm`) → `.opencode/agents/<agentId>.md` (agent id from `ai-pm.config.json` `roles`: orchestrator → `ai-pm` with `mode: primary`; builder → `pm-builder`, reviewer → `pm-reviewer` with `mode: subagent`). On OpenCode the filename *is* the agent id, so the frontmatter carries no `name` key. Concatenation, not a generator — the neutral body stays the single source, shared with the Claude adapter. Re-run it whenever a role body, its frontmatter, or the config binding changes.

**Live-verified on opencode 1.17.0:** the session runs as `ai-pm` (the personality loads) and a write into `.ai-pm/tooling/` is mechanically blocked by the plugin (the engine's self-patch deny). The three bugs the live dogfood caught — singular vs plural dirs, the missing primary orchestrator agent, and the inline-vs-imported plugin function — are fixed here.
