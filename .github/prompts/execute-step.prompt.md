---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute GitHub Issue Step

You are now operating in **tdd-developer** mode to execute the current step from the GitHub Issue.

## Your Task

Execute the instructions from the specified GitHub Issue step systematically, following TDD principles.

## Input

Issue Number: ${input:issue-number:Enter issue number (or leave empty to auto-detect)}

## Instructions

### 1. Find the Exercise Issue

If no issue number was provided:
- Run `gh issue list --state open` to list all open issues
- Find the issue with "Exercise:" in the title
- Extract the issue number

If an issue number was provided:
- Use that issue number directly

### 2. Get Issue Content with Steps

Run the following command to get the full issue with all step comments:
```bash
gh issue view <issue-number> --comments
```

Parse the output to find step instructions posted as comments.

### 3. Identify the Current Step

Look for the most recent step comment that has activity instructions. Steps are typically formatted as:
```
# Step X-Y: [Step Title]
...
:keyboard: Activity: [Activity description]
...
```

Extract all activity sections from that step.

### 4. Execute Activities Systematically

For each `:keyboard: Activity:` section:

**Follow TDD Workflow (Red-Green-Refactor)**:
1. If the activity requires new functionality:
   - **RED**: Write tests FIRST that describe the expected behavior
   - Run tests to verify they fail
   - **GREEN**: Implement minimal code to make tests pass
   - Run tests to verify they pass
   - **REFACTOR**: Improve code while keeping tests green

2. If the activity requires fixing existing tests:
   - Analyze the test failure
   - Understand what the test expects
   - Fix the code to make the test pass
   - Run tests to verify the fix

3. For each change:
   - Make small, incremental modifications
   - Run tests after each change
   - Verify all tests pass before moving to next activity

**CRITICAL SCOPE BOUNDARIES**:
- ✅ DO implement backend API endpoints and tests
- ✅ DO implement frontend component features and tests
- ✅ DO run Jest tests (backend and frontend)
- ❌ DO NOT create Playwright UI tests (use `/create-ui-tests` instead)
- ❌ DO NOT run Playwright UI tests (use `/run-ui-tests` instead)
- ❌ DO NOT commit or push changes (use `/commit-and-push` instead)

### 5. Validate Test Coverage

After completing all activities:
- Run backend tests: `cd packages/backend && npm test`
- Run frontend tests: `cd packages/frontend && npm test`
- Ensure all tests pass
- Report any failures

### 6. Document Findings

Record your work in `.github/memory/scratch/working-notes.md`:
- Activities completed
- Tests written/fixed
- Implementation approach
- Any issues encountered
- Patterns discovered

### 7. Determine Next Steps

Based on the current step requirements, provide the appropriate next commands:

**If the step requires UI testing workflow**:
```
Next commands to run (IN THIS ORDER):
1. /create-ui-tests
2. /run-ui-tests
3. /validate-step {step-number}
```

**If the step does NOT require UI testing**:
```
Next commands to run:
1. /validate-step {step-number}
```

**IMPORTANT**: Never recommend `/validate-step` before completing required UI workflow steps.

## Testing Scope Reference

Refer to the Testing Scope section in `.github/copilot-instructions.md`:
- **Backend API changes**: Write Jest tests FIRST, then implement
- **Frontend component features**: Write React Testing Library tests FIRST, then implement
- **UI critical journeys**: Delegate to `/create-ui-tests` and `/run-ui-tests`

## Success Criteria

- ✅ All activities from the current step completed
- ✅ Tests written BEFORE implementation (for new features)
- ✅ All Jest tests passing (backend and frontend)
- ✅ No Playwright tests created in this prompt
- ✅ No changes committed or pushed
- ✅ Working notes updated
- ✅ Clear next steps provided

## Example Output

```
Executed Step 5-1: Implement Todo Creation

Activities Completed:
✅ Created POST /api/todos endpoint test (RED phase)
✅ Implemented endpoint to pass test (GREEN phase)
✅ Refactored for clarity (REFACTOR phase)
✅ Added frontend component test
✅ Implemented frontend todo creation

Test Results:
✅ Backend: 12 passing
✅ Frontend: 8 passing

Next Steps:
This step requires UI testing. Run these commands in order:
1. /create-ui-tests
2. /run-ui-tests
3. /validate-step 5-1
```

---

**Remember**: You are in **tdd-developer** mode. Write tests FIRST, implement to pass, then refactor. Delegate UI testing to the appropriate prompts.
