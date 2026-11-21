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
 * Constructs the canonical full URL for an S3-hosted static asset dynamically
 * using the configured S3 base URL.
 */
export function getS3AssetUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanBase = appConfig.s3BaseUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}/${cleanPath}`;
}

export * from "./env";
