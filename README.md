# SauceDemo Playwright Test Automation

![Playwright Tests](https://github.com/ani-ravindran/saucedemo-playwright-pom/actions/workflows/playwright.yml/badge.svg)

End-to-end test automation for [saucedemo.com](https://www.saucedemo.com), a demo e-commerce site, built with **Playwright** and **TypeScript** using the **Page Object Model**.

Alongside standard UI checks, the suite includes **data-integrity assertions** that verify the numbers the application shows are internally consistent: item prices, subtotal, tax and total.

## What is tested

| Area | Tests |
|------|-------|
| Login | Standard user can log in |
| Inventory | Adding one or more items updates the cart count; cart icon opens the cart with the added item |
| Cart | Removing an item updates the cart count and contents |
| Checkout | Full purchase from login to order confirmation; missing first name shows a validation error |
| Data integrity | Subtotal equals the sum of item prices; tax is 8% of the subtotal; total equals subtotal plus tax; all cart items reach the order overview |

Every test runs in **Chromium, Firefox and WebKit**.

## Project structure

```
pages/          Page objects - one class per screen, holding its locators and actions
  BasePage.ts
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
tests/          Test specs, grouped by feature
test-data/      Users, products and customer details kept separate from test logic
playwright.config.ts
```

## Design choices

- **Page Object Model:** tests describe *what* the user does, while page classes handle *how* to find elements. If the site's layout changes, only the page class needs updating.
- **Test data separated from tests:** users, products and customer details live in `test-data/`, so the same test can run with different data.
- **Stable locators:** elements are found by the site's `data-test` attributes, not by CSS classes or layout, which change more often.
- **Money compared in whole cents:** prices are converted to integers before comparing, to avoid decimal rounding errors.
- **Continuous integration:** GitHub Actions runs the full suite on every push.

## How to run

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
npm install
npx playwright install
npx playwright test
```

View the HTML report:

```bash
npx playwright show-report
```

Run one browser only, with the window visible:

```bash
npx playwright test --project=chromium --headed
```

## Author

Aanitha Gandhi Ravindran ([GitHub](https://github.com/ani-ravindran))