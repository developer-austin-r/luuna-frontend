import Image from "next/image";

import {
  type CartItemType,
  formatCartPrice,
} from "@/components/Cart/cart-items";

import styles from "./OrderSummary.module.css";

const paymentLogos = [
  { name: "Paytm", file: "paytm", width: 62, height: 19 },
  { name: "PhonePe", file: "phonepe", width: 27, height: 27 },
  { name: "Google Pay", file: "google-pay", width: 68, height: 36 },
  { name: "Mastercard", file: "mastercard", width: 30, height: 19 },
  { name: "Visa", file: "visa", width: 70, height: 23 },
];

export default function OrderSummary({
  items,
  shipping,
}: {
  items: CartItemType[];
  shipping: number;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className={styles.summary} aria-labelledby="checkout-summary">
      <h2 id="checkout-summary">Order Summary</h2>

      {items.length ? (
        <ul className={styles.productList}>
          {items.map((item) => (
            <li key={item.id} className={styles.product}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={70}
                  height={70}
                  unoptimized
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.productImage} aria-hidden="true" />
              )}
              <div>
                <strong>{item.name}</strong>
                <span>Qty: {item.quantity}</span>
              </div>
              <span>{formatCartPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.notice}>Your cart is empty.</p>
      )}

      <div className={styles.promoSection}>
        <label htmlFor="checkout-promo">Apply Promo Code</label>
        <div className={styles.promoRow}>
          <input id="checkout-promo" placeholder="Enter promo code" disabled />
          <button type="button" disabled>
            Apply
          </button>
        </div>
      </div>

      <dl className={styles.prices} aria-live="polite">
        <div>
          <dt>
            Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
          </dt>
          <dd>{formatCartPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Estimated Shipping</dt>
          <dd>{quantity ? formatCartPrice(shipping) : "—"}</dd>
        </div>
        <div>
          <dt>Estimated Tax</dt>
          <dd>Pending</dd>
        </div>
        <div className={styles.total}>
          <dt>Estimated Total</dt>
          <dd>{formatCartPrice(subtotal + (quantity ? shipping : 0))}</dd>
        </div>
      </dl>

      <button
        type="button"
        className={styles.placeOrder}
        disabled
        aria-describedby="checkout-availability"
      >
        Place Order
        <Image
          src="/images/checkout/order-arrow.svg"
          alt=""
          width={16}
          height={16}
          unoptimized
        />
      </button>
      <p className={styles.notice} id="checkout-availability">
        Online ordering and promo codes are currently unavailable.
      </p>
      <p className={styles.secureText}>
        <Image
          src="/images/checkout/lock.svg"
          alt=""
          width={11}
          height={13}
          unoptimized
        />
        Secure payment with Razorpay
      </p>
      <div className={styles.paymentLogos}>
        {paymentLogos.map(({ name, file, width, height }) => (
          <Image
            key={file}
            src={`/images/checkout/${file}.svg`}
            alt={name}
            width={width}
            height={height}
            className={file === "google-pay" ? styles.googlePay : undefined}
            unoptimized
          />
        ))}
      </div>
    </aside>
  );
}
