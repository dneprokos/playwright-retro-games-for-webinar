import { Locator, Page } from "@playwright/test";
import { BaseWithTopHeaderPage } from "@pages/base_with_top_nav_page";

export class HomePage extends BaseWithTopHeaderPage {
  readonly searchInput: Locator;
  readonly gameName: Locator;
  readonly releaseDate: Locator;
  readonly platforms: Locator;
  readonly multiplayer: Locator;
  readonly rating: Locator;
  readonly mainContent: Locator;
  readonly noResultsContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId("search-input");
    this.gameName = page.getByTestId("game-name");
    this.releaseDate = page.getByTestId("game-release-date");
    this.platforms = page.getByTestId("game-platforms");
    this.multiplayer = page.getByTestId("game-multiplayer");
    this.rating = page.getByTestId("game-rating-value");
    this.mainContent = page.getByRole("main");
    this.noResultsContainer = page.locator("data-testid=no-results");
  }

  async goto() {
    await super.goto("/");
  }

  async searchForGame(title: string) {
    await this.searchInput.click();
    await this.searchInput.dblclick();
    await this.searchInput.fill(title);
  }

  getCardByName(name: string): Locator {
    return this.page.locator('[data-testid="game-card"]').filter({
      has: this.page.getByTestId("game-name").filter({ hasText: name }),
    });
  }

  async expectCardDetails(
    card: Locator,
    expected: {
      name: string;
      releaseYear: string;
      platforms: string;
      multiplayer: string;
      rating: string;
    }
  ) {
    await this.expectToHaveText(card.getByTestId("game-name"), expected.name);
    await this.expectToHaveText(
      card.getByTestId("game-release-date"),
      expected.releaseYear
    );
    await this.expectToHaveText(
      card.getByTestId("game-platforms"),
      expected.platforms
    );
    await this.expectToHaveText(
      card.getByTestId("game-multiplayer"),
      expected.multiplayer
    );
    await this.expectToHaveText(
      card.getByTestId("game-rating-value"),
      expected.rating
    );
  }

  async expectSearchSummary(text: string) {
    await this.expectToContainText(this.mainContent, text);
  }

  async getNoResultsHeaderAndText(): Promise<{
    header: string | null;
    text: string | null;
  }> {
    const headerText = await this.getText(
      this.noResultsContainer.locator("h2")
    );
    const paragraphText = await this.getText(
      this.noResultsContainer.locator("p")
    );
    return {
      header: headerText,
      text: paragraphText,
    };
  }
}
