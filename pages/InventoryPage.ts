import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly sortDropdown: Locator;

    constructor(page: Page) {
        super(page);
        this.inventoryItems = page.getByTestId('inventory-item');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartIcon = page.getByTestId('shopping-cart-link');
        this.sortDropdown = page.getByTestId('product-sort-container');
        }

  async addItemToCart(productName: string) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}