import { Page, Locator } from '@playwright/test';

/**
 * Covers all three checkout screens on saucedemo:
 * 1. Your Information (name and postcode form)
 * 2. Overview (items, subtotal, tax, total)
 * 3. Complete (order confirmation)
 */
export class CheckoutPage {
  readonly page: Page;

  // Step 1 - Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 - Overview
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Step 3 - Complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  /** Prices of every item on the Overview screen, in cents. */
  async getItemPricesInCents(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(toCents);
  }

  async getSubtotalInCents(): Promise<number> {
    return toCents(await this.subtotalLabel.textContent());
  }

  async getTaxInCents(): Promise<number> {
    return toCents(await this.taxLabel.textContent());
  }

  async getTotalInCents(): Promise<number> {
    return toCents(await this.totalLabel.textContent());
  }
}

/**
 * Turns text like "Item total: $39.98" into 3998.
 * Working in whole cents avoids decimal rounding errors
 * (in JavaScript, 0.1 + 0.2 is not exactly 0.3).
 */
function toCents(text: string | null): number {
  const match = text?.match(/\$([\d.]+)/);
  if (!match) throw new Error(`Could not find a price in: "${text}"`);
  return Math.round(parseFloat(match[1]) * 100);
}