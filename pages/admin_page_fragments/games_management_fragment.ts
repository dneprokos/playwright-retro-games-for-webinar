import { BaseWithTopHeaderPage } from "@pages/base_with_top_nav_page";
import { expect, Locator, Page } from "@playwright/test";

export type GameRowData = {
  id: string;
  name: string;
  genre: string;
  year: number;
  platforms: string[];
  hasMultiplayer: boolean;
  row: Locator;
  editButton: Locator;
  deleteButton: Locator;
};

export class GamesManagmentFragment extends BaseWithTopHeaderPage {
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.locator("#games-list");
  }

  private escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Перевіряє, що таблиця з'явилася і має хоча б один рядок.
   */
  async waitForTableLoaded() {
    await this.table.waitFor({ state: "visible" });
    await expect(this.table.locator("tbody tr")).not.toHaveCount(0);
  }

  rowByGameName(name: string): Locator {
    const exact = new RegExp(`^\\s*${this.escapeRegExp(name)}\\s*$`, "i");
    return this.table
      .locator("tbody tr")
      .filter({ has: this.page.locator("a", { hasText: exact }) })
      .first();
  }

  async getGameRowDataByName(name: string): Promise<GameRowData> {
    // чек таблиці, але без API-колів
    await this.waitForTableLoaded();

    const row = this.rowByGameName(name);

    // щоб уникнути гонки — дочекаємось, що рядок реально з’явився
    await expect
      .poll(() => row.count(), {
        message: `Row for game "${name}" should exist`,
        timeout: 10000,
      })
      .toBeGreaterThan(0);

    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible();

    const nameCell = row.locator("td").nth(0);
    const genreCell = row.locator("td").nth(1);
    const yearCell = row.locator("td").nth(2);
    const platformsCell = row.locator("td").nth(3);
    const multiplayerCell = row.locator("td").nth(4);

    const link = nameCell.locator("a");
    const linkHref = (await link.getAttribute("href")) ?? "";
    const idMatch = /\/game\/([^/?#]+)/.exec(linkHref);
    const id = idMatch?.[1] ?? "";

    const gameName = (await link.innerText()).trim();
    const genre = (await genreCell.innerText()).trim();
    const year = parseInt((await yearCell.innerText()).trim(), 10);

    const platformSpans = platformsCell.locator("span.bg-arcade-border");
    const platforms = (await platformSpans.allInnerTexts()).map((t) =>
      t.trim()
    );

    const hasMultiplayer = /yes/i.test(
      (await multiplayerCell.innerText()).trim()
    );

    const editButton = row.locator('button[title="Edit"]');
    const deleteButton = row.locator('button[title="Delete"]');

    return {
      id,
      name: gameName,
      genre,
      year: Number.isFinite(year) ? year : NaN,
      platforms,
      hasMultiplayer,
      row,
      editButton,
      deleteButton,
    };
  }
}
