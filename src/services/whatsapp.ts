import { apiClient } from "./api-client";

export type WhatsAppChannel = "BILLING" | "ORDER" | "MANUAL";

export interface SendWhatsAppDto {
  phone: string;
  templateParameters: string[];
  channel?: WhatsAppChannel;
  entityId?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  phone: string;
  logId: string;
  messageId?: string;
  error?: string;
}

export interface WhatsAppLog {
  id: string;
  phone: string;
  message: string;
  status: "SENT" | "FAILED" | "PENDING";
  channel: string;
  entityId?: string | null;
  sentBy?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface WhatsAppLogsResponse {
  data: WhatsAppLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function unwrap<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiClient<{ data: T }>(path, init);
  return res.data;
}

/**
 * Reusable WhatsApp service. The backend sends the configured Meta template.
 */
export const whatsappService = {
  /**
   * Send a WhatsApp template message through the backend.
   */
  async send(dto: SendWhatsAppDto): Promise<WhatsAppSendResult> {
    return unwrap<WhatsAppSendResult>("/whatsapp/send", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  /**
   * Send a bill receipt using the configured template's three body parameters.
   */
  async sendBillReceipt(
    phone: string,
    bill: {
      billNumber: string;
      customerName?: string | null;
      totalAmount: number | string;
      paymentMethod: string;
      id?: string;
      createdAt: string;
    },
  ): Promise<WhatsAppSendResult> {
    const billDate = new Date(bill.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    return whatsappService.send({
      phone,
      templateParameters: [
        bill.customerName?.trim() || "Customer",
        bill.billNumber,
        billDate,
      ],
      channel: "BILLING",
      ...(bill.id ? { entityId: bill.id } : {}),
    });
  },

  /**
   * Fetch WhatsApp message history.
   */
  async getLogs(params?: {
    phone?: string;
    channel?: string;
    entityId?: string;
    page?: number;
    limit?: number;
  }): Promise<WhatsAppLogsResponse> {
    const q = new URLSearchParams();
    if (params?.phone) q.set("phone", params.phone);
    if (params?.channel) q.set("channel", params.channel);
    if (params?.entityId) q.set("entityId", params.entityId);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return unwrap<WhatsAppLogsResponse>(
      `/whatsapp/logs${q.toString() ? `?${q}` : ""}`,
    );
  },
};
