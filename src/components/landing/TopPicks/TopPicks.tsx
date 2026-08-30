import styles from "./TopPicks.module.css";

const topPicks = [
  { id: 1, image: "/images/top-picks/pick-1.jpg" },
  { id: 2, image: "/images/top-picks/pick-2.jpg" },
  { id: 3, image: "/images/top-picks/pick-3.jpg" },
  { id: 4, image: "/images/top-picks/pick-4.jpg" },
];

export default function TopPicks() {
  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleBar}></span>
          <h2>Top Picks</h2>
        </div>
      </div>

      {/* Ranking Products */}
      <div className={styles.picksGrid}>
        {topPicks.map((product) => (
          <div className={styles.pickItem} key={product.id}>
            <div className={styles.rank}>{product.id}</div>

            <div className={styles.productImage}>
              <img src={product.image} alt={`Top pick ${product.id}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom divider */}
      <div className={styles.divider}></div>
    </section>
  );
}
