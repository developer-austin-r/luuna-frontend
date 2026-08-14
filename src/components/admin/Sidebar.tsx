import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  FileText,
  FolderTree,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Users,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/auth-slice";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

export const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Inventory", href: "/admin/inventory", icon: Layers },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Activity Logs", href: "/admin/activity-logs", icon: History },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Users", href: "/admin/users", icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLinkClick = () => {
    // Close sidebar on mobile/tablet after click
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login");
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border-custom flex flex-col transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-border-custom flex items-center justify-between bg-bg-secondary/20">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight"
          >
            <Compass className="w-6 h-6 stroke-[2.5]" />
            <span>LUUNA</span>
            <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
              Admin
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-bg-secondary text-text-custom/50 hover:text-text-custom transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-102"
                    : "text-text-custom/75 hover:bg-bg-secondary hover:text-text-custom"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-text-custom/60"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-custom bg-bg-secondary/10 flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase">
            {user?.email?.[0] ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-custom truncate">
              {user?.email ?? "User"}
            </p>
            <p className="text-2xs text-text-custom/50 truncate">
              {user?.role ?? "Admin"}
            </p>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-1.5 rounded-lg text-text-custom/50 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Log out
            </Button>
          </>
        }
      >
        <p>Are you sure you want to log out of your admin session?</p>
      </Modal>
    </>
  );
};
