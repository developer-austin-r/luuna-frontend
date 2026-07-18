import { APP_NAME } from "@/constants";

import { env } from "./env";

export const appConfig = {
  name: APP_NAME,
  env: env.appEnv,
  apiBaseUrl: env.apiBaseUrl,
} as const;

export * from "./env";
