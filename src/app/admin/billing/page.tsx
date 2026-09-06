"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  Loader2,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import { Breadcrumb, Button, Card, StatusBadge } from "@/components/admin";
import { BarcodeScanner } from "@/components/admin/BarcodeScanner";
import { BillItemsTable } from "@/components/admin/BillItemsTable";
import { BillPrintView } from "@/components/admin/BillPrintView";
import { billingService, type Bill, type BillItem } from "@/services/billing";
import { useAppSelector } from "@/redux/hooks";

type Tab = "new-bill" | "history";

function formatCurrency(n: number | string) {
  return `₹${Number(n).toFixed(2)}`;
}

// ─── New Bill Panel ───────────────────────────────────────────
function NewBillPanel() {
  const { user } = useAppSelector((s) => s.auth);

  const [items, setItems] = useState<BillItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [billDiscount, setBillDiscount] = useState(0);
  const [billTax, setBillTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedBill, setSavedBill] = useState<Bill | null>(null);
  const [showPrint, setShowPrint] = useState(false);

  const subtotal = items.reduce(
    (s, it) => s + it.unitPrice * it.quantity - (it.discount ?? 0) + (it.tax ?? 0),
    0
  );
  const total = subtotal - billDiscount + billTax;

  const handleProductFound = useCallback((item: BillItem) => {
    setItems((prev) => {
      const existing = prev.findIndex((p) => p.productId && p.productId === item.productId);
      if (existing >= 0) {
        const updated = [...prev];
        const cur = updated[existing]!;
        updated[existing] = { ...cur, quantity: cur.quantity + 1 };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const handleQty = (i: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, quantity: qty } : it)));
  };

  const handleDiscount = (i: number, disc: number) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, discount: disc } : it)));
  };

  const handleRemove = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (items.length === 0) return;
    setSaving(true);
    try {
      const dto: Parameters<typeof billingService.createBill>[0] = {
        items,
        discount: billDiscount,
        tax: billTax,
        paymentMethod,
        status: "PAID",
      };
      const name = user?.name ?? user?.email;
      if (name) dto.billedBy = name;
      if (customerName) dto.customerName = customerName;
      if (customerMobile) dto.customerMobile = customerMobile;
      if (customerEmail) dto.customerEmail = customerEmail;
      if (customerAddress) dto.customerAddress = customerAddress;
      if (notes) dto.notes = notes;
      const bill = await billingService.createBill(dto);
      setSavedBill(bill);
      setShowPrint(true);
      // Reset form
      setItems([]);
      setCustomerName("");
      setCustomerMobile("");
      setCustomerEmail("");
      setCustomerAddress("");
      setBillDiscount(0);
      setBillTax(0);
      setNotes("");
    } catch (e: unknown) {
      alert("Failed to save bill: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {showPrint && savedBill && (
        <BillPrintView bill={savedBill} onClose={() => setShowPrint(false)} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — Scanner + Items */}
        <div className="xl:col-span-2 space-y-5">
          <Card title="Scan Products">
            <div className="pt-2">
              <BarcodeScanner onProductFound={handleProductFound} />
            </div>
          </Card>

          <Card
            title={`Bill Items ${items.length > 0 ? `(${items.length})` : ""}`}
            extra={
              items.length > 0 ? (
                <button
                  onClick={() => setItems([])}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />Clear All
                </button>
              ) : undefined
            }
          >
            <BillItemsTable
              items={items}
              onQuantityChange={handleQty}
              onDiscountChange={handleDiscount}
              onRemove={handleRemove}
            />
          </Card>
        </div>

        {/* Right — Customer + Totals */}
        <div className="space-y-5">
          {/* Customer Details */}
          <Card title="Customer Details">
            <div className="space-y-3">
              <div>
                <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">
                  Name <span className="text-text-custom/30 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-custom/40" />
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    className="w-full h-9 pl-8 pr-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">Mobile</label>
                <input
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="+91 xxxxxxxxxx"
                  className="w-full h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">Email</label>
                <input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">Address</label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Billing address (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white resize-none transition-all"
                />
              </div>
            </div>
          </Card>

          {/* Payment & Totals */}
          <Card title="Payment Summary">
            <div className="space-y-4">
              {/* Payment Method */}
              <div>
                <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["CASH", "CARD", "UPI"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 rounded-lg text-2xs font-bold transition-all border ${
                        paymentMethod === m
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "border-border-custom text-text-custom/60 hover:border-primary/40"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {["NET_BANKING", "OTHER"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 rounded-lg text-2xs font-bold transition-all border ${
                        paymentMethod === m
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "border-border-custom text-text-custom/60 hover:border-primary/40"
                      }`}
                    >
                      {m === "NET_BANKING" ? "Net Banking" : "Other"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjustments */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={billDiscount}
                    onChange={(e) => setBillDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-right font-mono transition-all"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">Tax (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={billTax}
                    onChange={(e) => setBillTax(parseFloat(e.target.value) || 0)}
                    className="w-full h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-right font-mono transition-all"
                  />
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-bg-secondary/50 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-text-custom/60">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                {billDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-mono">-{formatCurrency(billDiscount)}</span>
                  </div>
                )}
                {billTax > 0 && (
                  <div className="flex justify-between text-text-custom/60">
                    <span>Tax</span>
                    <span className="font-mono">{formatCurrency(billTax)}</span>
                  </div>
                )}
                <div className="border-t border-border-custom/50 pt-2 flex justify-between font-bold text-sm">
                  <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-primary" />Total</span>
                  <span className="font-mono text-primary text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-2xs font-bold text-text-custom/60 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional bill notes…"
                  className="w-full px-3 py-2 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white resize-none transition-all"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={items.length === 0 || saving}
                className="w-full flex items-center justify-center gap-2 text-xs py-3"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ReceiptText className="w-4 h-4" />}
                {saving ? "Saving…" : `Generate Bill${items.length > 0 ? ` (${items.length} items)` : ""}`}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── History Panel ─────────────────────────────────────────────
function HistoryPanel() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Parameters<typeof billingService.getBills>[0] = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const res = await billingService.getBills(params);
      setBills(res.data);
      setMeta({ total: res.meta.total, page: res.meta.page, limit: res.meta.limit, totalPages: res.meta.totalPages });
    } catch {
      setBills([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, dateFrom, dateTo]);

  useEffect(() => { load(1); }, [load]);

  const statusColors: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    DRAFT: "bg-amber-50 text-amber-700 border border-amber-200",
    CANCELLED: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <>
      {viewBill && <BillPrintView bill={viewBill} onClose={() => setViewBill(null)} />}

      <Card
        title="Billing History"
        extra={
          <button
            onClick={() => load(meta.page)}
            className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-custom/50 hover:text-text-custom transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-custom/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill no, customer…"
              className="w-full h-9 pl-9 pr-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-text-custom/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-text-custom/40" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            />
            <span className="text-text-custom/40 text-xs">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 px-3 border border-border-custom rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            />
          </div>

          {(search || statusFilter || dateFrom || dateTo) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); setDateFrom(""); setDateTo(""); }}
              className="h-9 px-3 text-xs font-semibold text-text-custom/60 hover:text-text-custom border border-border-custom rounded-lg hover:bg-bg-secondary transition-all flex items-center gap-1"
            >
              <X className="w-3 h-3" />Clear
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-text-custom/50 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />Loading bills…
          </div>
        ) : bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-custom/40">
            <FileText className="w-10 h-10 mb-3" />
            <p className="text-xs font-semibold">No bills found</p>
            <p className="text-2xs mt-0.5">Create your first bill in the New Bill tab</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-custom text-3xs font-bold text-text-custom/50 uppercase tracking-wider bg-bg-secondary/30">
                    <th className="px-4 py-3">Bill No</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/30">
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-bg-secondary/10 transition-colors text-xs group">
                      <td className="px-4 py-3 font-mono font-bold text-text-custom">{bill.billNumber}</td>
                      <td className="px-4 py-3 text-text-custom/60 whitespace-nowrap">
                        {new Date(bill.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        <br />
                        <span className="text-2xs">{new Date(bill.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                      </td>
                      <td className="px-4 py-3">
                        {bill.customerName ? (
                          <div>
                            <p className="font-semibold text-text-custom">{bill.customerName}</p>
                            {bill.customerMobile && <p className="text-2xs text-text-custom/50">{bill.customerMobile}</p>}
                          </div>
                        ) : (
                          <span className="text-text-custom/30 italic">Walk-in</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-custom/70">{bill.billItems.length} item{bill.billItems.length !== 1 ? "s" : ""}</td>
                      <td className="px-4 py-3 text-right font-bold font-mono text-text-custom">{formatCurrency(bill.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-bg-secondary text-text-custom/70">{bill.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${statusColors[bill.status] ?? ""}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewBill(bill)}
                            title="View & Print"
                            className="p-1.5 rounded-lg text-text-custom/40 hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewBill(bill)}
                            title="Download"
                            className="p-1.5 rounded-lg text-text-custom/40 hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-custom/50">
              <p className="text-2xs text-text-custom/50">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} bills
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => load(meta.page - 1)}
                  className="w-7 h-7 rounded-lg border border-border-custom flex items-center justify-center text-text-custom/60 hover:text-text-custom hover:bg-bg-secondary disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-text-custom px-2">
                  {meta.page} / {meta.totalPages}
                </span>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => load(meta.page + 1)}
                  className="w-7 h-7 rounded-lg border border-border-custom flex items-center justify-center text-text-custom/60 hover:text-text-custom hover:bg-bg-secondary disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function BillingPage() {
  const [tab, setTab] = useState<Tab>("new-bill");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "new-bill", label: "New Bill", icon: <Plus className="w-3.5 h-3.5" /> },
    { key: "history", label: "Billing History", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb items={[{ label: "Billing", href: "/admin/billing" }]} />
          <h1 className="text-2xl font-bold text-text-custom mt-1 flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-primary" />
            POS Billing
          </h1>
          <p className="text-xs text-text-custom/60 mt-0.5">
            Create bills by scanning barcodes, manage customer details, and track billing history.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-custom gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-text-custom/60 hover:text-text-custom hover:border-border-custom"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "new-bill" && <NewBillPanel />}
      {tab === "history" && <HistoryPanel />}
    </div>
  );
}
