import { test as base } from '@playwright/test';
import { HomePage } from '../pageobjects/homepage';
import { DocsPage } from '../pageobjects/docs-page';
import { SearchModal } from '../pageobjects/search-modal';
import { ApiPage } from '../pageobjects/api-page';
import { CommunityPage } from '../pageobjects/community-page';
import { TodoPage } from '../pageobjects/todo-page';

type Fixtures = {
  homePage: HomePage;
  docsPage: DocsPage;
  searchModal: SearchModal;
  apiPage: ApiPage;
  communityPage: CommunityPage;
  todoPage: TodoPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  docsPage: async ({ page }, use) => {
    await use(new DocsPage(page));
  },
  searchModal: async ({ page }, use) => {
    await use(new SearchModal(page));
  },
  apiPage: async ({ page }, use) => {
    await use(new ApiPage(page));
  },
  communityPage: async ({ page }, use) => {
    await use(new CommunityPage(page));
  },
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },
});

export { expect } from '@playwright/test';
