// OpenCode realisation of the adapter's `spawn-a-sub-agent` contract point — the
// mirror of adapter/claude/install-agents.mjs. Assembles each platform-neutral
// role body (agents/<role>.md) + the OpenCode per-role frontmatter
// (adapter/opencode/agents/<role>.fm) into a spawnable OpenCode agent file
// (.opencode/agent/<agentId>.md). Concatenation, NOT a generator: the neutral body
// is the single source (shared with the Claude adapter), the .fm adds only
// OpenCode's frontmatter shape (description + mode + tools OBJECT map, per
// https://opencode.ai/docs/agents/ — no `name` key, the filename is the agent id).
// The agent id comes from ai-pm.config.json `roles` (its single home). The
// orchestrator is the session, not a spawned agent, so it has no entry here; it
// loads via opencode.json `instructions` (see INSTALL.md, OpenCode load-instructions).
//
// Run from the repo root: node adapter/opencode/install-agents.mjs [outDir]
//   outDir defaults to .opencode/agent/ (pass a temp dir to dry-run).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SPAWNABLE = ["builder", "reviewer"];

const config = JSON.parse(fs.readFileSync(path.join(ROOT, "ai-pm.config.json"), "utf8"));
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, ".opencode", "agent");
fs.mkdirSync(outDir, { recursive: true });

for (const role of SPAWNABLE) {
  const agentId = config.roles?.[role]?.agent;
  if (!agentId) throw new Error(`ai-pm.config.json roles.${role}.agent is missing`);
  const fm = fs.readFileSync(path.join(ROOT, "adapter", "opencode", "agents", `${role}.fm`), "utf8").trim();
  const body = fs.readFileSync(path.join(ROOT, "agents", `${role}.md`), "utf8").trimStart();
  const out = `---\n${fm}\n---\n\n${body}`;
  fs.writeFileSync(path.join(outDir, `${agentId}.md`), out);
  console.log(`wrote ${path.relative(ROOT, path.join(outDir, agentId + ".md"))}  (role ${role} -> ${agentId})`);
}
