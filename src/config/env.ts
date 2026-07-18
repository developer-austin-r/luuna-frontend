export const env = {
  appEnv: process.env.APP_ENV ?? "development",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
} as const;
