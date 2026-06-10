# Review: threat-model-module (Slice 1)

Reviewer: fresh context. Plan: `.ai-pm/plans/threat-model.md`. Branch: `feature/threat-model-module`.

## Code review: approve

Two findings from the prior pass were both fixed. No collateral. All gates green. Approved to ship.

---

### Finding 1 (moderate) — `modules.json` carries an undocumented `floor` field that duplicates `architecture.md:95`

**File and lines:** `modules.json:20` and `architecture.md:95`.

The threat-model entry in `modules.json` has a `floor` annotation field:

> `"floor": "The never-off part (for a security-relevant change the threats MUST be named and considered) stays in the role floor bodies — … modules.json carries no floor prose (single-home)."`

`architecture.md:95` already states the same fact:

> `Its FLOOR (a security-relevant change must have its threats named and considered) stays in the role floor bodies`

This is a second copy of the same statement — invariant-6 violation. The contradiction is visible within the field itself: it says "modules.json carries no floor prose (single-home)" while being floor prose. Additionally, `floor` does not appear in `_row_shape` (`modules.json:3–10`), so the field is undocumented by the schema the file defines, and the `_doc` (`modules.json:2`) says the file "carries only the DEEPENING (toggle · per-kind defaults · targets · fragment pointers)" — which this field violates.

The field is never read by the assembler (`adapter/modules.mjs` has no reference to `mod.floor`) so there is no runtime bug, but the documentation surface has a second home for a fact that should have one.

**Fix:** drop the `floor` field from the `threat-model` entry. The `_doc` already says the floor stays in the role bodies and points to `architecture.md`; `architecture.md:95` is the single home.

---

### Finding 2 (moderate) — `ai-pm.config.json` `_modules` cross-references a section that does not exist in `PROTOCOL.md`

**File and line:** `ai-pm.config.json:19`.

The `_modules` doc key reads:

> `"(PROTOCOL.md `## Capability modules`; the catalog + per-kind defaults are homed in modules.json)"`

`PROTOCOL.md` has no `## Capability modules` heading — the section is `## Capability modules` in **`architecture.md:69`**. `PROTOCOL.md` names the concept in one clause at line 98 inside `## Quality tools`, with no separate heading.

`modules.json` `_doc` gets this right: it points to `architecture.md \`## Capability modules\`` (which exists). `ai-pm.config.json` points to the wrong file.

**Fix:** change `PROTOCOL.md \`## Capability modules\`` to `architecture.md \`## Capability modules\`` in the `_modules` doc key.

---

### Passing items (with citations)

**Assembler safety — fail-safe to ON**
`adapter/modules.mjs:79–83` (`isExplicitlyOff`): only `false` or `{ enabled: false }` disables; everything else (undefined, null, string, number, object) returns false from `isExplicitlyOff` → module stays ON. `adapter/install-modules.test.mjs:49–52` asserts this for `"garbage"`, `42`, `null` — all three pass (36/36 green, verified by running `node adapter/install-modules.test.mjs`).

**Assembler safety — root-escape rejected**
`adapter/modules.mjs:41–53` (`resolveFragmentPath`): absolute pointer throws at line 46; `..`-bearing pointer resolved outside root throws at line 50. `adapter/install-modules.test.mjs:103–120` asserts `/etc/passwd` throws, `../outside.md` throws, empty string throws, and an enabled module with an escaping pointer throws at compose time — all pass.

**Assembler safety — missing-fragment hard error**
`adapter/modules.mjs:120–126` (`fragmentFor`): if `fs.existsSync(fpath)` is false, throws with a descriptive error. `adapter/install-modules.test.mjs:94–100` asserts a synthetic `ghost` module with an absent fragment throws — passes.

**Single-home for compose logic**
Both `adapter/claude/install-agents.mjs:22` and `adapter/opencode/install-agents.mjs:21` import `{ loadRegistry, composeBody }` from `"../modules.mjs"`. No compose logic is duplicated in the shims.

**Floor always present, marker consumed in deployed agents**
`agents/reviewer.md:19` carries the `<!-- ai-pm:modules -->` marker. Deployed `.claude/agents/pm-reviewer.md` and `.opencode/agents/pm-reviewer.md` contain no leftover marker (confirmed by grep returning empty). Both carry the floor security item ("secrets read from a committed template", `agents/reviewer.md:13`) and the `## Threat model` skeleton section. `adapter/install-modules.test.mjs:71–83` covers floor-always-present under every config shape.

**Module OFF: floor survives, fragment absent**
`adapter/install-modules.test.mjs:74–77` asserts: `{ "threat-model": false }` → fragment text absent, marker consumed, floor still present. Passes.

**No `<!-- ai-pm:modules -->` leaks into deployed output**
Grep across all four deployed agents (`.claude/agents/pm-reviewer.md`, `.claude/agents/pm-builder.md`, `.opencode/agents/pm-reviewer.md`, `.opencode/agents/pm-builder.md`) returns empty — marker is consumed in all cases.

**`.opencode/agents/ai-pm.md` byte-unchanged**
`diff .opencode/agents/ai-pm.md <(node adapter/opencode/install-agents.mjs /tmp/…)` returns identical — orchestrator agent carries no fragment marker (correct: `agents/orchestrator.md` has no `<!-- ai-pm:modules -->` line).

**Dogfood: deployed == generator output (no drift)**
`node adapter/claude/install-agents.mjs /tmp/…` + diff against `.claude/agents/` → no diff. Same for OpenCode. Both platforms clean.

**Honesty labelling**
`adapter/modules.mjs:14–16` labels the module `[persona]` in the file header. `modules.json:2` (`_doc`) labels it `[persona]`. `architecture.md:93` labels it `[persona]` and names the distinction (a deny rule is the mechanical part; the fragment is not). `ai-pm.config.json:19` (`_modules`) labels it `[persona]`. No over-claim of mechanical enforcement found anywhere in the diff.

**Thin core (Fork E)**
`PROTOCOL.md:98` adds exactly one sentence to `## Quality tools` — no new heading, no mechanism detail, points to `architecture.md ## Capability modules` and the registry. `wc -l PROTOCOL.md` is unchanged from the one-sitting budget.

**Neutral-prose guard extended to fragments**
`quality/neutral-prose.test.mjs:32–52` adds `moduleFragments()` to the surface scan; `modules/threat-model/reviewer.md` and `modules/threat-model/builder.md` are included. Test passes (neutral-prose PASS, no platform primitives in fragments).

**All test suites green at the expected counts**
parity 55 ✓ · install-modules 36 ✓ · install-model 11 ✓ · install-commands 10 ✓ · install-plugin 6 ✓ · opencode-inject 10 ✓ · rigor-profile 24 ✓ · neutral-prose PASS ✓. No existing test weakened — counts unchanged from pre-feature baselines.

**`modules.json` carries no floor prose (except Finding 1)**
The `_doc` and `_row_shape` are clean. The only prose duplication is the undocumented `floor` annotation field (Finding 1).

**Slice 2 content not faulted**
`modules/threat-model/reviewer.md:3` and `modules/threat-model/builder.md:3` correctly label themselves `SKELETON (Slice 1)` — thin content is by design for this slice, not a defect.

---

## Fixup re-review

Focused re-review against the two findings from the prior "changes requested" verdict. Fresh context; checked against the current working-tree state on `feature/threat-model-module`.

### Finding 1 — resolved

**Cited fix:** `modules.json` — `floor` field is absent from the `threat-model` entry.

Verified by full read of `modules.json:12–28`. The entry contains exactly the six fields declared in `_row_shape` (`id`, `for`, `toggle`, `defaults`, `targets`, `fragments`) — no `floor` field. JSON parses clean (`node -e "JSON.parse(...)"` exit 0). Nothing else was removed: all of `toggle` (line 15), `defaults` (lines 16–19), `targets` (lines 20–23), and `fragments` (lines 24–27) are intact. `architecture.md:95` remains the single home.

**Assembler unchanged:** `adapter/modules.mjs` has no reference to `mod.floor` (grep confirms). Dropping the field changes no assembled output. Fresh assemble-to-temp diff: `.claude/agents/` — no diff; `.opencode/agents/` — no diff. Both platforms byte-identical to deployed state.

### Finding 2 — resolved

**Cited fix:** `ai-pm.config.json:19` — `_modules` value now reads `architecture.md \`## Capability modules\`` (confirmed by `git diff ai-pm.config.json`, which shows the field was added as part of this feature with the correct pointer from the start of this fixup pass).

Verified: `architecture.md:69` carries `## Capability modules` — the heading exists. `PROTOCOL.md` has no such heading. The cross-reference is now correct.

### No collateral

Only `modules.json` (new untracked file) and `ai-pm.config.json` (modified) are relevant to the two findings. All other modified files (`agents/`, `.claude/agents/`, `.opencode/agents/`, `PROTOCOL.md`, `architecture.md`, `adapter/`, `quality/`) were already reviewed and passed in the prior pass — their state is unchanged relative to that verdict.

### Gates

- `node adapter/install-modules.test.mjs` → **PASS — 36 passed, 0 failed**
- `node adapter/parity.test.mjs` → **PASS — 55 passed, 0 failed**
- `node quality/neutral-prose.test.mjs` → **PASS — core is platform-neutral**

All three gate suites green at the expected counts. No existing test weakened.

### Verdict

Both findings are resolved with correct, minimal, non-collateral fixes. Security surface, honesty labelling, assembler safety, and dogfood wiring remain clean. Approved.
