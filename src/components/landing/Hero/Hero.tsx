"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./Hero.module.css";

const slides = [
  {
    title: "Featured collectible one",
    image: "/images/hero-1.jpg",
    alt: "Description of featured collectible one",
  },
  {
    title: "Featured collectible two",
    image: "/images/hero-2.jpg",
    alt: "Description of featured collectible two",
  },
  {
    title: "Featured collectible three",
    image: "/images/hero-3.jpg",
    alt: "Description of featured collectible three",
  },
  {
    title: "Featured collectible four",
    image: "/images/hero-4.jpg",
    alt: "Description of featured collectible four",
  },
  {
    title: "Featured collectible five",
    image: "/images/hero-5.jpg",
    alt: "Description of featured collectible five",
  },
];

export default function Hero() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    viewport.scrollBy({
      left: direction * viewport.clientWidth * (isMobile ? 0.72 : 0.67),
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.visuallyHidden}>
        Collect your favorite legends
      </h1>

      <div
        className={styles.viewport}
        ref={viewportRef}
        role="region"
        aria-label="Featured collectibles"
        aria-roledescription="carousel"
      >
        <div className={styles.track}>
          {slides.map((slide, index) => (
            <article
              className={styles.slide}
              key={slide.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            >
              <Image
                className={styles.photo}
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 700px) 72vw, 31vw"
              />

              <Link className={styles.shopButton} href="#new-arrivals">
                SHOP NOW
              </Link>
            </article>
          ))}
        </div>
      </div>

      <button
        className={`${styles.arrow} ${styles.previous}`}
        type="button"
        aria-label="Previous featured collectibles"
        onClick={() => moveCarousel(-1)}
      >
        <ChevronLeft size={23} />
      </button>

      <button
        className={`${styles.arrow} ${styles.next}`}
        type="button"
        aria-label="Next featured collectibles"
        onClick={() => moveCarousel(1)}
      >
        <ChevronRight size={23} />
      </button>
    </section>
  );
}
