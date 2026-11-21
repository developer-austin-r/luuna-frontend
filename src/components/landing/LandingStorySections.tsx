import { Suspense } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

import LandingProductCarousel from "@/components/landing/NewArrivals/LandingProductCarousel";
import { getS3AssetUrl } from "@/config";

import styles from "./LandingStorySections.module.css";

const headingFont = localFont({
  src: "../../assets/fonts/black-han-sans.ttf",
  display: "swap",
  weight: "400",
});

const categories = [
  {
    name: "Anime",
    s3Path: "assets/Categories-img/Anime.png",
    href: "/categories/anime",
    hotspot: styles.hotspotAnime,
  },
  {
    name: "DC",
    s3Path: "assets/Categories-img/Dc.png",
    href: "/categories/dc",
    hotspot: styles.hotspotDC,
  },
  {
    name: "Marvel",
    s3Path: "assets/Categories-img/Marvel.png",
    href: "/categories/marvel",
    hotspot: styles.hotspotMarvel,
  },
  {
    name: "K-Pop",
    s3Path: "assets/Categories-img/K-Pop.png",
    href: "/categories/kpop",
    hotspot: styles.hotspotKpop,
  },
  {
    name: "Nostalgia",
    s3Path: "assets/Categories-img/Nostalogia.png",
    href: "/categories/nostalgia",
    hotspot: styles.hotspotNostalgia,
  },
  {
    name: "Wheels",
    s3Path: "assets/Categories-img/Wheels.PNG",
    href: "/categories/wheels",
    hotspot: styles.hotspotWheels,
  },
];

function WhatsNewBanner() {
  return (
    <section
      id="whats-new"
      aria-labelledby="whats-new-title"
      className={`${styles.whatsNew} ${headingFont.className}`}
    >
      <h2 id="whats-new-title">WHAT’S NEW</h2>
      <Image
        src={getS3AssetUrl("assets/Lattest.png")}
        alt="Naruto overlooking a village framed by autumn leaves"
        width={1440}
        height={472}
        unoptimized
        className={styles.whatsNewImage}
      />
    </section>
  );
}

function CategoryGrid() {
  return (
    <section
      className={`${styles.categorySection} ${headingFont.className}`}
      aria-labelledby="category-title"
    >
      <div className={styles.contentWidth}>
        <div className={styles.sectionTitle}>
          <h2 id="category-title">CATEGORY</h2>
        </div>

        <div className={styles.categoryArtwork}>
          {categories.map(({ name, s3Path, href, hotspot }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.categoryHotspot} ${hotspot}`}
            >
              <Image
                src={getS3AssetUrl(s3Path)}
                alt={name}
                fill
                unoptimized
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
      <WhatsNewBanner />
      <CategoryGrid />
    </>
  );
}
