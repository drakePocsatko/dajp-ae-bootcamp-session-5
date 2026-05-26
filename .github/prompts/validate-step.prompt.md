---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate GitHub Issue Step

You are now operating in **code-reviewer** mode to validate step completion against success criteria.

## Your Task

Systematically verify that all success criteria for the specified step are met.

## Input

Step Number: ${input:step-number:Enter step number (REQUIRED, e.g., "5-0" or "5-1")}

## Instructions

### 1. Validate Input

Ensure step number was provided in format "X-Y" (e.g., "5-0", "5-1").

If not provided:
```
ERROR: Step number is required
Format: X-Y (e.g., "5-0", "5-1", "5-2")
```

Stop and ask the user for the step number.

### 2. Find the Exercise Issue

Run the following command to find the main exercise issue:
```bash
gh issue list --state open
```

Look for the issue with "Exercise:" in the title. Extract the issue number.

### 3. Get Issue with Steps

Run the following command to get the full issue content including all comments:
```bash
gh issue view <issue-number> --comments
```

### 4. Locate the Specific Step

Search through the issue content and comments to find:
```
# Step <step-number>: [Step Title]
```

For example, if validating step "5-1", find "# Step 5-1:".

Extract the full content of that step, including all sections.

### 5. Extract Success Criteria

Within the step content, find the section labeled:
```
## Success Criteria
```

or

```
:trophy: Success Criteria
```

Extract ALL criteria listed under this section. These are typically formatted as:
- Bullet points
- Checkboxes
- Numbered items

### 6. Validate Each Criterion

For each success criterion, check against the current workspace state:

**Code Verification**:
- Check if files exist: `ls -la <file-path>`
- Check file contents: `cat <file-path>` or search for specific code
- Verify implementation matches requirements

**Test Verification**:
- Run backend tests: `cd packages/backend && npm test`
- Run frontend tests: `cd packages/frontend && npm test`
- Run UI tests (if applicable): `cd packages/frontend && npm run test:ui`
- Verify all tests pass
- Verify specific test cases exist and pass

**Lint Verification**:
- Run linter: `npm run lint`
- Verify no errors or warnings (or only acceptable ones)

**Functional Verification**:
- Check if specific functionality works as described
- Verify API endpoints exist and respond correctly
- Verify UI components render and behave correctly

**Documentation Verification**:
- Check if required documentation exists
- Verify memory files updated if applicable

### 7. Report Completion Status

For each criterion, report:
- ✅ PASS: Criterion met with evidence
- ❌ FAIL: Criterion not met with specific gap
- ⚠️  PARTIAL: Partially met with details

**Example**:
```
Success Criteria Validation for Step 5-1:

✅ POST /api/todos endpoint implemented
   Evidence: Endpoint exists in packages/backend/src/app.js

✅ Endpoint validates required fields
   Evidence: Test "should return 400 for missing title" passes

❌ Frontend form includes validation
   Gap: Form does not display error messages for invalid input

✅ All tests passing
   Evidence: Backend 15/15, Frontend 10/10 passing

⚠️  Code follows style guidelines
   Issue: 3 no-console warnings in frontend code
   Action: Run /code-review to fix linting issues
```

### 8. Provide Clear Next Steps

Based on validation results:

**If all criteria pass**:
```
✅ Step <step-number> completed successfully!

All success criteria met. Ready to proceed.

Next Steps:
1. /commit-and-push <branch-name> (if not yet committed)
2. Move to next step: /execute-step
```

**If any criteria fail**:
```
❌ Step <step-number> incomplete

Failed Criteria:
- [List specific failures]

Action Required:
1. Address the failed criteria listed above
2. Run validation again: /validate-step <step-number>
```

**If lint issues exist**:
```
⚠️  Step <step-number> mostly complete

Minor issues to address:
- [List lint/style issues]

Optional Next Steps:
1. Fix linting: Switch to code-reviewer mode and run systematic fixes
2. Re-validate: /validate-step <step-number>
```

### 9. Update Memory

If validation reveals patterns or insights, note them in:
`.github/memory/scratch/working-notes.md`

## Success Criteria for This Prompt

- ✅ Step number provided and validated
- ✅ Exercise issue found and accessed
- ✅ Specific step content extracted
- ✅ All success criteria identified
- ✅ Each criterion checked systematically
- ✅ Clear pass/fail status for each criterion
- ✅ Actionable next steps provided

## Example Output

```
Validating Step 5-1: Implement Todo Creation

Success Criteria from Issue:
1. POST /api/todos endpoint implemented
2. Endpoint validates required fields (title, description)
3. Endpoint returns 201 on success with created todo
4. Frontend form submits new todo
5. Frontend displays new todo in list
6. All tests passing
7. No lint errors

Validation Results:

✅ 1. POST endpoint implemented
   File: packages/backend/src/app.js, Line 45
   Test: "POST /api/todos should create todo" passes

✅ 2. Validation implemented
   Tests pass: "should return 400 for missing title"
   Tests pass: "should return 400 for missing description"

✅ 3. Returns 201 with todo
   Test passes: "should return 201 and todo object"

✅ 4. Frontend form submits
   File: packages/frontend/src/App.js
   Test: "should call addTodo on form submit" passes

✅ 5. Todo displays in list
   Test: "should display new todo after creation" passes

✅ 6. All tests passing
   Backend: 15/15 passing
   Frontend: 10/10 passing
   UI: 5/5 passing

⚠️  7. Lint issues present
   3 warnings: no-console in App.js (lines 67, 89, 102)
   Non-blocking - can be fixed in next step

Overall Status: ✅ COMPLETE (with minor lint warnings)

Next Steps:
1. Optional: Fix lint warnings with code-reviewer mode
2. Commit changes: /commit-and-push feature/add-todo-creation
3. Proceed to next step: /execute-step
```

---

**Remember**: You are in **code-reviewer** mode. Systematically verify each criterion with evidence. Provide specific, actionable guidance for any failures.
