"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import CollectibleFigure from "@/components/landing/CollectibleFigure";

import styles from "./CuratedForYou.module.css";

export default function CuratedForYou() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="curated-title"
    >
      <div
        className={styles.banner}
        data-reveal={hasEntered ? "started" : undefined}
      >
        <CollectibleFigure
          className={`${styles.character} ${styles.leftCharacter}`}
          variant="sunburst"
        />
        <CollectibleFigure
          className={`${styles.character} ${styles.centerCharacter}`}
          variant="warrior"
        />
        <CollectibleFigure
          className={`${styles.character} ${styles.rightCharacter}`}
          variant="ninja"
        />
        <div className={styles.topBubble}>
          <h2 id="curated-title">CURATED ?</h2>
        </div>
        <div className={styles.storyBubble}>
          <p>The best loot all in one box, Captain!</p>
        </div>
        <Link className={styles.cta} href="#new-arrivals">
          <span>
            Explore
            <br />
            now!
          </span>
        </Link>
      </div>
    </section>
  );
}
