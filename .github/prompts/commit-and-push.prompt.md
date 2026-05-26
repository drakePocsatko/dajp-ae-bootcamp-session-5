---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push Changes

Systematically analyze changes, generate a conventional commit message, and push to a feature branch.

## Input

Branch Name: ${input:branch-name:Enter feature branch name (REQUIRED, e.g., feature/add-todo-creation)}

## Instructions

### 1. Validate Branch Name

Ensure a branch name was provided. If not:
```
ERROR: Branch name is required
Format: feature/<descriptive-name> or fix/<descriptive-name>
Example: feature/add-todo-api
```

Stop and ask the user for a branch name.

### 2. Pre-Commit Testing

**Check if UI testing is required**:
- If the current step involved UI changes or requires UI workflow
- Verify that UI tests have been run and are passing

**Run all test suites**:
```bash
# Backend tests
cd packages/backend && npm test

# Frontend tests
cd packages/frontend && npm test

# If UI workflow was required, verify UI tests were run
# (or run them now)
cd packages/frontend && npm run test:ui
```

**If any tests fail**:
- DO NOT proceed with commit
- Report failures to user
- Suggest fixing tests before committing

### 3. Analyze Changes

Run git diff to see what has changed:
```bash
git status
git diff
```

Categorize changes:
- New features
- Bug fixes
- Tests added/modified
- Refactoring
- Documentation
- Configuration

### 4. Generate Conventional Commit Message

Based on the changes, generate a commit message following this format:

```
<type>: <short description>

<optional longer description>
<optional body with more details>
```

**Commit Types** (see Git Workflow in `.github/copilot-instructions.md`):
- `feat:` - New features
- `fix:` - Bug fixes
- `test:` - Test additions or fixes
- `refactor:` - Code refactoring without behavior change
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `style:` - Code formatting changes

**Examples**:
```
feat: add POST /api/todos endpoint with validation
fix: correct todo deletion frontend state update
test: add integration tests for todo API
refactor: extract todo validation to separate function
```

### 5. Create or Switch to Branch

**Check if branch exists**:
```bash
git branch --list <branch-name>
```

**If branch does NOT exist**:
```bash
git checkout -b <branch-name>
```

**If branch exists**:
```bash
git checkout <branch-name>
```

**CRITICAL**: NEVER commit to `main` or any branch other than the user-provided branch name.

### 6. Stage All Changes

```bash
git add .
```

Verify staged changes:
```bash
git status
```

### 7. Commit with Generated Message

```bash
git commit -m "<generated-commit-message>"
```

### 8. Push to Remote Branch

```bash
git push origin <branch-name>
```

If this is the first push for the branch:
```bash
git push --set-upstream origin <branch-name>
```

### 9. Report Success

Provide a summary:
```
✅ Changes committed and pushed successfully

Branch: <branch-name>
Commit: <commit-message>
Files changed: X
Tests: All passing ✅

Next Steps:
- Continue with next GitHub Issue step, OR
- Create Pull Request: gh pr create --title "..." --body "..."
```

## Error Handling

**If tests fail**:
```
❌ Cannot commit - tests are failing

Failed tests:
- [list of failing tests]

Action required:
1. Fix failing tests
2. Run /commit-and-push again
```

**If no changes to commit**:
```
ℹ️  No changes to commit

Working directory is clean. Make changes before committing.
```

**If push fails**:
```
❌ Push failed

Error: [error message]

Common fixes:
- Pull latest changes: git pull origin <branch-name>
- Resolve conflicts if any
- Try push again
```

## Success Criteria

- ✅ All tests passing before commit
- ✅ Descriptive conventional commit message generated
- ✅ Changes committed to feature branch (NOT main)
- ✅ Changes pushed to remote branch
- ✅ Clear summary provided

## Example Output

```
✅ Changes committed and pushed successfully

Branch: feature/add-todo-creation
Commit: feat: add todo creation endpoint and frontend form

Files changed:
- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js
- packages/frontend/src/App.js
- packages/frontend/src/__tests__/App.test.js

Tests: All passing ✅
- Backend: 15 passing
- Frontend: 10 passing
- UI: 5 passing

Next Steps:
- Continue to next step, OR
- Create PR: gh pr create --title "Add todo creation feature" --body "Implements step 5-1"
```

---

**Remember**: Always ensure tests pass before committing. Use conventional commit format. Never commit to main directly.
