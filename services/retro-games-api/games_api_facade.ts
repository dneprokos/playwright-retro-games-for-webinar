import { APIRequestContext } from "@playwright/test";
import { GamesApi } from "@services/retro-games-api/games_api";
import { AuthApi } from "@services/retro-games-api/auth_api";

export class ApiFacade {
  readonly games: GamesApi;
  readonly auth: AuthApi;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.games = new GamesApi(request, baseUrl);
    this.auth = new AuthApi(request, baseUrl);
  }
}
