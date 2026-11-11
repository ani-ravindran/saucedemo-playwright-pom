import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/users';
import { products } from '../test-data/products';
import { customer } from '../test-data/customer';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);
  checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);

  await inventoryPage.addItemToCart(products.backpack);
  await inventoryPage.addItemToCart(products.bikeLight);
  await inventoryPage.goToCart();
  await cartPage.checkout();
});

test('user can complete a purchase from login to order confirmation', async () => {
  await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
  await checkoutPage.continue();
  await checkoutPage.finish();

  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

test('order totals on the overview page add up correctly', async () => {
  await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
  await checkoutPage.continue();

  const itemPrices = await checkoutPage.getItemPricesInCents();
  const subtotal = await checkoutPage.getSubtotalInCents();
  const tax = await checkoutPage.getTaxInCents();
  const total = await checkoutPage.getTotalInCents();

  // 1. Completeness: both items added to the cart reach the overview
  expect(itemPrices).toHaveLength(2);

  // 2. Subtotal equals the sum of the individual item prices
  const sumOfItems = itemPrices.reduce((sum, price) => sum + price, 0);
  expect(subtotal).toBe(sumOfItems);

  // 3. Tax is 8% of the subtotal, rounded to the nearest cent
  expect(tax).toBe(Math.round(subtotal * 0.08));

  // 4. Total equals subtotal plus tax
  expect(total).toBe(subtotal + tax);
});

test('checkout shows an error when first name is missing', async () => {
  await checkoutPage.fillCustomerInfo('', customer.lastName, customer.postalCode);
  await checkoutPage.continue();

  await expect(checkoutPage.errorMessage).toContainText('First Name is required');
});