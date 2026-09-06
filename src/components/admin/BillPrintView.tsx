"use client";
import React from "react";
import type { Bill } from "@/services/billing";

interface Props { bill: Bill; onClose: () => void; }

function fmt(n: number | string) {
  return `₹${Number(n).toFixed(2)}`;
}

export function BillPrintView({ bill, onClose }: Props) {
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`
      <html><head><title>${bill.billNumber}</title>
      <style>
        body { font-family: monospace; font-size: 12px; max-width: 320px; margin: 0 auto; padding: 16px; }
        h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { font-size: 11px; padding: 3px 0; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .total-row td { font-size: 14px; font-weight: bold; }
        @media print { button { display: none; } }
      </style></head><body>
      <h1>LUUNA</h1>
      <p class="center">Tax Invoice</p>
      <div class="divider"></div>
      <p>Bill No: <b>${bill.billNumber}</b></p>
      <p>Date: ${new Date(bill.createdAt).toLocaleString()}</p>
      ${bill.customerName ? `<p>Customer: ${bill.customerName}</p>` : ""}
      ${bill.customerMobile ? `<p>Mobile: ${bill.customerMobile}</p>` : ""}
      <div class="divider"></div>
      <table>
        <tr><th>Item</th><th>Qty</th><th class="right">Price</th><th class="right">Total</th></tr>
        ${bill.billItems.map(it => `<tr>
          <td>${it.productName}<br/><small>${it.sku || ""}</small></td>
          <td>${it.quantity}</td>
          <td class="right">₹${Number(it.unitPrice).toFixed(2)}</td>
          <td class="right">₹${Number(it.total ?? (Number(it.unitPrice) * it.quantity)).toFixed(2)}</td>
        </tr>`).join("")}
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
      </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
          <div>
            <h3 className="font-bold text-text-custom">{bill.billNumber}</h3>
            <p className="text-2xs text-text-custom/50">{new Date(bill.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all">Print / Download</button>
            <button onClick={onClose} className="px-3 py-1.5 text-xs font-semibold border border-border-custom rounded-lg hover:bg-bg-secondary transition-all">Close</button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-3">
          <div className="text-center space-y-0.5">
            <p className="font-bold text-sm">LUUNA</p>
            <p className="text-text-custom/50 text-2xs">Tax Invoice</p>
          </div>
          <div className="border-t border-dashed border-border-custom pt-3 space-y-1">
            <div className="flex justify-between"><span className="text-text-custom/60">Bill No:</span><span className="font-bold">{bill.billNumber}</span></div>
            {bill.customerName && <div className="flex justify-between"><span className="text-text-custom/60">Customer:</span><span>{bill.customerName}</span></div>}
            {bill.customerMobile && <div className="flex justify-between"><span className="text-text-custom/60">Mobile:</span><span>{bill.customerMobile}</span></div>}
            {bill.billedBy && <div className="flex justify-between"><span className="text-text-custom/60">Cashier:</span><span>{bill.billedBy}</span></div>}
          </div>
          <div className="border-t border-dashed border-border-custom pt-3">
            <table className="w-full text-2xs">
              <thead><tr className="border-b border-border-custom/40 pb-1"><th className="text-left pb-1">Item</th><th className="text-center">Qty</th><th className="text-right">Price</th><th className="text-right">Total</th></tr></thead>
              <tbody>
                {bill.billItems.map((it, i) => (
                  <tr key={i} className="border-b border-border-custom/20">
                    <td className="py-1 pr-2 leading-tight"><span className="font-semibold">{it.productName}</span>{it.sku && <><br /><span className="text-text-custom/40">{it.sku}</span></>}</td>
                    <td className="text-center">{it.quantity}</td>
                    <td className="text-right">{fmt(it.unitPrice)}</td>
                    <td className="text-right font-bold">{fmt(it.total ?? Number(it.unitPrice) * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-dashed border-border-custom pt-3 space-y-1">
            <div className="flex justify-between text-text-custom/60"><span>Subtotal</span><span>{fmt(bill.subtotal)}</span></div>
            {Number(bill.discount) > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{fmt(bill.discount)}</span></div>}
            {Number(bill.tax) > 0 && <div className="flex justify-between text-text-custom/60"><span>Tax</span><span>{fmt(bill.tax)}</span></div>}
            <div className="flex justify-between font-bold text-sm border-t border-dashed border-border-custom pt-2 mt-2"><span>TOTAL</span><span>{fmt(bill.totalAmount)}</span></div>
          </div>
          <div className="border-t border-dashed border-border-custom pt-3 text-center space-y-1">
            <p className="text-text-custom/60">Payment: <span className="font-bold text-text-custom">{bill.paymentMethod}</span></p>
            <p className="text-text-custom/40 text-2xs">Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
