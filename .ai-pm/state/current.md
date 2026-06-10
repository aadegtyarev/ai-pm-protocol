# Execution State

> Resume pointer — lean by design (a pointer, **not** a log). On resume READ THIS FIRST, by this exact path. Deferred work lives in `.ai-pm/backlog.md`; full history in the commit log + CHANGELOG. Keep this file short.

**Status (2026-06-11): no active feature. Working tree clean, `main` = `uni/main` = `55eac26` (4.0.1).** The repo now dogfoods the structure it gives downstream — **`docs/`** (architecture, contracts, decisions) + **`src/`** (adapter, agents, quality, modules, templates) + a root of entries (PROTOCOL.md, README, CHANGELOG, LICENSE, AGENTS.md, CLAUDE.md) + project config (`ai-pm.config.json`). **NEXT: the post-restructure queue — see `.ai-pm/backlog.md`.**

## Active direction — the protocol as a product-creation engine

Compass: **`docs/decisions/direction.md`** (the four pillars + the architecture & **mechanism principles** — read it; minimal-shape rationale in `docs/decisions/minimal-core.md`). The protocol is a development *engine*; products on it are arbitrary. Everything grows as **side-tools / config / modules — NEVER core bloat** (`PROTOCOL.md` one-sitting), under the whole-surface no-dup guard.

**The constructor is real:** capabilities are **toggleable modules** — per-module fragments (`src/modules/<id>/<role>.md`) composed into **assembled** role agents (floor body + enabled fragments), catalogued in `src/modules/registry.json`, offered by `setup`. Two guards: **assemble UP from a floor** (the overall floor — independent review · honesty · merge-stamp · Operator merges — never a toggle; malformed/unknown ⇒ fail-safe ON) and **defaults over toggles**. The acceptance test for the whole direction (in the compass): **a mechanism counts only if it fires WITHOUT the Operator's vigilance** — until then the Operator is the workhorse, which is the failure to fix.

Pillar status:
- **Configurable rigor — SHIPPED (3.3.0).** `profile: full|lite|solo`; floor never cuttable; fail-safe to `full`.
- **The module constructor + threat-model — COMPLETE (3.4.0/3.4.1).** Constructor infra + the real threat enumeration with the `depth` toggle; deepens the always-on Reviewer security floor (`[persona]`).
- **Product-advocate — PAUSED, plan ready** (`.ai-pm/plans/product-advocate.md`): a module that fires the uncomfortable product questions at plan time (toggle by kind · recorded-skip · honesty-floor · depth light↔rich). Resume after the queue.
- **Product discovery / research, relentless discipline** — queued (below).

## Post-restructure queue (the NEXT work — details in `.ai-pm/backlog.md`)
`pm-setup` command rename (namespace, don't mimic a built-in) · **code-quality** (eslint + comment-discipline per invariant 6 + sharpen the Reviewer's code dimension — the adapter code is over-commented / has weak names) · **`audit` realized** as a proactive health-check the protocol runs itself · **research** as a doing side-tool (not a module) · resume product-advocate. All under the acceptance test above (the protocol should catch these, not the Operator).

## Shipped to `uni/main`
3.0.0 → 4.0.1 across this session (minimal core · setup feature live-verified on opencode · configurable rigor · the module constructor + threat-model · the docs/+src/ restructure + retention discipline). Full log: CHANGELOG.

**Conventions:** conversation = Russian; artifacts/commits = English; the human role is the **Operator**. Decision authority = `interactive` (`ai-pm.config.json` `mode`); merge/ship manual (Operator authorizes — granted blanket for the mechanical restructure). THIS repo: `kind: software`, `profile: full`, `threat-model` enabled (`rich`). Gates in `src/quality/tools.json`.

**Remotes:** `uni` (`aadegtyarev/ai-pm-protocol-uni`) is the live fork — local `main` tracks it. `origin` (public) `main` is OLD (pre-redesign); public sync deferred. **Local branch cleanup pending:** `backup-2026-06-10` + stale `feature/opencode-harness-support--*` slices.
