import { expect, Locator, Page } from "@playwright/test";
import { BaseWithTopHeaderPage } from "@pages/base_with_top_nav_page";

export class GameDetailsPage extends BaseWithTopHeaderPage {
  readonly gameName: Locator;
  readonly gameGenre: Locator;
  readonly gameReleaseDate: Locator;
  readonly gameMultiplayer: Locator;
  readonly gameRating: Locator;
  readonly gamePlatforms: Locator;

  constructor(page: Page) {
    super(page);
    this.gameName = page.getByTestId("game-name");
    this.gameGenre = page.getByTestId("game-genre");
    this.gameReleaseDate = page.getByTestId("game-release-date");
    this.gameMultiplayer = page.getByTestId("game-multiplayer");
    this.gameRating = page.getByTestId("game-rating");
    this.gamePlatforms = page.getByTestId("game-platforms");
  }

  async goto(game_id: string) {
    await super.goto(`/game/${game_id}`);
  }

  async verifyGameDetails(expectedDetails: {
    name: string;
    genre: string;
    releaseDate: string;
    multiplayer: string;
    ratingText: string;
    platforms: string[];
  }) {
    await expect.soft(this.gameName).toHaveText(expectedDetails.name);
    await expect.soft(this.gameGenre).toContainText(expectedDetails.genre);
    await expect
      .soft(this.gameReleaseDate)
      .toContainText(expectedDetails.releaseDate);
    await expect
      .soft(this.gameMultiplayer)
      .toContainText(expectedDetails.multiplayer);
    await expect
      .soft(this.gameRating)
      .toContainText(expectedDetails.ratingText);

    const platformTags = await this.gamePlatforms
      .locator("span")
      .allTextContents();
    expect.soft(platformTags).toEqual(expectedDetails.platforms);
  }

  async expectRatingVisual(screenshotName: string) {
    await expect.soft(this.gameRating).toBeVisible();
    await expect.soft(this.gameRating).toHaveScreenshot(screenshotName, {
      animations: "disabled",
      scale: "css",
    });
  }
}
