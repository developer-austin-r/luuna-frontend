import React from "react";
import Link from "next/link";
import {
  Bell,
  Globe,
  Menu,
  Search as SearchIcon,
  Settings,
} from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-16 border-b border-border-custom bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Toggle Button for mobile/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-custom/70 hover:text-text-custom cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar mockup */}
        <div className="relative hidden md:block w-72">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-custom/40">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search transactions, products..."
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-border-custom rounded-lg bg-bg-secondary/40 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* View Store link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 text-xs font-semibold text-text-custom/70 hover:text-primary transition-colors border border-border-custom px-3 py-1.5 rounded-lg"
        >
          <Globe className="w-3.5 h-3.5" />
          Live Shop
        </Link>

        {/* Notifications Icon with indicator badge */}
        <button className="p-2 rounded-lg hover:bg-bg-secondary text-text-custom/70 hover:text-text-custom relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        </button>

        {/* Quick settings link */}
        <Link
          href="/admin/settings"
          className="p-2 rounded-lg hover:bg-bg-secondary text-text-custom/70 hover:text-text-custom transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
