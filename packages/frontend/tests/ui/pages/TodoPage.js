/**
 * Page Object Model for TODO Application
 */
export class TodoPage {
  constructor(page) {
    this.page = page;
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
  }

  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    await this.page.getByText(title).first().waitFor({ state: 'visible' });
  }

  getTodoByTitle(title) {
    return this.page.getByText(title).first();
  }

  async toggleTodo(title) {
    const todoText = await this.getTodoByTitle(title);
    const listItem = todoText.locator('..');
    const checkbox = listItem.getByRole('checkbox');
    await checkbox.click();
    await this.page.waitForTimeout(200);
  }

  async isTodoCompleted(title) {
    const todoText = await this.getTodoByTitle(title);
    const listItem = todoText.locator('..');
    const checkbox = listItem.getByRole('checkbox');
    return await checkbox.isChecked();
  }

  async deleteTodo(title) {
    const todoText = await this.getTodoByTitle(title);
    const listItem = todoText.locator('..');
    const deleteButton = listItem.getByRole('button', { name: 'delete todo' });
    await deleteButton.click();
    await todoText.waitFor({ state: 'detached' });
  }

  async editTodo(oldTitle, newTitle) {
    // Find the todo and click edit
    const todoText = await this.getTodoByTitle(oldTitle);
    const listItem = todoText.locator('..');
    const editButton = listItem.getByRole('button', { name: 'edit todo' });
    await editButton.click();
    
    // After clicking edit, the entire ListItem content changes
    // Wait for edit mode to activate - look for a textbox with the old value
    const textField = this.page.locator(`input[type="text"][value="${oldTitle}"]`);
    await textField.waitFor({ state: 'visible', timeout: 5000 });
    
    // Clear and type new title
    await textField.fill(newTitle);
    
    // Find and click Save button (should be near the textbox)
    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    
    // Wait for new title to appear
    await this.page.getByText(newTitle).first().waitFor({ state: 'visible' });
  }

  async cancelEdit(title) {
    const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
    await cancelButton.click();
  }

  async deleteAllTodos() {
    while (true) {
      const deleteButtons = await this.page.getByRole('button', { name: 'delete todo' }).all();
      if (deleteButtons.length === 0) break;
      await deleteButtons[0].click();
      await this.page.waitForTimeout(300);
    }
  }

  async isEmptyStateVisible() {
    const emptyMessage = this.page.getByText(/No todos yet/i);
    return await emptyMessage.isVisible();
  }

  async getIncompleteCount() {
    const chip = this.page.getByText(/items left/i);
    const text = await chip.textContent();
    const match = text.match(/(\d+) items left/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getCompletedCount() {
    const chip = this.page.getByText(/completed/i);
    const text = await chip.textContent();
    const match = text.match(/(\d+) completed/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isErrorVisible() {
    const errorMessage = this.page.getByText(/error/i);
    return await errorMessage.isVisible();
  }
}
