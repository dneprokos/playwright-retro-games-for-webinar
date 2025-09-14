import test, { Locator, Page } from "@playwright/test";
import { BaseWithTopHeaderPage } from "@pages/base_with_top_nav_page";
import { step } from "@framework/decorators/step";

export class LoginPage extends BaseWithTopHeaderPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;

  /**
   *
   */
  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.loginBtn = page.getByTestId("login-button");
  }

  async goto() {
    await super.goto("/login");
  }

  @step
  async submitLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  // async submitLoginForm(email: string, password: string) {
  //   await test.step(`Login as ${email} using Login form`, async () => {
  //     await this.emailInput.fill(email);
  //     await this.passwordInput.fill(password);
  //     await this.loginBtn.click();
  //   });
  // }
}
