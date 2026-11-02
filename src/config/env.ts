export const env = {
  appEnv: process.env.APP_ENV ?? "development",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
  s3BaseUrl:
    process.env.NEXT_PUBLIC_S3_BASE_URL ??
    process.env.NEXT_PUBLIC_BILLING_LOGO_URL ??
    "https://luuna-production-storage.s3.eu-north-1.amazonaws.com",
  indiaLgdApiUrl:
    process.env.NEXT_PUBLIC_INDIA_LGD_API_URL ??
    "https://india-lgd-index-api.vercel.app",
} as const;
