// OpenCode realisation of the adapter's load-instructions + spawn-a-sub-agent. Assembles
// each neutral role body (agents/<role>.md) + the OpenCode per-role frontmatter
// (adapter/opencode/agents/<role>.fm) into an OpenCode agent file in **.opencode/agents/**
// (PLURAL — opencode 1.17 loads `.opencode/agents/` and `.opencode/plugins/`, not the
// singular forms). Concatenation, not a generator: the neutral body is the single source
// (shared with the Claude adapter); the .fm adds only OpenCode's frontmatter (description +
// `mode` + `tools` OBJECT map, no `name` key — the filename is the agent id).
//
// UNLIKE Claude (where the orchestrator IS the session, held by CLAUDE.md), OpenCode runs
// the session as a PRIMARY agent — so here the orchestrator gets its own agent file
// (`mode: primary`, from orchestrator.fm), wired as opencode.json `default_agent`. The
// Builder and Reviewer are `mode: subagent`. The agent id comes from ai-pm.config.json
// `roles` (its single home): orchestrator→ai-pm, builder→pm-builder, reviewer→pm-reviewer.
//
// Run from the repo root: node adapter/opencode/install-agents.mjs [outDir]
//   outDir defaults to .opencode/agents/ (pass a temp dir to dry-run).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const ROLES = ["orchestrator", "builder", "reviewer"];

// Resolve a role's configured model to a CONCRETE OpenCode model id to bake into
// the assembled frontmatter, or null when none should be baked. UNLIKE Claude
// (where the orchestrator resolves the model and passes it at the spawn), OpenCode
// has no per-spawn model arg for a subagent — the model is a frontmatter key, so
// the install step is where a cross-model reviewer is realised. We bake ONLY a
// concrete pin; `auto`/`session`/absent emit NO `model:` line, so the agent
// inherits the session model — honest zero-config same-model review.
export function resolveModelPin(model) {
  if (!model) return null;                              // absent ⇒ session ⇒ no line
  if (model === "auto" || model === "session") return null; // wishes the adapter can't pin to a second model here
  if (typeof model === "string") return model;         // a bare `provider/model` pin
  if (typeof model === "object" && typeof model.opencode === "string") return model.opencode; // per-platform pin
  return null;
}

// Assemble every role agent file into outDir from the given config. Returns the
// agentId→path map written, so a test can read the result without re-deriving it.
export function install(outDir, config) {
  fs.mkdirSync(outDir, { recursive: true });
  const written = {};
  for (const role of ROLES) {
    const agentId = config.roles?.[role]?.agent;
    if (!agentId) throw new Error(`ai-pm.config.json roles.${role}.agent is missing`);
    const fm = fs.readFileSync(path.join(ROOT, "adapter", "opencode", "agents", `${role}.fm`), "utf8").trim();
    const body = fs.readFileSync(path.join(ROOT, "agents", `${role}.md`), "utf8").trimStart();
    const modelPin = resolveModelPin(config.roles?.[role]?.model);
    const modelLine = modelPin ? `model: ${modelPin}\n` : "";
    const out = `---\n${fm}\n${modelLine}---\n\n${body}`;
    const outPath = path.join(outDir, `${agentId}.md`);
    fs.writeFileSync(outPath, out);
    written[agentId] = outPath;
    console.log(`wrote ${path.relative(ROOT, outPath)}  (role ${role} -> ${agentId}${modelPin ? `, model ${modelPin}` : ""})`);
  }
  return written;
}

// Run only when invoked directly (not when imported by a test for resolveModelPin /
// install). Config path: the project's own ai-pm.config.json by default; AI_PM_CONFIG
// lets a test drive a fixture config without mutating the repo's real one.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const configPath = process.env.AI_PM_CONFIG
    ? path.resolve(process.env.AI_PM_CONFIG)
    : path.join(ROOT, "ai-pm.config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, ".opencode", "agents");
  install(outDir, config);
}
