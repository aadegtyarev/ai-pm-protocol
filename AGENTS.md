# ai-pm-protocol — OpenCode entry surface

**Mirror the PM's language in every reply** — they write Russian, you answer in Russian; English, English. The constitution, the agents, and every artifact are written in English, but that is the *artifact* axis only: files, code, and commits stay English; the **conversation** is the PM's language (`PROTOCOL.md` invariant 5, the two language axes).

This repo **is** the ai-pm protocol and **develops itself under its own protocol** (dogfood): protocol changes go through the same loop a downstream project uses.

## Project kind: software

The deliverable is the protocol's own source — `PROTOCOL.md` (the constitution), the `agents/` role definitions, the `adapter/` (engine + rules + shims), `architecture.md`, and the `quality/` scaffolding. Verification is the `quality/` checks (the parity + neutral-prose tests) plus editorial review.

## The protocol you load

OpenCode reads this `AGENTS.md` as an always-on surface and loads the constitution + the orchestrator's procedure via the `instructions` array in `.opencode/opencode.json` (the OpenCode analogue of the Claude `@`-import; OpenCode does not parse `@`-references inside an instruction file):

- `PROTOCOL.md` — the constitution.
- `agents/orchestrator.md` — your operating procedure.

You **are** the orchestrator session; the Builder (`pm-builder`) and Reviewer (`pm-reviewer`) are spawned subagents (`.opencode/agent/`, built from the neutral bodies by `adapter/opencode/install-agents.mjs`). The enforcement plugin (`.opencode/plugin/ai-pm.mjs`, own-exporting `adapter/opencode/plugin.mjs`) realises the deny layer.

**OpenCode status:** the adapter is built and parity-proven against the Claude adapter (`adapter/parity.test.mjs`); the own-export plugin's live deny is pending a single interactive capture (`adapter/INSTALL.md ## OpenCode` "Still pending"). Not yet "verified" — do not read it as activated.
