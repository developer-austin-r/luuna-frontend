"use client";

import { useEffect, useSyncExternalStore } from "react";

import { getWishlistSummary, wishlistUpdatedEvent } from "@/services/wishlist";

const initial = { productIds: [] as string[], loading: true };
let state = initial;
let pending = false;
let revision = 0;
const listeners = new Set<() => void>();

function publish(next: typeof initial) {
  state = next;
  listeners.forEach((listener) => listener());
}

function onMutation(event: Event) {
  revision++;
  const { detail } = event as CustomEvent<string[]>;
  publish({ productIds: detail, loading: false });
}

function subscribe(listener: () => void) {
  if (!listeners.size)
    window.addEventListener(wishlistUpdatedEvent, onMutation);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size)
      window.removeEventListener(wishlistUpdatedEvent, onMutation);
  };
}

async function refresh() {
  if (pending) return;
  pending = true;
  const startedAt = revision;
  publish({ ...state, loading: true });
  try {
    const productIds = await getWishlistSummary();
    if (revision === startedAt) publish({ productIds, loading: false });
  } catch {
    if (revision === startedAt) publish({ ...state, loading: false });
  } finally {
    pending = false;
  }
}

export function useWishlist() {
  const result = useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
  useEffect(() => {
    void refresh();
  }, []);
  return result;
}
