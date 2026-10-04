import { ShieldCheck, Truck } from "lucide-react";

import styles from "./CartSummary.module.css";

export default function CartSummary() {
  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.line}></div>

      <div className={styles.row}>
        <span>Subtotal (3 items)</span>
        <span>₹101.00</span>
      </div>

      <div className={styles.row}>
        <span>Estimated Shipping</span>
        <span className={styles.free}>FREE</span>
      </div>

      <div className={styles.row}>
        <span>Estimated Tax</span>
        <span>₹8.08</span>
      </div>

      <div className={styles.line}></div>

      <div className={styles.total}>
        <span>Total</span>
        <strong>₹109.08</strong>
      </div>

      <button type="button" className={styles.checkoutButton}>
        Proceed to Checkout →
      </button>

      <div className={styles.featureRow}>
        <div className={styles.feature}>
          <ShieldCheck />
          <span>Secure Payment</span>
        </div>

        <div className={styles.feature}>
          <Truck />
          <span>Free Returns</span>
        </div>
      </div>
    </aside>
  );
}
