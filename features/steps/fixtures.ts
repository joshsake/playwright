import { test as base } from 'playwright-bdd';
import { HomePage } from '../../pageobjects/homepage';
import { SearchModal } from '../../pageobjects/search-modal';

type Fixtures = {
  homePage: HomePage;
  searchModal: SearchModal;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchModal: async ({ page }, use) => {
    await use(new SearchModal(page));
  },
});
