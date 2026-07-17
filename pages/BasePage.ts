import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page; //this stores the browser page object so that every method in this class (and its subclasses) can use it

  constructor(page: Page) { //this is how we hand that page in when we create an instance
    this.page = page;
  }

  async goto(path: string = '/') { //this is a helper which will call the base URL from the config
    await this.page.goto(path);
  }
}