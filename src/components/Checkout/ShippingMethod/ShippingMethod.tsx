import styles from "./ShippingMethod.module.css";

export default function ShippingMethod() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span className={styles.headingBar}></span>
        <h2>Shipping Method</h2>
      </div>

      <div className={styles.options}>
        <button type="button" className={styles.optionCard}>
          <div>
            <h3>Standard Courier</h3>
            <p>5–7 Days</p>
          </div>

          <span>₹ 50</span>
        </button>

        <button type="button" className={styles.optionCard}>
          <div>
            <h3>Fast Courier</h3>
            <p>1–2 Days</p>
          </div>

          <span>₹ 100</span>
        </button>
      </div>
    </section>
  );
}
