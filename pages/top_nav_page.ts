import { Locator, Page, expect } from "@playwright/test";

export class TopNavPage {
  readonly page: Page;
  readonly email: Locator;
  readonly logoutButton: Locator;
  readonly adminLink: Locator;
  readonly ownerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator("nav").locator("text=/^[^@]+@[^@]+.[^@]+$/"); // Very bad locator
    this.logoutButton = page
      .locator("nav")
      .getByRole("button", { name: "Logout" });
    this.adminLink = page.locator("nav").getByRole("link", { name: /Admin/i });
    this.ownerLink = page.locator("nav").getByRole("link", { name: /Owner/i });
  }

  async expectUserInfoVisible(expectedEmail: string) {
    await expect.soft(this.email).toHaveText(expectedEmail);
    await expect.soft(this.logoutButton).toBeVisible();
  }

  async expectAdminLinkVisible() {
    await expect.soft(this.adminLink).toBeVisible();
  }

  async expectAdminLinkNotVisible() {
    await expect.soft(this.adminLink).toHaveCount(0);
  }

  async expectedOwnerLinkVisible() {
    await expect.soft(this.ownerLink).toBeVisible();
  }

  async expectOwnerLinkNotVisible() {
    await expect.soft(this.ownerLink).toHaveCount(0);
  }
}
