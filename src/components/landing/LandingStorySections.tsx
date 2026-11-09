import Link from "next/link";
import { CarFront } from "lucide-react";

import CollectibleFigure from "@/components/landing/CollectibleFigure";
import {
  type ArrivalProduct,
  ProductCard,
  ProductCarousel,
} from "@/components/landing/NewArrivals/NewArrivals";

import styles from "./LandingStorySections.module.css";

const accessories: ArrivalProduct[] = [
  {
    name: "God of War bundle",
    description: "Collectible set · 2 pieces",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
  },
  {
    name: "God of War bundle",
    description: "Shelf accessory · 1 piece",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
  },
  {
    name: "God of War bundle",
    description: "Mini figure · 10 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "sunburst",
  },
  {
    name: "God of War bundle",
    description: "Enamel pins · Set of 3",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "ninja",
  },
];

const topPicks: ArrivalProduct[] = [
  {
    name: "God of War bundle",
    description: "Collector figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
    image: "/images/recommendation-toy.png",
  },
  {
    name: "God of War bundle",
    description: "Vinyl figures · Set of 2",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 16 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "sunburst",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 15 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "ninja",
  },
  {
    name: "God of War bundle",
    description: "Fantasy figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
  },
  {
    name: "God of War bundle",
    description: "Collector figure · 17 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
  },
  {
    name: "God of War bundle",
    description: "Fantasy figure · 16 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "ninja",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 15 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "sunburst",
  },
];

const categories = [
  {
    name: "ANIME",
    tone: "anime",
    variant: "sunburst" as const,
  },
  {
    name: "ANIME",
    tone: "classics",
    variant: "ninja" as const,
  },
  {
    name: "DC",
    tone: "dc",
    variant: "warrior" as const,
  },
  {
    name: "MARVEL",
    tone: "marvel",
    variant: "web" as const,
  },
  {
    name: "K-POP",
    tone: "kpop",
    variant: "sunburst" as const,
  },
];

function ArtworkBanner({
  id,
  title,
  scene,
}: {
  id: string;
  title: string;
  scene: "new" | "nostalgia" | "wheels";
}) {
  return (
    <section className={styles.posterSection} id={id} aria-label={title}>
      <div className={`${styles.poster} ${styles[`poster${scene}`]}`}>
        <div className={styles.posterArt} aria-hidden="true">
          {scene === "wheels" ? (
            <CarFront size={150} strokeWidth={1.1} />
          ) : (
            <CollectibleFigure
              className={styles.posterFigure}
              variant={scene === "new" ? "sunburst" : "warrior"}
            />
          )}
        </div>
        <div className={styles.posterLabel}>
          <h2>{title}</h2>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section
      className={styles.categorySection}
      aria-labelledby="category-title"
    >
      <div className={styles.contentWidth}>
        <div className={styles.sectionTitle}>
          <h2 id="category-title">CATEGORY</h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              href="#top-picks"
              className={`${styles.categoryCard} ${styles[category.tone]}`}
              key={`${category.tone}-${category.name}`}
            >
              <span className={styles.categoryCopy}>
                <span className={styles.categoryName}>{category.name}</span>
              </span>
              <CollectibleFigure
                className={styles.categoryFigure}
                variant={category.variant}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStrip() {
  return <div className={styles.brandStrip} aria-hidden="true" />;
}

function ProductGrid() {
  return (
    <section
      className={styles.productGridSection}
      aria-label="Featured products"
    >
      <div className={styles.contentWidth}>
        <div className={styles.productGrid}>
          {topPicks.map((product, index) => (
            <ProductCard
              key={`favorite-${index}-${product.name}`}
              product={product}
              index={index}
              total={topPicks.length}
              className={styles.gridCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingStorySections() {
  return (
    <>
      <ProductCarousel
        id="accessories"
        title="ACCESSORIES"
        products={accessories}
      />
      <ArtworkBanner id="whats-new" title="WHAT’S NEW" scene="new" />
      <CategoryGrid />
      <ArtworkBanner id="nostalgia" title="NOSTALGIA" scene="nostalgia" />
      <ArtworkBanner id="wheels" title="WHEELS" scene="wheels" />
      <BrandStrip />
      <ProductCarousel id="top-picks" title="TOP PICKS" products={topPicks} />
      <ProductGrid />
    </>
  );
}
