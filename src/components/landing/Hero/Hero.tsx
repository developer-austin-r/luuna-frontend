"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CollectibleFigure from "@/components/landing/CollectibleFigure";

import styles from "./Hero.module.css";

const slides = [
  { title: "Shadow realm", tone: "ember", variant: "ninja" as const },
  {
    title: "Collector’s spotlight",
    tone: "ice",
    image: "/images/recommendation-toy.png",
  },
  { title: "Legends in the making", tone: "gold", variant: "warrior" as const },
  {
    title: "Power up your shelf",
    tone: "violet",
    variant: "sunburst" as const,
  },
  { title: "Everyday heroes", tone: "blue", variant: "web" as const },
];

export default function Hero() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.7,
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
              className={`${styles.slide} ${styles[slide.tone]}`}
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            >
              <div className={styles.artStage}>
                {slide.image ? (
                  <Image
                    className={styles.photo}
                    src={slide.image}
                    alt="Dark winged fantasy collectible figure"
                    fill
                    priority
                    sizes="(max-width: 700px) 72vw, 34vw"
                  />
                ) : (
                  <CollectibleFigure
                    className={styles.figure}
                    variant={slide.variant!}
                  />
                )}
              </div>
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
