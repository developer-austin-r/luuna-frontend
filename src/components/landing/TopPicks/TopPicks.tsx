import localFont from "next/font/local";
import Image from "next/image";

import styles from "./TopPicks.module.css";

const headingFont = localFont({
  src: "../../../assets/fonts/black-han-sans.ttf",
  display: "swap",
  weight: "400",
});

const topPicks = [
  {
    id: 1,
    image: "/images/top-picks/pick-1.jpg",
    alt: "Anime collectible figure on rocky base",
  },
  {
    id: 2,
    image: "/images/top-picks/pick-2.jpg",
    alt: "White racing car with open doors",
  },
  {
    id: 3,
    image: "/images/top-picks/pick-3.jpg",
    alt: "BWT Alpine F1 team drivers and car",
  },
  {
    id: 4,
    image: "/images/top-picks/pick-4.jpg",
    alt: "Spider-Man collectible figurines",
  },
];

export default function TopPicks() {
  return (
    <section className={styles.section} aria-labelledby="top-picks-title">
      <div className={styles.container}>
        <h2
          id="top-picks-title"
          className={`${styles.title} ${headingFont.className}`}
        >
          TOP PICKS
        </h2>

        <div className={styles.picksGrid}>
          {topPicks.map((product) => (
            <div className={styles.pickItem} key={product.id}>
              <span
                className={`${styles.rank} ${headingFont.className}`}
                aria-hidden="true"
              >
                {product.id}
              </span>
              <div className={styles.productImageWrapper}>
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 540px) 42vw, (max-width: 900px) 25vw, 210px"
                  className={styles.productImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
