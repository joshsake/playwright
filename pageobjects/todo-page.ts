import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly todoCount: Locator;
  readonly toggleAllCheckbox: Locator;
  readonly clearCompletedButton: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly selectedFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.todoCount = page.getByTestId('todo-count');
    this.toggleAllCheckbox = page.getByLabel('Mark all as complete');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.filterAll = page.getByRole('link', { name: 'All' });
    this.filterActive = page.getByRole('link', { name: 'Active' });
    this.filterCompleted = page.getByRole('link', { name: 'Completed' });
    this.selectedFilter = page.locator('.filters a.selected');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(items: string[]) {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  todoItem(title: string): Locator {
    return this.todoItems.filter({ hasText: title });
  }

  async completeTodo(title: string) {
    await this.todoItem(title).getByRole('checkbox').check();
  }

  async uncompleteTodo(title: string) {
    await this.todoItem(title).getByRole('checkbox').uncheck();
  }

  async editTodo(title: string, newText: string) {
    const item = this.todoItem(title);
    await item.dblclick();
    const editBox = item.getByRole('textbox', { name: 'Edit' });
    await editBox.fill(newText);
    await editBox.press('Enter');
  }

  async deleteTodo(title: string) {
    const item = this.todoItem(title);
    await item.hover();
    await item.locator('button.destroy').click();
  }

  async clearCompleted() {
    await this.clearCompletedButton.click();
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter }).click();
  }

  // The demo app persists todos in localStorage under the key 'react-todos'.
  async expectTodoCountInLocalStorage(expected: number) {
    await this.page.waitForFunction(
      (count) => JSON.parse(localStorage['react-todos']).length === count,
      expected
    );
  }

  async expectCompletedCountInLocalStorage(expected: number) {
    await this.page.waitForFunction(
      (count) =>
        JSON.parse(localStorage['react-todos']).filter(
          (todo: { completed: boolean }) => todo.completed
        ).length === count,
      expected
    );
  }
}
