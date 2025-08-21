import { BaseWithTopHeaderPage } from "@pages/base_with_top_nav_page";
import { Page } from "@playwright/test";
import { AddNewGameFragment } from "@pages/admin_page_fragments/add_new_game_fragment";
import { GamesManagmentFragment } from "@pages/admin_page_fragments/games_management_fragment";

export class AdminPage extends BaseWithTopHeaderPage {
  readonly addNewGameFragment: AddNewGameFragment;
  readonly gamesManagementFragment: GamesManagmentFragment;

  constructor(page: Page) {
    super(page);
    this.addNewGameFragment = new AddNewGameFragment(this.page);
    this.gamesManagementFragment = new GamesManagmentFragment(this.page);
  }

  async goto() {
    await this.page.goto("/admin");
  }

  async openAddGameForm() {
    await this.page.getByRole("button", { name: "Add Game" }).click();
  }
}
