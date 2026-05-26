---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests for Critical Journeys

You are now operating in **test-engineer** mode to create Playwright UI tests for critical user journeys.

## Your Task

Create comprehensive, stable, and maintainable Playwright UI tests using Page Object Model patterns.

## Input

Journeys: ${input:journeys:Enter comma-separated journeys (or leave empty for defaults: create, edit, toggle, delete, error-handling)}

## Instructions

### 1. Determine Test Scenarios

**If journeys were not provided**, use this default set:
- Create: User creates a new todo
- Edit: User updates an existing todo
- Toggle: User marks todo as complete/incomplete
- Delete: User removes a todo
- Error handling: User encounters validation errors

**If journeys were provided**:
- Parse the comma-separated list
- Create tests for each specified journey

### 2. HARD LIMIT: Maximum 5 Tests

**CRITICAL CONSTRAINT**:
- Create a MAXIMUM of 5 Playwright test cases (`test(...)` or `it(...)` blocks)
- Target range: 3-5 total tests
- Include at least 1 error-path test within the 3-5 total
- If more than 5 candidate scenarios exist, select the highest-risk 5
- List any deferred scenarios for future implementation

**Prioritize by risk**:
1. Critical happy paths (create, toggle, delete)
2. Key error paths (validation, network errors)
3. Edge cases (edit, persistence)

### 3. Review Existing Test Structure

Check current test files:
```bash
ls -la packages/frontend/tests/ui/
```

Identify:
- Existing test files
- Page Object Models in `tests/ui/pages/`
- Current test coverage

### 4. Create or Update Page Object Models

**Page Object Best Practices**:
- Place reusable UI interactions in page object classes
- Use stable selectors (priority order):
  1. `getByRole()` - Most stable (accessibility)
  2. `getByLabel()` - Stable (accessibility)
  3. `getByTestId()` - Explicit test selector
  4. Avoid CSS selectors - Too brittle

- Use state-based waits (NOT time-based):
  - `waitFor({ state: 'visible' })`
  - `waitForLoadState('networkidle')`
  - NOT `waitForTimeout()`

**Example Page Object** (`tests/ui/pages/TodoPage.js`):
```javascript
export class TodoPage {
  constructor(page) {
    this.page = page;
    // Stable selectors
    this.todoInput = page.getByTestId('todo-input');
    this.todoDescription = page.getByTestId('todo-description');
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoList = page.getByTestId('todo-list');
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
  }

  async addTodo(title, description) {
    await this.todoInput.fill(title);
    await this.todoDescription.fill(description);
    await this.addButton.click();
    // State-based wait
    await this.page.getByText(title).waitFor({ state: 'visible' });
  }

  async toggleTodo(title) {
    const todo = this.page.getByText(title);
    const checkbox = todo.locator('..').getByRole('checkbox');
    await checkbox.click();
  }

  async deleteTodo(title) {
    const todo = this.page.getByText(title);
    const deleteBtn = todo.locator('..').getByRole('button', { name: /delete/i });
    await deleteBtn.click();
    await todo.waitFor({ state: 'detached' });
  }
}
```

### 5. Create Test Scenarios

**Keep tests focused on scenario intent**:
- Use Page Object methods for interactions
- Keep assertions in test file
- Follow Arrange-Act-Assert pattern
- Ensure test isolation (no shared state)

**Example Test File** (`tests/ui/e2e.spec.js`):
```javascript
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test.describe('Todo Application - Critical Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should create a new todo', async ({ page }) => {
    // Arrange
    const title = 'Buy groceries';
    const description = 'Milk, bread, eggs';

    // Act
    await todoPage.addTodo(title, description);

    // Assert
    await expect(page.getByText(title)).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    // Arrange
    const title = 'Complete project';
    await todoPage.addTodo(title, 'Finish by Friday');

    // Act
    await todoPage.toggleTodo(title);

    // Assert
    const todo = page.getByText(title);
    const checkbox = todo.locator('..').getByRole('checkbox');
    await expect(checkbox).toBeChecked();
  });

  test('should delete a todo', async ({ page }) => {
    // Arrange
    const title = 'Temporary task';
    await todoPage.addTodo(title, 'Will be deleted');

    // Act
    await todoPage.deleteTodo(title);

    // Assert
    await expect(page.getByText(title)).not.toBeVisible();
  });

  test('should show validation error for empty title', async ({ page }) => {
    // Arrange - empty title

    // Act
    await todoPage.addButton.click();

    // Assert
    await expect(page.getByText(/title is required/i)).toBeVisible();
  });
});
```

### 6. Verify Test Count

**Before finishing**:
- Count the number of `test(...)` or `it(...)` blocks created/updated
- If count > 5, reduce to the 5 highest-priority scenarios
- List any deferred scenarios

**Report**:
```
Created Playwright Tests: X of 5 maximum

Tests created:
1. should create a new todo
2. should toggle todo completion
3. should delete a todo
4. should show validation error for empty title
[Stop at 5 or fewer]

Deferred scenarios (if applicable):
- Edit todo functionality
- Persistence after page reload
- Multiple todo interactions
```

### 7. Ensure Test Isolation

**Each test must**:
- Start with clean state (beforeEach)
- Not depend on other tests
- Clean up after itself
- Be runnable independently
- Be runnable in any order

### 8. Document Test Coverage

Update or create test documentation:
- What journeys are covered
- What scenarios are tested
- What page objects exist
- How to run tests

### 9. Report Files Changed

Provide summary:
```
UI Tests Created:

Files Changed:
✅ tests/ui/pages/TodoPage.js - Page Object Model created/updated
✅ tests/ui/e2e.spec.js - Test scenarios added

Test Count: 4 of 5 maximum (within limit ✅)

Scenarios Covered:
1. ✅ Create todo (happy path)
2. ✅ Toggle completion (happy path)
3. ✅ Delete todo (happy path)
4. ✅ Validation error (error path)

Deferred Scenarios:
- Edit todo functionality (priority: medium)

Next Steps:
1. /run-ui-tests - Execute tests and verify they pass
2. /validate-step <step-number> - Validate step completion
```

## Success Criteria

- ✅ Maximum 5 test cases created (3-5 target range)
- ✅ At least 1 error-path test included
- ✅ Page Object Model used for reusable interactions
- ✅ Stable selectors used (role, label, testid)
- ✅ State-based waits (not time-based)
- ✅ Tests are isolated and deterministic
- ✅ Clear Arrange-Act-Assert structure
- ✅ Test count verified before finishing
- ✅ Files changed reported
- ✅ Scenarios covered documented
- ✅ Deferred scenarios listed (if applicable)

## Example Output

```
Created UI Tests for Critical Journeys

Files Changed:
✅ packages/frontend/tests/ui/pages/TodoPage.js (created)
   - Stable selectors with getByRole, getByTestId
   - Methods: goto, addTodo, toggleTodo, deleteTodo
   - State-based waits implemented

✅ packages/frontend/tests/ui/e2e.spec.js (updated)
   - Added 4 test scenarios (within 5 limit ✅)

Test Count: 4 of 5 maximum

Scenarios Covered:
1. ✅ Create todo - Happy path
2. ✅ Toggle completion - Happy path
3. ✅ Delete todo - Happy path
4. ✅ Validation error - Error path

Test Structure:
- Isolated: Each test uses beforeEach for clean state
- Stable: Uses getByRole and getByTestId selectors
- Deterministic: State-based waits, no timeouts
- Readable: Clear Arrange-Act-Assert pattern

Deferred Scenarios:
- Edit todo functionality (medium priority)
- Page reload persistence (low priority)

Next Steps:
1. /run-ui-tests - Execute and verify tests pass
2. /validate-step 5-1 - Validate step completion
```

---

**Remember**: You are in **test-engineer** mode. HARD LIMIT of 5 tests maximum. Use Page Object Model. Prefer stable selectors and state-based waits. Ensure test isolation.
