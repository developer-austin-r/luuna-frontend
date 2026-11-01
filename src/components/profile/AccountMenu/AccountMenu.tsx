"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Heart,
  HelpCircle,
  Loader2,
  Lock,
  LogOut,
  type LucideIcon,
  Package,
  Ticket,
  User,
  X,
} from "lucide-react";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Change password", href: "/profile/change-password", icon: Lock },
  { label: "My Orders", href: "/profile/myorders", icon: Package },
  { label: "My Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Coupon code", href: "/profile/coupons", icon: Ticket },
  { label: "Help & Support", href: "/help-support", icon: HelpCircle },
];

export interface AccountMenuProps {
  onLogout?: () => void | Promise<void>;
  className?: string;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({
  onLogout,
  className = "",
}) => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLogoutModal && !isLoggingOut) {
        setShowLogoutModal(false);
      }
    };
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLogoutModal, isLoggingOut]);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (onLogout) {
        await onLogout();
      }
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <div
        className={`w-full rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between p-3 pb-8 ${className}`}
      >
        <ul className="flex flex-col w-full gap-1">
          {MENU_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/profile/myorders" &&
                (pathname === "/profile/orders" ||
                  pathname.startsWith("/profile/myorders")));
            const Icon = item.icon;

            return (
              <li key={item.label} className="">
                <Link
                  href={item.href || "#"}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#F3E8FF] text-[#6B21A8]"
                      : "text-gray-600 hover:bg-[#F3E8FF] hover:text-[#6B21A8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-[#6B21A8]"
                            : "text-gray-400 group-hover:text-[#6B21A8] transition-colors"
                        }
                      />
                    )}
                    {item.label}
                  </div>
                  <ChevronRight
                    size={16}
                    className={
                      isActive
                        ? "text-[#6B21A8]"
                        : "text-gray-400 group-hover:text-[#6B21A8] transition-colors"
                    }
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout Action */}
        <div className="mt-8 px-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#6B21A8] bg-[#F3E8FF] hover:bg-[#E9D5FF] transition-all duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
                <LogOut size={22} />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Confirm Logout
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to log out? You will need to log in again
                to access your account.
              </p>

              <div className="mt-6 flex w-full items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="w-1/2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                  className="w-1/2 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
