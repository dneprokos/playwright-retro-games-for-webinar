import { expect, test } from "@fixtures/custom_fixture";

test.describe("Home page search and filter tests", () => {
  test("should display correct game data after searching", async ({
    api,
    homePage,
  }) => {
    // Arrange
    const game = await api.games.getFirstGame();
    const targetGame = game.name;
    const formattedDate = new Date(game.releaseDate).getFullYear().toString();
    const platforms = game.platforms.join(", ");
    const multiplayer = game.hasMultiplayer ? "Multiplayer" : "Single Player";
    const rating = `${game.rating}/10`;

    await homePage.goto();

    // Act
    await homePage.searchForGame(targetGame);

    // Assert
    const card = homePage.getCardByName(targetGame);
    await homePage.expectCardDetails(card, {
      name: game.name,
      releaseYear: formattedDate,
      platforms,
      multiplayer,
      rating,
    });
    await homePage.expectSearchSummary("Showing 1 of 1 games");
  });

  test("should not display games once db is empty", async ({
    homePage,
    page,
  }) => {
    // Intercept the API call and return zero games
    await page.route(`**/api/games?**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          games: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalGames: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }),
      })
    );

    // Act
    await homePage.goto();

    // Optional: assert that the page displays no games message
    const noResultsContent = await homePage.getNoResultsHeaderAndText();
    expect.soft(noResultsContent.header).toBe("No Games Found");
    expect
      .soft(noResultsContent.text)
      .toBe("Try adjusting your search or filters to find more games.");
  });
});
