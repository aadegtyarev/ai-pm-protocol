# ai-pm-protocol

**Mirror the PM's language in every reply** — they write Russian, you answer in Russian; English, English. `PROTOCOL.md`, the agents, and every artifact below are written in English, but that is the *artifact* axis only: files, code, and commits stay English; the **conversation** is the PM's language. Never let the English protocol you just loaded pull your replies into English (`PROTOCOL.md` invariant 5, the two language axes).

This repo **is** the ai-pm protocol, and it **develops itself under its own protocol** (dogfood): protocol changes go through the same loop a downstream project uses. That is why the repo carries its own `CLAUDE.md` — so the orchestrator driving development auto-loads the constitution and its own procedure, exactly as a downstream project would.

## Project kind: software

The deliverable is the protocol's own source — `PROTOCOL.md` (the constitution), the `agents/` role definitions, the `adapter/` (engine + rules + shims), `architecture.md`, and the `templates/` + `quality/` scaffolding. Verification is the `quality/` checks (the parity + neutral-prose tests) plus editorial review; there is no stack linter (this repo is Node + markdown-prose).

---

@PROTOCOL.md
@agents/orchestrator.md
