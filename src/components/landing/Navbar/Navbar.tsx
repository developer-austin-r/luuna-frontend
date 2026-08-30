"use client";

import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";

import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      {/* Purple Navbar */}
      <nav className={styles.navbar}>
        {/* Left Menu */}
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Open menu"
        >
          <Menu size={25} />
        </button>

        {/* Search + Icons */}
        <div className={styles.rightSection}>
          {/* Search Bar */}
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Find your favorite toy..."
              aria-label="Search products"
            />
          </div>

          {/* Wishlist */}
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Wishlist"
          >
            <Heart size={21} />
          </button>

          {/* Cart */}
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Shopping cart"
          >
            <ShoppingCart size={21} />
          </button>

          {/* Account */}
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Account"
          >
            <UserRound size={21} />
          </button>
        </div>
      </nav>

      {/* White space below navbar */}
      <div className={styles.logoSpace}>
        {/* Actual LUUNA Logo */}
        <div className={styles.logoWrapper}>
          <img src="/images/luuna.png" alt="LUUNA" className={styles.logo} />
        </div>
      </div>
    </header>
  );
}
