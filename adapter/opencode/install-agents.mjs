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

const config = JSON.parse(fs.readFileSync(path.join(ROOT, "ai-pm.config.json"), "utf8"));
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, ".opencode", "agents");
fs.mkdirSync(outDir, { recursive: true });

for (const role of ROLES) {
  const agentId = config.roles?.[role]?.agent;
  if (!agentId) throw new Error(`ai-pm.config.json roles.${role}.agent is missing`);
  const fm = fs.readFileSync(path.join(ROOT, "adapter", "opencode", "agents", `${role}.fm`), "utf8").trim();
  const body = fs.readFileSync(path.join(ROOT, "agents", `${role}.md`), "utf8").trimStart();
  const out = `---\n${fm}\n---\n\n${body}`;
  fs.writeFileSync(path.join(outDir, `${agentId}.md`), out);
  console.log(`wrote ${path.relative(ROOT, path.join(outDir, agentId + ".md"))}  (role ${role} -> ${agentId})`);
}
