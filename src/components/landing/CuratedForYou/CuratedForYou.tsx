import styles from "./CuratedForYou.module.css";

const curatedItems = [
  {
    id: 1,
    title: "Anime",
    description: "Lorem ipsum Lorem ipsumlorem ipsum",
    className: "largeCard",
  },
  {
    id: 2,
    title: "Avengers",
    description: "Lorem ipsum Lorem ipsumlorem ipsum Lorem ipsum",
    className: "wideCard",
  },
  {
    id: 3,
    title: "Anime",
    description: "Lorem ipsum Lorem ipsum",
    className: "smallCard",
  },
  {
    id: 4,
    title: "Anime",
    description: "Lorem ipsum Lorem ipsum",
    className: "smallCard",
  },
];

export default function CuratedForYou() {
  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleBar}></span>

          <h2>Curated For You</h2>
        </div>

        <a href="#" className={styles.browseLink}>
          Browse All Products
          <span>→</span>
        </a>
      </div>

      {/* Curated Grid */}
      <div className={styles.grid}>
        {curatedItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${
              styles[item.className as keyof typeof styles]
            }`}
          >
            <div className={styles.cardContent}>
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <a href="#" className={styles.shopLink}>
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
