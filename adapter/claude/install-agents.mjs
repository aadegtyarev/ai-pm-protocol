// Claude realisation of the adapter's `spawn-a-sub-agent` contract point.
// Assembles each platform-neutral role body (agents/<role>.md) + the Claude per-role
// frontmatter (adapter/claude/agents/<role>.fm) into a spawnable Claude agent file
// (.claude/agents/<agentId>.md). Concatenation, NOT a generator: the neutral body
// is the single source, the .fm adds only Claude's frontmatter, and the agent id
// comes from ai-pm.config.json `roles` (its single home — name is injected, never
// duplicated in the .fm). The orchestrator is the session, not a spawned agent, so
// it has no entry here; it loads via CLAUDE.md (see INSTALL.md, load-instructions).
//
// Run from the repo root: node adapter/claude/install-agents.mjs [outDir]
//   outDir defaults to .claude/agents/ (pass a temp dir to dry-run).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SPAWNABLE = ["builder", "reviewer"];

const config = JSON.parse(fs.readFileSync(path.join(ROOT, "ai-pm.config.json"), "utf8"));
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, ".claude", "agents");
fs.mkdirSync(outDir, { recursive: true });

for (const role of SPAWNABLE) {
  const agentId = config.roles?.[role]?.agent;
  if (!agentId) throw new Error(`ai-pm.config.json roles.${role}.agent is missing`);
  const fm = fs.readFileSync(path.join(ROOT, "adapter", "claude", "agents", `${role}.fm`), "utf8").trim();
  const body = fs.readFileSync(path.join(ROOT, "agents", `${role}.md`), "utf8").trimStart();
  const out = `---\nname: ${agentId}\n${fm}\n---\n\n${body}`;
  fs.writeFileSync(path.join(outDir, `${agentId}.md`), out);
  console.log(`wrote ${path.relative(ROOT, path.join(outDir, agentId + ".md"))}  (role ${role} -> ${agentId})`);
}
