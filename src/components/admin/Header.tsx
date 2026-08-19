import React from "react";
import Link from "next/link";
import { Menu, Settings } from "lucide-react";

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
      </div>

      <div className="flex items-center gap-4">
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
