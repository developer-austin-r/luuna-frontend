import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 176, // 176px is width of w-44
      });
    }
    setIsOpen(!isOpen);
  };

  // Close menu on scroll or resize to prevent alignment drift
  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => {
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 rounded-lg border border-border-custom hover:bg-bg-secondary text-text-custom/70 hover:text-text-custom transition-all duration-150 cursor-pointer"
        type="button"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="w-44 rounded-lg bg-white border border-border-custom shadow-lg ring-1 ring-black/5 z-50 focus:outline-none divide-y divide-border-custom/50 py-1 origin-top-right transition-all animate-fadeIn"
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-left hover:bg-bg-secondary cursor-pointer transition-colors ${
                  item.variant === "danger"
                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                    : "text-text-custom hover:text-primary"
                }`}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};
