import { test } from "@fixtures/custom_fixture";

test.describe("Game Details e2e tests", () => {
  test("should display correct game data", async ({ api, gameDetailsPage }) => {
    // Arrange
    const game = await api.games.getFirstGame();
    const id = game._id;
    const targetGame = game.name;
    const formattedDate = new Date(game.releaseDate).getFullYear().toString();
    const platforms = game.platforms;
    const multiplayer = game.hasMultiplayer ? "Multiplayer" : "Single Player";
    const rating = `${game.rating}/10`;
    const genre = game.genre;

    // Act
    // Navigate to game details page base_url/game/688a58acf3dc68117fcfbc7f
    await gameDetailsPage.goto(id);

    // Assert
    await gameDetailsPage.verifyGameDetails({
      name: targetGame,
      genre: genre,
      multiplayer: multiplayer,
      ratingText: rating,
      releaseDate: formattedDate,
      platforms: platforms,
    });
  });

  test("should show correct rating in game details and match visual", async ({
    page,
    gameDetailsPage,
    api,
  }) => {
    // Arrange
    const game = await api.games.getFirstGame();

    await page.route("**/api/games/*", async (route, request) => {
      const originalResponse = await route.fetch();
      const json = await originalResponse.json();

      json.game.rating = 9.3; // Change rating only

      await route.fulfill({
        response: originalResponse,
        body: JSON.stringify(json),
      });
    });

    // Act
    await gameDetailsPage.goto(game._id);

    // Assert
    await gameDetailsPage.expectRatingVisual("details-rating.png");
  });
});
