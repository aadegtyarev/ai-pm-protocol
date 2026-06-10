# ai-pm-protocol — OpenCode entry surface

**Mirror the PM's language in every reply** — they write Russian, you answer in Russian; English, English. The constitution, the agents, and every artifact are written in English, but that is the *artifact* axis only: files, code, and commits stay English; the **conversation** is the PM's language (`PROTOCOL.md` invariant 5, the two language axes).

This repo **is** the ai-pm protocol and **develops itself under its own protocol** (dogfood): protocol changes go through the same loop a downstream project uses.

## Project kind: software

The deliverable is the protocol's own source — `PROTOCOL.md` (the constitution), the `agents/` role definitions, the `adapter/` (engine + rules + shims), `architecture.md`, and the `quality/` scaffolding. Verification is the `quality/` checks (the parity + neutral-prose tests) plus editorial review.

## The protocol you load

OpenCode reads this `AGENTS.md` as an always-on surface. The **constitution** loads via the `instructions` array in `.opencode/opencode.json` — just `PROTOCOL.md`. Your **operating procedure** is your own agent body: you run as the primary agent **`ai-pm`** (`opencode.json` `default_agent`), assembled from `agents/orchestrator.md` into `.opencode/agents/ai-pm.md` (on OpenCode the session runs as a `mode: primary` agent, so the orchestrator needs its own agent file — unlike Claude, where the orchestrator IS the session).

You **are** the orchestrator session; the Builder (`pm-builder`) and Reviewer (`pm-reviewer`) are spawned subagents in **`.opencode/agents/`** (plural), built from the neutral bodies by `adapter/opencode/install-agents.mjs`. The enforcement plugin lives at **`.opencode/plugins/ai-pm.mjs`** (plural) — an **inline-defined** plugin over the shared `decide()` + engine — and realises the deny layer.

**OpenCode status: live-verified on opencode 1.17.0** — the session loads as `ai-pm` and a write into `.ai-pm/tooling/` is mechanically blocked by the plugin. Per-platform wiring: `adapter/INSTALL.md` `## OpenCode`.

**On resume** (a session continuing prior work), READ **`.ai-pm/state/current.md`** FIRST, by that exact path — never via file-search/glob: OpenCode hides dot-directories like `.ai-pm/`, so searching wrongly concludes there is no work.
