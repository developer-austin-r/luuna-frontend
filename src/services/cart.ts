import { apiClient } from "./api-client";

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  tax: number;
  quantity: number;
  image: string | null;
  availableStock: number;
}

export interface CartSnapshot {
  items: CartItemType[];
  notices: string[];
}

async function requestCart(path: string, init: RequestInit = {}) {
  const result = await apiClient<{ data: CartSnapshot }>(path, {
    cache: "no-store",
    ...init,
  });
  return result.data;
}

export function getCart() {
  return requestCart("/cart");
}

export function addCartItem(productId: string, quantity: number) {
  return requestCart("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function setCartItemQuantity(productId: string, quantity: number) {
  return requestCart(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(productId: string) {
  return requestCart(`/cart/items/${productId}`, { method: "DELETE" });
}
