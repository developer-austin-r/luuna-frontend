"use client";

import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";

import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      {/* Main Navbar */}
      <nav className={styles.navbar}>
        {/* Left - Menu */}
        <button className={styles.menuButton} aria-label="Menu">
          <Menu size={30} />
        </button>

        {/* Search */}
        <div className={styles.searchBox}>
          <Search size={20} />
          <input type="text" placeholder="Find your favorite toy..." />
        </div>

        {/* Center Logo */}
        <div className={styles.logoWrapper}>
          <img src="/images/luuna.png" alt="LUUNA" className={styles.logo} />
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          <button aria-label="Wishlist">
            <Heart size={26} />
          </button>

          <button aria-label="Cart">
            <ShoppingCart size={26} />
          </button>

          <button aria-label="Account">
            <UserRound size={25} />
          </button>
        </div>
      </nav>

      {/* Pattern / White Space below Navbar */}
      <div className={styles.logoSpace}></div>
    </header>
  );
}
