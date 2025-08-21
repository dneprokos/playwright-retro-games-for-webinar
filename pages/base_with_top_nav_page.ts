import { Locator, Page } from "@playwright/test";
import { BasePage } from "@framework/base_page";
import { TopNavPage } from "@pages/top_nav_page";

export class BaseWithTopHeaderPage extends BasePage {
  readonly topNav: TopNavPage;

  constructor(page: Page) {
    super(page);
    this.topNav = new TopNavPage(page);
  }

  async setTokenToLocalStorage(jwtToken: string) {
    await this.setLocalStorageItem("token", jwtToken);
  }
}
