import styles from "./NewArrivals.module.css";

const arrivals = [
  {
    id: 1,
    title: "Anime",
    description: "Lorem ipsum Lorem ipsumlorem ipsum",
    type: "large",
  },
  {
    id: 2,
    title: "Avengers",
    description: "Lorem ipsum Lorem ipsumlorem ipsum Lorem ipsum Lorem",
    type: "wide",
  },
  {
    id: 3,
    title: "Anime",
    description: "Lorem ipsum Lorem",
    type: "small",
  },
  {
    id: 4,
    title: "Anime",
    description: "Lorem ipsum Lorem",
    type: "small",
  },
];

export default function NewArrivals() {
  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleBar}></span>

          <h2>New Arrivals</h2>
        </div>

        <a href="#" className={styles.browseLink}>
          Browse All Products
          <span>→</span>
        </a>
      </div>

      {/* Arrivals Grid */}
      <div className={styles.arrivalsGrid}>
        {arrivals.map((item) => (
          <article
            key={item.id}
            className={`${styles.arrivalCard} ${styles[item.type]}`}
          >
            <div className={styles.cardContent}>
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <a href="#" className={styles.shopLink}>
                Shop Now
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
