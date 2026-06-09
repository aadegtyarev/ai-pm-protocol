# Product map — what the protocol guarantees, by contract

> **GENERATED** from `.ai-pm/contracts/` + git history — do not hand-edit.

> Status: **live** — contract in force. The protocol's product is its enforced behavioral guarantees; the primary consumer is the LLM/agent, alongside the PM. Each contract below leads with its value; the features that built or strengthened it are listed under `Built by:` as a name + date ledger (the durable "why/what" lives in the value prose above; per-feature plan/review evidence has evaporated to git).

## cross-model-review

A model reviewing its own work shares its own blind spots — it tends to miss exactly what it got wrong, and to over-rate its own output. This guarantee makes the reviewer a *different brain* by default: review and audit run on a model different from the session that planned and coded, so a second set of blind spots catches what the first missed. The PM gets this diversity out of the box, is always told which model is reviewing (never left guessing), and is never blocked by it — when no other model is available, the activity still runs on the session model and says so.

**Out of scope:**

- Choosing *which reviewer engine* runs — that is engine-selection (a different axis: engine = which reviewer, model = which brain); both coexist.
- Forcing a cross-model run when no other model exists — the path degrades to the session model rather than failing.
- Pinning the *session* model — that is a harness relaunch, unrelated to this config.

Built by:

| Feature | Added |
|---|---|
| cross-model-review | 2026-06-06 |
| review-typology-framework | 2026-06-05 |
| review-engine-selection | 2026-06-05 |

## cross-session-enforcement

Prose rules in a workflow document only hold while a session remembers to read them. A fresh AI session, a different model, or a long conversation that has paged the rules out would otherwise be free to do the forbidden thing. This guarantee makes the load-bearing rules *mechanical*: a small set of before-tool guards blocks the specific dangerous actions at the moment they are attempted — so the rules survive memory loss, model swaps, and session boundaries. Crucially, the guards are a named deny-list, not a blanket block, so they never get in the way of legitimate diagnostics or deployment.

**Out of scope:**

- Enforcing semantic judgements a regex cannot make (is this feature user-facing? is the product under-specified? is this a security-touch?) — those are soft-enforced by gates and backstops, deliberately not hooks.
- Blocking legitimate runtime, deployment, or read-only diagnostic work — the enforcement layer is a targeted deny-list, not a productivity wall.
- Realizing the same guards identically on every harness — the *rules* are harness-neutral, but the wiring and the available outcomes differ per harness (see the dual-harness contract).

Built by:

| Feature | Added |
|---|---|
| protocol-integrity-and-stack-literacy | 2026-05-30 |
| protocol-builtins-realignment | 2026-06-02 |
| bootstrap-write-loss-guards | 2026-06-06 |
| deny-review-orchestrator | 2026-06-05 |

## decision-authority

A protocol that asks the PM about *everything* is exhausting; one that decides *everything* itself is dangerous. This guarantee gives the dial two ends and a clear rule for which end applies to each fork. By default the PM answers each product fork (interactive). Optionally the pipeline resolves forks itself from the PM's bootstrap mandate and the project's own canon (autonomous) — but only when the answer is genuinely derivable from cited canon, announcing each decision before acting, and always escalating a fork that is not derivable, touches a security surface, or is irreversible/high-stakes. Whichever mode is in force, the PM keeps the final, irrevocable control: merge and ship never happen without them.

**Out of scope:**

- A numeric self-confidence threshold for auto-deciding — explicitly rejected (LLM self-confidence is mis-calibrated); the gate is a citable-canon test, not a confidence score.
- A formal backlog priority/ranking model — autonomous feature-selection uses a derivable-tiebreak floor and escalates on an absent tiebreak, not a scoring algorithm.
- Relaxing merge or ship — those stay manual in both scopes, always.
- Enforcing the modes via a hook — whether a gap is derivable is a semantic judgement a regex cannot make; enforcement is the soft gate plus the two citation backstops.

Built by:

| Feature | Added |
|---|---|
| automode | 2026-06-04 |
| automode-procedural-gates | 2026-06-04 |
| pm-decision-via-askuserquestion | 2026-06-03 |
| pm-product-advocate | 2026-06-04 |

## disciplined-pipeline

Whoever drives a change — an AI agent or the PM behind it — gets a single, predictable path from idea to shipped release, with independent checks wired into the path so that quality does not depend on anyone remembering to be careful. A change cannot quietly skip planning, skip review, or land half-finished: the pipeline makes the disciplined route the only route. The PM watches a plain-language conversation; the structure runs underneath it.

**Out of scope:**

- Deciding *what* a change should do — that is the planning conversation, not the pipeline's structural guarantee.
- Forcing the full pipeline onto a trivial change — the fast path exists for that, and substrate/backend work is proportioned by change type.
- Merging or shipping automatically — the ship gate stays manual (see the decision-authority contract).

Built by:

| Feature | Added |
|---|---|
| template-v2 | 2026-05-28 |
| integrate-consultancy | 2026-05-30 |
| review-stamp-gate | 2026-06-04 |
| optimize-without-losing-rigor | 2026-05-30 |

## documentation-discipline

Documentation that is written once and never updated is worse than none — it lies. This guarantee makes the doc set a living, owned thing: every project (greenfield or legacy, and the protocol itself) gets a full documentation set bootstrapped at the start, and each document has an owning agent that refreshes it when a landed feature changes it. The PM never has to author or chase documentation; the agents keep architecture, journeys, the product front door, stack notes, and (on security-bearing projects) the threat model current. The protocol proves the discipline by developing itself under it.

**Out of scope:**

- Authoring the *product* decisions the docs record — the docs capture decisions the PM made; this guarantee maintains the docs, not the product strategy.
- Generating documentation a project does not need — non-applicable sections are marked `N/A`, and a non-security project gets no threat model.
- Running product-behavior tests for downstream documentation — validation for a docs-kind deliverable is by dry-run/sign-off, not a runtime test (the disciplined-pipeline `## Validation` stamp).

Built by:

| Feature | Added |
|---|---|
| template-v2 | 2026-05-28 |
| architect-owns-architecture-md | 2026-05-30 |
| legacy-reader-role-split | 2026-06-04 |
| threat-model-ownership-and-lifecycle | 2026-06-04 |
| doc-migration-on-template-bump | 2026-06-04 |

## dual-harness-from-one-source

The protocol's guarantees should not be tied to one AI coding tool. This guarantee lets it run on two harnesses (Claude Code, and OpenCode in preview) without maintaining two divergent copies: a single harness-neutral source generates both adapters, and the shared instruction prose refers to every harness-specific concept by a neutral noun (the project entry file, the structured-question tool, the enforcement layer, the instruction-loading mechanism) resolved per harness through one reference table. The PM can adopt the protocol on either harness and get the same disciplined behavior; the agent loads an adapter that is faithful to the single source.

**Out of scope:**

- Harnesses beyond Claude Code and OpenCode — the architecture generalizes to N adapters, but Cursor, Codex CLI, Aider, and similar are not built.
- Full OpenCode certification this slice — OpenCode is a labeled preview gated on tracked upstream gaps; the source/distribution repo split (stage b) is PM-gated/pending.
- Imposing a build, toolchain, or generator on downstream — downstream always gets pre-built plain files.

Built by:

| Feature | Added |
|---|---|
| opencode-harness-support | 2026-06-07 |
| harness-neutral-prose | 2026-06-07 |
| opencode-orchestrator-primary | 2026-06-07 |
| per-operation-effort-tiering | 2026-06-07 |
| opencode-compact-reviewer | 2026-06-08 |

## plan-fidelity

When the PM approves a plan, they are approving a promise: this is what will be built. Plan-fidelity makes that promise mechanical — an independent checker confirms that every scenario in the approved plan is actually implemented *and* tested before the change is allowed to pass, and that the change did not quietly grow beyond or shrink below what was agreed. The PM never has to read code to know the plan was honored; the agent cannot pass a half-built or scope-crept change.

**Out of scope:**

- Judging whether the plan itself was a good idea — fidelity checks faithfulness to the approved plan, not its merit (that is the planning conversation and the product-readiness gate).
- Technical bug-hunting — that is Pass 2 (the disciplined-pipeline / regression-protection guarantees), a separate pass from plan-compliance.

Built by:

| Feature | Added |
|---|---|
| integrate-consultancy | 2026-05-30 |
| protocol-integrity-and-stack-literacy | 2026-05-30 |
| optimize-without-losing-rigor | 2026-05-30 |

## product-readiness-gate

The orchestrator both elicits product detail from the PM and pushes toward coding — player and referee at once — so an under-specified product could otherwise sail straight into implementation. This guarantee inserts an *independent* product referee between planning and coding: on every user-facing feature it checks the plan against a fixed set of foundational product questions and holds the handoff to the coder until each gap is either answered or deliberately descoped with a recorded reason. The PM gets a structural safeguard against building the wrong or half-defined thing, and the answer always stays the PM's — the referee judges presence of an answer, never its quality.

**Out of scope:**

- Grading the quality of the PM's answers — the gate checks that each foundational gap has a recorded answer or descope, not whether the answer is good.
- Running on non-user-facing work — substrate, infra, docs-only, trivial, and diagnostic changes are exempt by design (a blanket gate would strangle legitimate substrate work).
- Deciding the answer itself in interactive mode — the gate surfaces gaps to the PM; autonomous resolution of a derivable gap is the decision-authority contract's concern.

Built by:

| Feature | Added |
|---|---|
| pm-product-advocate | 2026-06-04 |
| integrate-consultancy | 2026-05-30 |

## project-boundary

An AI agent loose on the filesystem — reading sibling repos, editing production files in place — is a trust and integrity hazard. This guarantee draws two hard lines. First, every agent stays inside the project root: no parent directories, no sibling repositories, no protocol-internal submodule content beyond the named shipped surface. Second, any file the repository owns changes through git, never by an in-place edit on a remote system — so the git history stays the single source of truth and a "tiny obvious fix" on a server cannot silently diverge from the repo. The PM gets a self-contained project whose real state always lives in git.

**Out of scope:**

- Blocking legitimate remote work — read-only diagnostics, deployment via the project's own channel, and PM-initiated maintenance proceed; only silent edits to repo-owned files are forbidden.
- Enforcing semantic ownership judgements a regex cannot make — the edit-ownership rule (who writes which artifact) is orchestrator discipline plus gates, distinct from the path/remote guards this contract enforces.
- Reaching into the protocol submodule's internal history — that surface is excluded by design.

Built by:

| Feature | Added |
|---|---|
| protocol-integrity-and-stack-literacy | 2026-05-30 |
| protocol-builtins-realignment | 2026-06-02 |
| orchestrator-read-discipline | 2026-06-05 |
| agent-reporting-discipline | 2026-06-06 |

## regression-protection

The most dangerous failure in fast development is the silent regression — a new feature that quietly breaks an old one nobody re-tested. This guarantee closes that: every user-facing feature carries a Product Contract naming, in plain language, what it must do and what must never break; whenever a change touches that feature, those promises are re-checked against the diff, and a violation blocks the PR rather than slipping through. The PM gets durable, accumulating protection of everything the product already promises, without re-describing it each time.

**Out of scope:**

- Protecting behavior of a change that has no user-facing surface — backend/infra refactors carry no contract unless they change visible behavior.
- Judging whether a promise is *worth* keeping — the PM owns the meaning of each must-work / must-not-break item; this guarantee only enforces that recorded promises survive.

Built by:

| Feature | Added |
|---|---|
| integrate-consultancy | 2026-05-30 |
| contract-two-layer-token-lint | 2026-06-03 |
| nfr-operational-limits-prompt | 2026-06-04 |
| contract-centric-product-map | 2026-06-02 |

## Infrastructure (no user-facing contract)

Protocol-internal features (48) that strengthen the system but are not linked to a specific contract above. The feature name + date is the ledger entry; the full record lives in git history.

| Feature | Added |
|---|---|
| agent-handoff-durability | 2026-06-06 |
| ai-minimums-linter-wiring | 2026-06-05 |
| architecture-doc-coherence | 2026-06-02 |
| audit-fixup-hooks-quoted-form | 2026-05-30 |
| audit-fixup-self-docs-architecture | 2026-05-30 |
| audit-fixup-self-stack-notes | 2026-05-30 |
| audit-scope-menu | 2026-06-05 |
| behavioral-contract-and-human-journeys | 2026-06-03 |
| bootstrap-populated-journeys | 2026-06-04 |
| changelog-backfill | 2026-05-30 |
| changeset-hygiene | 2026-06-05 |
| comment-restraint | 2026-06-06 |
| context-leanness | 2026-06-07 |
| diagnostic-flow-discipline | 2026-06-05 |
| diagnostic-probe-mode | 2026-06-02 |
| doc-frugality | 2026-06-09 |
| documentation-flavor | 2026-06-04 |
| english-canonical-artifacts | 2026-06-03 |
| extract-migrations-reference | 2026-06-03 |
| integration-risk-spike-gate | 2026-06-06 |
| invariants-index | 2026-06-04 |
| markdown-blank-line-sweep | 2026-06-03 |
| on-hardware-blast-radius-preflight | 2026-06-04 |
| opencode-compact-reviewer | 2026-06-08 |
| opencode-orchestrator-primary | 2026-06-07 |
| orchestrator-anti-corner-cutting | 2026-06-08 |
| per-operation-effort-tiering | 2026-06-07 |
| product-map-migration-detection | 2026-06-02 |
| product-map-value-first | 2026-06-03 |
| product-md-front-door | 2026-06-02 |
| protocol-process-flavor | 2026-06-04 |
| readme-currency | 2026-06-05 |
| readme-front-gate | 2026-06-03 |
| readme-rewrite | 2026-06-04 |
| readme-template-canonical-shape | 2026-06-05 |
| readme-workflow-split | 2026-05-30 |
| route-reminder-coverage-and-prprep-model | 2026-06-03 |
| seam-completeness | 2026-06-06 |
| semgrep-pre-review-linter | 2026-06-06 |
| severity-triage-deployment-context | 2026-06-06 |
| stack-idioms-library | 2026-06-06 |
| state-archive-home | 2026-06-06 |
| state-model-section | 2026-06-05 |
| taxonomy-drift-sweep | 2026-06-04 |
| template-dev-artifacts-inert | 2026-06-06 |
| test-wiring-parity | 2026-06-05 |
| workflow-extract-to-refs | 2026-06-05 |
| workflow-progressive-disclosure | 2026-06-05 |
