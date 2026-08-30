"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/auth-slice";
import { refreshTokenApi } from "@/services/auth";

/**
 * Runs once on mount and calls the refresh endpoint to restore
 * the Redux user state from the existing HttpOnly cookie.
 * This ensures the sidebar shows the correct name and role
 * after a page reload without requiring re-login.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const didInit = useRef(false);

  useEffect(() => {
    // Only run once, and only if Redux user is not already populated
    if (didInit.current || user) return;
    didInit.current = true;

    refreshTokenApi()
      .then((freshUser) => {
        dispatch(setUser(freshUser));
      })
      .catch(() => {
        // Refresh failed — middleware will redirect to /login on protected routes
      });
  }, [dispatch, user]);

  return null;
}
