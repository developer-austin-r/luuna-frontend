import { apiClient } from "./api-client";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
}

interface AuthApiResponse {
  data: {
    user: AuthUser;
  };
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Authenticates the user. Tokens are stored in HttpOnly cookies by the backend.
 * Never stored in localStorage or sessionStorage.
 */
export async function loginApi(payload: LoginPayload): Promise<AuthUser> {
  const res = await apiClient<AuthApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data.user;
}

/**
 * Refreshes tokens using the HttpOnly refresh token cookie.
 */
export async function refreshTokenApi(): Promise<AuthUser> {
  const res = await apiClient<AuthApiResponse>("/auth/refresh", {
    method: "POST",
  });
  return res.data.user;
}

/**
 * Logs the user out. Clears all auth cookies on the backend.
 */
export async function logoutApi(): Promise<void> {
  await apiClient<{ data: { message: string } }>("/auth/logout", {
    method: "POST",
  });
}
