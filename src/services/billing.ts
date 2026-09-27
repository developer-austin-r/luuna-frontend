import { apiClient } from "./api-client";

export interface BillItem {
  id?: string;
  productId?: string;
  productName: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total?: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  billedBy?: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  customerAddress?: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  status: "DRAFT" | "PAID" | "CANCELLED";
  notes?: string;
  createdAt: string;
  billItems: BillItem[];
}

export interface CreateBillDto {
  billedBy?: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  customerAddress?: string;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  status?: string;
  notes?: string;
  items: BillItem[];
}

export interface BillsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BillsResponse {
  data: Bill[];
  meta: BillsMeta;
}

// All backend responses are wrapped: { data: <payload> } by ResponseInterceptor
async function unwrap<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiClient<{ data: T }>(path, init);
  return res.data;
}

export const billingService = {
  async createBill(dto: CreateBillDto): Promise<Bill> {
    return unwrap<Bill>("/billing", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  async getBills(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<BillsResponse> {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.status) q.set("status", params.status);
    if (params.dateFrom) q.set("dateFrom", params.dateFrom);
    if (params.dateTo) q.set("dateTo", params.dateTo);
    return unwrap<BillsResponse>(`/billing?${q.toString()}`);
  },

  async getBill(id: string): Promise<Bill> {
    return unwrap<Bill>(`/billing/${id}`);
  },

  /** Exact barcode / SKU lookup — backend wraps in { data: product } */
  async lookupProduct(code: string): Promise<any> {
    return unwrap<any>(`/products/lookup?code=${encodeURIComponent(code)}`);
  },
};
