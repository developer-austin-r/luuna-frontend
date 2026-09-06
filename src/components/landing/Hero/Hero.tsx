import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1>
            Collect Your Favorite
            <br />
            Legends
          </h1>

          <button className={styles.shopButton}>SHOP NOW</button>
        </div>
      </div>

      {/* Slider dots */}
      <div className={styles.dots}>
        <span className={`${styles.dot} ${styles.active}`} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </section>
  );
}
