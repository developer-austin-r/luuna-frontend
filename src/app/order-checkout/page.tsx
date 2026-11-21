import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";

import Footer from "@/components/landing/Footer/Footer";
import Navbar from "@/components/landing/Navbar/Navbar";

import Checkout from "./Checkout";

import styles from "./page.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = { title: "Checkout" };

export default function OrderCheckoutPage() {
  return (
    <div className={`${poppins.className} ${styles.checkout}`}>
      <div className={styles.accountBar}>
        <Link href="/login?redirect=/order-checkout">
          Sign in to your Luuna account
        </Link>
      </div>
      <Navbar checkout />
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.body}>
        <Checkout />
        <Footer compact />
      </div>
    </div>
  );
}
