// OpenCode adapter — the plugin entry. The SINGLE export (OpenCode treats every
// export of a registered plugin module as a plugin function, so there must be
// exactly one). All the logic lives elsewhere: the shared engine (../engine.mjs)
// holds the predicates, ../deny-rules.json the rules, ./normalise.mjs the
// OpenCode input-normaliser + decide() path. This file only: resolves the root,
// resolves the actor (async), calls decide(), and throws on a deny verdict.
//
// Only deny is handled here, on purpose: OpenCode has no ask-return (ask → persona)
// and no prompt hook (inject is always-on). Class support: tool-map.json `class_support`.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../engine.mjs";
import { decide } from "./normalise.mjs";

const ADAPTER_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Resolve whether the calling session is the ORCHESTRATOR (primary). The
// orchestrator has no parentID (top-level) or agent id `ai-pm`; a task-spawned
// subagent has parentID set. FAIL-OPEN: any lookup failure returns false (treat
// as a subagent) so a miss never produces a false denial — persona is the
// fail-safe, matching the engine's fail-open-on-actor contract.
async function isOrchestratorSession(client, sessionID) {
  try {
    if (!client || !client.session || typeof client.session.get !== "function") return false;
    if (typeof sessionID !== "string" || sessionID.length === 0) return false;
    const res = await client.session.get({ path: { id: sessionID } });
    const data = (res && res.data) || {};
    if (data.agent === "ai-pm") return true;
    return data.parentID === undefined || data.parentID === null;
  } catch (_e) {
    return false;
  }
}

export const AiPmEnforcement = async (ctx) => {
  const root = (ctx && (ctx.directory || ctx.worktree)) || process.cwd();
  const client = ctx && ctx.client;
  const config = loadConfig(ADAPTER_DIR);

  return {
    "tool.execute.before": async (input, output) => {
      const tool = input && input.tool;
      const args = (output && output.args) || {};
      const isOrchestrator = await isOrchestratorSession(client, input && input.sessionID);
      const result = decide(tool, args, root, isOrchestrator, config);
      if (result.verdict === "deny") {
        throw new Error("[ai-pm] " + result.reason);
      }
      // ask / inject / allow → no throw (ask falls back to persona on OpenCode).
    },
  };
};
