# Research: automode

## What we looked for

Whether (and how) to add an **autonomous decision-authority mode** — the PM front-loads intent +
boundaries once at bootstrap, then the pipeline resolves later product-forks autonomously from
that baseline + the project canon, recording each auto-decision with rationale, and escalating
only when a fork is genuinely unresolvable. The inverse of `pm-product-advocate` (which blocks
until the PM answers). "Confidence" here is an LLM judgment over prose docs, not a calibrated
number; no runtime.

## Bottom line first

The authoritative literature converges cleanly, and it **validates the backlog sketch with one
correction and one concrete fix:**

- **Shape = graded + per-context, NOT a whole-project on/off.** SAE J3016 classifies *features*
  not vehicles; Parasuraman-Sheridan-Wickens make autonomy four independently-tunable stages;
  Sheridan-Verplank give a 10-rung ask/act ladder. → automode should be **per-feature** (a
  project-level default + per-feature override), capped by the baseline — not a single binary.
- **The bootstrap baseline = an Operational Design Domain (ODD).** It front-loads **where** the
  agent may act autonomously; a fork **outside** it automatically drops to "ask". This is the
  cleanest formalization of the backlog's "resolve from the baseline, escalate when outside it".
- **Ask-vs-act = selective prediction / reject-option / learning-to-defer** (emit a decision only
  when a gate passes, else abstain + defer). BUT every rigorous version assumes a **calibrated
  numeric score**, which we don't have → we borrow the **shape**, not the math.
- **The honest no-number proxy = a baseline-coverage / derivability test:** "is this fork's answer
  *derivable from cited project canon + the bootstrap mandate*?" Yes → auto-resolve **with the
  cited passage + rationale**; No → out-of-mandate → **escalate** (raw LLM confidence is
  overconfident and a weak deferral signal — do **not** threshold on it).
- **Anti-rubber-stamp:** the rationale must be committed **before** acting, and **escalation is a
  first-class recorded event**; the human reviews the batch after the fact.
- **The failure mode to design against = automation complacency / over-trust** (the human-factors
  twin of "confabulating a direction the baseline never implied"). → autonomy is an **upper
  bound, never required**; proportionality: **high autonomy is unsuitable for high-stakes /
  irreversible / human-must-take-over forks** — those escalate regardless of mode.

Crucially this **reuses the advocate machinery**: the advocate still generates the foundational
gaps; automode redirects each gap to *derive-from-canon-or-escalate*, recorded in the advocate's
`## Resolutions` trail (now "the list of decisions that got auto-made").

---

## Candidates / frameworks

### SAE J3016 driving-automation levels + the ODD concept — the graded-autonomy + boundary model

**What it is:** the canonical L0–L5 ladder for *who does what / who falls back*, and the
**Operational Design Domain** — the full set of conditions a feature was designed to handle.

**Key findings:** "Levels describe **features, not vehicles**" (Koopman) — a system runs at
different levels per engaged feature. And "at L3–4 the system can **only** be engaged within the
ODD; if engagement outside the ODD is possible, it is L1/L2 by definition."

**Contributes:** per-feature autonomy (not whole-project); the **baseline = the ODD** — declared
once, it bounds where automode may act; a fork outside the ODD is by definition an "ask".
**Downside/fit:** L3 has a documented hand-off hazard (the human must re-engage on the boundary);
analogizing driving→dev-protocol is a reasoned transfer, not a documented application.

**Sources:** <https://users.ece.cmu.edu/~koopman/j3016/index.html>

### Parasuraman-Sheridan-Wickens + Sheridan-Verplank — levels of automation (LOA)

**What it is:** autonomy as four independently-tunable stages (information acquisition / analysis
/ decision-and-action selection / action implementation), each low→high; plus the 10-rung
decision/action ladder (human-does-all → suggest → narrow → execute-after-approval → veto-window
→ … → fully autonomous).

**Key finding:** the appropriate level is set by **evaluative criteria** (human-performance
consequences, then reliability + cost-of-error), and **the recommended level is an UPPER BOUND,
not a required level** — "burden of proof on the designer". High decision-automation causes
situation-awareness loss + skill degradation, so it "may not be suitable" where a human must take
over.

**Contributes:** automode should be **capped, not forced**; the "veto-window" rung (auto-resolve
but pause for override) is an option to weigh; autonomy is justified by stakes, not default.
**Downside:** the LOA ladder is definitional/old (1978/2000), an anchor not an empirical result.

**Source:** <https://www.cs.uml.edu/~holly/91.549/readings/sheridan-autonomy.pdf>

### Selective prediction / reject-option / learning-to-defer — the ask-vs-act mechanism

**What it is:** a model emits a prediction only when a **selection function** passes; otherwise it
says "don't know" and defers to a human (Geifman-El-Yaniv SelectiveNet/SGR; Mozannar-Sontag
learning-to-defer; Franc et al. reject-option). The human sets a **target risk/coverage in
advance**; the boundary is "abstain when expected risk exceeds the reject cost".

**Key finding for us:** **raw confidence-thresholding is a weak signal** — jointly-trained
deferral beats naive confidence-thresholding, and softmax confidence is "widely documented as
overconfident". So we take the **architecture (front-loaded gate + abstain-and-defer)**, NOT a
confidence number.

**Contributes:** the exact ask-vs-act shape — a human-front-loaded operating point + a
defer-when-unresolvable rule. **Downside/fit:** all assume a calibrated numeric score we lack →
shape only, not threshold. **Source:** <https://arxiv.org/pdf/2006.01862>, <http://proceedings.mlr.press/v97/geifman19a/geifman19a.pdf>, <https://jmlr.org/papers/volume24/21-0048/21-0048.pdf>

### The no-number proxy — a baseline-coverage / derivability test (synthesized, medium-conf)

**What it is:** since we have no calibrated score and LLM self-confidence is overconfident, the
honest gate is a **derivability test**: *is the fork's answer derivable from cited project canon
(product.md / architecture / contracts / prior decisions / declared standards) + the bootstrap
mandate?* Derivable → auto-resolve, **citing the specific canon passage** + rationale.
Not-derivable → out-of-mandate → escalate.

**Contributes:** the practical ask-vs-act gate for a prose-only protocol; the citation requirement
is the anti-confabulation guard (no canon passage → no auto-decision). **Downside:** it is a
*synthesized inference* (no single source states it verbatim) — medium confidence; the exact
"what counts as derivable vs an inference gap" is an open design question.

### Reviewability trail + pre-committed rationale — the anti-rubber-stamp logging

**What it is:** Cobbe-Lee-Singh (FAccT 2021) "reviewability" — record-keeping across the **whole**
decision pipeline (factors, inputs, reasoning, alternatives, rationale), because model-centric
explanations alone are insufficient for accountability. FINOS AIR MI-21: "explicit reasoning
generated and logged **in advance** of tool calls". IETF agent-audit-trail draft: **escalation as
a first-class logged event** (reason, target, context, urgency).

**Contributes:** auto-decisions recorded with rationale **committed before acting** (resists
post-hoc justification); escalation logged explicitly; the human reviews the **batch** after the
fact. Maps onto the advocate's `## Resolutions` trail (reused). **Downside/fit:** MI-21 assumes a
runtime numeric confidence field (drop it); the IETF draft is a v00 individual draft (illustrative
structure only). **Sources:** <https://arxiv.org/abs/2102.04201>, <https://air-governance-framework.finos.org/mitigations/mi-21_agent-decision-audit-and-explainability.html>

### Automation complacency / over-trust — the failure mode to design against

**What it is:** when automation is highly-but-not-perfectly reliable, the operator stops
monitoring and fails to detect failures (over-trust / complacency), worst under multitasking;
high decision-automation degrades situation awareness and skill.

**Contributes:** the human-factors twin of **confabulation from an under-specified baseline** —
the dominant risk for automode. → autonomy capped (upper bound); proportionality guard (high
autonomy unsuitable for high-stakes / irreversible / must-take-over forks); the derivability gate
+ batch review + a reversal-on-review signal are the countermeasures. **Source:** Parasuraman-Sheridan-Wickens (above).

---

## Conclusion (maps to our protocol)

**(a) Shape — per-feature, capped, not a whole-project binary.** A `## Decision authority:
autonomous | interactive` **default in `CLAUDE.md`** (default `interactive`) **plus a per-feature
override** (the plan may set it), since J3016/LOA say autonomy is per-feature/per-function and an
**upper bound**. The bootstrap baseline (product.md / architecture / constraints / declared
standards) is the **ODD/mandate** that bounds where autonomous resolution is allowed. (This
refines the backlog's project-level sketch toward graded/per-feature.)

**(b) Ask-vs-auto-resolve WITHOUT a number — the derivability gate.** The advocate still generates
each foundational-question gap. In autonomous mode, for each gap run the **baseline-coverage
test**: is the answer **derivable from cited project canon + the mandate**? **Derivable →
auto-resolve**, recording the **cited canon passage + rationale** (committed before acting).
**Not derivable → escalate** (the existing one-`AskUserQuestion` relay). Never threshold on raw
LLM confidence (overconfident).

**(c) Auto-decision trail that resists rubber-stamping = the advocate's `## Resolutions`, reused.**
Each entry: the gap, the resolution, the **cited canon passage**, the rationale (pre-committed),
and an **`auto` vs `escalated` marker**. The human reviews the **batch** after the fact; a
`pm-plan-checker`/`pm-auditor` check can require every `auto` entry to cite canon (anti-confabulation,
presence-keyed — the protocol's shape-not-meaning style).

**(d) Escalation rule.** A fork **outside the mandate / not derivable from canon**, OR a
**high-stakes / irreversible** fork, → **ask even in automode**; escalation is a first-class
recorded entry. The mandate boundary is the bootstrap baseline (the ODD).

**(e) Failure modes + proportionality guard.** Design against **confabulation from an
under-specified baseline** (the citation requirement is the guard: no canon → no auto-decision) and
**over-trust/complacency** (autonomy is an upper bound; high-stakes/irreversible always escalate;
batch review + a **reversal-on-review** metric flags mis-calibration). Automode pays off for an
experienced PM with a **rich** baseline; on a thin baseline it should mostly escalate (which is the
correct, safe behavior).

**Build vs adapt:** no off-the-shelf tool fits a no-runtime prose protocol; we **adapt** the
shape (ODD-as-baseline, abstain-and-defer, reviewability trail, capped autonomy) onto the
**existing advocate + Resolutions + AskUserQuestion-relay** machinery. Largely a wiring/redirect
feature, not greenfield — exactly the backlog's framing ("the advocate becomes the list of
auto-made decisions").

## Open questions (carry into `/pm-plan`)

- **Concrete form of the derivability test** — must each `auto` entry **quote a specific canon
  passage**? What counts as "derivable" vs an inference gap that must escalate? (The
  anti-confabulation guard's exact shape.)
- **Drift / OOD over a long pipeline** — the canon may silently fail to cover later forks; is a
  **periodic re-confirmation** with the PM warranted even within automode?
- **Veto-window vs binary** — auto-resolve-but-pause-for-override (J3016 L3 / Sheridan rung 6)
  vs binary auto-resolve|ask; the veto-window carries the documented hand-off-readiness hazard.
- **Review cadence + mis-calibration metrics** — real-time vs batch review of the auto-decision
  log; what signals (escalation rate, reversal-on-review rate) say automode is mis-calibrated.
- **Relationship to the ship gate** — does automode relax only the *product-fork* questions, or
  also Step 6 (A/B/C ship)? (Lean: keep merge/ship authority with the PM.)

## Sources

Primary / authoritative:

- [SAE J3016 — Koopman User Guide (levels + ODD)](https://users.ece.cmu.edu/~koopman/j3016/index.html)
- [Parasuraman–Sheridan–Wickens / Sheridan–Verplank — Levels of Automation](https://www.cs.uml.edu/~holly/91.549/readings/sheridan-autonomy.pdf)
- [Mozannar–Sontag — Consistent Estimators for Learning to Defer](https://arxiv.org/pdf/2006.01862)
- [Geifman–El-Yaniv — SelectiveNet](http://proceedings.mlr.press/v97/geifman19a/geifman19a.pdf)
- [Franc–Průša–Voráček — reject-option (JMLR 2023)](https://jmlr.org/papers/volume24/21-0048/21-0048.pdf)
- [Cobbe–Lee–Singh — Reviewable Automated Decision-Making (FAccT 2021)](https://arxiv.org/abs/2102.04201)
- [FINOS AIR — MI-21 agent decision audit & explainability](https://air-governance-framework.finos.org/mitigations/mi-21_agent-decision-audit-and-explainability.html)

Supporting (illustrative, weaker standing):

- [IETF agent-audit-trail draft (v00 — escalation as a logged event)](https://datatracker.ietf.org/doc/draft-sharif-agent-audit-trail/)

---

*Research run 2026-06-04 via `deep-research` (5 angles, ~19 sources, claims extracted, 25
adversarially verified at 3-vote, 0 killed; selective-prediction frameworks assume a calibrated
score we lack — the no-number derivability proxy is a synthesized medium-confidence inference,
flagged).*
