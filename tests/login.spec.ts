import { test, expect } from '@playwright/test'; // pulls in Playwright's test runner and assertion library
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

test('standard user can log in', async ({ page }) => { // Playwright automatically gives every test a fresh page (a new browser tab) as a built-in argument, no setup needed
  const loginPage = new LoginPage(page); // runs the constructor in login page which in turn invokes the constructor in base page and all locators and methods in login and base page
  await loginPage.goto(); // uses the inherited BasePage method → goto -> loads
  await loginPage.login(users.standard.username, users.standard.password);

  await expect(page).toHaveURL(/inventory.html/);
});