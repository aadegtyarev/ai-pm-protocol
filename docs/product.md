# Product brief

> The one home for **what this project is and why** — filled at onboarding (the orchestrator's `## Product discovery`), before the first feature. Every feature grounds in it: the loop's Understand beat reads it, and each feature's product questions check the change against it. Keep it current; it is not a one-time throwaway.
>
> **How it is filled — gather first, conclude last.** Discovery walks these sections as a plain dialog (the structured-question tool, a different kind of inquiry each round), recording what the Operator gives and marking the rest `[?]` — never grading whether an answer is "good" (the Operator owns meaning). The spine (§3–§6) is the concrete **zero-to-working story** a non-expert can actually answer; the hard conclusions (§7) come at the END, on top of what was gathered. Grounded in the established discovery frameworks (Working Backwards, Lean Canvas, Cagan, Torres). A number not yet fixed is `[?]` — never invented; plain product language.

## 0. The idea — what is this product?

A protocol for developing software and/or documentation with the help of AI.

> The anchor for everything below; every question reasons around it.

## 1. Customer — who exactly?

A spectrum, not one persona — from a **non-technical product person** (PM, founder, domain expert) to a **technical lead / developer**. The protocol's **modularity** serves the whole range as one product, not separate ones — and it is **a few preset usage scenarios, not a pile of toggles**: a scenario varies the **output detail** (show the diff before or after review, or hide it), the **depth of questions**, and **how much the AI auto-decides vs surfaces**. For a PM: lean on product questions and **backstop the technical part automatically** from a few key milestones. For a tech-lead: surface the diff and the technical design to inspect.

The scenario dial is **two-dimensional — [who] × [speed↔quality]:**

- **Prototype mode** — move fast, verify the hypothesis first; the AI auto-fills more, cuts research and review depth, accepts conscious tech debt (tracked in `.ai-pm/backlog.md`, not hidden). The floor holds: code works, review happens at appropriate depth, debt is visible.
- **Quality mode** — trade speed for no-rewrites; full research before code, independent deep review, plan-first; the change is right and works before it ships.

Same person, different mode depending on where they are in the product lifecycle. The **floor** holds in every scenario — not just the quality end. One universal promise; a low-cardinality scenario dial.

## 2. Problem — from their point of view

Five pains, all in play — from the user's own point of view:

- **Trust / quality** — AI builds fast, but the output can't be trusted: no discipline, no review, no gates; it hallucinates, breaks working code, smuggles in junk. They need quality guarantees.
- **Access / the code barrier** — without a programmer (or a whole team) software/docs can't be built at all; the "you must read code / keep engineers" barrier cuts a non-technical person off from the result.
- **Process chaos** — AI development is ad-hoc: every session starts over, no repeatable plan→build→review→ship loop, no memory/state. The outcome is unpredictable.
- **Control / oversight** — what the AI decides and does is neither visible nor steerable; there are no points where the human decides, and no boundaries the AI will not cross.
- **No speed/quality dial** — it's ceremony or chaos: a full process slows prototype work; vibe-coding has no floor. There is no explicit way to say *"prototype mode: move fast, take tracked debt, verify hypothesis first"* and still get a working result. You choose between discipline and speed instead of consciously trading one for the other.

## 3. Discovery & onboarding — zero to working

**How a new user finds out it exists (distribution):** two channels — **organic / GitHub** (open repo, README, word-of-mouth in the dev community; the current de-facto, minimal) and a **plugin marketplace** (the platform's plugin registry — Claude Code / OpenCode — where a user finds and installs it). Content/teaching is not a channel we are betting on for now.

**First steps from nothing to working (onboarding):** install the protocol (git submodule + wire the active platform's adapter) → start a fresh session, which loads as the orchestrator → `/pm-setup` (the plain-language config dialog) → product discovery (this brief) → the build loop. (Drafted from the current product — confirm or correct.)

## 4. Continuity & recovery

- **Across sessions and machines:** state carries through the resume pointer (`.ai-pm/state/current.md`) plus git — a fresh session reads the pointer to continue prior work; any machine with the repo continues.
- **Crash recovery:** a session that dies mid-loop recovers from the same resume pointer and git history.
- **Lost access / keys:** N/A — no accounts, no keys.
- **Multi-party:** single-Operator by design. Several people = several copies/branches coordinated by ordinary git — not the protocol's concern.

## 5. Competition / the incumbent

> Drafted from research (`research` side-tool) — to confirm/correct with the Operator.

**What the user reaches for today:**

- **Structured / spec-driven AI-dev frameworks** — the closest competitors, same shape: **BMAD-Method** (≈21 specialized agents, 50+ workflows, roles for analysis/planning/dev/review, "stop vibe coding", spec-first), **GitHub Spec Kit**, **GSD**, agent loops (Ralph, Codex). They bring discipline and roles to AI coding.
- **No-code AI app builders** (the access end) — **Lovable**, **bolt.new**, **v0**, **Base44**, **Softr**, **Bubble**: describe an app in plain English, get a working full-stack app. They remove the code barrier for non-coders.
- **Doing nothing structured** — raw AI coding in Cursor / Claude Code / Aider with no protocol ("vibe coding").

**How this is meaningfully different — an explicit speed↔quality dial with a guaranteed floor:**

- **Prototype mode** (solo/lite profile): verify the hypothesis fast — the AI auto-fills more, cuts research and review depth, accepts conscious tech debt (tracked in `.ai-pm/backlog.md`, not a hidden mess). Code still works. Review still happens at appropriate depth. Floor holds.
- **Quality mode** (full profile): trade speed for no-rewrites — full research before code, independent review, plan-first; the change is right and works before it ships.

The dial is **explicit and conscious**: you choose the mode; the floor holds in both. The two expensive rework loops are cut at every dial position:

- **"built but broken"** — killed by quality gates + independent review (depth varies by mode, but it runs).
- **"built but wrong"** — killed by plan-first + product discovery + Operator approval (ceremony varies by mode, but the plan precedes code).

Competitors don't offer this matrix:

- **BMAD / Spec-Kit** — ceremony-or-nothing (no prototype mode; a light session drops the whole process).
- **Vibe-coding** — no floor at any speed; the "built but broken" and "built but wrong" loops appear.
- **No-code builders** (Lovable, bolt.new) — fast-only; no dial toward quality.

Three lean roles vs BMAD's ≈21 agents, a mechanical deny layer (not prose-only discipline like BMAD / Spec-Kit), operator-first language — these are the *how*. The guarantee: less thrash, more shipped-and-right, at the speed you consciously chose.

## 6. Viability — who runs and funds it

**Pure open-source.** MIT — free forever, including commercial use, no monetization. Self-hosted: it runs inside the user's own AI coding harness, with no service to operate. The user's only cost is their own model tokens. Maintained on the author's enthusiasm — a hobby project (bus-factor 1).

## 7. The case against *(the conclusion — at the end)*

> Synthesised from the gathered brief above — the honest reasons this could fail, for the Operator to weigh.

- **"For everyone" is sound — modularity here is a few preset scenarios, not a config-tax (§1).** The core promise (stable result, fewer rework loops) is user-agnostic, so one product serves the PM↔tech-lead spectrum by varying output detail / question depth / how much it auto-decides — picked as a scenario, not wrangled as toggles (the git / VS Code case: universal core, low-cardinality surface). The one real residual is the **autonomy dial**: the lighter the scenario (a PM where the AI auto-fills from a few milestones), the harder it leans on the AI's product judgment being right — and the PM is least able to catch a wrong call. So the lighter the scenario, the more the core "built-but-wrong" guarantee must hold unsupervised — a design constraint on the light scenarios (they need stronger automatic product-discovery/review), not a reason against serving everyone. The softer external risk: a "for everyone" *pitch* can feel "for no one" vs specialists — mitigated by leading with the universal value, not the audience list.
- **Crowded, funded competition + mindshare (§5).** BMAD (large community), Spec Kit (GitHub/Microsoft), and VC-funded no-code builders own the attention; a lean solo-hobby OSS protocol competes against funded ecosystems and "good-enough" vibe-coding.
- **No distribution engine (§3).** Discovery is essentially "find it on GitHub" plus a hoped-for marketplace listing — a great product nobody finds.
- **Pure-OSS, bus-factor 1 (§6).** No funding, runs on author enthusiasm; if the author stops, it dies — hard to sustain against funded rivals.
- **Single-Operator ceiling (§4).** No team / multi-party support caps it out of the team/enterprise space where durable usage and money live.
- **The promise must actually hold (§5).** "Stable result, fewer rework loops" is real only if the enforcement genuinely delivers — and much of it is `[persona]`-held, not mechanical. If the stability does not materialise, it is just another spec framework.
- **Wrong for:** someone who wants a one-click app (Lovable is faster/simpler); a senior dev who finds the ceremony heavier than just coding in Cursor; a team (no multi-party).
