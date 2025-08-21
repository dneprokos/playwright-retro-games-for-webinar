import { APIRequestContext } from "@playwright/test";

export class BaseApiRequest {
  protected request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }
}
