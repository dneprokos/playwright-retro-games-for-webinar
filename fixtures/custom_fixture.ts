import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home_page";
import { ApiFacade } from "@services/retro-games-api/games_api_facade";
import { GameDetailsPage } from "@pages/game_details_page";
import { LoginPage } from "@pages/login_page";
import { AdminPage } from "@pages/admin_page";
import { Config } from "@config/config";

type Services = {
  api: ApiFacade;
};

type Pages = {
  homePage: HomePage;
  gameDetailsPage: GameDetailsPage;
  loginPage: LoginPage;
  adminPage: AdminPage;
};

type Auth = {
  jwtToken: string;
  adminLoggedPage: AdminPage; // AdminPage with token already in localStorage and page navigated
};

export const test = base.extend<Services & Pages & Auth>({
  api: async ({ request, baseURL }, use) => {
    const apiFacade = new ApiFacade(request, baseURL!);
    await use(apiFacade);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  gameDetailsPage: async ({ page }, use) => {
    const gameDetails = new GameDetailsPage(page);
    await use(gameDetails);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },
  // === NEW: jwtToken fixture ===
  jwtToken: async ({ api }, use) => {
    const token = await api.auth.getAuthToken({
      email: Config.ADMIN_EMAIL,
      password: Config.ADMIN_PASSWORD,
    });
    await use(token);
  },

  // === NEW: adminLoggedPage fixture ===
  adminLoggedPage: async ({ page, homePage, jwtToken }, use) => {
    // Reuse your method that seeds localStorage with the token
    await homePage.setTokenToLocalStorage(jwtToken);

    const admin = new AdminPage(page);
    await admin.goto(); // now the app sees the token
    await use(admin);
  },
});

export { expect } from "@playwright/test";
