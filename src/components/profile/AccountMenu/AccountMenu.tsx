"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Lock,
  Package,
  Heart,
  Ticket,
  HelpCircle,
  LogOut,
  ChevronRight,
  LucideIcon
} from "lucide-react";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Change password", href: "/profile/change-password", icon: Lock },
  { label: "My Orders", href: "/profile/orders", icon: Package },
  { label: "My Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Coupon code", href: "/profile/coupons", icon: Ticket },
  { label: "Help & Support", href: "/help-support", icon: HelpCircle },
];

export interface AccountMenuProps {
  onLogout?: () => void;
  className?: string;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ onLogout, className = "" }) => {
  const pathname = usePathname();

  return (
    <div className={`w-full rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between p-3 pb-8 ${className}`}>
      <ul className="flex flex-col w-full gap-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
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
                      className={isActive ? "text-[#6B21A8]" : "text-gray-400 group-hover:text-[#6B21A8] transition-colors"}
                    />
                  )}
                  {item.label}
                </div>
                <ChevronRight size={16} className={isActive ? "text-[#6B21A8]" : "text-gray-400 group-hover:text-[#6B21A8] transition-colors"} />
              </Link>
            </li>
          );
        })}
      </ul>
      
      {/* Logout Action */}
      <div className="mt-8 px-4">
        <button
          onClick={onLogout}
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#6B21A8] bg-[#F3E8FF] hover:bg-[#E9D5FF] transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

