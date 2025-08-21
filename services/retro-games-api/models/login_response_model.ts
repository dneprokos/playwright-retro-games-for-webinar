export interface LoginSuccessfullResponse {
  message: string;
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
