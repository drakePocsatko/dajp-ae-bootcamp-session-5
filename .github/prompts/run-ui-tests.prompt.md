---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ['read', 'execute', 'todo']
---

# Run UI Tests and Analyze Failures

You are now operating in **test-engineer** mode to execute UI tests and classify any failures.

## Your Task

Execute Playwright UI tests, summarize results, and classify failures by root cause.

## Instructions

### 1. REQUIRED FIRST STEP: Install Playwright Dependencies

**CRITICAL**: Before running UI tests for the first time (or after container rebuild), install Playwright browsers and system dependencies:

```bash
npm run test:ui:install --workspace=frontend
```

**What this does**:
- Runs `playwright install --with-deps chromium` in the frontend workspace
- Installs Chromium browser required for Playwright
- Installs system dependencies for Ubuntu/Linux environments
- Includes automatic bounded remediation for the common Yarn GPG key issue:
  * Removes problematic Yarn repository configuration
  * Retries the install command once
  * If failure persists, stops and reports the environment blocker

**Environment Expectations**:
- In Ubuntu/Linux, this step is MANDATORY before first UI test run
- Must be repeated after dev container rebuild
- The install script includes one automatic retry after Yarn key remediation
- If install still fails after remediation, stop immediately and report as environment blocker

**Installation Failure Protocol**:
```
If `npm run test:ui:install` fails:
1. Check if the error is the known Yarn GPG key issue
2. The script will automatically remediate and retry once
3. If failure persists after remediation:
   - DO NOT attempt ad-hoc package installation
   - DO NOT perform broad OS troubleshooting
   - STOP immediately
   - Report as environment blocker with:
     * Failing command
     * Key error lines from output
     * Message: "Environment blocker - Playwright dependencies failed after remediation"
4. Do not proceed to run UI tests after failed install
```

### 2. Ensure Backend and Frontend are Running

**Check if services are running**:
```bash
# Check for running processes
ps aux | grep node
```

**If not running, start from repo root**:
```bash
# Start both backend and frontend
npm start
```

**Wait for services to be ready**:
- Backend typically runs on http://localhost:3001
- Frontend typically runs on http://localhost:3000
- Wait for "Server started" or "Compiled successfully" messages

### 3. Run UI Test Suite

Execute Playwright tests:
```bash
cd packages/frontend && npm run test:ui
```

**Alternative runs for debugging**:
```bash
# Run in headed mode (see browser)
npm run test:ui -- --headed

# Run specific test
npm run test:ui -- -g "should create a new todo"

# Run with debug mode
npm run test:ui -- --debug

# Run with trace (for failure analysis)
npm run test:ui -- --trace on
```

### 4. Capture Test Output

Parse the test output systematically:
- Total tests executed
- Number passing
- Number failing
- Execution time
- Error messages for failures
- Stack traces
- Screenshots (if failures occurred)

### 5. Summarize Results Clearly

**For successful runs**:
```
UI Test Results: ✅ ALL PASSING

Executed: X tests
Passing: X tests (100%)
Execution time: Y.Y seconds

All critical user journeys verified:
✅ Create todo
✅ Toggle completion
✅ Delete todo
✅ Validation errors

Next Steps:
- /validate-step <step-number>
```

**For runs with failures**:
```
UI Test Results: ❌ FAILURES DETECTED

Executed: X tests
Passing: Y tests (Z%)
Failing: N tests
Execution time: W.W seconds

Failed Tests:
1. "test name 1" - Brief error description
2. "test name 2" - Brief error description

See detailed failure analysis below.
```

### 6. Classify Each Failure

For each failing test, determine the **root cause category**:

**Category 1: Application Defect (Fix in application code)**
- **Indicators**:
  - Expected behavior doesn't occur
  - API returns wrong data or status
  - UI doesn't update after user action
  - State not persisted correctly
- **Example**: Delete button clicked but todo still visible

**Category 2: Test Defect (Fix in test code)**
- **Indicators**:
  - Selector doesn't match actual element
  - Incorrect expected value in assertion
  - Race condition (missing wait)
  - Test data conflicts
- **Example**: Using wrong selector that doesn't exist in DOM

**Category 3: Environment Issue (Fix in environment/configuration)**
- **Indicators**:
  - Backend not running or port mismatch
  - Timeout too aggressive
  - Browser version mismatch
  - Network connectivity issue
  - Test data not cleaned between runs
- **Example**: Tests timing out because backend isn't responding

### 7. Provide Detailed Failure Analysis

For each failing test:

```
Test: "should delete a todo"
Status: ❌ FAILED

Error Message:
Timeout 5000ms exceeded waiting for element to be detached

Classification: Application Defect

Root Cause Analysis:
1. Test clicked delete button (confirmed in screenshot)
2. API DELETE request returned 200 OK (confirmed in network log)
3. Todo element still visible on page (screenshot shows element present)
4. Frontend not updating state after successful delete

Evidence:
- Screenshot: test-results/todo-delete-failure.png
- Network: DELETE /api/todos/123 → 200 OK
- DOM State: Element with testid="todo-123" still present

Proposed Fix:
Update frontend deleteTodo handler to remove todo from state:

// In App.js
const deleteTodo = async (id) => {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  setTodos(todos.filter(todo => todo.id !== id)); // Add this line
};

Action Required:
1. Fix application code as shown above
2. Re-run tests: /run-ui-tests
```

### 8. Provide Debugging Resources

When failures occur, point to debugging tools:

**Playwright Debugging**:
```bash
# Run with trace viewer
npm run test:ui -- --trace on

# View trace after failure
npx playwright show-trace trace.zip

# Run in debug mode (pause at each step)
npm run test:ui -- --debug

# Run in headed mode (see browser)
npm run test:ui -- --headed
```

**Check Screenshots**:
```bash
# Failures generate screenshots automatically
ls -la packages/frontend/test-results/
```

### 9. Recommend Next Actions

**If all tests pass**:
```
Next Steps:
1. /validate-step <step-number> - Validate step completion
2. /commit-and-push <branch-name> - Commit changes
```

**If tests fail**:
```
Next Steps:
1. Fix identified issues (see analysis above)
2. Re-run tests: /run-ui-tests
3. Continue until all tests pass
4. Then: /validate-step <step-number>
```

**If environment issues**:
```
Next Steps:
1. Fix environment setup
   - Ensure backend running: npm start (from root)
   - Check port availability
   - Verify Playwright installed: npm run test:ui:install --workspace=frontend
2. Re-run tests: /run-ui-tests
```

## Success Criteria

- ✅ Playwright dependencies installed (if first run)
- ✅ Backend and frontend running
- ✅ UI tests executed
- ✅ Results summarized clearly (X passing, Y failing)
- ✅ Each failure classified (application/test/environment)
- ✅ Root cause analysis provided for failures
- ✅ Proposed fixes with specific code changes
- ✅ Debugging resources referenced
- ✅ Clear next steps provided

## Example Output - All Passing

```
UI Test Results: ✅ ALL PASSING

Executed: 5 tests
Passing: 5 tests (100%)
Execution time: 8.3 seconds

Test Suite: Todo Application - Critical Journeys
✅ should create a new todo (1.2s)
✅ should toggle todo completion (1.5s)
✅ should delete a todo (1.8s)
✅ should show validation error for empty title (1.1s)
✅ should edit existing todo (2.7s)

All critical user journeys verified successfully.

Next Steps:
1. /validate-step 5-1 - Validate step completion
2. /commit-and-push feature/add-todo-ui - Commit changes
```

## Example Output - With Failures

```
UI Test Results: ❌ FAILURES DETECTED

Executed: 5 tests
Passing: 3 tests (60%)
Failing: 2 tests (40%)
Execution time: 12.5 seconds

Passing Tests:
✅ should create a new todo (1.2s)
✅ should toggle todo completion (1.5s)
✅ should show validation error for empty title (1.1s)

Failed Tests:
❌ should delete a todo (timeout)
❌ should edit existing todo (element not found)

---

Detailed Failure Analysis:

Test 1: "should delete a todo"
Status: ❌ FAILED
Error: Timeout waiting for element to be detached

Classification: Application Defect

Root Cause:
Frontend does not remove deleted todo from state after DELETE request succeeds.

Evidence:
- DELETE /api/todos/123 returns 200 OK
- Element still visible in DOM after delete
- Screenshot: test-results/delete-failure.png

Proposed Fix:
// packages/frontend/src/App.js
const deleteTodo = async (id) => {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  setTodos(todos.filter(todo => todo.id !== id)); // ADD THIS
};

---

Test 2: "should edit existing todo"
Status: ❌ FAILED
Error: Element getByRole('button', { name: /edit/i }) not found

Classification: Test Defect

Root Cause:
Test expects edit button but feature not yet implemented in UI.

Evidence:
- Screenshot shows no edit button on todo items
- API endpoint GET /api/todos/:id exists
- Frontend missing edit UI

Proposed Fix:
Either:
A) Implement edit feature in application (if required by step)
B) Remove or skip test until edit feature implemented

---

Summary:
- 1 Application defect (delete state update)
- 1 Test defect (edit feature not implemented)
- 0 Environment issues

Next Steps:
1. Fix delete state update in App.js (see proposed fix above)
2. Decide on edit feature (implement or remove test)
3. Re-run tests: /run-ui-tests
4. Continue until all tests pass
```

---

**Remember**: You are in **test-engineer** mode. Execute tests, classify failures systematically, provide specific fixes. Install Playwright dependencies first if this is the initial run.
