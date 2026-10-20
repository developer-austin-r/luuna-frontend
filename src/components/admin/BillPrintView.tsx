"use client";
import React, { useState } from "react";

import type { Bill } from "@/services/billing";
import { whatsappService } from "@/services/whatsapp";

// export const DEFAULT_BILLING_LOGO_URL =
//   process.env.NEXT_PUBLIC_BILLING_LOGO_URL"/assets/Luuna%20Logo-02.png";

export const DEFAULT_BILLING_LOGO_URL = `${process.env.NEXT_PUBLIC_BILLING_LOGO_URL}/assets/Luuna%20Logo-02.png`;

interface Props {
  bill: Bill;
  onClose: () => void;
  logoUrl?: string;
}

function fmt(n: number | string) {
  return `₹${Number(n).toFixed(2)}`;
}

export function BillPrintView({
  bill,
  onClose,
  logoUrl = DEFAULT_BILLING_LOGO_URL,
}: Props) {
  const handlePrint = () => window.print();
  const [sendingWA, setSendingWA] = useState(false);
  const [waSent, setWaSent] = useState(false);
  const [waError, setWaError] = useState<string | null>(null);

  const handleSendWhatsApp = async () => {
    if (!bill.customerMobile) return;
    setSendingWA(true);
    setWaError(null);
    try {
      const result = await whatsappService.sendBillReceipt(
        bill.customerMobile,
        {
          billNumber: bill.billNumber,
          customerName: bill.customerName ?? null,
          totalAmount: bill.totalAmount,
          paymentMethod: bill.paymentMethod,
          id: bill.id,
          createdAt: bill.createdAt,
        },
      );
      if (result.success) {
        setWaSent(true);
      } else {
        setWaError(result.error ?? "WhatsApp could not send this message.");
      }
    } catch (error) {
      setWaError(
        error instanceof Error
          ? error.message
          : "WhatsApp could not send this message.",
      );
    } finally {
      setSendingWA(false);
    }
  };

  const handleDownload = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`
      <html><head><title>${bill.billNumber}</title>
      <base href="${typeof window !== "undefined" ? window.location.origin : ""}">
      <style>
        body { font-family: monospace; font-size: 12px; max-width: 320px; margin: 0 auto; padding: 16px; }
        .logo-wrap { width: 150px; height: 50px; margin: 0 auto 6px auto; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .logo-wrap img { width: 150px; height: 150px; object-fit: contain; display: block; }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { font-size: 11px; padding: 3px 0; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .total-row td { font-size: 14px; font-weight: bold; }
        @media print { button { display: none; } }
      </style></head><body>
      <div class="logo-wrap">
        <img id="bill-logo" src="${logoUrl}" alt="LUUNA" onerror="this.onerror=null;this.src='/images/luuna.png';" />
      </div>
      <p class="center">Tax Invoice</p>
      <div class="divider"></div>
      <p>Bill No: <b>${bill.billNumber}</b></p>
      <p>Date: ${new Date(bill.createdAt).toLocaleString()}</p>
      ${bill.customerName ? `<p>Customer: ${bill.customerName}</p>` : ""}
      ${bill.customerMobile ? `<p>Mobile: ${bill.customerMobile}</p>` : ""}
      <div class="divider"></div>
      <table>
        <tr><th>Item</th><th>Qty</th><th class="right">Price</th><th class="right">Total</th></tr>
        ${bill.billItems
          .map(
            (it) => `<tr>
          <td>${it.productName}<br/><small>${it.sku || ""}</small></td>
          <td>${it.quantity}</td>
          <td class="right">₹${Number(it.unitPrice).toFixed(2)}</td>
          <td class="right">₹${Number(it.total ?? Number(it.unitPrice) * it.quantity).toFixed(2)}</td>
        </tr>`,
          )
          .join("")}
      </table>
      <div class="divider"></div>
      <table>
        <tr><td>Subtotal</td><td class="right">₹${Number(bill.subtotal).toFixed(2)}</td></tr>
        ${Number(bill.discount) > 0 ? `<tr><td>Discount</td><td class="right">-₹${Number(bill.discount).toFixed(2)}</td></tr>` : ""}
        ${Number(bill.tax) > 0 ? `<tr><td>Tax</td><td class="right">₹${Number(bill.tax).toFixed(2)}</td></tr>` : ""}
        <tr class="total-row"><td>TOTAL</td><td class="right">₹${Number(bill.totalAmount).toFixed(2)}</td></tr>
      </table>
      <div class="divider"></div>
      <p class="center">Payment: ${bill.paymentMethod}</p>
      <p class="center">Thank you for shopping!</p>
      <script>
        var printed = false;
        function triggerPrint() {
          if (printed) return;
          printed = true;
          window.focus();
          window.print();
        }
        window.addEventListener('load', function() {
          var img = document.getElementById('bill-logo');
          if (img && !img.complete) {
            img.onload = function() { setTimeout(triggerPrint, 100); };
            img.onerror = function() { setTimeout(triggerPrint, 100); };
          } else {
            setTimeout(triggerPrint, 100);
          }
        });
        setTimeout(triggerPrint, 1000);
      </script>
      </body></html>`);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
          <div>
            <h3 className="font-bold text-text-custom">{bill.billNumber}</h3>
            <p className="text-2xs text-text-custom/50">
              {new Date(bill.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
            >
              Print / Download
            </button>
            {bill.customerMobile && (
              <button
                onClick={handleSendWhatsApp}
                disabled={sendingWA || waSent}
                title={`Send bill to ${bill.customerMobile} on WhatsApp`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  waSent
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-[#25D366] hover:bg-[#1ebe5d] text-white"
                } disabled:opacity-60`}
              >
                {sendingWA ? (
                  <svg
                    className="w-3.5 h-3.5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : waSent ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.862L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.504-5.18-1.382l-.372-.22-3.762.896.929-3.652-.241-.378A10 10 0 0112 2a10 10 0 110 20z" />
                  </svg>
                )}
                {waSent ? "Sent!" : sendingWA ? "Sending…" : "Send WhatsApp"}
              </button>
            )}
            {waError && (
              <p role="alert" className="basis-full text-xs text-red-600">
                {waError}
              </p>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold border border-border-custom rounded-lg hover:bg-bg-secondary transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-3">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center h-12 w-36 mx-auto overflow-hidden">
              <img
                src={logoUrl}
                alt="LUUNA"
                className="w-36 h-36 object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/luuna.png";
                }}
              />
            </div>
            <p className="text-text-custom/50 text-2xs">Tax Invoice</p>
          </div>
          <div className="border-t border-dashed border-border-custom pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-text-custom/60">Bill No:</span>
              <span className="font-bold">{bill.billNumber}</span>
            </div>
            {bill.customerName && (
              <div className="flex justify-between">
                <span className="text-text-custom/60">Customer:</span>
                <span>{bill.customerName}</span>
              </div>
            )}
            {bill.customerMobile && (
              <div className="flex justify-between">
                <span className="text-text-custom/60">Mobile:</span>
                <span>{bill.customerMobile}</span>
              </div>
            )}
            {bill.billedBy && (
              <div className="flex justify-between">
                <span className="text-text-custom/60">Cashier:</span>
                <span>{bill.billedBy}</span>
              </div>
            )}
          </div>
          <div className="border-t border-dashed border-border-custom pt-3">
            <table className="w-full text-2xs">
              <thead>
                <tr className="border-b border-border-custom/40 pb-1">
                  <th className="text-left pb-1">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.billItems.map((it, i) => (
                  <tr key={i} className="border-b border-border-custom/20">
                    <td className="py-1 pr-2 leading-tight">
                      <span className="font-semibold">{it.productName}</span>
                      {it.sku && (
                        <>
                          <br />
                          <span className="text-text-custom/40">{it.sku}</span>
                        </>
                      )}
                    </td>
                    <td className="text-center">{it.quantity}</td>
                    <td className="text-right">{fmt(it.unitPrice)}</td>
                    <td className="text-right font-bold">
                      {fmt(it.total ?? Number(it.unitPrice) * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-dashed border-border-custom pt-3 space-y-1">
            <div className="flex justify-between text-text-custom/60">
              <span>Subtotal</span>
              <span>{fmt(bill.subtotal)}</span>
            </div>
            {Number(bill.discount) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>
                  Discount
                  {bill.discountRate != null && Number(bill.discountRate) > 0
                    ? ` (${Number(bill.discountRate)}%)`
                    : ""}
                </span>
                <span>-{fmt(bill.discount)}</span>
              </div>
            )}
            {Number(bill.tax) > 0 && (
              <div className="flex justify-between text-text-custom/60">
                <span>
                  Tax
                  {bill.taxRate != null && Number(bill.taxRate) > 0
                    ? ` (${Number(bill.taxRate)}%)`
                    : ""}
                </span>
                <span>{fmt(bill.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm border-t border-dashed border-border-custom pt-2 mt-2">
              <span>TOTAL</span>
              <span>{fmt(bill.totalAmount)}</span>
            </div>
          </div>
          <div className="border-t border-dashed border-border-custom pt-3 text-center space-y-1">
            <p className="text-text-custom/60">
              Payment:{" "}
              <span className="font-bold text-text-custom">
                {bill.paymentMethod}
              </span>
            </p>
            <p className="text-text-custom/40 text-2xs">
              Thank you for shopping with us!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
