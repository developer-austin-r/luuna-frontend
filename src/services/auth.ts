import { apiClient } from "./api-client";

export interface MenuNode {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  permission: string | null;
  sortOrder: number;
  children: MenuNode[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  permissions: string[];
  menus: MenuNode[];
}

interface AuthApiResponse {
  data: {
    user: Omit<AuthUser, "permissions" | "menus">;
    permissions: string[];
    menus: MenuNode[];
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
  return {
    ...res.data.user,
    permissions: res.data.permissions ?? [],
    menus: res.data.menus ?? [],
  };
}

/**
 * Refreshes tokens using the HttpOnly refresh token cookie.
 */
export async function refreshTokenApi(): Promise<AuthUser> {
  const res = await apiClient<AuthApiResponse>("/auth/refresh", {
    method: "POST",
  });
  return {
    ...res.data.user,
    permissions: res.data.permissions ?? [],
    menus: res.data.menus ?? [],
  };
}

/**
 * Logs the user out. Clears all auth cookies on the backend.
 */
export async function logoutApi(): Promise<void> {
  await apiClient<{ data: { message: string } }>("/auth/logout", {
    method: "POST",
  });
}
