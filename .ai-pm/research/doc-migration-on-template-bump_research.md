# Research: doc-migration-on-template-bump

## What we looked for

How mature ecosystems migrate a project's **existing** documentation / config / structure
up to a **new version** of a framework or template — especially how they split the
**mechanical** parts (do automatically) from the **human-judgment** parts (surface to a
person) — so we can design a flow that, on a template bump, brings a downstream project's
docs up to the new template's expectations **in partnership with the PM**.

## Bottom line first

The closest existing model is the **template-update tool family** — **Copier** (and `cruft`
for cookiecutter): the only tools that *update an already-scaffolded project to a newer
template version and reconcile the drift*, which is exactly our situation (a downstream
project scaffolded from our template, the template moves ahead, bump the submodule). Borrow
its **regenerate-and-diff + conflict-marker** mechanism. From the framework-codemod world,
borrow the **load-bearing marker** (the single most important finding): do the mechanical
transform automatically, then surface anything needing judgment as a marker the human
**cannot ignore** because a gate fails until it's resolved. From databases/packaging, borrow
**version-stamp + three-way comparison** for proportionality and idempotence.

Crucially, our protocol **already owns both halves** — `MIGRATIONS.md` (mechanical,
detect-condition → procedure) and the `pm-product-advocate` pattern (generate questions →
orchestrator relays to PM). This feature is largely **wiring them into a bump-triggered
flow**, not building from scratch.

---

## Candidates

### Copier (and cruft) — template-update tools  ← closest analogue

**What it is:** A scaffolding tool that can later **update** a project it generated when the
template publishes a new version, reconciling the template's new changes against the edits
the project made locally. (`cruft` does the same for cookiecutter templates.)

**How it works (the mechanism to imitate):** a **three-way regenerate-and-diff** — regenerate
a fresh project from the *old* template version, diff that against the project's *actual
current* files to capture local edits, apply the *new* template version, then re-apply the
captured edits. What it cannot reconcile is surfaced as **git-style inline conflict markers**
(default) or per-file `.rej` files, which the human reviews manually before committing. The
"what was this generated from" state lives in a **committed `.copier-answers.yml`** plus Git
tags on the template — so the delta is computable from versioned text + a stored state file,
**no runtime introspection**.

**Solves our problem:** partially — it is the right *shape* (update-scaffolded-project,
reconcile-drift) and the right *mechanism* (three-way diff, conflict markers, committed
state). It does **not** do semantic analysis of prose docs (it diffs files, doesn't reason
about "this new required section needs PRODUCT content") — that gap is exactly what our LLM
subagents add.

**Would work for us:** as the **base model**, yes. Conflict markers in Markdown + a committed
"last-applied template version" are PM-readable in a normal Git review, no runtime needed.
**Caveat:** Copier has a CLI runtime that executes the merge; we have none, so we supply the
execution layer (a slash command + subagent driving Git diff + a state file).

**Sources:** <https://copier.readthedocs.io/en/stable/updating/>,
<https://copier.readthedocs.io/en/stable/configuring/>, <https://cruft.github.io/cruft/>

### Framework codemods (Next.js, Angular) — the load-bearing-marker pattern  ← most important technique

**What it is:** Automated transforms that rewrite a project's code for a new framework
version (`@next/codemod upgrade`, Angular's standalone-migration schematic).

**The key finding:** where the transform **can't decide**, it does **not** silently skip —
it inserts a **load-bearing marker** that forces the human to act:

- Next.js inserts `@next-codemod-error` comments / `UnsafeUnwrapped` typecasts that
  **intentionally break the build** until a human removes them (an explicit
  `@next-codemod-ignore` escape hatch exists — itself a deliberate acknowledgment).
- Angular auto-transforms most code, leaves `TODO(standalone-migration): …` markers where it
  can't, **plus** an explicit "After the migration" human-action checklist.
- Both are **interactive at decision points** ("you may be prompted to choose which codemods
  to apply") — propose-then-confirm, not blanket auto-apply.

**Would work for us:** strongly — this is how we make the PM step **un-skippable**. The
no-runtime analogue: leave a marker in the doc + a **gate** (`pm-audit` / `pm-plan-checker`)
that **fails until the marker is cleared** — exactly the protocol's existing review-stamp
"loud marker + load-bearing gate" pattern.

**Sources:** <https://nextjs.org/docs/app/guides/upgrading/codemods>,
<https://angular.dev/reference/migrations/standalone>

### dpkg conffile handling — the gold-standard proportionality model

**What it is:** How Debian package upgrades handle a changed config file already on disk.

**The key finding (proportionality):** a **three-way comparison** (new package vs last
package vs the file on disk) yields four cases, and it **prompts the human ONLY when BOTH the
maintainer and the user changed the file**. Neither changed → left alone; only the user
changed → their edits kept silently; only the maintainer changed → new version installed with
an informative message; **both changed → human must resolve.**

**Would work for us:** directly — this is the answer to "never re-nag." Compute independently
*"did the PM customize this doc?"* and *"did the template change this section in the new
version?"* — surface a decision **only when both are true**. Already-adequate docs are never
re-flagged.

**Source:** <https://www.debian.org/doc/debian-policy/ap-pkg-conffiles.html>

### terraform plan→apply, and "doctor" tools — diagnose/preview vs gated apply

**What it is:** `terraform plan` is a **non-mutating preview** ("does not carry out the
changes") designed for human/team review; `terraform apply` then **prompts for approval**
before acting (`-auto-approve` is the explicit opt-out). `flutter doctor` / `brew doctor`
diagnose problems with per-item status markers and **recommend** manual fixes rather than
auto-applying.

**Would work for us:** this is our **top-level flow skeleton** — *analyze → present a
reviewable gap report/plan to the PM → PM approves → apply*, with approval as the **default
gate**, and a doctor-style per-item status list as the PM-facing report format.

**Sources:** <https://developer.hashicorp.com/terraform/cli/commands/plan>,
<https://developer.hashicorp.com/terraform/cli/commands/apply>,
<https://docs.flutter.dev/install/troubleshoot>

### Migration registries (Django) — computing the delta without a runtime

**What it is:** Django treats migrations as version control for the schema and computes the
delta by **replaying the ordered migration history into an in-memory target state**, then
diffing that against the current `models.py` — **"rather than introspecting live state."** It
also draws a clear **mechanical-vs-human boundary**: schema migrations auto-generate, but
"can't automatically generate **data** migrations for you"; on ambiguity it prompts and
auto-resolves "only if it thinks it's safe enough." Idempotence is a **version stamp**
(applied-migrations) so a re-run is a no-op.

**Would work for us:** this is the second half of "how to represent what version N expects" —
ship an **ordered, versioned set of expectation artifacts** in the template; the *target* for
version N is derived from them; the *gap* is a pure text diff against the project's current
docs. And the mechanical(structural)-auto / human(semantic)-routed split maps onto our
`MIGRATIONS.md`-vs-`pm-product-advocate` division.

**Source:** <https://docs.djangoproject.com/en/6.0/topics/migrations/>

---

## Conclusion

**(a) Closest base model — template-update (Copier), composed with two borrowed techniques.**
Build on Copier's *update-scaffolded-project / reconcile-drift* shape; borrow the
**load-bearing marker** from framework codemods for the human-judgment surface; borrow the
**version-stamp + three-way comparison** from databases/packaging for idempotence and
proportionality. We are NOT a codemod (we don't rewrite the project's own code) and NOT a
pure migration-registry (we reconcile against an external template) — we are template-update.

**(b) How to represent "what version N expects" without a runtime.** A **versioned, diffable
expectations spec** shipped in the template — a per-version manifest of the disciplines/
required sections that version introduced (e.g. "v2.8 → `## Behavioral contract`", "v2.13 →
populated threat-model lifecycle", "v2.16 → journeys owned by pm-architect"). This **extends
what already exists**: `MIGRATIONS.md`'s single-source `### Pending-migration detection` is
already a versioned, by-name-referenced condition list — grow it from *structural* detect
conditions to also carry *semantic* "new discipline in vN" entries. The project's **current
version is already recorded by the git submodule pointer**; a small committed
"last-migrated-to" stamp (the `.copier-answers.yml` analogue) keeps re-runs proportional.

**(c) Split mechanical-auto vs human-surfaced-to-PM — the protocol already has both halves.**
- **Mechanical / structural** (a section renamed, a file moved, a header migrated) → the
  existing `MIGRATIONS.md` procedures auto-apply, as today.
- **Semantic / content** (a new required section that needs PRODUCT content the PM must
  author — foundational journeys, threat-model assets, a value statement) → routed to the PM
  via the **`pm-product-advocate` pattern**: a subagent *generates* the gap questions, the
  orchestrator *relays* them in **one `AskUserQuestion` pass**, the PM answers or descopes.
  Anything deferred leaves a **load-bearing marker** that a gate flags until resolved.

**(d) Proportional and idempotent.** Apply the **dpkg three-way rule**: surface a gap only
when *the new version changed/introduced that discipline* AND *the project doesn't already
satisfy it* — never re-flag adequate docs. Stamp the last-migrated version so a re-run on an
already-migrated project surfaces nothing (Copier/terraform "zero changes"); optionally a
self-check asserting **"second run = zero gaps."**

**Where it lives (to settle in `/pm-plan`):** most likely a **new command** run after the
submodule bump (e.g. `/pm-migrate-docs`) wired into `WORKFLOW.md` § "Maintenance", **reusing**
the `MIGRATIONS.md` detection registry (mechanical), the `pm-product-advocate` relay pattern
(semantic), the `/pm-audit` doc-currency machinery (gap detection), and the review-stamp
**loud-marker + load-bearing-gate** pattern (un-skippable PM step). An `--upgrade` mode of
`/pm-audit` is the alternative. This is an **integration/wiring feature**, not greenfield.

## Open questions (carry into `/pm-plan`)

- **Encoding semantic expectations for prose.** None of the cited tools handle free-text
  semantic gaps ("a new required section needing PM-authored content"). What is the minimal
  machine-checkable spec an LLM subagent can diff against **without false positives** — a
  required-section manifest? a per-version conformance checklist? This is the genuinely novel
  part (everyone else diffs code/structured config).
- **The committed state file.** What is our `.copier-answers.yml` analogue, given submodule +
  symlink delivery — is the submodule pointer enough, or do we add a small
  "last-migrated-to-version + deferred-gaps" stamp in the downstream's `.ai-pm/`?
- **Load-bearing marker in a no-runtime template.** Realize it as an unresolved-marker check
  in `pm-audit` / `pm-plan-checker` that blocks until cleared — and define the
  explicit-acknowledgment **escape hatch** (the `@next-codemod-ignore` analogue) so a PM can
  *consciously defer* a gap without it being silently lost (mirrors the advocate's
  descope-with-rationale).
- **cruft specifics** were named but not independently verified here (only Copier was) — if we
  lean on the template-update model, confirm cruft's drift-reconciliation adds nothing Copier
  doesn't.

## Sources

Primary (load-bearing):

- [Copier — Updating a project](https://copier.readthedocs.io/en/stable/updating/) · [Copier — Configuring](https://copier.readthedocs.io/en/stable/configuring/)
- [cruft](https://cruft.github.io/cruft/)
- [Next.js — Codemods (upgrade)](https://nextjs.org/docs/app/guides/upgrading/codemods)
- [Angular — Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Debian Policy — Configuration files (conffiles)](https://www.debian.org/doc/debian-policy/ap-pkg-conffiles.html)
- [Terraform — plan](https://developer.hashicorp.com/terraform/cli/commands/plan) · [Terraform — apply](https://developer.hashicorp.com/terraform/cli/commands/apply)
- [Django — Migrations](https://docs.djangoproject.com/en/6.0/topics/migrations/)
- [Flutter — Troubleshoot (doctor)](https://docs.flutter.dev/install/troubleshoot)

Supporting:

- [Terratest — idempotence definition](https://terratest.gruntwork.io/docs/testing-best-practices/idempotent/)
- [JSON Schema — `$schema` versioning](https://json-schema.org/understanding-json-schema/reference/schema)

---

*Research run 2026-06-04 via `deep-research` (5 angles, 19 sources fetched, 87 claims
extracted, 25 adversarially verified at 3-vote, 0 killed).*
