"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";

import { getS3AssetUrl } from "@/config";

import styles from "./Navbar.module.css";

const BG_BANNER_URL = getS3AssetUrl("/assets/bg-banner.jpeg");

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

          <Link href="/profile" aria-label="Account">
            <UserRound size={25} />
          </Link>
        </div>
      </nav>

      {/* Pattern / White Space below Navbar */}
      <div
        className={styles.logoSpace}
        style={{
          backgroundImage: `url("${BG_BANNER_URL}")`,
        }}
      ></div>
    </header>
  );
}
