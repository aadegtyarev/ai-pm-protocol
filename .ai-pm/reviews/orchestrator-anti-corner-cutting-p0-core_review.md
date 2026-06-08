# Plan-compliance review — anti-corner-cutting CORE-HOIST (Piece 0 + piece-1 echo)

Branch `feature/opencode-harness-support--anti-corner-cutting-p0-core` · commits `84adbd6` (Piece 0 core hoist), `0c4eadb` (piece-1 echo + extension tests). Diff base `feature/opencode-harness-support`.

## Plan compliance

### Piece 0 — ABSORB (Edit-ownership → Delegation & gate integrity)
- ✓ **WORKFLOW.md kernel REPLACES the Edit-ownership bullet in place** (not deleted, not a parallel sibling). `WORKFLOW.md:13` now carries the **Delegation & gate integrity** bullet; Edit-ownership is named inside it as "the **edit-route instance** of this rule". Matches arch note §1 ABSORB + §2 drafted kernel.
- ✓ **Kernel carries all four required elements**: gate = "fresh spawn of the owning agent this turn"; "never produces, paraphrases, reuses, or skips an autonomous agent's deliverable"; existing-artifact = "failed / missing / already-existing / skipped all count as 'not run'"; pointer to `workflow/enforcement.md` (with the carve-outs/artefact-list/test/ban named). The own-outputs surface (backlog, PM decisions, Pass-2 trail, advocate Resolutions, protocol-gap, git ops) is named inline.
- ✓ **enforcement.md full rule generalized in place** (`workflow/enforcement.md`): the `##` section retitled to "Boundary, delegation & gate integrity, and remote-system rules (full)"; the rule paragraph retitled "Delegation & gate integrity rule"; the illustrative-not-exhaustive route list (edit / skip / substitute-crashed / reuse-stale / composite) + the fresh-spawn-this-turn test + the named-rationalization ban promoted to the rule top; the `### Graceful subagent-failure` and `### Artifact gate` sub-sections re-framed as the crash-route / deny-side instances. Matches arch note §3 mechanics 1–6.

### THE #1 RISK — carve-outs preserved + no over-block
- ✓ **Edit-route paragraph preserved verbatim** (`enforcement.md:23`) — "The edit-route instance (the original edit-ownership rule, preserved)" with the full agent-owned-content artefact list (source / schemas / `docs/*` / plans / `## Verdict` bodies / arch notes / audit reports) unchanged.
- ✓ **Both carve-outs preserved verbatim in force** — "The one carve-out inside `.ai-pm/reviews/<topic>_review.md`" (Pass-2 `## Code review` trail, `enforcement.md:27`) and "A second carve-out … `_advocate.md`" (`## Resolutions` trail, `:29`). The **Orchestration artefacts** paragraph (`:31`) — backlog / PM decisions / Pass-2 trail / protocol-feedback reports / remediation order / git operations / deployment script — is intact verbatim.
- ✓ **No over-block + prominently scoped.** A NEW lead-in paragraph "The carve-outs — what the orchestrator MAY legitimately produce (preserved verbatim, in force)" (`enforcement.md:25`) states explicitly that "The generalized rule above must **not** be read as catching any of the following … so a future reader or harness port cannot misread the broadened first sentence as blocking the orchestrator's own job." The closing "The line:" boundary paragraph (`:33`) was extended with "a fresh-spawn-this-turn gate never applies to them, because they are not an autonomous agent's deliverable in the first place." The broadened first sentence reads "the orchestrator legitimately writes the **outputs of the processes it drives** (the carve-out surface named in full below). What it never does is **produce, paraphrase, reuse, or skip** an autonomous agent's deliverable" — the legitimate-write clause leads, so it cannot be misread as a blanket ban. **Load-bearing editorial check: PASS.**

### Piece-1 echo (OpenCode persona)
- ✓ `src/manifests/opencode/harness_local/body/ai-pm.body.md` gains a new "## Delegation & gate integrity" section ABOVE the existing failure-path / conditional sections, carrying the unified never-produce/paraphrase/reuse/skip statement, gate=fresh-spawn-THIS-turn, existing-artifact = "not run", and the named-rationalization ban (with the audit live-example). It closes with "This is an echo of the core **Delegation & gate integrity** invariant in `WORKFLOW.md` and `workflow/enforcement.md` — the same rule, not a divergent one" and frames the two following sections as its crash-route / ship-route instances. Consistent with (does not contradict) the existing failure-path/conditional sections. Matches arch note §4 (persona = harness-local echo).
- ✓ Regenerated `.opencode/agent/ai-pm.md` echo is content-identical to the source body (generator single-source intact). Root `AGENTS.md` carries no persona body → unchanged, as the state note records.

### No invariant dropped / weakened
- ✓ All seven `## Cross-cutting invariants` bullets present in WORKFLOW.md: pm-* agents, Project boundary, **Delegation & gate integrity** (in place of Edit-ownership), Remote-system boundary, Language canon, Decision authority, Read-on-demand. Nothing dropped or weakened.

### Cross-harness / golden
- ✓ `WORKFLOW.md` + `workflow/enforcement.md` are non-generated → `tests/generator.sh` 4/4 (Claude golden byte-identical). `tests/neutral-prose.sh` 5/5 (core rule reads harness-neutral — no "plugin"/"OpenCode session" in the core body; those stay in the harness-local sub-sections). The persona echo is OpenCode-only (manifest body + regenerated agent).

### Scenario coverage
- ✓ **Scenario 11** (stale-artifact re-run → re-spawn this turn, never present the on-disk artifact) — covered by `oc-stale-artifact-persona` (persona echo's existing-artifact = "not run" + named-rationalization ban) and the WORKFLOW/enforcement kernel.
- ✓ **Scenario 12** (kernel present + enforcement full rule + both carve-outs + artefact list intact, no false over-block) — covered by `core-delegation-invariant-present` + `edit-ownership-carveouts-preserved`.

### Tests — present, pass, non-vacuous (verified by injection)
- ✓ `tests/core-delegation.sh` `core-delegation-invariant-present` — PASS. Non-vacuous: removing "fresh spawn of the owning agent this turn" from WORKFLOW.md → the case FAILS.
- ✓ `tests/core-delegation.sh` `edit-ownership-carveouts-preserved` — PASS. Non-vacuous: removing "A second carve-out" from enforcement.md → the case FAILS.
- ✓ `tests/opencode.sh` `oc-stale-artifact-persona` — PASS. Non-vacuous: removing the ban clause from the **manifest source body** → the case FAILS (and the diff-clean guard also trips on the regen). NB: editing only the *generated* `.opencode/agent/ai-pm.md` does not fail, because opencode.sh regenerates `.opencode/` from source at startup — correct single-source behaviour, the source body is the true target.
- ✓ Full suite green on the committed tree: core-delegation 2/2, generator 4/4, neutral-prose 5/5, opencode 37/37, oc-plugin-unit 54/54, hooks 79/79, targeted-reading 7/7, ultra-absent 2/2.

### Product Contract
This change touches the protocol's own dogfood canon; relevant contracts: `cross-session-enforcement.md`, `project-boundary.md`, `documentation-discipline.md`, `disciplined-pipeline.md`. See Blocking #1 — the rename broke a single-source pointer cited by string in two of them. No user-facing end-product contract otherwise affected (this is constitution prose). Non-security project (no threat-model).

## Definition of Done
- [x] All plan scenarios (11, 12) implemented and tested
- [x] Interaction scenarios have concurrent-state tests — n/a (Piece 0/1 add no shared-state/async behaviour; the interaction scenarios in the plan belong to pieces 2/3, not built here)
- [x] Stack expectations respected; stack-spec tests pass — n/a for Piece 0/1 (no stack-notes surface touched; the stack entries are piece-2/3 plugin work)
- [ ] Product Contract honored; no silent behavior change — **see Blocking #1** (rename left a stale section-name pointer in two protocol contracts)
- [x] Pipeline green (all suites)
- [x] State file updated (`.ai-pm/state/current.md` records the piece-1-echo + extension-tests slice)
- [x] Product Impact Report present — n/a (no end-product user-facing contract touched)
- [ ] Docs updates landed — plan lists `doc/architecture.md` as deferred post-coding (acceptable); **but the rename's broken contract refs are not deferred-by-plan, see Blocking #1**
- [x] Expected artifacts exist (plan, this review; no end-product contract needed for constitution prose)
- [x/n/a] Product-readiness gate — n/a (not an end-user-facing feature; every scenario subject is the orchestrator/system, no human role)
- [n/a] Validation gate — software-kind project, no `## Validation` section emitted
- [x/n/a] Failure-inventory negative-space tests — n/a for Piece 0/1 (the piece-1 *failure-path* inventory belongs to the already-shipped pieces 1+2; this slice is the core hoist + persona echo, prose-grep-tested)

**DoD: fail** (one blocking item — stale contract cross-reference introduced by the section rename)

## Blocking
1. `.ai-pm/contracts/project-boundary.md:32` and `:56`, `.ai-pm/contracts/cross-session-enforcement.md:57` — the Piece 0 rename of the `workflow/enforcement.md` `##` heading from **"Boundary, edit-ownership, and remote-system rules"** to **"Boundary, delegation & gate integrity, and remote-system rules (full)"** left three single-source pointers in two protocol contracts citing the OLD section name by quoted string. The old name now resolves nowhere in `enforcement.md` (`grep -c` = 0), so these `§ "…"` references are broken. **Why it matters:** the contracts use these quoted section names as their authoritative single-source pointer ("the rules are single-sourced, not restated here: … in `workflow/enforcement.md` § '…'"). A pointer to a non-existent heading is exactly the canon-drift the single-source discipline exists to prevent — a reader/auditor following the contract lands nowhere. The diff changed the heading; the contract refs that depend on it must move with it. Fix: respawn the contract owner to update the three quoted section-name references to the new heading. (Note: `disciplined-pipeline.md:56` and `documentation-discipline.md:57` reference `doc/architecture.md § "Edit-ownership split"`, whose heading is *unchanged* in this slice — those are fine; only the two enforcement.md `§`-name citations are broken.)

## Notes (product)
1. The plan's "Extension docs to update" lists `doc/architecture.md` as a deferred post-coding pm-architect handoff to record the core-hoist (Delegation & gate integrity absorbs Edit-ownership) + the 4th variant. That handoff is correctly deferred and tracked in the state file's NEXT line — flagging only so the PM is aware the architecture decision-record is not in this branch (intended, per plan). Once pm-architect updates `doc/architecture.md` it should also reconcile the `§ "Edit-ownership split"` heading there if it renames it, so the `disciplined-pipeline.md` / `documentation-discipline.md` refs do not become the next stale pointer.

## Verdict
request-changes

<!-- The trail below is the ONE review section the orchestrator owns, not pm-plan-checker. -->
## Code review findings
**Pass-1 blocking finding RESOLVED** (the `## Verdict: request-changes` above was the contract-ref drift): the enforcement.md `##`-heading rename broke 3 single-source pointers (`project-boundary.md` ×2, `cross-session-enforcement.md` ×1) → fixed in `678e887` (refs repointed to the new heading; grep confirms zero live refs to the old name). Pass-1 is satisfied.

**Pass-2 `code-review` (cross-model: Sonnet)** — 3 findings, all real, all FIXED:
1. (`WORKFLOW.md:13` kernel) "reuses" unqualified → could be over-read as forbidding the orchestrator's legitimate Step-1 context READS of agent-owned docs. → `19dca0a`: added the qualifier "(reading an agent's artifact for context … is fine; the banned move is *presenting* it as this turn's gate result, not reading it)".
2. (persona `## What backs this rule`) gave a behavioral signal for the edit-route urge but none for the stale-artifact-reuse urge. → `3b867b4`: added the parallel signal ("about to read and relay an existing audit/review/plan in place of spawning the owner → same rule, stop and spawn fresh").
3. (`tests/core-delegation.sh` + `workflow/enforcement.md`) the carve-out test comment claimed a `state` token the grep omitted, AND `.ai-pm/state` (written by the orchestrator every turn) was absent from the enforcement.md Orchestration-artefacts carve-out list. → `19dca0a` added `.ai-pm/state` to the carve-out; `3b867b4` added the non-vacuous `state` assertion (verified it fails if the carve-out drops `.ai-pm/state`).

## Code review: FIXED — `19dca0a` + `3b867b4`
Re-verified independently: core-delegation 2/2, generator 4/4 (Claude byte-identical), opencode 37/37, neutral-prose 5/5, oc-plugin-unit 54/54, hooks 79/79, targeted-reading 7/7, ultra-absent 2/2.

## Verdict (Pass 2): approve
