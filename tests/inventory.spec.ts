import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../test-data/users';
import { products } from '../test-data/products';
import { CartPage } from '../pages/CartPage';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

test('adding an item updates the cart count', async ({ page }) => {

  expect(await inventoryPage.getCartCount()).toBe(0);

  await inventoryPage.addItemToCart(products.backpack);

  expect(await inventoryPage.getCartCount()).toBe(1);
});

test('adding multiple items updates the cart count', async ({ page }) => {
 
  expect(await inventoryPage.getCartCount()).toBe(0);

  await inventoryPage.addItemToCart(products.backpack);
  await inventoryPage.addItemToCart(products.bikeLight);
  await inventoryPage.addItemToCart(products.boltTShirt);

  expect(await inventoryPage.getCartCount()).toBe(3);
});

test('cart icon navigates to cart page with added item', async ({ page }) => {
  const cartPage = new CartPage(page);

  await inventoryPage.addItemToCart(products.backpack);
  await inventoryPage.goToCart();

  expect(await cartPage.hasItem(products.backpack)).toBe(true);
  expect(await cartPage.getItemCount()).toBe(1);
});