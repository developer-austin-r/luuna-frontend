"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

import styles from "./Navbar.module.css";

const links = [
  { href: "#new-arrivals", label: "New Arrivals" },
  { href: "#category-title", label: "Category" },
  { href: "#top-picks", label: "Top Picks" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <button
          className={styles.menuButton}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <form className={styles.searchBox} role="search" action="/">
          <Search size={20} />
          <input
            type="search"
            name="q"
            aria-label="Search collectibles"
            placeholder="Find your favorite toy..."
          />
          <kbd>↵</kbd>
        </form>

        <Link href="/" className={styles.logoWrapper} aria-label="Luuna home">
          <Image
            src="/images/luuna.png"
            alt="Luuna"
            width={2122}
            height={741}
            priority
            className={styles.logo}
          />
        </Link>

        <div className={styles.actions}>
          <Link href="/profile/wishlist" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link href="/profile" aria-label="Your account">
            <UserRound size={21} />
          </Link>
          <Link href="/cart" aria-label="Shopping bag">
            <ShoppingBag size={21} />
          </Link>
        </div>
      </nav>

      <div
        className={`${styles.menuPanel} ${menuOpen ? styles.menuPanelOpen : ""}`}
        id="primary-navigation"
      >
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/cart" onClick={() => setMenuOpen(false)}>
          <ShoppingBag size={16} /> Your bag
        </Link>
      </div>
    </header>
  );
}
