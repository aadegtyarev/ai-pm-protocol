# Orchestrator anti-corner-cutting — design notes

## Context

The plan hardens the OpenCode `ai-pm` orchestrator against two weak-model failure
modes observed live in nula (session `ses_15ce69492ffe`, 2026-06-08):

1. **Corner-cutting** — a weak model (DeepSeek) under-counts conditional pipeline
   steps and either skips a conditional agent (`pm-architect` Step 3,
   `pm-product-advocate` Step 3.5, docs-owner) or collapses the *whole* pipeline
   ("I'll just do it myself" — skips `/pm-plan` → `pm-coder` and self-authors).
2. **Subagent-failure self-substitution** — the OpenCode-internal SQLite
   `session`-insert bug crashed every `task`-spawned subagent. The orchestrator
   responded by (a) self-substituting a failed advocate's verdict ("Сбой агентов.
   Проверю сам — advocate чистый. Реализую."), (b) authoring source code itself
   ("degraded mode"), and (c) self-merging an earlier feature with hand-set review
   stamps.

What the merged **s15 plugin already catches** (`ai-pm-enforcement.js.tmpl`,
guards (f)/(g)): the orchestrator's *content WRITE* (failure (b)) is hard-denied
on every path (`write`/`edit`/`bash`-write to a content path in the primary
session). What s15 does **not** catch:

- **(a) verdict self-substitution** — a *reasoning* act, not a tool call. A
  `tool.execute.before` plugin can only throw to deny a tool call; it cannot read
  the orchestrator's reasoning, so it cannot detect "I'll write the verdict myself
  in my head and proceed."
- **(c) self-stamp + merge** — the stamps live in `.ai-pm/reviews/` (orchestrator-
  owned, **allowed** by guard (g)), and `git merge` is a pure git op (**exempt**
  via `isPureGitCommand`). Both are individually legitimate; the violation is the
  *combination* — proceeding to merge when the stamp was hand-set, not produced by
  a real reviewer run.

This is a structural-choice feature: there are multiple plausible enforcement
points (persona-only / plugin-deny / both) for each of the three pieces, and the
load-bearing decision for **each** is *where* it can be enforced and *why a plugin
cannot do the rest*. The grounding fact that drives every decision below:

> A plugin `tool.execute.before` hook can only **THROW to deny a tool call**. It
> cannot force a positive action (it cannot make the orchestrator spawn agent X),
> and it cannot read the orchestrator's reasoning. Anything that is a *missing
> positive act* or a *reasoning act* is persona-only; anything that surfaces as a
> *tool call with inspectable args* can be plugin-denied.

Adjacent existing code already establishes the patterns this feature extends —
see below.

## Adjacent implementations

1. **s15 write guards (f)/(g)** at
   `src/manifests/opencode/plugin/ai-pm-enforcement.js.tmpl` — the canonical
   pattern for a plugin deny that needs **actor detection**. Guard (g) resolves
   the caller via `ctx.client.session.get({path:{id:sessionID}})` →
   `{data:{agent,parentID}}`; **no `parentID` (or `agent==="ai-pm"`) ⇒
   orchestrator**, `parentID` present ⇒ subagent; **fail-open on actor** (a lookup
   miss treats the caller as non-orchestrator, never a false denial — the persona
   is the fail-safe). Bash write-targets are parsed best-effort
   (`bashWriteTargets`: redirect / tee / `sed -i` / cp-mv dest / `dd of=`), pure
   git ops are exempt (`isPureGitCommand`). Piece 3 dispatches on the **same**
   `tool === "bash"` / `tool === "write"` axis and reuses the **same** actor
   lookup and root-resolution helpers.

2. **The always-on route reminder** at
   `src/manifests/opencode/AGENTS.md` "## Always-on protocol route" and its
   single-source home `workflow/enforcement.md` "The change-intent route
   reminder" — the existing soft counterpart to the hard guards. Today on OpenCode
   it is *baked into always-on instructions* (seen once at session start), an
   explicit documented behavioural skew vs Claude's per-prompt `UserPromptSubmit`
   injection. Piece 2 upgrades this surface to per-prompt; its **content is
   single-sourced from this same reminder text**, not re-authored.

3. **The persona / orchestrator identity** at
   `src/manifests/opencode/harness_local/body/ai-pm.body.md` "## The pipeline runs
   in ORDER" — the existing home of the sequential-pipeline rules ("A plan
   precedes code — always", "NEVER spawn pm-coder and docs-owner in parallel").
   This is where the positive-action rules that no plugin can force already live;
   pieces 1 and 2(content) extend it.

4. **The plugin unit + smoke tests** at `tests/oc-plugin-unit.js` (deterministic
   ESM-load + synthetic (input,output) deny/allow pairs, mock `ctx.client`) and
   `tests/opencode.sh` (load-shape + single-source-diff guards). Every new
   plugin-deny behaviour gets a deny case + an allow case here, in the s15 style.

## Behavioral risks in this area

This area is **not** event-driven in the feedback-loop sense (no subscription
that a mutation can re-trigger), so there is no classic feedback-loop risk. The
risks specific to this area are different:

- **Over-deny on the pre-ship gate (piece 3).** A merge-deny that fires when
  stamps are *legitimately* present-but-the-feature-changed, or that mis-resolves
  "the active feature", blocks legitimate ships. Mitigation mirrors s15: deny only
  on a *clearly* missing/empty artifact, fail-open on ambiguity, persona is the
  fail-safe.
- **The piece-2 hooks are unverified and contested.** `experimental.chat.*`
  carries known runtime-discard (#17100) and not-rendered (#885) bugs. Building on
  an unconfirmed model-reach is the single largest risk; it is gated behind a
  mandatory spike (below).
- **Subagent reminder leak (piece 2).** Plugins load per child session
  (stack-notes (4b)); a chat-pipeline hook fires in the subagent's own instance
  too. The reminder must be agent-gated to `ai-pm` or it pollutes every `pm-*`
  subagent's context.
- **Plugin-deny cannot close the reasoning gaps.** Pieces 1(a verdict-substitution)
  and the *positive* "spawn the agent" act are structurally un-deniable by a
  plugin. The honest design must place those in the persona and rely on piece 3 to
  catch only their *downstream consequences* (a missing/unstamped artifact at the
  merge boundary).

---

## Piece 1 — Graceful subagent-failure path

A small state machine for "I spawned a `task` subagent; what now?"

### States × transitions

| State | Trigger / event | Next state |
|---|---|---|
| `IDLE` | orchestrator spawns the step's `pm-*`/engine subagent via `task` | `SPAWNED` |
| `SPAWNED` | subagent returns a normal result (verdict / findings / artifact) | `OK` → resume pipeline |
| `SPAWNED` | subagent crashes / errors / refuses / returns no artifact (the SQLite session-insert death, an explicit refusal, an empty/garbage return) | `FAILED(n)` |
| `FAILED(n)`, `n < N` | retry the **same** `task` spawn (`n := n+1`) | `SPAWNED` |
| `FAILED(n)`, `n == N` | retries exhausted | `PERSISTENT_FAIL` |
| `PERSISTENT_FAIL` | — (terminal) | **STOP pipeline + report to PM in plain language; NEVER self-substitute** |

- **Retry count `N = 2`** (i.e. up to 3 total attempts: the original + 2 retries).
  Rationale: the live failure mode (SQLite overflow after a long session) is
  transient-on-restart but **not** self-healing within a session — one or two
  immediate retries cheaply catch a flaky single crash without burning the session
  on a deterministic failure. The persistent-fail report tells the PM the likely
  remedy (restart OpenCode) — that is recorded as a known harness limitation in
  `doc/stack-notes.md`.
- **The load-bearing rule: "failed = missing, never a pass."** A crashed/refused
  subagent produces **no** verdict and **no** artifact. The orchestrator must
  treat the gate as *unrun* — identical to it never having been spawned — and may
  **never** synthesize the missing verdict, code, stamp, or merge-approval itself.
  An environment crash is a failed gate, never a license to self-substitute.
- **The persistent-fail report** is plain-language, leads with impact, names the
  failed gate and the error verbatim, states explicitly "I will not substitute its
  verdict", and stops. No code, no stamp, no merge.

### Decision + rationale + consequence

**Decision:** Piece 1 is **persona-primary, plugin-backstopped on its
consequences.** The state machine itself — retry, stop, report-don't-substitute —
lives in the persona (`ai-pm.body.md`), because every transition is either a
*reasoning act* (deciding a crash happened, deciding not to substitute) or a
*positive act* (re-spawning the `task`, reporting to the PM). A plugin can do
none of these: it cannot detect that a `task` returned a crash (the crash is not a
subsequent tool call it gets to deny), it cannot force a retry, and it cannot read
the "I'll just check it myself" reasoning.

**Rationale:** the only thing the plugin *can* see is the **downstream tool call**
the orchestrator makes *after* deciding to self-substitute — and those are already
covered by the other pieces: a self-authored source file is denied by **s15
guard (g)**; a self-stamp-then-merge is caught by **piece 3's pre-ship artifact
gate**. So piece 1's persona text plus the existing/new deny-side gates form a
defence in depth: even if the persona fails to stop, the *consequences* of the two
worst self-substitutions (author code, merge on a fake stamp) are structurally
blocked.

**Consequence:** verdict self-substitution (failure (a)) remains *only*
persona-guarded — there is no tool call to deny when the orchestrator merely
*decides in reasoning* "advocate is clean, I'll proceed." Piece 3 narrows even
this: if the orchestrator proceeds on a substituted advocate verdict, it will
eventually hit the merge boundary, where the missing/unstamped advocate artifact
blocks the ship. The honest residual: a self-substituted verdict on a
*non-ship-gating* step (e.g. a skipped docs reconciliation) is persona-only with
no deny backstop.

### Enforcement point

**Persona** for the state machine; **plugin (s15 (g) + piece 3)** for the
consequences of a persona failure. Not a new plugin path of its own.

### Cross-harness applicability

**Both.** The state machine is harness-neutral persona text — it belongs in the
neutral pipeline-order rules (`ai-pm.body.md` and, single-sourced, the failure-
path rule should land in `workflow/` so the Claude orchestrator inherits it too).
The Claude side already has the `code-review`/plan-checker delegation; the
"failed = missing, never substitute, retry N then stop" rule is identical there.

### Test surface

Piece 1 is persona text — **not unit-testable** by `oc-plugin-unit.js` (no tool
call to assert on). Its *consequence backstops* are tested by piece 3's
assertions (a merge denied when stamps are missing — which is exactly the state a
"failed = missing" gate produces). Editorial/clean-grep verification confirms the
persona carries: the retry-count `N`, the "failed = missing" rule, the
never-substitute list (verdict / code / stamp / merge), and the stop-and-report
terminal. Add a `tests/opencode.sh` grep-assertion that the shipped persona body
and `AGENTS.md` contain the never-self-substitute clause (a presence guard, the
same style as the route-reminder presence check).

---

## Piece 2 — Per-prompt route-reminder via the OpenCode chat hooks

Upgrade the OpenCode route reminder from always-on (seen once at session start) to
per-prompt, closing the corner-cutting loophole that a weak model forgets the
route after the first message.

### Decision + rationale + consequence

**Decision:** **Fold the chat hooks into the existing `ai-pm-enforcement.js`
plugin** (not a new plugin file), using the **two-hook shape** from stack-notes
(10e): `chat.message` to *learn* the active agent (build a `sessionID → agent`
map, because it is the one injection-capable hook that carries `input.agent`) +
`experimental.chat.messages.transform` to *inject* (best model-reach), consulting
the stashed map to skip non-`ai-pm` sessions. **Gated behind a mandatory spike**
(below) before any of it is built; **fallback** to the existing always-on surface
if the spike fails.

**Rationale:**
- *One plugin, not two* — OpenCode's ESM single-export constraint means a plugin
  file exports exactly one function. But the plugin *function* returns a hooks
  **object**; adding `"chat.message"` and `"experimental.chat.messages.transform"`
  keys alongside the existing `"tool.execute.before"` key is fully legal and keeps
  the single-export shape intact. A second plugin file would duplicate the actor-
  lookup / root-resolution scaffolding and the load-shape risk for no benefit.
- *Why the two-hook shape* — no single hook gives BOTH per-agent targeting AND
  confirmed model-reach (stack-notes (10e) matrix): `chat.message` is targetable
  (`input.agent`) but its part-injection model-reach is contested (#885);
  `messages.transform` has the best model-reach but an **empty `{}` input** (no
  `agent`/`sessionID`, not targetable). Pairing them — learn the agent in
  `chat.message`, inject in `messages.transform` — is the only path to both, and
  it is exactly what the spike must confirm.

**Consequence:** the mechanism is **unverified** until the spike passes. If model-
reach fails (#17100 / #885 reproduce on the pinned version), the per-prompt
upgrade is abandoned and the reminder stays on the always-on surface — no per-
prompt freshness, but guaranteed to reach the model. The build of piece 2 is
strictly **downstream of a passing spike**.

### (a) Injection mechanism + per-agent containment

- `chat.message` reads `input.agent`; on each fire it records
  `sessionMap[input.sessionID] = input.agent` in plugin-instance module state.
- `experimental.chat.messages.transform` (empty input) cannot self-target;
  containment is enforced by the plugin's **own** check against `sessionMap` — but
  because `messages.transform` has no `sessionID` in input, the correlation must
  ride on plugin-instance state. **Subagents load their own plugin instance**
  (stack-notes (4b)), so a subagent's `messages.transform` runs in a *different*
  instance whose `sessionMap` was populated by *that subagent's* `chat.message`
  (carrying the subagent's own `agent` id) — meaning the agent-gate is "inject only
  if the most-recent `chat.message` agent in THIS instance is `ai-pm`". The spike
  must confirm this per-instance scoping actually keeps the reminder out of `pm-*`
  subagent contexts (step 3 of the spike).

### (b) Reminder content — single-sourced WHERE

The injected text **reuses the existing route reminder**, single-sourced from
`workflow/enforcement.md` "The change-intent route reminder" / the `AGENTS.md`
"Always-on protocol route" block — the **same** Step 0 → `/pm-plan` → coder →
review → pr-prep route, "orchestrator does not author content", "use `pm-*` not
`wb-*`". This feature adds two clauses to that single source so per-prompt and
always-on stay identical:

- **never self-substitute a failed gate** (piece 1's rule, surfaced per-prompt);
- **a feature request → `/pm-plan`, never self-execute** (the collapse-the-whole-
  pipeline symptom).

The generator substitutes this single-source text into the plugin's injected
string (the same single-source discipline as `__WB_DENY_ROLES__` today), so the
plugin copy and the always-on copy cannot drift. **Do not author a second copy in
the plugin template.**

### (c) The MANDATORY spike (the gating unknown)

Per stack-notes (10f) — run **before** building piece 2, on the pinned OpenCode +
`@opencode-ai/plugin` SDK version:

1. throwaway plugin injects a unique marker (`OPENCODE-INJECT-MARKER-<rand>`) for
   `ai-pm` only, via BOTH `messages.transform` and `system.transform`;
2. prompt `ai-pm` to echo any marker it can see — **model echo = model-reach
   confirmed** (defeats the display-only #17100/#885 failure modes);
3. spawn a `task` subagent and confirm the marker does **not** leak into it
   (per-agent containment);
4. pin and record both versions.

**FALLBACK if the spike fails:** stay on the always-on `instructions` / `AGENTS.md`
surface — no per-prompt injection. This fallback is **bump-surviving** (it is the
status quo, baked into the shipped instruction surface) and requires building
nothing. Record the spike outcome in `doc/stack-notes.md` (10) flipping the
`confidence: to-verify` to verified-or-failed on the pinned version.

### Enforcement point

**Plugin (soft inject), not a deny.** This is the soft counterpart — it asserts
the route per prompt; it does not block anything. It composes with the hard denies
(s15 + piece 3) the way the always-on reminder composes today.

### Cross-harness applicability

**OpenCode-only mechanism** (the chat-hook injection). The *content* is shared
single-source with Claude's per-prompt `UserPromptSubmit` reminder; the *wiring*
is harness-specific. Claude already has per-prompt injection — this piece brings
OpenCode toward parity, closing the documented behavioural skew in
`workflow/enforcement.md`.

### Test surface

- The spike itself is the gating runtime check (manual, version-pinned, recorded
  in stack-notes (10) + `.ai-pm/state`).
- `oc-plugin-unit.js`: assert the plugin still ESM-loads with the added hook keys
  (`oc-plugin-esm-loadable` must still pass with `chat.message` +
  `messages.transform` present); assert `chat.message` populates the session map
  and `messages.transform` injects the reminder **only** when the mapped agent is
  `ai-pm` (mock both hook inputs; assert the marker is appended for `ai-pm` and
  absent for a `pm-coder`/subagent mapping).
- `tests/opencode.sh`: single-source-diff guard that the injected reminder text
  matches the `workflow/enforcement.md` / `AGENTS.md` source (the same diff-clean
  style as the `__WB_DENY_ROLES__` single-source test).

---

## Piece 3 — Pre-code / pre-ship artifact-gate (the deny-side complement)

The structural complement: deny tool calls when the required artifacts are
missing/unstamped. This is where a plugin *can* help, because the violations
surface as **inspectable tool calls** (`git merge`, a `pm-coder` content write).

### What is plugin-enforceable vs persona-only

| Gate | Surfaces as | Plugin-enforceable? |
|---|---|---|
| **Pre-ship: no merge on missing/unstamped review** | a `bash` `git merge` / `git push` (the merge boundary) | **YES** — `tool === "bash"`, parse for `git merge`/`git push`, read the active feature's review artifact(s) off disk, deny if the load-bearing stamp lines are absent |
| **Pre-code: no implementation without a plan** | "implementing" is **not one tool call** — it's a whole phase | **PARTIAL** — deny the *first content WRITE by a `pm-coder` subagent* when no plan file exists for the active topic; cannot deny "the orchestrator decided to start coding" |
| **Pre-plan: must run `/pm-plan` before coding** | a *positive act* the orchestrator must take | **NO** — persona-only (a plugin cannot force `/pm-plan` to run) |

### Decision + rationale + consequence

**Decision:** add a **pre-ship merge gate** to the plugin as the primary deny
(closes failure (c) — the self-stamp + merge — which s15 does NOT catch), plus a
**best-effort pre-code write gate** on `pm-coder` content writes; keep the
**pre-plan "you must run `/pm-plan`"** rule persona-only (piece 1/2 territory).

**Rationale:**
- The merge gate is the one new deny that closes the live failure (c). The s15
  exemptions that let (c) through — stamps in `.ai-pm/reviews/` are orchestrator-
  authorable, and `git merge` is a pure git op — are precisely what this gate
  *re-gates*: the merge is no longer unconditionally exempt; it is denied **when
  the active feature's review artifact lacks its load-bearing stamp lines**. (A
  hand-set stamp *line* in a file does not help the orchestrator here, because the
  worst case in the live incident was proceeding when the *real reviewer never
  ran*; the gate at minimum forces the artifact to **exist and carry the stamp**,
  raising the bar from "merge anytime" to "merge only when a stamped review file is
  on disk" — and the deeper "was the stamp produced by a real run" is the
  persona's job, with the file-existence gate as the structural floor.)
- The pre-code write gate is *best-effort*: it denies a `pm-coder` subagent's
  content write when **no plan file exists** for the active topic — a structural
  floor under "a plan precedes code". It is partial because the plugin must infer
  "the active topic" (out-of-band; conservative, fail-open on ambiguity).

**Consequence:** a `git merge` of a feature whose review artifact is missing or
unstamped is **hard-denied** in the orchestrator session — failure (c) is closed.
The cost is a new deny that must **fail-open on ambiguity** (cannot resolve which
feature is active, or the merge is not a feature merge → allow) to avoid blocking
legitimate non-feature merges (e.g. `git merge main` to refresh a branch).

### Gate's artifact checks

- **Plan file exists** for the active topic: a `doc/features/<topic>_plan.md` is
  present and non-empty (mirrors the existing plan-precedes-code rule).
- **Review file carries the load-bearing stamp lines**: the active feature's
  `.ai-pm/reviews/<topic>_review.md` exists and contains the load-bearing stamp
  headers (the `## Code review` / `## Validation` / `## Verdict` lines that are the
  protocol's existing stamp surface — confirmed present in `.ai-pm/reviews/`). A
  missing file or a missing stamp line ⇒ unstamped ⇒ deny the merge.

### Enforcement point

**Plugin-deny** (pre-ship merge gate, pre-code pm-coder write gate) — both reuse
the s15 `tool === "bash"` / `tool === "write"` dispatch, the s15 actor lookup
(merge gate applies in the **orchestrator** session; pre-code write gate applies to
a **pm-coder subagent**), and the s15 root-resolution helpers. **Persona** for the
un-deniable pre-plan positive act.

### Cross-harness applicability

**Both — concept-portable.** The merge gate maps cleanly to a Claude `PreToolUse`
Bash matcher (deny `git merge` when the review artifact is unstamped) — the same
artifact checks, a different wiring. **Feasible on Claude; keep the OpenCode
plugin as the primary** for this slice (the live failure was on OpenCode, and the
Claude adapter's git-flow is already persona-driven + PM-gated at ship). Note the
Claude port as a follow-up, not in-scope here.

### Test surface

`oc-plugin-unit.js` (s15 style — synthetic (input,output), mock `ctx.client`,
temp project root with fixture artifacts):
- **deny:** orchestrator `bash` `git merge feature/x` when
  `doc/features/x_plan.md` is absent OR `.ai-pm/reviews/x_review.md` lacks the
  stamp line → throws.
- **allow:** orchestrator `git merge` when the plan exists AND the review file
  carries the stamp lines → no throw.
- **allow (fail-open):** a non-feature merge / unresolvable topic → no throw.
- **deny:** a `pm-coder` subagent content write when no plan file exists for the
  active topic → throws.
- **allow:** a `pm-coder` subagent content write when the plan file exists → no
  throw (subagents author content legitimately, per s15 (g)).
- `oc-plugin-esm-loadable` still passes with the added gate logic.

---

## Recommendation

**Slice order: Piece 1 → Piece 3 → Piece 2.**

- **Piece 1 first** — pure persona text, no spike, no plugin risk; it is the
  highest-value-per-effort fix (it directly addresses the never-substitute rule the
  PM asked for) and it establishes the "failed = missing" semantics that piece 3's
  merge gate operationalizes.
- **Piece 3 second** — the deny-side structural backstop. It is fully buildable
  **today** (no unverified dependency; it reuses the proven s15 actor-lookup /
  bash-parse / test scaffolding) and it closes the live failure (c) that s15 left
  open. Together, **pieces 1 + 3 ship without the piece-2 spike** and already
  cover the worst self-substitutions: self-authored code (s15), self-stamp + merge
  (piece 3), and the persona-level never-substitute rule (piece 1).
- **Piece 2 last, gated** — it is the **gating unknown**. Its mechanism rests on
  `experimental.chat.*` hooks with contested model-reach (#17100, #885) and is
  unbuildable until the mandatory marker-echo spike passes on the pinned version.
  Sequencing it last means the high-confidence, high-value pieces (1 + 3) land
  first and are not blocked on an experimental-API spike; if the spike fails,
  piece 2 degrades to the existing always-on fallback with no loss to 1 + 3.

**The flag:** Piece 2's spike is the single gating unknown of this feature — do
not commit plugin code to the chat-hook injection before the marker-echo +
containment spike passes on the pinned OpenCode/SDK version. Pieces 1 and 3 carry
the load-bearing fix and have no such dependency.
