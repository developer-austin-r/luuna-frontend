import { type Customer, type Order } from "@/types/admin";

import { apiClient } from "./api-client";

export interface CustomersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DetailedCustomer extends Customer {
  address: {
    shipping: CustomerAddress;
    billing: CustomerAddress;
  };
  orders: Order[];
  activityLogs: Array<{
    id: string;
    event: string;
    date: string;
    action?: string;
  }>;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface UpdateCustomerPayload {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface CustomersResult {
  data: Customer[];
  pagination: CustomersPagination;
}

export async function getCustomers(
  params: GetCustomersParams = {},
): Promise<CustomersResult> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search && params.search.trim())
    query.append("search", params.search.trim());
  if (params.status && params.status !== "all")
    query.append("status", params.status);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortDir) query.append("sortDir", params.sortDir);

  const qs = query.toString();
  const raw = await apiClient<any>(`/admin/customers${qs ? `?${qs}` : ""}`);

  // Unwrap ResponseInterceptor envelope: { statusCode, data: { data: [...], pagination: {...} } }
  const payload = raw?.data?.data !== undefined ? raw.data : raw;

  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload?.pagination || {
      page: 1,
      limit: params.limit || 10,
      total: Array.isArray(payload?.data) ? payload.data.length : 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

export async function getCustomerById(id: string): Promise<DetailedCustomer> {
  const raw = await apiClient<any>(`/admin/customers/${id}`);
  return raw?.data?.id !== undefined ? raw.data : raw;
}

export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload,
): Promise<DetailedCustomer> {
  const raw = await apiClient<any>(`/admin/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return raw?.data?.id !== undefined ? raw.data : raw;
}

export async function toggleCustomerStatus(
  id: string,
  status: "active" | "suspended",
): Promise<{ id: string; status: "active" | "suspended"; message: string }> {
  const raw = await apiClient<any>(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return raw?.data?.id !== undefined ? raw.data : raw;
}

export async function deleteCustomer(
  id: string,
): Promise<{ id: string; message: string }> {
  const raw = await apiClient<any>(`/admin/customers/${id}`, {
    method: "DELETE",
  });
  return raw?.data?.message !== undefined ? raw.data : raw;
}
