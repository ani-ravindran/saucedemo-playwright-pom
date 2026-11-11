import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../test-data/users';
import { products } from '../test-data/products';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

test('removing an item updates the cart', async () => {
  await inventoryPage.addItemToCart(products.backpack);
  await inventoryPage.addItemToCart(products.bikeLight);
  await inventoryPage.goToCart();

  expect(await cartPage.getItemCount()).toBe(2);

  await cartPage.removeItem(products.backpack);

  expect(await cartPage.getItemCount()).toBe(1);
  expect(await cartPage.hasItem(products.backpack)).toBe(false);
  expect(await cartPage.hasItem(products.bikeLight)).toBe(true);
});