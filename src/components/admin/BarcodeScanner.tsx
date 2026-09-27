"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Barcode, Loader2, Package, Search, X } from "lucide-react";

import { apiClient } from "@/services/api-client";
import type { BillItem } from "@/services/billing";
import { billingService } from "@/services/billing";

interface ProductSuggestion {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  finalPrice: string;
  basePrice: string;
  images?: { imageUrl?: string; displayUrl?: string }[];
  availableStock?: number;
}

interface Props {
  onProductFound: (item: BillItem) => void;
}

/** Renders children into document.body so they escape overflow:hidden parents */
function FloatingPortal({
  children,
  anchorRef,
  visible,
}: {
  children: React.ReactNode;
  anchorRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (!visible || !anchorRef.current) return;
    const update = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [visible, anchorRef]);

  if (!visible || !rect) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export function BarcodeScanner({ onProductFound }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Fetch suggestions ─────────────────────────────────── */
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearching(true);
    try {
      const res = await apiClient<{
        data: { data: ProductSuggestion[]; meta: unknown };
      }>(`/products?search=${encodeURIComponent(query.trim())}&limit=8`);
      const results: ProductSuggestion[] = res?.data?.data ?? [];
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setHighlightIdx(-1);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearching(false);
    }
  }, []);

  /* ── Debounced trigger ─────────────────────────────────── */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(code), 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code, fetchSuggestions]);

  /* ── Close on outside click ────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Add from suggestion ───────────────────────────────── */
  const addProductFromSuggestion = useCallback(
    (p: ProductSuggestion) => {
      const price = Number(p.finalPrice ?? p.basePrice ?? 0);
      const item: BillItem = {
        productId: p.id,
        productName: p.name ?? "Unknown Product",
        sku: p.sku,
        quantity: 1,
        unitPrice: isNaN(price) ? 0 : price,
        discount: 0,
        tax: 0,
      };
      if (p.barcode) item.barcode = p.barcode;
      onProductFound(item);
      setCode("");
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
      inputRef.current?.focus();
    },
    [onProductFound],
  );

  /* ── Exact barcode/SKU lookup ──────────────────────────── */
  const lookup = useCallback(
    async (val: string) => {
      const trimmed = val.trim();
      if (!trimmed) return;
      setLoading(true);
      setError(null);
      setShowSuggestions(false);
      try {
        const product = await billingService.lookupProduct(trimmed);
        const price = Number(product.finalPrice ?? product.basePrice ?? 0);
        const item: BillItem = {
          productId: product.id,
          productName: product.name ?? "Unknown Product",
          sku: product.sku,
          quantity: 1,
          unitPrice: isNaN(price) ? 0 : price,
          discount: 0,
          tax: 0,
        };
        if (product.barcode) item.barcode = product.barcode;
        onProductFound(item);
        setCode("");
        setError(null);
        inputRef.current?.focus();
      } catch {
        setError(`No product found for "${trimmed}"`);
      } finally {
        setLoading(false);
      }
    },
    [onProductFound],
  );

  /* ── Keyboard navigation ───────────────────────────────── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIdx((i) => Math.max(i - 1, -1));
        return;
      }
      if (e.key === "Enter" && highlightIdx >= 0) {
        e.preventDefault();
        const sel = suggestions[highlightIdx];
        if (sel) addProductFromSuggestion(sel);
        return;
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        return;
      }
    }
    if (e.key === "Enter") lookup(code);
  };

  const clear = () => {
    setCode("");
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    inputRef.current?.focus();
  };

  /* ── Show "no results" dropdown too ───────────────────── */
  const showNoResults =
    !searching &&
    code.trim().length >= 2 &&
    suggestions.length === 0 &&
    showSuggestions === false &&
    !!code; // only after debounce ran

  const dropdownVisible =
    (showSuggestions && suggestions.length > 0) || showNoResults;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-text-custom uppercase tracking-wider flex items-center gap-1.5">
        <Barcode className="w-3.5 h-3.5 text-primary" />
        Scan / Enter Barcode, SKU or Product Name
      </label>

      <div className="flex gap-2" ref={wrapperRef}>
        {/* Input wrapper — anchor for the portal */}
        <div className="relative flex-1">
          <div ref={wrapperRef as React.RefObject<HTMLDivElement>}>
            <input
              ref={inputRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
                if (e.target.value.trim().length < 2) setShowSuggestions(false);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Scan barcode, type SKU or product name…"
              autoFocus
              autoComplete="off"
              className="w-full h-10 pl-4 pr-10 border border-border-custom rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-text-custom transition-all"
            />
          </div>

          {/* Right icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {searching ? (
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
            ) : code ? (
              <button
                type="button"
                onClick={clear}
                className="text-text-custom/40 hover:text-text-custom transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-3.5 h-3.5 text-text-custom/30" />
            )}
          </div>

          {/* ── Portal dropdown — escapes overflow:hidden ── */}
          <FloatingPortal
            anchorRef={wrapperRef as React.RefObject<HTMLElement>}
            visible={dropdownVisible}
          >
            <div className="bg-white border border-border-custom rounded-xl shadow-2xl overflow-hidden">
              {showSuggestions && suggestions.length > 0 ? (
                <>
                  <div className="px-3 py-1.5 bg-bg-secondary/60 border-b border-border-custom/40 flex items-center justify-between">
                    <span className="text-2xs font-bold text-text-custom/50 uppercase tracking-wider">
                      {suggestions.length} product
                      {suggestions.length !== 1 ? "s" : ""} found
                    </span>
                    <span className="text-2xs text-text-custom/40">
                      ↑↓ navigate · Enter select
                    </span>
                  </div>

                  <ul className="max-h-72 overflow-y-auto divide-y divide-border-custom/30">
                    {suggestions.map((p, i) => {
                      const img =
                        p.images?.[0]?.displayUrl ?? p.images?.[0]?.imageUrl;
                      const price = Number(p.finalPrice ?? p.basePrice ?? 0);
                      return (
                        <li
                          key={p.id}
                          onMouseDown={() => addProductFromSuggestion(p)}
                          onMouseEnter={() => setHighlightIdx(i)}
                          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                            highlightIdx === i
                              ? "bg-primary/8"
                              : "hover:bg-bg-secondary/60"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="w-9 h-9 rounded-lg border border-border-custom overflow-hidden shrink-0 bg-bg-secondary flex items-center justify-center">
                            {img ? (
                              <img
                                src={img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-text-custom/30" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text-custom truncate leading-tight">
                              {p.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-2xs text-text-custom/50 font-mono">
                                SKU: {p.sku}
                              </span>
                              {p.barcode && (
                                <span className="text-2xs text-text-custom/40 font-mono">
                                  · {p.barcode}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price + Stock */}
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-primary font-mono">
                              ₹{isNaN(price) ? "—" : price.toFixed(2)}
                            </p>
                            {p.availableStock !== undefined && (
                              <p
                                className={`text-2xs font-semibold ${
                                  p.availableStock > 0
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                }`}
                              >
                                {p.availableStock > 0
                                  ? `${p.availableStock} in stock`
                                  : "Out of stock"}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div className="px-4 py-4 text-center space-y-1">
                  <p className="text-xs font-semibold text-text-custom/50">
                    No products matched &ldquo;{code}&rdquo;
                  </p>
                  <p className="text-2xs text-text-custom/40">
                    Press Enter to try exact barcode / SKU lookup
                  </p>
                </div>
              )}
            </div>
          </FloatingPortal>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => lookup(code)}
          disabled={loading || !code.trim()}
          className="px-4 h-10 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 transition-all shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Add
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}

      <p className="text-2xs text-text-custom/40">
        Type a product name for suggestions, or scan/enter a barcode and press{" "}
        <kbd className="px-1 py-0.5 bg-bg-secondary border border-border-custom rounded text-2xs font-mono">
          Enter
        </kbd>
      </p>
    </div>
  );
}
