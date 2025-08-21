import { Config } from "@config/config";
import { expect, test } from "@fixtures/custom_fixture";
import { faker } from "@faker-js/faker";

const dateOnly = (iso: string) => new Date(iso).toISOString().slice(0, 10);
const sorted = <T>(arr: T[]) => [...arr].sort();

test.describe("Add new game e2e tests", () => {
  let createdGameId: string | null = null;

  test.beforeEach(async ({ adminLoggedPage }) => {
    // You’re already authenticated here
    await adminLoggedPage.openAddGameForm();
  });

  test.afterEach(async ({ api, jwtToken }) => {
    if (createdGameId) {
      await api.games.deleteGame(createdGameId, jwtToken);
      createdGameId = null;
    }
  });

  test("should create a new game with all populated data", async ({
    adminLoggedPage,
    api,
  }) => {
    // Arrange
    const allowedGenres = [
      "Platformer",
      "RPG",
      "Action",
      "Adventure",
      "Puzzle",
      "Shooter",
    ];
    const allowedPlatforms = ["NES", "SNES", "Game Boy", "PC", "N64"];
    const gameName = faker.company.buzzPhrase(); // or keep your hardcoded "Super Retro Bros"
    const genre = faker.helpers.arrayElement(allowedGenres);
    const releaseDate = faker.date
      .between({ from: "1990-01-01", to: "1999-12-31" })
      .toISOString()
      .slice(0, 10);
    const platforms = faker.helpers.arrayElements(allowedPlatforms, {
      min: 1,
      max: 4,
    });
    const rating = faker.number
      .float({ min: 0, max: 10, multipleOf: 0.1 })
      .toFixed(1);
    const ratingNum = Number(rating);
    const description = faker.lorem.sentence();
    const imageUrl = "https://example.com/game.jpg";

    // Act
    const addNewGameForm = adminLoggedPage.addNewGameFragment;
    await addNewGameForm.fillGameName(gameName);
    await addNewGameForm.selectGenre(genre);
    await addNewGameForm.setReleaseDate(releaseDate);
    await addNewGameForm.selectPlatforms(platforms);
    await addNewGameForm.setRating(rating);
    await addNewGameForm.setImageUrl(imageUrl);
    await addNewGameForm.setDescription(description);
    await addNewGameForm.setMultiplayerYes();
    await addNewGameForm.submitAndWait();

    // Assert
    const actualGame = await api.games.getFirstGameBySearch(gameName);
    createdGameId = actualGame._id; // save the id for afterAll deletion

    // API assertion
    expect.soft(actualGame.name).toBe(gameName);
    expect.soft(actualGame.genre).toBe(genre);
    expect.soft(dateOnly(actualGame.releaseDate)).toBe(releaseDate);
    expect.soft(sorted(actualGame.platforms)).toEqual(sorted(platforms));
    expect.soft(actualGame.hasMultiplayer).toBe(true);
    expect.soft(actualGame.rating).toBeCloseTo(ratingNum, 1);
    expect.soft(actualGame.description.trim()).toBe(description.trim());
    expect.soft(actualGame.imageUrl).toBe(imageUrl);
    expect.soft(actualGame._id).toBeTruthy();

    // UI assertion
    const actualGameOnUI =
      await adminLoggedPage.gamesManagementFragment.getGameRowDataByName(
        gameName
      );
    expect.soft(actualGameOnUI.genre).toBe(genre);
    expect.soft(actualGameOnUI.platforms).toContain(platforms[0]);
    expect.soft(actualGameOnUI.hasMultiplayer).toBeTruthy();
    const expectedYear = new Date(releaseDate).getFullYear();
    expect.soft(actualGameOnUI.year).toBe(expectedYear);
  });
});
