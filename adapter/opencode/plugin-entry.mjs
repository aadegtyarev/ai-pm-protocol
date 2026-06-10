// OpenCode plugin entry — install drops THIS file (only) into .opencode/plugins/
// (PLURAL — opencode 1.17 loads `.opencode/plugins/`, not the singular form). Rewrite
// the adapter path below if the adapter is vendored somewhere other than the tooling
// submodule.
//
// It must DEFINE the plugin function inline, NOT import-and-re-expose it. Dogfooded on
// opencode 1.17.0: an own export of an imported function (`import { X as impl }; export
// const X = impl`) — like a bare re-export — LOADS without error but its
// `tool.execute.before` hook NEVER fires. opencode only registers hooks off a function
// DEFINED in the loaded module. So the thin wrapper (resolve root, resolve the actor,
// call the shared decide(), throw on deny) lives here, inline; only the rule logic
// (engine + decide) is imported, so the rules stay single-sourced. Verified live: the
// inline form blocks a write into `.ai-pm/tooling/` (the engine's self-patch deny).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../.ai-pm/tooling/adapter/engine.mjs";
import { decide } from "../../.ai-pm/tooling/adapter/opencode/normalise.mjs";

const ADAPTER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", ".ai-pm", "tooling", "adapter");

// Resolve whether the calling session is the orchestrator (no parentID, or agent id
// `ai-pm`). FAIL-OPEN to false on any lookup failure — a miss never produces a false
// denial; persona is the fail-safe (matches the engine's fail-open-on-actor contract).
async function isOrchestrator(client, sessionID) {
  try {
    if (!client || !client.session || !client.session.get || !sessionID) return false;
    const res = await client.session.get({ path: { id: sessionID } });
    const data = (res && res.data) || {};
    if (data.agent === "ai-pm") return true;
    return data.parentID == null;
  } catch (_e) { return false; }
}

export const AiPmEnforcement = async (ctx) => {
  const root = (ctx && (ctx.directory || ctx.worktree)) || process.cwd();
  const config = loadConfig(ADAPTER);
  return {
    "tool.execute.before": async (input, output) => {
      const isOrch = await isOrchestrator(ctx && ctx.client, input && input.sessionID);
      const r = decide(input && input.tool, (output && output.args) || {}, root, isOrch, config);
      if (r.verdict === "deny") throw new Error("[ai-pm] " + r.reason);
    },
  };
};
