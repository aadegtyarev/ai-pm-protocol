# ai-pm-protocol — what it is and why

Authored product front door. Owned by `pm-architect`, validated one-pass by the PM. This is **not** the generated map — the contract → features map lives in [`product-map.md`](product-map.md) (linked from `## Features` below).

> This repo uses `doc/` (its long-standing self-convention), not the `docs/` the downstream template ships. Links below point inside `doc/`.

## Why this exists

You want to build a product — solo, or paired with an AI coding assistant — and you want it built with discipline, not vibes. The hard part of AI-driven development is not getting code written; it is keeping the code honest: matching the plan, not breaking what already worked, not silently leaving the product under-defined, not making quiet edits straight onto production.

ai-pm-protocol is a template for exactly that. You play **product manager**: you describe what you want, answer clarifying questions, make product calls at the forks, and say "ship" when a release has accumulated. You do **not** read code. A set of specialized AI agents plan the feature, write the code, check it against the plan, review it for bugs and security, and prepare the release — and a small enforcement layer makes the rules hold even across separate AI sessions that don't share memory.

It is for two audiences:

- **A PM/developer** who wants a repeatable, reviewable AI development loop instead of ad-hoc prompting.
- **A downstream project** — any codebase that adds this template as a submodule and runs its product development through the protocol, on either supported AI coding harness (Claude Code, or OpenCode in preview).

The template carries no domain assumptions: it fits a web app, a CLI, an embedded firmware project, or a pure-documentation project (SOPs, runbooks, specs) equally, because every agent reads code and docs as text — no language-specific tooling required.

## What it does today

The protocol drives a feature from idea to shipped PR through a fixed pipeline, with independent checks at each stage. The PM sees a conversation; the agents and the pipeline run underneath it.

**It does:**

- **Drives a feature through a Step 0–7 pipeline** — check git state, read project docs, plan together in plain language, decide the structural question if there is one, run a product-readiness gate on user-facing features, implement on a branch, run a two-pass review loop (plan-compliance then technical quality), optionally run the feature for real, and ship via a PR the PM merges.
- **Plans with specialized agents** — a structural architect, a stack researcher (reads the canon of a new stack component and cites rules), a coder, a plan-compliance checker, a product-readiness advocate, an auditor, and a PR-prep agent. The PM never names them; they are spawned by the orchestrator.
- **Keeps code matching the plan** — every plan scenario is verified to have both an implementation and a test before a feature passes; technical bugs, security issues, and dead code returned by review go back to the coder automatically until the review is clean. A load-bearing review stamp gates the release.
- **Protects existing behavior** — Product Contracts record, per user-facing feature, what must work and what must not break; a violation blocks the PR.
- **Closes under-specified products before coding** — an independent product advocate matches the plan against foundational product questions on user-facing features and blocks the coder handoff until each gap is answered or consciously descoped.
- **Resolves product forks two ways** — by default **interactive** (the PM answers each fork through a structured-question tool); optionally **autonomous** (the pipeline derives the answer from the bootstrap mandate and project canon, announces each decision before acting, and records it with its rationale). Merge and ship stay manual in both modes.
- **Enforces the rules across sessions** — an enforcement layer (a harness-level guard) blocks role-duplicator agents and skills that would occupy a protocol seat, blocks silent in-place edits to repo-owned files on remote systems, and blocks unsupervised force-push; read-only diagnostics and legitimate deployment are not affected.
- **Bootstraps documentation for any project** — greenfield (a short bootstrap conversation then full `doc/` set) or legacy (quick-start with `[?]` gaps, or full extraction that reads the whole codebase and reconstructs the architecture and journeys so the system can even be ported off the legacy stack).
- **Reviews and audits on a different model by default (cross-model)** — review and audit run on a different model than the session that wrote the plan and code, to catch a different set of blind spots; the review model is named at launch, and the path degrades gracefully to the session model when no other is available.
- **Develops itself under its own protocol (dogfood)** — this repo *is* the template, and changes to the protocol go through the same `/pm-*` pipeline a downstream project uses.
- **Runs on two harnesses from one source** — a single harness-neutral source generates two symmetric adapters (Claude Code and OpenCode). The shared instruction prose names every harness-specific concept with a neutral noun (the project entry file, the structured-question tool, the enforcement layer, the instruction-loading mechanism), resolved per harness through one [harness-reference table](../gen/harness-reference.md).

**It does NOT yet:**

- **Treat OpenCode as fully certified** — OpenCode is a labeled **preview**. The adapters load and the enforcement plugin is verified subagent-effective on OpenCode 1.16.2 (version-pinned — re-verify on upgrade), but several pieces are **not yet in preview**: install harness auto-detect, the bash-`find` boundary guard and the "ask"-class enforcement guards (the OpenCode enforcement primitive is throw-or-allow, with no "ask"), cross-model model pins in agent frontmatter, a protocol-owned OpenCode review/research engine (OpenCode ships no built-in equivalent), and the source/distribution repo split itself. Full OpenCode certification is a later, separate step, gated on two tracked upstream gaps.
- **Run product-behavior tests for downstream projects** — the template ships as documentation + config and has no runtime to assert against; validation is "by use" (the next feature flowing through the pipeline correctly). The one exception is the protocol's own enforcement-hook regexes, which are unit-tested in this repo.
- **Support harnesses beyond Claude Code and OpenCode** — the architecture generalizes to N adapters, but only these two are built. Cursor, Codex CLI, Aider, and similar are out of scope.

## Documents

Where to look for what, in `doc/`:

- [Architecture](architecture.md) — stack, the architectural decision records (dual-harness, harness-neutral prose, enforcement, review typology, cross-model review, decision authority), constraints, file layout, release flow.
- [User journeys](user-journeys.md) — how the protocol is actually used: drive a feature, bootstrap a project, dogfood, get enforced, resolve a fork, cross-model review.
- [Stack notes](stack-notes.md) — cited rules and idioms for the components the protocol is built on (git submodules, the harness hook/plugin APIs, jq, GitHub Actions).
- The orchestration spec itself — [`WORKFLOW.md`](../WORKFLOW.md) (thin constitution + router) and the on-demand `workflow/*.md` topic files — is the canonical source of the protocol's behavior; the journeys above reference it rather than restate it.
- [Harness-reference table](../gen/harness-reference.md) — the neutral-noun → per-harness concrete mapping (generated; do not hand-edit).

> Threat model and UI guide are intentionally absent: this project has no runtime and no untrusted input (non-security) and no graphical interface (see `architecture.md` § Security constraints and § UI guide).

## Features

Contract → features map (what each guarantee includes, which features built it, reviews): [`product-map.md`](product-map.md).
