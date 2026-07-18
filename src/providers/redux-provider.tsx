"use client";

import { Provider } from "react-redux";

import { store } from "@/redux/store";

type ReduxProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
