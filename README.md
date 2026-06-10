# ai-pm-protocol

A way to build software by describing what you want. You are the product manager: you say *what* to build and *why*, approve the plan, and decide what ships — and you never read code. A small set of AI roles plans the change, builds it, reviews it independently, and ships it.

It runs inside an AI coding harness (Claude Code today; OpenCode is in progress) and **develops itself under its own protocol** — this repository is its own first project.

## How it works

The whole protocol is one short constitution you can read in one sitting: **[`PROTOCOL.md`](PROTOCOL.md)**. The essence:

**Three roles.** Eight specialised personas collapse into three, keeping the one split that matters — the reviewer is never the builder, so a maker can't wave through its own blind spots.

| Role | Does |
|---|---|
| **Orchestrator** | The running session. Talks to you, drives the loop, owns git and state. Routes every other task to a role; builds and reviews nothing itself. |
| **Builder** | Plans the change, then writes the code, docs, and tests. |
| **Reviewer** | Independently checks the built change against the plan and a tight quality / security / honesty checklist. A separate context from the Builder. |

**Five beats.** Every feature flows: **understand → plan → build → review → ship**. You approve the plan in plain language before any code; the review is a fresh, independent pass; **you merge** — shipping is always manual.

**You decide product, not code.** The orchestrator leads with user impact, frames decisions as trade-offs, asks one question at a time, and never shows you code.

## Platform-neutral by design

The protocol is **one neutral core + one thin adapter per platform**. The core (`PROTOCOL.md`, the `agents/` roles, `architecture.md`) names only abstract acts — *read a file*, *spawn a sub-agent*, *deny a write outside the project*. Each platform (Claude Code, OpenCode, the next one) is a thin **adapter** (`adapter/`) that maps those acts to its concrete tools. Adding a platform is its adapter and **zero edits to the core**.

Part of that adapter is a real **enforcement layer** — a deny layer that mechanically blocks certain tool calls (reading or writing outside the project, spawning a look-alike role into a protocol seat, merging an unreviewed change). What is mechanically enforced versus held by the prose alone is labelled honestly throughout (`PROTOCOL.md` `## Enforcement`, `architecture.md`).

## Install

Status: **Claude Code** is the active, proven harness. The **OpenCode** adapter is built and parity-proven against it (`adapter/parity.test.mjs`, 50/50); the own-export plugin's live deny is pending a single interactive capture (`adapter/INSTALL.md ## OpenCode`).

The protocol is consumed as a git submodule; the active platform's adapter is then wired — the deny hooks, the role agents, and the `PROTOCOL.md` import. The concrete, per-platform wiring lives in **[`adapter/INSTALL.md`](adapter/INSTALL.md)** — the single home for where each file lands and how each platform is hooked up. After wiring, start a fresh session so the harness loads the protocol.

## Layout

```
PROTOCOL.md        the constitution — the loop, the roles, the invariants, the honest enforcement map
agents/            the three role definitions (neutral bodies)
adapter/           the only platform-specific code:
  engine.mjs         the shared enforcement engine (one copy, every platform)
  deny-rules.json    every guard, as data
  tool-map.json      neutral act -> each platform's concrete tool
  claude/            the Claude shim, hooks, and agent assembler
  opencode/          the OpenCode shim + agent assembler (live deny pending)
  INSTALL.md         where each file lands, per platform
architecture.md    the engineer's mental model — how the pieces fit
quality/           what "green" means here (the parity + neutral-prose checks)
templates/         the lean scaffold a downstream project starts from
ai-pm.config.json  the project's choices — roles, mode, platform, kind
```

## Contributing

This repo develops itself under its own protocol — the same loop, roles, and checks it ships. Start with `PROTOCOL.md` (the rules), `architecture.md` (how it is built), and the `quality/` checks: `node adapter/parity.test.mjs` and `node quality/neutral-prose.test.mjs`.

## License

MIT — free use, including commercial. Modifications may stay closed; there is no copyleft.
