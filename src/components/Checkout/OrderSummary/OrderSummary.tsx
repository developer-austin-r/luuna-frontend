import styles from "./OrderSummary.module.css";

const products = [
  {
    id: 1,
    name: "Toy",
    quantity: 1,
    price: "₹ 24.99",
  },
  {
    id: 2,
    name: "Toy",
    quantity: 1,
    price: "₹ 24.99",
  },
  {
    id: 3,
    name: "Toy",
    quantity: 1,
    price: "₹ 24.99",
  },
];

export default function OrderSummary() {
  return (
    <aside className={styles.summary}>
      <h2>Order Summary</h2>

      <div className={styles.titleLine}></div>

      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.product}>
            <div className={styles.imagePlaceholder}></div>

            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>Qty: {product.quantity}</p>
            </div>

            <strong>{product.price}</strong>
          </div>
        ))}
      </div>

      <div className={styles.promoSection}>
        <h3>Apply Promo Code</h3>

        <div className={styles.promoRow}>
          <input type="text" placeholder="CODE20" />
          <button type="button">Apply</button>
        </div>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.priceRow}>
          <span>
            Subtotal (3 items)
            <small>Saved ₹60</small>
          </span>

          <div>
            <del>₹ 250.00</del>
            <strong>₹ 101.00</strong>
          </div>
        </div>

        <div className={styles.priceRow}>
          <span>Estimated Shipping</span>
          <strong className={styles.free}>FREE</strong>
        </div>

        <div className={styles.priceRow}>
          <span>Estimated Tax</span>
          <strong>₹ 8.08</strong>
        </div>

        <div className={styles.divider}></div>

        <div className={`${styles.priceRow} ${styles.grandTotal}`}>
          <span>Grand Total</span>
          <strong>₹ 109.08</strong>
        </div>

        <a href="#" className={styles.savingsLink}>
          Your total savings
        </a>

        <div className={styles.savingsRow}>
          <span>Includes ₹30 savings through free delivery</span>
          <strong>₹ 90</strong>
        </div>
      </div>

      <button type="button" className={styles.placeOrder}>
        Place Order →
      </button>

      <p className={styles.secureText}>SSL Encrypted Secure Payment</p>
      <div className={styles.paymentLogos}>
        <span className={styles.paytmLogo}>Paytm</span>
        <span className={styles.phonepeLogo}>PhonePe</span>
        <span className={styles.gpayLogo}>G Pay</span>

        <span className={styles.mastercardLogo}>
          <i></i>
          <b></b>
        </span>

        <span className={styles.visaLogo}>VISA</span>
      </div>
    </aside>
  );
}
