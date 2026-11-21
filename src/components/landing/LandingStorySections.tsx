import Image from "next/image";
import Link from "next/link";
import { CarFront } from "lucide-react";

import CollectibleFigure from "@/components/landing/CollectibleFigure";
import {
  type ArrivalProduct,
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

const categories = [
  {
    name: "ANIME",
    image: "/images/categories/anime.png",
    href: "/categories/anime",
  },
  {
    name: "DC",
    image: "/images/categories/dc.png",
    href: "/categories/dc",
  },
  {
    name: "MARVEL",
    image: "/images/categories/marvel.png",
    href: "/categories/marvel",
  },
  {
    name: "K-POP",
    image: "/images/categories/kpop.png",
    href: "/categories/kpop",
  },
  {
    name: "NOSTALGIA",
    image: "/images/categories/nostalgia.png",
    href: "/categories/nostalgia",
  },
  {
    name: "WHEELS",
    image: "/images/categories/wheels.png",
    href: "/categories/wheels",
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

        <div className={styles.categoryArtwork}>
          <Image
            src="/images/category.png"
            alt="Explore Anime, DC, Marvel, K-Pop, Nostalgia, and Wheels"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className={styles.categoryArtworkImage}
          />

          <Link
            href="/categories/anime"
            className={`${styles.categoryHotspot} ${styles.hotspotAnime}`}
            aria-label="Explore Anime"
          />

          <Link
            href="/categories/dc"
            className={`${styles.categoryHotspot} ${styles.hotspotDC}`}
            aria-label="Explore DC"
          />

          <Link
            href="/categories/marvel"
            className={`${styles.categoryHotspot} ${styles.hotspotMarvel}`}
            aria-label="Explore Marvel"
          />

          <Link
            href="/categories/kpop"
            className={`${styles.categoryHotspot} ${styles.hotspotKpop}`}
            aria-label="Explore K-Pop"
          />

          <Link
            href="/categories/nostalgia"
            className={`${styles.categoryHotspot} ${styles.hotspotNostalgia}`}
            aria-label="Explore Nostalgia"
          />

          <Link
            href="/categories/wheels"
            className={`${styles.categoryHotspot} ${styles.hotspotWheels}`}
            aria-label="Explore Wheels"
          />
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
    </>
  );
}
