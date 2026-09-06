import styles from "./Category.module.css";

const categories = [
  { id: 1, name: "Marvel", position: "top" },
  { id: 2, name: "Anime", position: "bottom" },
  { id: 3, name: "Marvel", position: "top" },

  { id: 4, name: "Marvel", position: "top" },
  { id: 5, name: "Anime", position: "bottom" },
  { id: 6, name: "Marvel", position: "top" },
];

export default function Category() {
  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleBar}></span>

          <h2>Category</h2>
        </div>

        <a href="#" className={styles.browseLink}>
          Browse All Products
          <span>→</span>
        </a>
      </div>

      {/* Category Grid */}
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`${styles.categoryCard} ${
              category.position === "bottom"
                ? styles.imageFirst
                : styles.titleFirst
            }`}
          >
            <h3>{category.name}</h3>

            <div className={styles.imageBox}></div>
          </div>
        ))}
      </div>
    </section>
  );
}
