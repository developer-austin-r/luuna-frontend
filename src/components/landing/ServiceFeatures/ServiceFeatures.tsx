import styles from "./ServiceFeatures.module.css";

export default function ServiceFeatures() {
  return (
    <section
      className={styles.section}
      aria-label="Benefits: Quick Delivery, Secure Payment, Best Quality"
    >
      <div className={styles.container}>
        <img
          src="/images/brand-strip.png"
          alt="Quick Delivery, Secure Payment, Best Quality"
          className={styles.brandStrip}
        />
      </div>
    </section>
  );
}
