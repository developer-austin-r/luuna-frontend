"use client";
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { BillItem } from "@/services/billing";

interface Props {
  items: BillItem[];
  onQuantityChange: (index: number, qty: number) => void;
  onDiscountChange: (index: number, discount: number) => void;
  onRemove: (index: number) => void;
}

export function BillItemsTable({ items, onQuantityChange, onDiscountChange, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-custom/40">
        <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center mb-3">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
          </svg>
        </div>
        <p className="text-xs font-semibold">No items added</p>
        <p className="text-2xs mt-0.5">Scan a barcode or enter a SKU above to add products</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-custom text-3xs font-bold text-text-custom/50 uppercase tracking-wider bg-bg-secondary/30">
            <th className="px-3 py-2.5">#</th>
            <th className="px-3 py-2.5">Product</th>
            <th className="px-3 py-2.5 text-center">Qty</th>
            <th className="px-3 py-2.5 text-right">Unit Price</th>
            <th className="px-3 py-2.5 text-right">Discount</th>
            <th className="px-3 py-2.5 text-right">Total</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-custom/30">
          {items.map((item, i) => {
            const subtotal = item.unitPrice * item.quantity;
            const disc = item.discount ?? 0;
            const total = subtotal - disc + (item.tax ?? 0);
            return (
              <tr key={i} className="hover:bg-bg-secondary/10 transition-colors text-xs group">
                <td className="px-3 py-2.5 text-text-custom/40 font-mono text-2xs">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <p className="font-semibold text-text-custom line-clamp-1">{item.productName}</p>
                  {item.sku && <p className="text-2xs text-text-custom/50 font-mono">SKU: {item.sku}</p>}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(i, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 rounded border border-border-custom flex items-center justify-center hover:bg-bg-secondary disabled:opacity-30 transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => onQuantityChange(i, parseInt(e.target.value) || 1)}
                      className="w-10 text-center border border-border-custom rounded text-xs font-bold py-0.5 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => onQuantityChange(i, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-border-custom flex items-center justify-center hover:bg-bg-secondary transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono font-semibold text-text-custom">
                  ₹{item.unitPrice.toFixed(2)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <input
                    type="number"
                    min={0}
                    value={disc}
                    onChange={(e) => onDiscountChange(i, parseFloat(e.target.value) || 0)}
                    className="w-20 text-right border border-border-custom rounded text-xs py-0.5 px-1.5 focus:outline-none focus:border-primary font-mono"
                  />
                </td>
                <td className="px-3 py-2.5 text-right font-bold font-mono text-text-custom">
                  ₹{total.toFixed(2)}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="p-1.5 rounded text-text-custom/30 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
