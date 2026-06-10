# Minimal AI-PM — greenfield design proposal

> Status: **proposal for the PM to tear apart.** No code touched. The target: a protocol a human holds in their head — ~10 short files — that keeps the reliability the current one bought with ~2,200 lines of rules + persona prose.

## The problem, in numbers

| Surface | Now |
|---|---|
| Constitution (`WORKFLOW.md` + 16 `workflow/*.md`) | **991 lines, 17 files** |
| Agent personas (8) | **1,219 lines** |
| Commands (5), templates (10), enforcement (hooks 508 + plugin 749), generator (349) | + much more |

A person cannot hold this. Every session this year added a rule because something broke — and each fix was *correct*, but the sum is past human capacity. Trimming words (frugality, plain-language, honesty) was edge-work. The disease is **structural surface**.

## The one test, and the rule of the cut

**The test:** a tech-PM reads the whole protocol in one sitting and holds its shape.

**The rule of the cut (non-negotiable):** the complexity is not noise — most of it prevents a real failure (corner-cutting, boundary breach, slop, lost context). So we do **not** "delete to shrink." Every cut names *the failure it prevented* and either (a) keeps that failure out by a **cheaper mechanism** (a mechanical deny instead of a paragraph; one sharp invariant instead of five overlapping ones; killing a duplicate), or (b) **consciously accepts the risk**, written down. A cut that silently re-opens a failure is forbidden.

## Design principles (the few)

1. **Human-holds-it** — small enough to read whole. This is the master constraint; it kills most machinery by itself (see below).
2. **One home per fact** — zero duplication. (We spent this whole session fixing drift from re-encoded rules.)
3. **Mechanical floor over prose** — a rule worth enforcing becomes a hook/plugin deny; prose-only rules are admitted as `[persona]`, never dressed as `[mechanical]`.
4. **Reader-goal-first docs** — every doc leads with what its reader came to do, not a chronicle.
5. **Fewer, sharper** — collapse N overlapping rules/roles/checks into one.
6. **Environment-agnostic core — DNA, not a feature.** The brain — loop, roles, invariants, rules — is **platform-neutral**. Each environment (Claude Code, OpenCode, the next one) is a **thin adapter** that realizes the neutral core's contract. **Adding a platform = hours**: pick the platform's mechanism for each contract point, ship the adapter, leave the core untouched. Both Claude Code and OpenCode are first-class from day one — designed from scratch, not one ported onto the other.

## The minimal file map (~10)

| File | Job | Budget |
|---|---|---|
| `README.md` | front door: what it is, install | ≤100 lines |
| `PROTOCOL.md` | **the constitution**: the loop + the ~6 hard invariants + the role model + the enforcement map. Replaces WORKFLOW + all 16 `workflow/*.md`. | ≤~300 lines |
| `agents/` | the role definitions — **3 roles**, compact | ≤~80 lines each |
| `enforcement` (hooks / plugin config) | the mechanical floor (the deny-list) | as small as the deny-list is |
| `architecture.md` | the system's mental model (the rebuilt form) | the exemplar |
| `state.md` | resume pointer | ≤1 screen |
| `backlog.md` | deferred work | — |
| `contracts.md` | **one** file, all product promises, short | — |
| `templates/` | the lean downstream scaffold set | — |
| `CHANGELOG.md` / `MIGRATIONS` | release + the rare bump note | — |

## The loop (replaces Step 0–7 + the command essays)

```
understand → plan (PM approves) → build → review (independent) → ship
```
Five beats. `fixup` = the loop with plan+review collapsed for a trivial change. `research`/`audit` = side-tools, not 200-line command files. The loop is described once in `PROTOCOL.md`; there are no per-command essays.

## Roles: 8 → 3

Keep the **one reliability-bearing split**: the reviewer is a different context than the builder (a maker can't catch its own blind spots). Everything else is a *checklist*, not a *persona*.

| Role | Is |
|---|---|
| **Builder** | plans + writes code/docs + tests. (folds today's coder + architect + stack-researcher + codebase-reader) |
| **Reviewer** | independent: checks the work against the plan + a tight quality/security/honesty checklist. (folds plan-checker + code-review + auditor + product-advocate) |
| **Orchestrator** | drives the loop, talks to the PM, owns git + state. |

The specialised checks the folded agents ran (advocate's product questions, auditor's frugality/graduation, architect's honesty/data-flow) **survive as short checklists** the Reviewer/Builder run — not as 200-line bodies. *Honest risk accepted:* a generalist reviewer may miss what a dedicated advocate caught; mitigated by sharp checklists, not by separate agents.

## Core / adapter split — the agnosticism contract (DNA)

The protocol is **one neutral core + one thin adapter per environment**. This is the load-bearing architecture, not an optimisation.

**CORE (neutral — the ~10 files' brain).** The loop, the role definitions, the invariants, the deny-RULES **as intent**, all expressed in **abstract terms only**: "read a file", "write a file", "spawn a sub-agent", "ask the PM a structured question", "deny an out-of-root write". Zero `Claude` / `OpenCode` / hook / plugin / tool-name specifics. A human reads the core and understands the protocol without knowing which platform runs it.

**ADAPTER (per environment — thin, swappable).** The concrete realisation of the contract points for one platform:
| Contract point (neutral) | Claude Code | OpenCode |
|---|---|---|
| abstract tool → concrete tool | `Read`/`Edit`/`Write`/`Task`/structured-question | `read`/`edit`/`write`/`task`/… |
| **enforce a deny** | `PreToolUse` hook (settings.json) | `tool.execute.before` plugin (throw) |
| spawn a sub-agent | `Task(subagent_type)` | `task(agent)` |
| load instructions | `@import` / instruction file | `instructions[]` array |
| install into a project | symlink + submodule | symlink + submodule |

**THE CONTRACT** between them is a **small, stable, enumerated interface** — the list of contract points above. An adapter is "done" when every point is realised for that platform.

**Acceptance test for "agnostic" (the few-hours promise):** a **new** environment is supported by writing **only** its adapter (the tool-map + the deny-realisation + spawn/question/load/install) against the fixed contract — **zero edits to the neutral core**. If supporting a new harness forces a core edit, the boundary leaked and the design failed.

**What's wrong today (the real work, not "cut the agnosticism"):** the split exists but **leaks** — the "neutral" bodies still carry harness assumptions, and the adapter is a 349-line generator + heavy manifests + a doubled enforcement surface (hooks 508 *and* plugin 749). Re-architect so the core is **genuinely** neutral and the adapter is **genuinely** thin and contract-shaped. The agnosticism stays; the leak and the bloat go.

## What dies / merges, and the failure it must still prevent

| Cut | Failure it prevented | How the minimal form keeps it |
|---|---|---|
| 16 `workflow/*.md` → one `PROTOCOL.md` | rules forgotten under long context | the whole thing is now small enough to **load every turn** — so the progressive-disclosure / on-demand machinery (which existed *because* the total was huge) **dies with it** |
| 8 personas → 3 roles + checklists | independent review; specialised checks | keep builder≠reviewer (the load-bearing split); checks become checklists |
| conditional-section machinery (nfr / state-model / security / readme / failure-inventory "when-it-fires" essays) | missing a relevant concern | a **one-line prompt per concern** in the plan checklist, judged by the model — not a 30-line essay each |
| `decision-authority.md` (60) + autonomous machinery | overreach / wrong autonomous call | the kernel is ~2 lines (autonomous\|interactive; derivable→act+announce, else ask). The elaboration *was* the bloat |
| review-typology (116) + auditor dimensions (250) | shipping slop / undocumented | one tight reviewer checklist |
| migrations machinery (detection + per-migration procedures) | downstream drift on a template bump | if the protocol is ~10 small files, **"re-read it"** replaces "run N migration procedures" |
| O(1) doc-frugality gates (just built) | knowledge lost when evidence evaporates | **keep the principle**, shrink the gate prose to a line |

## The hard questions (I won't pretend these are settled)

1. **Dual-harness — SETTLED (PM, 2026-06-09): environment-agnosticism is DNA.** Not "keep two vs pick one." **Both Claude Code and OpenCode are first-class, designed from scratch**, behind the clean **core/adapter** boundary above. What goes is not the agnosticism — it is today's **leaky** split (neutral bodies still assume a harness; the adapter is a 349-line generator + heavy manifests + doubled enforcement). The real design work: make the core genuinely neutral and the adapter genuinely thin + contract-shaped, so a *third* environment is a few hours. **The open sub-question is mechanism:** is the adapter generated (today's `gen/generate.py` from neutral source) or runtime-resolved (the core reads a small per-env mapping table)? — pick whichever keeps the core untouched and the new-env cost lowest.
2. **The mechanical floor is itself big** (hooks 508 + plugin 749) — but it's the *reliable* part. Most of that is test scaffolding around a ~dozen deny rules. The rules stay; the question is how small the realization gets.
3. **What genuinely resists shrinking?** Independent review, the deny-list, git-flow, plain-language PM-comms — these are load-bearing and short already. The bloat is everywhere else.

## Migration (dogfood-safe)

The protocol develops itself, so we can't dismantle the heavy pipeline *with* the heavy pipeline. Proposed: (1) agree this target; (2) **build the minimal core fresh** (`PROTOCOL.md` + 3 roles + the kept deny-list) alongside the current one; (3) prove the minimal core can drive one real feature end-to-end; (4) swap, archive the old surface to git. Big-bang risk is real — flag it now, stage it.

## What I need from you

- Is the **target shape** (~10 files, 3 roles, one constitution, the loop) right — or too aggressive / not aggressive enough?
- The **dual-harness** call (Q1) — it dominates the surface; your steer changes the whole plan.
- Anything in "what dies" where you think the failure-prevention does **not** survive the cut — that's where I want to be wrong early.
