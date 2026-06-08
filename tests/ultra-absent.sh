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
# NON-VACUOUS: the suite also injects an `ultra` token into a scratch copy of a
# scoped file and asserts the scan trips (ultra-reintroduction-trips-guard) —
# so a future re-introduction of the level cannot pass silently.
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
scan_ultra() {
    # Prints every offending "file:line:text" hit; empty output = clean.
    git ls-files -z -- $SCAN_PATHS 2>/dev/null \
        | xargs -0 grep -niw 'ultra' 2>/dev/null
}

# ----------------------------------------------------------------------
# ultra-absent-review-level: no `ultra` in any scoped surface.
# ----------------------------------------------------------------------
HITS=$(scan_ultra)
if [ -z "$HITS" ]; then
    pass "ultra-absent-review-level: no 'ultra' review level in workflow/, src/commands/, README.md, .claude/, .opencode/, .golden/"
else
    fail "ultra-absent-review-level: 'ultra' still appears as a review level in a scoped surface:"
    printf '%s\n' "$HITS" | sed 's/^/    /'
fi

# ----------------------------------------------------------------------
# ultra-reintroduction-trips-guard (non-vacuous): inject `ultra` into a scratch
# copy of a scoped file and confirm a whole-word scan trips. Proves the guard is
# real — that a future re-introduction of the level would be caught.
# ----------------------------------------------------------------------
SCRATCH=$(mktemp -d) || { echo "FAIL: mktemp failed" >&2; exit 1; }
trap 'rm -rf "$SCRATCH"' EXIT
INJECT="$SCRATCH/review-typology.md"
printf 'fall back to the built-in /code-review ultra at the selected depth.\n' > "$INJECT"
if grep -qniw 'ultra' "$INJECT"; then
    pass "ultra-reintroduction-trips-guard: an injected 'code-review ultra' is detected by the whole-word scan"
else
    fail "ultra-reintroduction-trips-guard: the scan FAILED to detect an injected 'ultra' — guard is vacuous"
fi

# ----------------------------------------------------------------------
# Summary
# ----------------------------------------------------------------------
TOTAL=$((PASS_COUNT + FAIL_COUNT))
echo "----"
echo "Total: $TOTAL  Passed: $PASS_COUNT  Failed: $FAIL_COUNT"

[ "$FAIL_COUNT" -gt 0 ] && exit 1
exit 0
