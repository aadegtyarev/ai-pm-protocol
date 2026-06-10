# Execution State

> Resume pointer — READ FIRST, by this exact path. Deferred detail: `.ai-pm/backlog.md`. History: commits + CHANGELOG.

**Status (2026-06-11, END OF SESSION — STOPPED by the Operator, resume tomorrow). `main` = `c89a5b0` (4.0.2).** The autonomous post-restructure queue was running; stopped mid-flight.

## ⚠️ IN-FLIGHT — resume HERE first (do not lose the WIP)
**`PROTOCOL.md` instructions-only rewrite — BUILT but UNREVIEWED — committed on local branch `feature/protocol-de-water` (`cc239d8`).** It is NOT pushed (the merge-gate blocks an unstamped feature push) and NOT on `main` (main's `PROTOCOL.md` is still the watery original). The prior de-water pass was LOST uncommitted — this one is committed on the branch so it survives.
**Resume:** `git checkout feature/protocol-de-water` → respawn a FRESH Reviewer against the diff (verify NO instruction/rule lost + readability) → ship. (3854→3241 words; cut preamble + manifesto rhetoric + section-intro prose; broke inline pseudo-lists + crammed walls into real Markdown lists; Builder claims every invariant/contract/beat/enforcement-row/config-field survives; parity 55 + neutral-prose green.)

## The principle the Operator hammered (the lens for the whole queue)
**`PROTOCOL.md` and EVERY doc are INSTRUCTIONS, human-readable — NOT prose.** Cut water/rhetoric; real Markdown lists, short blocks, no walls. And: **every failure the Operator catches by hand must become a protocol mechanism that catches it** — acceptance test: *it fires WITHOUT the Operator's vigilance.* Right now the Operator is the workhorse catching the readability/quality sins; the queue exists to end that.

## Queue for tomorrow, IN ORDER (detail in `.ai-pm/backlog.md`)
1. **Finish the `PROTOCOL.md` rewrite** — review + ship the WIP above.
2. **Systemic readability sweep** — `src/agents/{orchestrator,builder,reviewer}.md`, `docs/architecture.md`, `src/adapter/INSTALL.md` have the SAME disease (water, walls, broken lists — Operator: "orchestrator.md нечитаемо, стыдно"). Same instructions-only/readable treatment, each its own reviewed change.
3. **Doc + code-quality MECHANISMS** (so the protocol catches it, not the Operator): **eslint** (JS — meaningful names, no `ab`/`bc`, readable functions) + **markdownlint** (broken Markdown / walls) as build-beat tools; fold a **doc-quality dimension into the Reviewer** (brevity · structure · human-readability · format tidiness — NOT a new role; Operator's preference) + sharpen its code dimension; comment-discipline (invariant 6 on code) + de-bloat the over-commented adapters. *Proportionate — catch real cruft, don't strangle with style.*
4. **`audit` realized** — a proactive health-check the protocol runs itself.
5. **`research`** — a doing side-tool (not a module).
6. **Resume product-advocate** (`.ai-pm/plans/product-advocate.md`).
7. **`install.mjs`** (unified installer) — enables a real-downstream rollout. The Operator wants the protocol installed into `/home/adegtyarev/Develop/Hobby/ad-md-editor/`; this session CAN'T (out-of-root — the deny boundary blocks it, correct behaviour). Needs the unified installer, or a session rooted in that project.

## Direction (compass: `docs/decisions/direction.md`)
The protocol as a product-creation engine; four pillars, all as side-tools/config/modules, never core bloat. The constructor is real (modules = fragments → assembled agents, `src/modules/registry.json`, two guards: assemble-up-from-a-floor + defaults-over-toggles). Shipped this session: **3.0.0 → 4.0.2** (minimal core · setup live-verified on opencode · configurable rigor · module constructor + threat-model · the `docs/`+`src/` restructure + retention discipline · `/pm-setup`).

**Conventions:** Russian chat; English artifacts; the human is the **Operator**; `interactive` mode (merge/ship manual). THIS repo: `kind: software`, `profile: full`, `threat-model: rich`. Gates: `src/quality/tools.json`. **Remotes:** `uni` (`aadegtyarev/ai-pm-protocol-uni`) is the live fork — local `main` tracks it; public `origin` is OLD. **Branches pending cleanup:** `backup-2026-06-10` + stale `feature/opencode-harness-support--*` — but KEEP `feature/protocol-de-water` until its WIP ships.
