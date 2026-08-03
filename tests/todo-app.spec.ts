import { test, expect } from '../fixtures';

const TODO_ITEMS = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];

test.describe('TodoMVC — Adding Todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('added items appear in the list in order', async ({ todoPage }) => {
    await todoPage.addTodos(TODO_ITEMS);
    await expect(todoPage.todoTitles).toHaveText(TODO_ITEMS);
    await todoPage.expectTodoCountInLocalStorage(3);
  });

  test('input is cleared after adding an item', async ({ todoPage }) => {
    await todoPage.addTodo(TODO_ITEMS[0]);
    await expect(todoPage.newTodoInput).toBeEmpty();
  });

  test('counter reflects the number of active items', async ({ todoPage }) => {
    await todoPage.addTodo(TODO_ITEMS[0]);
    await expect(todoPage.todoCount).toHaveText('1 item left');
    await todoPage.addTodo(TODO_ITEMS[1]);
    await expect(todoPage.todoCount).toHaveText('2 items left');
  });

  test('whitespace-only input does not create a todo', async ({ todoPage }) => {
    await todoPage.addTodo('   ');
    await expect(todoPage.todoItems).toHaveCount(0);
  });
});

test.describe('TodoMVC — Completing Todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
    await todoPage.addTodos(TODO_ITEMS);
  });

  test('completing an item marks it as completed', async ({ todoPage }) => {
    await todoPage.completeTodo(TODO_ITEMS[0]);
    await expect(todoPage.todoItem(TODO_ITEMS[0])).toHaveClass('completed');
    await expect(todoPage.todoCount).toHaveText('2 items left');
    await todoPage.expectCompletedCountInLocalStorage(1);
  });

  test('un-completing an item restores it to active', async ({ todoPage }) => {
    await todoPage.completeTodo(TODO_ITEMS[0]);
    await todoPage.uncompleteTodo(TODO_ITEMS[0]);
    await expect(todoPage.todoItem(TODO_ITEMS[0])).not.toHaveClass('completed');
    await expect(todoPage.todoCount).toHaveText('3 items left');
  });

  test('toggle-all marks every item as completed', async ({ todoPage }) => {
    await todoPage.toggleAllCheckbox.check();
    await expect(todoPage.todoItems).toHaveClass(['completed', 'completed', 'completed']);
    await todoPage.expectCompletedCountInLocalStorage(3);
  });

  test('toggle-all clears when unchecked', async ({ todoPage }) => {
    await todoPage.toggleAllCheckbox.check();
    await todoPage.toggleAllCheckbox.uncheck();
    await expect(todoPage.todoItems).toHaveClass(['', '', '']);
    await expect(todoPage.todoCount).toHaveText('3 items left');
  });
});

test.describe('TodoMVC — Editing Todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
    await todoPage.addTodos(TODO_ITEMS);
  });

  test('double-clicking an item allows editing its text', async ({ todoPage }) => {
    await todoPage.editTodo(TODO_ITEMS[1], 'feed the dog');
    await expect(todoPage.todoTitles).toHaveText([TODO_ITEMS[0], 'feed the dog', TODO_ITEMS[2]]);
  });

  test('saving an empty edit deletes the item', async ({ todoPage }) => {
    await todoPage.editTodo(TODO_ITEMS[1], '');
    await expect(todoPage.todoTitles).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('pressing Escape cancels the edit', async ({ todoPage }) => {
    const item = todoPage.todoItem(TODO_ITEMS[1]);
    await item.dblclick();
    const editBox = item.getByRole('textbox', { name: 'Edit' });
    await editBox.fill('this edit should be discarded');
    await editBox.press('Escape');
    await expect(todoPage.todoTitles).toHaveText(TODO_ITEMS);
  });
});

test.describe('TodoMVC — Deleting Todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
    await todoPage.addTodos(TODO_ITEMS);
  });

  test('deleting an item removes it from the list', async ({ todoPage }) => {
    await todoPage.deleteTodo(TODO_ITEMS[1]);
    await expect(todoPage.todoTitles).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    await todoPage.expectTodoCountInLocalStorage(2);
  });

  test('"Clear completed" removes only completed items', async ({ todoPage }) => {
    await todoPage.completeTodo(TODO_ITEMS[0]);
    await todoPage.clearCompleted();
    await expect(todoPage.todoTitles).toHaveText([TODO_ITEMS[1], TODO_ITEMS[2]]);
  });

  test('"Clear completed" button is hidden when nothing is completed', async ({ todoPage }) => {
    await expect(todoPage.clearCompletedButton).toBeHidden();
    await todoPage.completeTodo(TODO_ITEMS[0]);
    await expect(todoPage.clearCompletedButton).toBeVisible();
  });
});

test.describe('TodoMVC — Filters', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
    await todoPage.addTodos(TODO_ITEMS);
    await todoPage.completeTodo(TODO_ITEMS[1]);
  });

  test('"Active" filter shows only incomplete items', async ({ todoPage }) => {
    await todoPage.filterBy('Active');
    await expect(todoPage.todoTitles).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('"Completed" filter shows only completed items', async ({ todoPage }) => {
    await todoPage.filterBy('Completed');
    await expect(todoPage.todoTitles).toHaveText([TODO_ITEMS[1]]);
  });

  test('"All" filter shows everything again', async ({ todoPage }) => {
    await todoPage.filterBy('Completed');
    await todoPage.filterBy('All');
    await expect(todoPage.todoTitles).toHaveText(TODO_ITEMS);
  });

  test('filter selection is reflected in the URL and highlighted', async ({ todoPage, page }) => {
    await todoPage.filterBy('Active');
    await expect(page).toHaveURL(/#\/active/);
    await expect(todoPage.selectedFilter).toHaveText('Active');
  });
});

test.describe('TodoMVC — Persistence', () => {
  test('todos and completed state survive a page reload', async ({ todoPage, page }) => {
    await todoPage.goto();
    await todoPage.addTodos(TODO_ITEMS);
    await todoPage.completeTodo(TODO_ITEMS[0]);
    await todoPage.expectCompletedCountInLocalStorage(1);

    await page.reload();

    await expect(todoPage.todoTitles).toHaveText(TODO_ITEMS);
    await expect(todoPage.todoItem(TODO_ITEMS[0])).toHaveClass('completed');
    await expect(todoPage.todoCount).toHaveText('2 items left');
  });
});
