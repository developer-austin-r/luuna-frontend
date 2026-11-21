import Link from "next/link";
import { ShieldCheck, Truck } from "lucide-react";

import { type CartItemType, formatCartPrice } from "../cart-items";

import styles from "./CartSummary.module.css";

export default function CartSummary({ items }: { items: CartItemType[] }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.line}></div>

      <div className={styles.row}>
        <span>
          Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
        </span>
        <span>{formatCartPrice(subtotal)}</span>
      </div>

      <div className={styles.row}>
        <span>Estimated Shipping</span>
        <span>Calculated at checkout</span>
      </div>

      <div className={styles.row}>
        <span>Estimated Tax</span>
        <span>Pending</span>
      </div>

      <div className={styles.line}></div>

      <div className={styles.total}>
        <span>Total before shipping and tax</span>
        <strong>{formatCartPrice(subtotal)}</strong>
      </div>

      {quantity > 0 && (
        <Link href="/order-checkout" className={styles.checkoutButton}>
          Proceed to Checkout →
        </Link>
      )}

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
