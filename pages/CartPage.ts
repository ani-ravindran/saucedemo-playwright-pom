import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async hasItem(productName: string): Promise<boolean> {
    const item = this.cartItems.filter({ hasText: productName });
    return (await item.count()) > 0;
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async removeItem(productName: string) {
  const item = this.cartItems.filter({ hasText: productName });
  await item.getByRole('button', { name: 'Remove' }).click();
}

  async checkout() {
  await this.page.getByTestId('checkout').click();
}
}