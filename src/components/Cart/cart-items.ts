"use client";

import { useEffect, useSyncExternalStore } from "react";

import { type CartSnapshot, getCart } from "@/services/cart";

export type { CartItemType } from "@/services/cart";

export const formatCartPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
}).format;

const initial = {
  cart: null as CartSnapshot | null,
  error: "",
  loading: true,
  updating: false,
};
let state = initial;
const listeners = new Set<() => void>();

function setState(next: Partial<typeof state>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function reload() {
  if (requestPending || state.updating) return;
  requestPending = true;
  setState({ loading: true, error: "" });

  try {
    const cart = await getCart();
    setState({ cart });
  } catch (error) {
    setState({
      error:
        error instanceof Error ? error.message : "Could not load your cart.",
    });
  } finally {
    requestPending = false;
    setState({ loading: false });
  }
}

let requestPending = false;

async function update(change: () => Promise<CartSnapshot>) {
  if (state.updating || state.loading) return;
  setState({ updating: true, error: "" });

  try {
    const data = await change();
    setState({
      cart: {
        ...data,
        notices: [...(state.cart?.notices ?? []), ...data.notices],
      },
    });
  } catch (error) {
    setState({
      error:
        error instanceof Error ? error.message : "Could not update your cart.",
    });
  } finally {
    setState({ updating: false });
  }
}

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
  useEffect(() => {
    void reload();
  }, []);

  return { ...snapshot, reload, update };
}
