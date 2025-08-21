import { BaseApiRequest } from "@framework/base_request";
import { APIRequestContext, expect } from "@playwright/test";
import {
  LoginRequest,
  LoginSuccessfullResponse,
} from "./models/login_response_model";

export class AuthApi extends BaseApiRequest {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async getAuthToken(loginPayload: LoginRequest): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/api/auth/login`, {
      data: loginPayload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(response.ok()).toBeTruthy();
    const body: LoginSuccessfullResponse = await response.json();
    return body.token;
  }
}
