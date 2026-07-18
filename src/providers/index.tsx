"use client";

import { ReduxProvider } from "./redux-provider";

type AppProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
