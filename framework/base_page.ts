import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  async expectToHaveText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  }

  async expectToContainText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }

  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.addInitScript(
      ([k, v]) => {
        localStorage.setItem(k, v);
      },
      [key, value]
    );
  }
}
