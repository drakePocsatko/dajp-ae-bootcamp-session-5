/**
 * End-to-End Tests for TODO Application
 * 
 * Tests critical user journeys using Playwright and Page Object Model.
 * Ensures stable, isolated, and deterministic test execution.
 */
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test.describe('TODO Application - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    // Initialize Page Object and navigate to app
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  /**
   * Test 1: Create a new todo (Happy Path)
   * 
   * Verifies that users can successfully create a new todo item.
   * This is the most critical happy path for the application.
   */
  test('should create a new todo', async ({ page }) => {
    // Arrange
    const todoTitle = 'Buy groceries';

    // Act
    await todoPage.addTodo(todoTitle);

    // Assert
    const todo = todoPage.getTodoByTitle(todoTitle);
    await expect(todo).toBeVisible();
    
    // Verify stats updated
    const incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBe(1);
  });

  /**
   * Test 2: Toggle todo completion status (Happy Path)
   * 
   * Verifies that users can mark todos as complete and incomplete.
   * Tests the core workflow of task completion.
   */
  test('should toggle todo completion status', async ({ page }) => {
    // Arrange - Create a todo first
    const todoTitle = 'Complete project documentation';
    await todoPage.addTodo(todoTitle);

    // Act - Toggle to completed
    await todoPage.toggleTodo(todoTitle);

    // Assert - Verify todo is marked as completed
    const isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(true);

    // Verify stats updated
    const completedCount = await todoPage.getCompletedCount();
    expect(completedCount).toBe(1);

    // Act - Toggle back to incomplete
    await todoPage.toggleTodo(todoTitle);

    // Assert - Verify todo is marked as incomplete
    const isStillCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isStillCompleted).toBe(false);
  });

  /**
   * Test 3: Delete a todo (Happy Path)
   * 
   * Verifies that users can successfully delete todo items.
   * Tests the remove functionality which is critical for task management.
   */
  test('should delete a todo', async ({ page }) => {
    // Arrange - Create a todo first
    const todoTitle = 'Temporary task to be deleted';
    await todoPage.addTodo(todoTitle);

    // Verify todo exists before deletion
    const todoBeforeDelete = todoPage.getTodoByTitle(todoTitle);
    await expect(todoBeforeDelete).toBeVisible();

    // Act - Delete the todo
    await todoPage.deleteTodo(todoTitle);

    // Assert - Verify todo is no longer visible
    const todoAfterDelete = page.getByText(todoTitle);
    await expect(todoAfterDelete).not.toBeVisible();
  });

  /**
   * Test 4: Edit an existing todo (Happy Path)
   * 
   * Verifies that users can update todo titles.
   * Tests the edit functionality for modifying existing tasks.
   */
  test('should edit an existing todo', async ({ page }) => {
    // Arrange - Create a todo first
    const originalTitle = 'Draft meeting notes';
    const updatedTitle = 'Finalize meeting notes';
    await todoPage.addTodo(originalTitle);

    // Act - Edit the todo
    await todoPage.editTodo(originalTitle, updatedTitle);

    // Assert - Verify new title is visible
    const updatedTodo = todoPage.getTodoByTitle(updatedTitle);
    await expect(updatedTodo).toBeVisible();

    // Verify old title is gone
    const originalTodo = page.getByText(originalTitle);
    await expect(originalTodo).not.toBeVisible();
  });

  /**
   * Test 5: Display empty state when no todos exist (Edge Case)
   * 
   * Verifies that the application shows a helpful message when the list is empty.
   * Tests user experience for new users or after all tasks are completed.
   */
  test('should display empty state message when no todos exist', async ({ page }) => {
    // Arrange - Delete any existing todos first
    await todoPage.deleteAllTodos();

    // Assert - Verify empty state message is visible
    const isEmptyStateVisible = await todoPage.isEmptyStateVisible();
    expect(isEmptyStateVisible).toBe(true);

    // Verify stats show zero
    const incompleteCount = await todoPage.getIncompleteCount();
    const completedCount = await todoPage.getCompletedCount();
    expect(incompleteCount).toBe(0);
    expect(completedCount).toBe(0);
  });
});
