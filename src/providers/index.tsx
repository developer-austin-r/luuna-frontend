"use client";

import { ReduxProvider } from "./redux-provider";
import { ToastProvider } from "./toast-provider";

type AppProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <ToastProvider>{children}</ToastProvider>
    </ReduxProvider>
  );
}
