import { APP_NAME } from "@/constants";

import { env } from "./env";

export const appConfig = {
  name: APP_NAME,
  env: env.appEnv,
  apiBaseUrl: env.apiBaseUrl,
  s3BaseUrl: env.s3BaseUrl,
  indiaLgdApiUrl: env.indiaLgdApiUrl,
} as const;

/**
 * Constructs the canonical full URL for an S3-hosted static asset.
 */
export function getS3AssetUrl(path: string): string {
  const cleanBase = appConfig.s3BaseUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export * from "./env";
