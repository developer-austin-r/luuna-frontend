import { apiClient } from "./api-client";

export type WhatsAppChannel = "BILLING" | "ORDER" | "MANUAL";

export interface SendWhatsAppDto {
  phone: string;
  message: string;
  channel?: WhatsAppChannel;
  entityId?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  phone: string;
  logId: string;
  url?: string;
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
 * Build the WhatsApp deep-link message for a bill.
 * Kept here so any feature (billing, orders, etc.) can call it.
 */
export function buildBillWhatsAppMessage(bill: {
  billNumber: string;
  customerName?: string | null;
  totalAmount: number | string;
  paymentMethod: string;
}): string {
  const name = bill.customerName ? ` ${bill.customerName}` : "";
  return (
    `Hello${name}! 🎉\n\n` +
    `Thank you for shopping with us. Here is your bill summary:\n\n` +
    `📄 *Bill No:* ${bill.billNumber}\n` +
    `💰 *Total:* ₹${Number(bill.totalAmount).toFixed(2)}\n` +
    `💳 *Payment:* ${bill.paymentMethod}\n\n` +
    `Thank you for your business! 🙏`
  );
}

/**
 * Reusable WhatsApp service.
 * Logs the send attempt to the backend and returns a wa.me URL
 * that the frontend opens in a new tab.
 */
export const whatsappService = {
  /**
   * Log a WhatsApp send and get back the wa.me URL to open.
   */
  async send(dto: SendWhatsAppDto): Promise<WhatsAppSendResult> {
    return unwrap<WhatsAppSendResult>("/whatsapp/send", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  /**
   * Convenience wrapper: build bill message → log → open WhatsApp.
   * Returns false if the phone is missing or the API call fails.
   */
  async sendBillReceipt(
    phone: string,
    bill: {
      billNumber: string;
      customerName?: string | null;
      totalAmount: number | string;
      paymentMethod: string;
      id?: string;
    },
  ): Promise<boolean> {
    if (!phone) return false;
    try {
      const message = buildBillWhatsAppMessage(bill);
      const result = await whatsappService.send({
        phone,
        message,
        channel: "BILLING",
        entityId: bill.id,
      });
      if (result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }
      return result.success;
    } catch {
      return false;
    }
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
