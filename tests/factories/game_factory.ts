import { faker } from "@faker-js/faker";

export function makeGameData(allowedGenres: [], allowedPlatforms: []) {
  return {
    name: faker.company.buzzPhrase(), // e.g., "Quantum Pixel Odyssey"
    genre: faker.helpers.arrayElement(allowedGenres),
    // date string formatted like your UI expects (YYYY-MM-DD)
    releaseDate: faker.date
      .between({ from: "1990-01-01", to: "1999-12-31" })
      .toISOString()
      .slice(0, 10),
    platforms: faker.helpers.arrayElements(allowedPlatforms, {
      min: 1,
      max: 4,
    }),
    multiplayer: faker.datatype.boolean(),
    rating: faker.number.float({ min: 0, max: 10, multipleOf: 0.1 }).toFixed(1),
    // keep image url hardcoded as you wanted
    imageUrl: "https://example.com/game.jpg",
    description: faker.lorem.sentence(),
  };
}
