"use client";

export type AuthTabType = "login" | "register";

interface TabSwitcherProps {
  activeTab: AuthTabType;
  onTabSelect: (tab: AuthTabType) => void;
}

export function TabSwitcher({ activeTab, onTabSelect }: TabSwitcherProps) {
  return (
    <div className="tab-container">
      <button
        type="button"
        className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
        onClick={() => onTabSelect("login")}
      >
        Login
      </button>
      <button
        type="button"
        className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
        onClick={() => onTabSelect("register")}
      >
        Register
      </button>
    </div>
  );
}
