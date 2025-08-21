import { BaseApiRequest } from "@framework/base_request";
import { APIRequestContext, expect } from "@playwright/test";
import {
  Game,
  GetGamesResponse,
} from "@services/retro-games-api/models/game_model";

export class GamesApi extends BaseApiRequest {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async getFirstGame(): Promise<Game> {
    const response = await this.request.get(
      `${this.baseUrl}/api/games?limit=1`
    );
    expect(response.ok()).toBeTruthy();

    const json = (await response.json()) as GetGamesResponse;
    expect(json.games.length).toBeGreaterThan(0);
    return json.games[0];
  }

  // Future: you can also expose full paginated response if needed:
  async getGames(limit = 12): Promise<GetGamesResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/api/games?limit=${limit}`
    );
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<GetGamesResponse>;
  }

  async getFirstGameBySearch(search: string): Promise<Game> {
    const url = `${this.baseUrl}/api/games?search=${encodeURIComponent(
      search
    )}&limit=1`;
    const response = await this.request.get(url);
    expect(response.ok()).toBeTruthy();

    const json = (await response.json()) as GetGamesResponse;
    expect(json.games.length).toBeGreaterThan(0);
    return json.games[0];
  }

  async deleteGame(id: string, token: string): Promise<void> {
    const response = await this.request.delete(
      `${this.baseUrl}/api/games/${encodeURIComponent(id)}`,
      { headers: { accept: "*/*", Authorization: `Bearer ${token}` } }
    );

    // Accept common success codes for DELETE
    expect([200, 202, 204]).toContain(response.status());
  }
}
