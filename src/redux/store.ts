import { configureStore } from "@reduxjs/toolkit";

import { adminReducer } from "./slices/admin-slice";
import { authReducer } from "./slices/auth-slice";
import { counterReducer } from "./slices/counter-slice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    admin: adminReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
