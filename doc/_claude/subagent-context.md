# Subagent context — agent enum gap + legacy review trail compat

On-demand reference для секции «Доступные subagents» в `CLAUDE.md`. Edge case context, который не релевантен в каждой сессии.

## Project-level agent enum gap (Claude Code limitation)

**Симптом (Bug #3 protocol-minors-2026-05-25):** В running session project-level agent'ы из `.claude/agents/*.md` могут не появляться в Agent tool'а `subagent_type` enum. Source unclear (Claude Code bug / missing documentation / intended behavior).

**v0.7.0 consolidation response:** reviewer.md теперь монолит — все 5 reviewer ролей (protocol-compliance + 4 domains) inlined как sections в один файл, sequential self-pass. Никакого nested spawn'а не требуется. См. `.claude/agents/reviewer.md` § Mandatory baseline + § Domain-specific checks.

## Legacy review trail backward-compat

Pre-v0.7.0 trail'ы могут содержать frontmatter с `agent_type: specialized-reviewer` / `general-purpose-with-role-spec` / `inline-roleplay` — accepted backward-compat в existing committed `_review.md`.

Новые review'и используют `agent_type: inline-sections` + `applied_sections: [...]` (см. reviewer.md Step 5.2).
