import { Suspense } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { CarFront } from "lucide-react";

import CollectibleFigure from "@/components/landing/CollectibleFigure";
import LandingProductCarousel from "@/components/landing/NewArrivals/LandingProductCarousel";

import styles from "./LandingStorySections.module.css";

const categoryFont = localFont({
  src: "../../assets/fonts/black-han-sans.ttf",
  display: "swap",
  weight: "400",
});

const categories = [
  {
    name: "Anime",
    image: "anime.png",
    href: "/categories/anime",
    hotspot: styles.hotspotAnime,
  },
  {
    name: "DC",
    image: "dc.png",
    href: "/categories/dc",
    hotspot: styles.hotspotDC,
  },
  {
    name: "Marvel",
    image: "marvel.png",
    href: "/categories/marvel",
    hotspot: styles.hotspotMarvel,
  },
  {
    name: "K-Pop",
    image: "kpop.png",
    href: "/categories/kpop",
    hotspot: styles.hotspotKpop,
  },
  {
    name: "Nostalgia",
    image: "nostalgia.png",
    href: "/categories/nostalgia",
    hotspot: styles.hotspotNostalgia,
  },
  {
    name: "Wheels",
    image: "wheels.png",
    href: "/categories/wheels",
    hotspot: styles.hotspotWheels,
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
      className={`${styles.categorySection} ${categoryFont.className}`}
      aria-labelledby="category-title"
    >
      <div className={styles.contentWidth}>
        <div className={styles.sectionTitle}>
          <h2 id="category-title">CATEGORY</h2>
        </div>

        <div className={styles.categoryArtwork}>
          {categories.map(({ name, image, href, hotspot }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.categoryHotspot} ${hotspot}`}
            >
              <Image
                src={`/images/category-collage/${image}`}
                alt=""
                fill
                sizes="(min-width: 1440px) 1280px, 89vw"
                className={styles.categoryArtworkImage}
              />
              <span className={styles.categoryLabel}>{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingStorySections() {
  return (
    <>
      <Suspense>
        <LandingProductCarousel section="accessories" />
      </Suspense>
      <ArtworkBanner id="whats-new" title="WHAT’S NEW" scene="new" />
      <CategoryGrid />
    </>
  );
}
