import { BaseWithTopHeaderPage } from "@pages/base_with_top_nav_page";
import { expect, Locator, Page } from "@playwright/test";

export class AddNewGameFragment extends BaseWithTopHeaderPage {
  readonly form: Locator;
  readonly addGameButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.page.locator("form");
    this.addGameButton = this.form.locator('button[type="submit"]', {
      hasText: /^Add Game$/,
    });
  }

  /**
   * Clicks the "Add Game" button. Waits for it to be visible & enabled first.
   */
  async clickAddGame() {
    await this.addGameButton.waitFor({ state: "visible" });
    await expect(this.addGameButton).toBeEnabled(); // ensures not disabled
    await this.addGameButton.click();
  }

  /**
   * Optional: click and wait for the create request or navigation.
   * Adjust the URL/status to match your app.
   */
  async submitAndWait() {
    await this.addGameButton.waitFor({ state: "visible" });
    await expect(this.addGameButton).toBeEnabled();

    await Promise.all([
      // Example 1: wait for API create call
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/api/games") &&
          res.request().method() === "POST" &&
          res.ok()
      ),
      this.addGameButton.click(),
    ]);
  }

  async fillGameName(name: string) {
    await this.page.getByPlaceholder("Enter game name").fill(name);
  }

  async selectGenre(genre: string) {
    await this.page.locator('[name="genre"]').selectOption(genre);
  }

  async setReleaseDate(date: string) {
    await this.page.locator('[name="releaseDate"]').fill(date);
  }

  async selectPlatforms(platforms: string[]) {
    for (const platform of platforms) {
      await this.page.getByLabel(platform, { exact: true }).check();
    }
  }

  async setMultiplayerYes() {
    await this.page.getByLabel("Yes", { exact: true }).check();
  }

  async setRating(rating: string) {
    await this.page.locator('[name="rating"]').fill(rating);
  }

  async setImageUrl(url: string) {
    await this.page.locator('[name="imageUrl"]').fill(url);
  }

  async setDescription(description: string) {
    await this.page
      .locator(".retro-card")
      .locator('[name="description"]')
      .fill(description);
  }

  // --- Combined workflow ---
  async createGame({
    name,
    genre,
    releaseDate,
    platforms,
    rating,
    imageUrl,
    description,
  }: {
    name: string;
    genre: string;
    releaseDate: string;
    platforms: string[];
    rating: string;
    imageUrl: string;
    description: string;
  }) {
    await this.fillGameName(name);
    await this.selectGenre(genre);
    await this.setReleaseDate(releaseDate);
    await this.selectPlatforms(platforms);
    await this.setMultiplayerYes();
    await this.setRating(rating);
    await this.setImageUrl(imageUrl);
    await this.setDescription(description);
  }
}
