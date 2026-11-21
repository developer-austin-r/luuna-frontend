"use client";

import { useSyncExternalStore } from "react";

export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const initialCart: CartItemType[] = [1, 2, 3].map((id) => ({
  id,
  name: "Toy",
  price: 24,
  quantity: 1,
  image: `/images/checkout/toy-${id}.png`,
}));

const cartKey = "luuna:checkout-cart";
const initialSnapshot = JSON.stringify(initialCart);
let cartSnapshot = initialSnapshot;
const listeners = new Set<() => void>();

function readCart() {
  try {
    return sessionStorage.getItem(cartKey) ?? cartSnapshot;
  } catch {
    return cartSnapshot;
  }
}

function parseCart(snapshot: string): CartItemType[] {
  try {
    const items: unknown = JSON.parse(snapshot);
    return Array.isArray(items) ? items : initialCart;
  } catch {
    return initialCart;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCartItems(): CartItemType[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    readCart,
    () => initialSnapshot,
  );
  return parseCart(snapshot);
}

export function updateCart(edit: (items: CartItemType[]) => CartItemType[]) {
  cartSnapshot = JSON.stringify(edit(parseCart(readCart())));
  try {
    sessionStorage.setItem(cartKey, cartSnapshot);
  } catch {
    // The in-memory snapshot still supports navigation in this tab.
  }
  listeners.forEach((listener) => listener());
}

export const formatCartPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
}).format;
