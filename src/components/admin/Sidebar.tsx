"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  Barcode,
  Compass,
  CreditCard,
  FileText,
  FolderTree,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Ticket,
  Users,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/auth-slice";
import type { MenuNode } from "@/services/auth";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Map backend icon names → Lucide components */
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Products: Package,
  Package,
  Orders: ShoppingCart,
  ShoppingCart,
  Billing: CreditCard,
  CreditCard,
  Barcode,
  Reports: FileText,
  FileText,
  Settings,
  FolderTree,
  Layers,
  Ticket,
  History,
  "Invoice History": FileText,
  InvoiceHistory: FileText,
  BarChart2,
};

/** Fallback static menu (shown only if backend menus unavailable) */
export const STATIC_MENU_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    permission: "users.view",
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    permission: "products.view",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: "orders.view",
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
    permission: "billing.view",
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: FileText,
    permission: "reports.view",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: "settings.view",
  },
];

/** Convert backend slug → frontend href */
function slugToHref(slug: string): string {
  const map: Record<string, string> = {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    products: "/admin/products",
    orders: "/admin/orders",
    billing: "/admin/billing",
    "invoice-history": "/admin/billing/invoices",
    reports: "/admin/reports",
    settings: "/admin/settings",
  };
  return map[slug] ?? `/admin/${slug}`;
}

/** Get icon from icon name string */
function getIcon(iconName: string | null): React.FC<{ className?: string }> {
  if (!iconName) return FileText;
  return ICON_MAP[iconName] ?? FileText;
}

interface NavItemProps {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
  depth?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  href,
  icon: Icon,
  isActive,
  onClick,
  depth = 0,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
      depth > 0 ? "ml-4 py-2 text-2xs" : ""
    } ${
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/20 scale-102"
        : "text-text-custom/75 hover:bg-bg-secondary hover:text-text-custom"
    }`}
  >
    <Icon
      className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-text-custom/60"}`}
    />
    {name}
  </Link>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login");
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin" || href === "/admin/dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  const getFlatMenus = (menus: MenuNode[]): MenuNode[] => {
    const result: MenuNode[] = [];
    const traverse = (node: MenuNode) => {
      result.push({
        ...node,
        children: [],
      });
      if (node.children && node.children.length > 0) {
        node.children.forEach(traverse);
      }
    };
    menus.forEach(traverse);
    return result;
  };

  /** Render a backend menu node */
  const renderMenuNode = (node: MenuNode) => {
    const href = slugToHref(node.slug);
    const icon = getIcon(node.icon);
    const active = isLinkActive(href);

    return (
      <NavItem
        key={node.id}
        name={node.name}
        href={href}
        icon={icon}
        isActive={active}
        onClick={handleLinkClick}
        depth={0}
      />
    );
  };

  const hasMenus = user?.menus && user.menus.length > 0;
  const flatMenus = hasMenus ? getFlatMenus(user!.menus) : [];

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
          {hasMenus
            ? flatMenus.map((node) => renderMenuNode(node))
            : STATIC_MENU_ITEMS.map((item) => (
                <NavItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={isLinkActive(item.href)}
                  onClick={handleLinkClick}
                />
              ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-custom bg-bg-secondary/10 flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase">
            {user?.name?.[0] ?? user?.email?.[0] ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-custom truncate">
              {user?.name ?? user?.email ?? "—"}
            </p>
            <p className="text-2xs text-text-custom/50 truncate">
              {user?.role ?? "—"}
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
