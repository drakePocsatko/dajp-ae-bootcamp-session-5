# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development. It helps both human developers and AI assistants maintain context across sessions and apply learned patterns to new situations.

## Memory Types

### Persistent Memory
**Location**: `.github/copilot-instructions.md`
- Foundational principles and workflows
- Project-wide standards and conventions
- Testing strategies and agent usage guidelines
- Rarely changes; committed to git

### Working Memory
**Location**: `.github/memory/` directory
- Development discoveries and patterns
- Session-specific findings and decisions
- Active work in progress
- Split between committed (historical) and ephemeral (active) content

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical session summaries (COMMITTED)
├── patterns-discovered.md       # Accumulated code patterns (COMMITTED)
└── scratch/
    ├── .gitignore               # Ignores all scratch files
    └── working-notes.md         # Active session notes (NOT COMMITTED)
```

### File Purposes

**session-notes.md** (Committed)
- Historical record of completed development sessions
- Documents what was accomplished, key findings, and decisions
- Provides context for understanding project evolution
- Review before starting related work to avoid repeating mistakes

**patterns-discovered.md** (Committed)
- Accumulated code patterns and best practices
- Documents recurring solutions to common problems
- Referenced by AI for context-aware suggestions
- Grows over time as new patterns emerge

**scratch/working-notes.md** (NOT Committed)
- Active session notes and work in progress
- Quick capture of findings, decisions, and blockers
- Ephemeral - cleared or archived after session
- At session end, key findings move to session-notes.md

## When to Use Each File

### During TDD Workflow

**While Writing Tests (RED phase)**:
- Use `scratch/working-notes.md` to track test design decisions
- Note any patterns or conventions being followed
- Document expected behavior being tested

**While Implementing (GREEN phase)**:
- Record implementation approaches in `scratch/working-notes.md`
- Note any deviations from expected patterns
- Track issues encountered and solutions tried

**While Refactoring (REFACTOR phase)**:
- Document refactoring decisions in `scratch/working-notes.md`
- If a pattern emerges, add to `patterns-discovered.md`
- Note any surprising discoveries or gotchas

**At Session End**:
- Summarize key findings in `session-notes.md`
- Update `patterns-discovered.md` with new patterns
- Clear or archive `scratch/working-notes.md`

### During Linting Workflow

**While Fixing Lint Errors**:
- Use `scratch/working-notes.md` to categorize issues
- Track systematic fix approaches
- Note any auto-fix limitations or risks

**When Discovering Patterns**:
- If multiple files have similar issues, document in `patterns-discovered.md`
- Record any project-specific ESLint configuration decisions
- Note recurring anti-patterns to avoid

### During Debugging Workflow

**While Investigating Issues**:
- Use `scratch/working-notes.md` for rapid note-taking
- Document hypotheses and test results
- Track debugging steps and findings

**When Finding Root Causes**:
- Document the issue and solution in `scratch/working-notes.md`
- If it reveals a pattern, add to `patterns-discovered.md`
- Note any testing gaps that allowed the bug

**At Resolution**:
- Summarize in `session-notes.md` with clear problem/solution
- Update `patterns-discovered.md` if applicable
- Share learnings to prevent recurrence

### During Integration Testing

**When Frontend/Backend Mismatch Found**:
- Document the mismatch in `scratch/working-notes.md`
- Note API contract assumptions that were incorrect
- Track verification steps taken

**When Fixing Integration Issues**:
- Record the alignment approach
- If it reveals a communication pattern, add to `patterns-discovered.md`
- Note any test coverage gaps

## How AI Uses Memory

### Context Application
1. **AI reads persistent instructions** from `.github/copilot-instructions.md` for foundational guidance
2. **AI reviews patterns-discovered.md** to apply learned patterns to new code
3. **AI checks session-notes.md** for historical context on related work
4. **AI updates scratch/working-notes.md** during active sessions with findings

### Pattern Recognition
- AI recognizes when current work matches documented patterns
- AI suggests solutions based on previous discoveries
- AI warns about anti-patterns documented in memory

### Continuous Learning
- As new patterns emerge, AI helps document them
- AI cross-references memory when making suggestions
- AI maintains consistency with established practices

## Workflow Example

**Starting a Session**:
1. Review relevant entries in `session-notes.md`
2. Check `patterns-discovered.md` for applicable patterns
3. Open `scratch/working-notes.md` for active note-taking

**During Development**:
1. Capture findings in `scratch/working-notes.md` as you work
2. When tests fail, document the failure and investigation
3. When patterns emerge, note them for later documentation

**Ending a Session**:
1. Summarize key findings from `scratch/working-notes.md`
2. Add summary to `session-notes.md` with date and context
3. Move any patterns to `patterns-discovered.md`
4. Clear or archive `scratch/working-notes.md`
5. Commit updated `session-notes.md` and `patterns-discovered.md`

## Best Practices

1. **Be Concise**: Memory files should be scannable and focused
2. **Use Examples**: Show concrete code examples in patterns
3. **Date Entries**: Always include dates in session notes
4. **Link Files**: Reference specific files when documenting patterns
5. **Update Regularly**: Keep memory current as patterns evolve
6. **Archive Old Notes**: Move outdated session notes to archive if needed
7. **Clear Scratch**: Don't let working notes accumulate indefinitely

## Benefits

- **Consistency**: Apply learned patterns across the codebase
- **Efficiency**: Avoid repeating investigations or mistakes
- **Context**: Understand why decisions were made
- **Collaboration**: Share knowledge with team members and AI
- **Learning**: Build institutional knowledge over time
