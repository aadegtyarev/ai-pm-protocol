# OpenCode harness support — plan

Source: PM request 2026-06-07 ("использовать протокол с OpenCode … можно ли универсально, чтобы не держать два репозитория"). Prior research: this conversation's harness-portability analysis + the `doc/stack-notes.md` § "OpenCode (sst/opencode → anomalyco/opencode)" entry (added 2026-06-07 by `pm-stack-researcher`).

> **Scope of THIS plan = design + groundwork slice** (PM decision via AskUserQuestion 2026-06-07). It locks the dual-harness architecture, carves the harness-neutral core, keeps the Claude Code adapter byte-unchanged, scaffolds the OpenCode adapter as a clearly-labeled **preview**, and de-risks the two unsettled upstream dependencies with gated spikes. It does **not** certify OpenCode as a fully-supported harness — that is a later slice, gated on the two upstream blockers (see Out of scope).

---

## Scenarios

1. **The protocol declares a dual-harness architecture.** A reader of `doc/architecture.md` sees a recorded decision: the protocol is one repository serving two harnesses (Claude Code + OpenCode) via a **harness-neutral core** plus a **thin per-harness adapter**, kept **dual-native** (both adapters committed as plain files, no build step) and guarded by an **equivalence test**, with OpenCode shipped as a preview until two named upstream gaps close.

2. **The harness-neutral core is explicitly carved.** The protocol's harness-agnostic surface — `WORKFLOW.md`, `workflow/*.md`, the **bodies** of every `pm-*` agent and command, `doc/_templates/*` — is confirmed and documented as shared-across-harnesses. The harness-specific shell — instruction-entry mechanism, agent/command frontmatter shape, enforcement mechanism, tool-vocabulary, install wiring — is enumerated per harness in a **harness-adapter contract** the architecture document owns. A harness-neutral vocabulary layer lets the core prose name capabilities ("the structured-question tool", "the change-intent route reminder", "the deny-list enforcement") without binding to one harness's primitive names.

3. **The Claude Code path is unchanged.** A maintainer running the existing dogfood pipeline on Claude Code sees byte-identical `.claude/` adapter behaviour: same agents, same commands, same `settings.json` hooks, `tests/hooks.sh` green, `@`-import of `WORKFLOW.md` intact. Claude Code remains the self-host harness (PM decision 2026-06-07).

4. **A downstream project on OpenCode can install the protocol as a preview.** The repository carries a committed `.opencode/` adapter — agents, commands, an enforcement plugin, an `opencode.json` with an `instructions` array, and an `AGENTS.md` entry — translated from the same neutral core. A prominent **preview label** states it is not yet enforcement-certified and names the two upstream gaps it waits on.

5. **Installation stays one flow across both harnesses, harness auto-detected.** The install instructions (and any install helper) add the submodule identically, then **detect** which harness the project uses (presence of `.claude` vs `.opencode`, or a flag) and wire the matching adapter — the submodule step and the mental model are the same as today's Claude Code install (PM decision 2026-06-07: auto-detect).

6. **Each of the four OpenCode gaps has a recorded adapter strategy.** The design names, for each gap, exactly how the OpenCode adapter behaves and how it differs from Claude Code: the missing per-prompt route-reminder hook, the missing built-in review/research engines, the missing runtime model override (cross-model), and the unsettled subagent enforcement containment.

7. **The two unsettled dependencies are de-risked by gated spikes.** Two throwaway spikes are scheduled (not assumed): one verifies submodule-path sourcing for the install design, one verifies whether plugin `tool.execute.before` actually constrains a `task`-spawned subagent (the disputed `#5894`). Their outcomes flip the affected design points from `doc-cited (unverified)` to `execution-verified` or trigger the documented fallback.

## Existing behaviors this feature touches

(What must not break — the dogfood self-host runs on this repo under Claude Code.)

- **The Claude Code adapter (`.claude/agents`, `.claude/commands`, `.claude/settings.json`).** No agent, command, or hook changes shape or behaviour. `tests/hooks.sh` stays green at its current count.
- **The `@`-import chain** `CLAUDE.md` → `@WORKFLOW.md` → on-demand `workflow/*.md`. The neutralization in scenario 2 must not change what a Claude Code session loads.
- **The submodule-delivery + `settings.json` symlink + `@`-import install** (the recorded "Settings.json delivered via symlink" and "WORKFLOW.md imported via `@`" decisions). The OpenCode install path is added **alongside**, never replacing the Claude path.
- **The "Agents are plain Markdown files, no build step" architectural decision.** The dual-native choice exists precisely to preserve it — adding a generator would contradict it; this plan does not.
- **The tooling-submodule / dev-artifact inertness invariant** (`template-dev-artifacts-inert`, #251): adapter files for one harness must be inert under the other harness's session, the same way the tooling submodule is inert downstream.

## Contracts

N/A — this template repo has **no user-facing Product Contracts** (the recorded exception in `doc/architecture.md` § "Contract-centric product map": the protocol's "product" is the protocol itself; capabilities live in `architecture.md` + `doc/features/`, not in `.ai-pm/contracts/`). No contract is created or changed.

## Stack expectations touched

(From `doc/stack-notes.md` § "OpenCode" — the load-bearing rules the adapter design must respect. All currently `doc/cited (unverified)`; the spikes below are the verification path.)

- **Instruction entry — config-listed file array, not in-file import.** OpenCode's `opencode.json` `instructions` array accepts relative/glob paths, so a submodule-relative `.ai-pm/tooling/WORKFLOW.md` entry is expressible; but there is **no `@`-import inside an instruction file** ("opencode doesn't automatically parse file references in `AGENTS.md`"). The adapter re-expresses the Claude `@`-import as a config-array entry + the existing harness-agnostic Read-on-demand pattern for topic files. Source: <https://opencode.ai/docs/rules/>, <https://opencode.ai/docs/config/>
- **Subagent frontmatter shape differs.** `.opencode/agent/*.md` uses `mode`/`model`/`permission` and a `tools` **object map** (`{write: true}`, deprecated in favour of `permission`), not Claude's comma-list; invocation is by name/description via the `task` tool (no `subagent_type` string). Source: <https://opencode.ai/docs/agents/>
- **Enforcement is JS-throw-to-block in a TS plugin**, not a JSON `permissionDecision` contract: `tool.execute.before` throws to deny / mutates `output.args` to rewrite. Source: <https://opencode.ai/docs/plugins/>
- **No UserPromptSubmit-equivalent hook** — no hook injects context per prompt; message hooks are reactive/post-fact. Source: <https://opencode.ai/docs/plugins/>
- **`question` tool = AskUserQuestion equivalent (PRESENT)** and **`skill` tool = Skill equivalent (PRESENT)**, and OpenCode reads Claude-compatible `.claude/skills/` paths. The protocol's "surface forks via the structured-question tool" and skill-invocation rules port. Source: <https://opencode.ai/docs/tools/>, <https://opencode.ai/docs/skills/>
- **No runtime per-`task` model override** (PR `#17577` closed-not-merged); subagent model is pinned in agent frontmatter or inherited. The Cross-model-review mechanism must pin model in **agent frontmatter** on OpenCode, not via a runtime override. Source: <https://opencode.ai/docs/agents/>, <https://github.com/anomalyco/opencode/pull/17577>
- **No built-in `code-review` / `deep-research`** — must be re-bound to a protocol-shipped OpenCode agent/skill. Source: <https://opencode.ai/docs/agents/>
- **Subagent tool-hook containment unsettled** (`#5894` closed-disputed, fix PR `#7473` closed-not-merged): a plugin `tool.execute.before` may not constrain every action a `task`-spawned subagent takes (a subagent shelling out via `bash` is only gated at the `bash` level). Spike-gated. Source: <https://github.com/anomalyco/opencode/issues/5894>
- **Install — likely submodule + small link step + `instructions` entry.** Config can point `instructions` at a submodule path, but the docs do **not** confirm the agent/command/plugin loaders can source from an arbitrary submodule subdir by config alone — a symlink/copy step into `.opencode/` may be required. Spike-gated. Source: <https://opencode.ai/docs/config/>

## Interaction scenarios

(Not isolated — two adapters share one repository, one submodule-delivery channel, one CI/validation surface.)

- **When a Claude Code dogfood session runs in this repo while the `.opencode/` adapter is present:** the OpenCode files are inert — they do not register as Claude agents, do not alter `@`-import loading, and `tests/hooks.sh` is unaffected (mirrors the `template-dev-artifacts-inert` invariant).
- **When an OpenCode session runs against the same tree:** the `.claude/settings.json` hooks and `@`-import are inert for it; OpenCode reads its own `AGENTS.md` + `instructions` + `.opencode/` adapter.
- **When a downstream project runs `git submodule update --remote`:** both adapters arrive together in one update; neither harness's install is left stale by a bump (the same single-bump delivery the Claude `@`-import + symlink already gives).
- **When the harness-neutral core (a `pm-*` agent/command body, `WORKFLOW.md`, a `workflow/*.md` rule) is edited:** the equivalence test fails unless both adapters carry the identical neutral body — the guard that keeps "one source of truth" true without a build step.
- **When the install helper runs in a project that already has a `.opencode/` or `.claude/` dir / where a symlink target exists:** install detects the harness and does not clobber an existing adapter (failure-path, see Test plan).

## Test plan

- **Existing tests that must pass:** all of `tests/hooks.sh` (current count, unchanged — the Claude adapter is byte-identical).
- **New tests:**
  - `equivalence-neutral-core`: given the `.claude` and `.opencode` adapters, when the shared body of each `pm-*` agent and command is extracted (frontmatter stripped), then the two adapters' bodies are identical — the dual-native sync guard the PM chose. Fails loudly on any drift.
  - `opencode-adapter-inert-under-claude`: given a simulated Claude Code session over this tree, when `tests/hooks.sh`'s boundary/route checks run, then the `.opencode/` files neither register as Claude agents nor change any hook outcome (mirrors the dev-artifact-inert invariant).
  - `preview-label-present`: given the OpenCode adapter, when its entry surface (`AGENTS.md` / adapter README) is read, then the preview label and the two named upstream gaps are present — a positive-presence check so "preview" can never silently read as "certified" (the review-stamp lesson).
- **Interaction scenario tests (one per Interaction scenario above):**
  - `submodule-bump-delivers-both`: simulate a `submodule update`; assert both adapter trees are present and self-consistent after one bump.
  - `neutral-core-edit-trips-equivalence`: mutate a neutral agent body in one adapter only; assert `equivalence-neutral-core` fails (guard is live, not vacuous).
  - `install-no-clobber`: run the install helper where an adapter dir / symlink target already exists; assert it detects and refuses to overwrite, with a clear message.
- **Stack-spec tests (one per stack expectation above, verifying against the cited OpenCode contract, not the adapter's own mapping):**
  - `oc-agent-frontmatter-shape`: each `.opencode/agent/*.md` carries a `description` + a valid `mode` + a `permission`/`tools`-object (not a Claude comma-list). Comment cites <https://opencode.ai/docs/agents/>.
  - `oc-instructions-points-at-submodule-core`: `opencode.json` `instructions` includes the submodule-relative always-on core path(s). Comment cites <https://opencode.ai/docs/config/>.
  - `oc-cross-model-pinned-in-frontmatter`: any OpenCode review/audit agent that must run cross-model carries an explicit frontmatter `model:` (no reliance on a runtime override). Comment cites <https://github.com/anomalyco/opencode/pull/17577>.
  - `oc-enforcement-plugin-throws`: the OpenCode enforcement plugin's `tool.execute.before` throws (or mutates args) for each deny-list case that `tests/hooks.sh` covers on the Claude side. Comment cites <https://opencode.ai/docs/plugins/>.

  > Note: these are **form** checks against the documented contract. Behavioural truth for the two unsettled rules (submodule-path sourcing; subagent hook containment) comes from the spikes, not a static test — the static tests freeze the documented shape, the spikes verify it runs.

## Docs to update

- `doc/architecture.md`: one decision record — **dual-harness adapter architecture** (harness-neutral core + thin per-harness adapter; dual-native + no-build-step + equivalence-test; OpenCode-as-preview with the two named upstream gates; the four gap-handling strategies; the two spike gates; Claude Code stays self-host). Owned by `pm-architect`, post-coding handoff.
- `README.md`: install section gains the OpenCode (auto-detect) path; the architecture one-liner / install mechanics change → README-currency fires. Refreshed by `pm-architect` (README front-door owner), kept in the canonical front-door shape.
- `doc/stack-notes.md`: **already landed** (OpenCode entry, 2026-06-07) — no further change unless a spike flips a `confidence` tag (then the orchestrator updates that rule's tag per the spike-gate discipline).
- `WORKFLOW.md` / `workflow/*.md`: add the **harness-neutral vocabulary layer / harness-adapter reference** (a single named home that maps neutral capability names → each harness's primitive, referenced by name, never re-encoded — the protocol's single-source-of-conditions pattern). The wholesale reword of every inline Claude-primitive mention is **scoped by the architecture decision**, not assumed here.

## Out of scope

- **Full OpenCode certification / "fully-supported" status** — this slice ships a labeled preview only. Certification is a later plan, gated on the two upstream blockers below.
- **Closing the two upstream blockers ourselves** — runtime per-`task` model override (PR `#17577`, closed-not-merged) and subagent hook containment (`#5894`, disputed). We design around them and wait/track; we do not fork OpenCode to fix them.
- **Dogfooding the protocol on OpenCode** — PM decision 2026-06-07: Claude Code stays the self-host harness; OpenCode parity is validated by a smoke/preview path, not by self-hosting.
- **Generator / build-step single-source** — explicitly rejected (PM decision: dual-native + equivalence test) to preserve the recorded "no build step" architecture decision.
- **Live execution of the two spikes if no OpenCode runtime is available in-session** — they are scheduled as gated tasks; if no runtime, the first task records the runtime requirement (the plan-checker "first task in plan" pattern) and the affected design points stay `doc-cited (unverified)` with the documented fallback.
- **Sibling harnesses of the `harness` category** — Cursor, Codex CLI, Aider, Continue, and any other AI-coding harness. This plan focuses on **OpenCode** (PM-named); each other harness is a separate plan because each has its own adapter contract (instruction entry, frontmatter shape, hook/plugin model, tool vocabulary). The dual-harness architecture is designed to **generalize** to N adapters, but only the OpenCode adapter is built here.

## Key design decisions

- **Four PM forks resolved 2026-06-07 (AskUserQuestion):** (1) scope = design + groundwork (OpenCode adapter as preview); (2) dogfood = Claude Code stays self-host, OpenCode = downstream-supported; (3) sync = dual-native + equivalence test (no build step); (4) install = auto-detect harness.
- **Dual-native over generator** preserves the load-bearing "Agents are plain Markdown, no build step" decision; the equivalence test is what makes "one source of truth" honest without a compile step.
- **Gap-handling design (the four OpenCode gaps):**
  - *No per-prompt route reminder hook* → bake the change-intent route-reminder content into the always-on `AGENTS.md`/`instructions` surface (permanent context) instead of per-prompt injection; document the behavioural difference (always-on vs change-intent-triggered).
  - *No built-in review/research engine* → ship a protocol-owned OpenCode review/research agent or skill in the `.opencode/` adapter; investigate reuse via OpenCode's `.claude/skills/` cross-read before authoring net-new.
  - *No runtime model override (cross-model)* → pin the reviewer/auditor model in **agent frontmatter** per OpenCode subagent file; the `review-config.md` runtime resolution degrades to static pins on OpenCode, and the mandatory per-review model announce states this. (When/if `#17577`-class support lands, the adapter can adopt the runtime override and retire the static pins.)
  - *Unsettled subagent enforcement containment (`#5894`)* → the TS plugin encodes the same deny-list as `.claude/settings.json`; **until Spike B verifies subagent containment, the OpenCode enforcement is labeled "best-effort, not subagent-proof"** and the preview label says so. This is the security-honest stance: never present degraded enforcement as equivalent.
- **`spike-deferred` if no runtime:** the integration-risk spikes (submodule-path sourcing; subagent hook containment) hinge on `doc-cited (unverified)` rules; if no OpenCode runtime is available in-session, record `spike-deferred: <rationale>` and surface the unverified premise to coder + reviewer rather than asserting it.
- **This feature needs an architecture review** — it adds a new axis of extension (a second harness adapter) and makes a structural choice about repo layout (where adapters live, how the neutral core is carved, how the equivalence test is shaped). Recommend an `pm-architect` arch note before any implementation begins.
