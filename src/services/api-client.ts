import { appConfig } from "@/config";

export async function apiClient<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    credentials: "include", // Always send HttpOnly cookies
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData) {
        errorMessage = errorData.error || errorData.message || errorMessage;
      }
    } catch {
      // Ignore parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<TResponse>;
}
