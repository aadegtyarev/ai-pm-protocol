# opencode-live-fix — review

Independent cross-model review (claude-sonnet-4-6; the orchestrator session is on opus, so `auto` resolved to the opposite model). Branch `feature/opencode-live-fix`, base `main` = `50f5ffb` (the merged 3.0.0 redesign). Two commits: protocol resume-state-path fix + the OpenCode adapter live-fix.

## Code review: approve

First pass → **changes requested**, three findings, all fixed and confirmed resolved in a re-review:
- **F1 (blocker, fixed):** the assembled `.opencode/agents/ai-pm.md` was stale (loose `state.md`); regenerated from the fixed `agents/orchestrator.md` — now names `.ai-pm/state/current.md` + the read-first-by-path discipline.
- **F2 (blocker, fixed):** `AGENTS.md` (the opencode always-on surface) was stale and carried two honesty defects (it said OpenCode "not verified / pending" for what the commit live-verifies); rewritten — `instructions` = `PROTOCOL.md` only, procedure via `default_agent: ai-pm`, plural `.opencode/{agents,plugins}/`, inline plugin, live-verified status, resume-path note.
- **F3 (minor, fixed):** dead-path comment in `adapter/engine.mjs` removed.

Re-review confirmed all three resolved, no new defect introduced, claims match the code. Quality: parity 50/50, neutral-prose pass. The OpenCode adapter fix is additionally LIVE-verified on opencode 1.17.0 (session runs as `ai-pm`; a write into `.ai-pm/tooling/` is mechanically blocked).
