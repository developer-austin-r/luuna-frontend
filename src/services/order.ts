import { apiClient } from "./api-client";

export type OrderStatus =
  "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderProductImage {
  id: string;
  imageUrl?: string | null;
  displayUrl?: string;
  originalUrl?: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  finalPrice: number | string;
  images?: OrderProductImage[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number | string;
  discount: number | string;
  tax: number | string;
  total: number | string;
  product: OrderProduct;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  shipmentStatus: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  shippedDate?: string | null;
  deliveredDate?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  shippingCharge: number | string;
  totalAmount: number | string;
  notes?: string | null;
  orderedAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  shipment: Shipment[];
}

/**
 * Fetch all orders belonging to the currently authenticated user.
 */
export async function getMyOrdersApi(): Promise<Order[]> {
  const res = await apiClient<Order[] | { data: Order[] }>("/orders/my-orders");
  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any)?.data)) return (res as any).data;
  return [];
}

/**
 * Fetch single order details by ID.
 */
export async function getOrderByIdApi(id: string): Promise<Order> {
  const res = await apiClient<Order | { data: Order }>(`/orders/${id}`);
  return (res as any)?.data || res;
}

/**
 * Cancel an order belonging to the user.
 */
export async function cancelOrderApi(id: string): Promise<Order> {
  const res = await apiClient<Order | { data: Order }>(`/orders/${id}/cancel`, {
    method: "PATCH",
  });
  return (res as any)?.data || res;
}
