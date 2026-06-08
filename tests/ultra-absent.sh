#!/bin/sh
# tests/ultra-absent.sh — clean-grep guard for the ultra-removal slice
# (opencode-compact-reviewer, slice C, plan piece 3 + Test plan `ultra-absent`).
#
# `ultra` is retired as a review level everywhere it was a live protocol
# instruction: the `/code-review ultra` engine level, the `low→ultra` depth
# range, the `high/max/ultra` depth lists, the "ultra picks its own models"
# cross-model carve-out, and the `ultra AI` / "at ultra depth" review-TYPE
# intensity descriptors. This test asserts the word no longer appears anywhere
# in the surfaces where it can only mean a review level:
#
#   ultra-absent-review-level
#     given the scoped surfaces — workflow/, src/commands/, README.md, and the
#     generated/frozen adapter trees (.claude/, .opencode/, .golden/) — when
#     scanned for the whole word `ultra` (case-insensitive), then NONE appears.
#     These surfaces carry only review-typology / engine-selection / pm-audit
#     prose, so the only thing `ultra` could mean here is a review level; a
#     whole-word match is therefore unambiguous and cannot trip on an unrelated
#     word (there are none — no "ultrasound", "ultraviolet", etc. in protocol
#     prose). The grep catches `code-review ultra`, `ultra level`, `low→ultra`,
#     `high/max/ultra`, `ultra AI`, `ultra depth`, and "ultra picks its own
#     models" alike, because every one of them contains the whole word.
#
# NON-VACUOUS: the suite also injects an `ultra` token into a REAL tracked,
# in-scope file and asserts the production scan_ultra() path (git ls-files |
# xargs grep) trips on it (ultra-reintroduction-trips-guard), then restores the
# file via `git checkout` — so a future re-introduction of the level cannot pass
# silently, and the self-check exercises the actual plumbing rather than a
# scratch string.
#
# Out of scope (NOT scanned — by design): CHANGELOG.md (historical release
# records), doc/ (the separate post-coding pm-architect decision-record handoff),
# and .ai-pm/ (plans, reviews, research, state — historical/active records, not
# live protocol instructions).
#
# Exit code: 0 if every check passes, 1 if any fails.
# One line per check is printed: "PASS: ..." or "FAIL: ...".
#
# Usage: bash tests/ultra-absent.sh
# Dependencies: grep, git. No third-party framework.

set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || {
    echo "FAIL: not inside a git repo — tests/ultra-absent.sh must run inside ai-pm-protocol" >&2
    exit 1
}
cd "$ROOT" || exit 1

PASS_COUNT=0
FAIL_COUNT=0
pass() { echo "PASS: $1"; PASS_COUNT=$((PASS_COUNT + 1)); }
fail() { echo "FAIL: $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }

# The scoped surfaces — every place `ultra` was a live review-level instruction.
# README.md is a single file; the rest are directories of generated/authored
# prose. The scan is restricted to GIT-TRACKED files (via `git ls-files`) so it
# covers only the protocol's shipped surface and never trips on untracked,
# vendored noise (e.g. the local-only `.opencode/node_modules/` npm stub, which
# is not part of the protocol and not in git).
SCAN_PATHS="workflow src/commands .claude .opencode .golden README.md"

# Whole-word, case-insensitive scan over the tracked files in the scoped paths.
# `-w` anchors to a word boundary so the match is the level token, never a
# substring of an unrelated word.
#
# Returns 0 and prints every offending "file:line:text" hit; empty output = clean.
# Returns 2 (and prints nothing to stdout) when the scoped surface covers ZERO
# tracked files — that means the scan inspected nothing and a clean result would
# be vacuous, so the caller treats it as a hard error, not a pass.
#
# `--no-run-if-empty` on xargs stops grep from running on an empty file list
# (GNU xargs otherwise runs the command once with no args, where grep would read
# inherited STDIN instead of the surface and report a false clean). The empty
# case is caught explicitly above that anyway, but the flag closes the stdin leak
# defensively. The `-z`/`-0` NUL pairing is kept so paths with newlines are safe.
scan_ultra() {
    # Emptiness is detected with a plain (non-`-z`) count: `git ls-files` without
    # `-z` is one line per file, safe to count, and we never store the NUL stream
    # in a shell variable (command substitution strips NULs and would silently
    # break the `xargs -0` pairing). The actual scan re-runs `git ls-files -z`
    # and streams it straight into `xargs -0` so NUL separation is preserved.
    if [ "$(git ls-files -- $SCAN_PATHS 2>/dev/null | wc -l)" -eq 0 ]; then
        return 2  # zero tracked files in scope — scan would be vacuous
    fi
    git ls-files -z -- $SCAN_PATHS 2>/dev/null \
        | xargs -0 --no-run-if-empty grep -niw 'ultra' 2>/dev/null
}

# ----------------------------------------------------------------------
# ultra-absent-review-level: no `ultra` in any scoped surface.
# ----------------------------------------------------------------------
HITS=$(scan_ultra)
SCAN_RC=$?
if [ "$SCAN_RC" -eq 2 ]; then
    fail "ultra-absent-review-level: the scoped surfaces ($SCAN_PATHS) matched ZERO tracked files — the scan covered nothing; these paths are expected to exist, so a vacuous clean is treated as a hard failure"
elif [ -z "$HITS" ]; then
    pass "ultra-absent-review-level: no 'ultra' review level in workflow/, src/commands/, README.md, .claude/, .opencode/, .golden/"
else
    fail "ultra-absent-review-level: 'ultra' still appears as a review level in a scoped surface:"
    printf '%s\n' "$HITS" | sed 's/^/    /'
fi

# ----------------------------------------------------------------------
# ultra-reintroduction-trips-guard (non-vacuous): inject an `ultra` review-level
# phrase into a REAL tracked, in-scope file, then run the production scan_ultra()
# (git ls-files | xargs grep) — the same code path the absence check uses — and
# assert it reports the injection. This proves the whole plumbing catches a
# reintroduction, not merely that grep's regex matches a scratch string. The file
# is restored with `git checkout` via a trap so the tree is never left dirty,
# even if the assertion (or anything after) fails.
#
# INJECT_FILE must be tracked AND inside SCAN_PATHS so scan_ultra() actually
# reaches it. README.md is both (a single tracked file in scope).
# ----------------------------------------------------------------------
INJECT_FILE="README.md"
restore_inject() { git checkout -- "$INJECT_FILE" 2>/dev/null; }
trap restore_inject EXIT
printf '\n<!-- self-check probe: fall back to /code-review ultra at depth -->\n' >> "$INJECT_FILE"
PROBE_HITS=$(scan_ultra)
PROBE_RC=$?
if [ "$PROBE_RC" -eq 0 ] && printf '%s' "$PROBE_HITS" | grep -q "$INJECT_FILE"; then
    pass "ultra-reintroduction-trips-guard: scan_ultra() (the real git-ls-files|xargs-grep path) catches an 'ultra' injected into the tracked, in-scope $INJECT_FILE"
else
    fail "ultra-reintroduction-trips-guard: scan_ultra() FAILED to catch an 'ultra' injected into $INJECT_FILE — the production scan path is vacuous"
fi
restore_inject
trap - EXIT

# ----------------------------------------------------------------------
# Summary
# ----------------------------------------------------------------------
TOTAL=$((PASS_COUNT + FAIL_COUNT))
echo "----"
echo "Total: $TOTAL  Passed: $PASS_COUNT  Failed: $FAIL_COUNT"

[ "$FAIL_COUNT" -gt 0 ] && exit 1
exit 0
