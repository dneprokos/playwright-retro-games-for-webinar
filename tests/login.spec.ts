import { Config } from "@config/config";
import { test } from "@fixtures/custom_fixture";

test.describe("Login feature tests", () => {
  let adminEmail: string;
  let adminPassword: string;

  test.beforeEach(async ({ page }) => {
    adminEmail = Config.ADMIN_EMAIL;
    adminPassword = Config.ADMIN_PASSWORD;
  });

  test("admin should login via UI with valid credentials", async ({
    loginPage,
    homePage,
  }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.submitLoginForm(adminEmail, adminPassword); // Temp solution. Password should be hidden. Never commit such thing.

    // Assert
    const topNav = homePage.topNav;
    await topNav.expectUserInfoVisible(adminEmail);
    await topNav.expectAdminLinkVisible();
    await topNav.expectOwnerLinkNotVisible();
  });

  test("admin should login via local storage with valid credentials", async ({
    homePage,
    api,
  }) => {
    // Arrange
    const jwtToken = await api.auth.getAuthToken({
      email: adminEmail,
      password: adminPassword,
    });
    await homePage.setTokenToLocalStorage(jwtToken);

    // Act
    await homePage.goto();

    // Assert
    const topNav = homePage.topNav;
    await topNav.expectUserInfoVisible(adminEmail);
    await topNav.expectAdminLinkVisible();
    await topNav.expectOwnerLinkNotVisible();
  });
});
