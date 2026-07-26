"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  const success = useCallback(
    (msg: string, dur?: number) => toast(msg, "success", dur),
    [toast],
  );
  const error = useCallback(
    (msg: string, dur?: number) => toast(msg, "error", dur),
    [toast],
  );
  const info = useCallback(
    (msg: string, dur?: number) => toast(msg, "info", dur),
    [toast],
  );
  const warning = useCallback(
    (msg: string, dur?: number) => toast(msg, "warning", dur),
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((t) => {
          let bgColor = "bg-white/95 border-gray-200 text-gray-800";
          let icon = <Info className="w-5 h-5 text-blue-500" />;

          if (t.type === "success") {
            bgColor = "bg-emerald-50/95 border-emerald-200 text-emerald-800";
            icon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
          } else if (t.type === "error") {
            bgColor = "bg-rose-50/95 border-rose-200 text-rose-800";
            icon = <AlertCircle className="w-5 h-5 text-rose-500" />;
          } else if (t.type === "warning") {
            bgColor = "bg-amber-50/95 border-amber-200 text-amber-800";
            icon = <AlertCircle className="w-5 h-5 text-amber-500" />;
          } else {
            bgColor = "bg-blue-50/95 border-blue-200 text-blue-800";
            icon = <Info className="w-5 h-5 text-blue-500" />;
          }

          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-slide-in pointer-events-auto ${bgColor}`}
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 text-sm font-semibold">{t.message}</div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
