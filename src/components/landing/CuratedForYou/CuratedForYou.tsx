"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { getS3AssetUrl } from "@/config";

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
      { threshold: 0.2 },
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
        {/* Nami - Left Character */}
        <div className={`${styles.characterWrapper} ${styles.leftWrapper}`}>
          <div className={`${styles.characterFloat} ${styles.namiFloat}`}>
            <img
              src={getS3AssetUrl("assets/Curated-img/nami 1.png")}
              alt="Nami"
              className={styles.characterImg}
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "true";
                  target.src = getS3AssetUrl("assets/Curated/nami 1.png");
                }
              }}
            />
          </div>
        </div>

        {/* Zoro - Center Character */}
        <div className={`${styles.characterWrapper} ${styles.centerWrapper}`}>
          <div className={`${styles.characterFloat} ${styles.zoroFloat}`}>
            <img
              src={getS3AssetUrl("assets/Curated-img/zoro 1.png")}
              alt="Zoro"
              className={styles.characterImg}
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "true";
                  target.src = getS3AssetUrl("assets/Curated/zoro 1.png");
                }
              }}
            />
          </div>
        </div>

        {/* Luffy - Right Character */}
        <div className={`${styles.characterWrapper} ${styles.rightWrapper}`}>
          <div className={`${styles.characterFloat} ${styles.luffyFloat}`}>
            <img
              src={getS3AssetUrl("assets/Curated-img/luffy png 1.png")}
              alt="Luffy"
              className={styles.characterImg}
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "true";
                  target.src = getS3AssetUrl("assets/Curated/luffy png 1.png");
                }
              }}
            />
          </div>
        </div>

        {/* Message 1: CURATED ? (Populates right after characters land) */}
        <div className={styles.topBubble}>
          <h2 id="curated-title">CURATED ?</h2>
          <svg
            viewBox="0 0 52 42"
            fill="none"
            className={styles.topTail}
            aria-hidden="true"
          >
            <path
              d="M4 1 C16 14 32 26 50 39 C38 26 32 14 30 1 Z"
              fill="#ffffff"
              stroke="#160b24"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="1"
              x2="31"
              y2="1"
              stroke="#ffffff"
              strokeWidth="5"
            />
          </svg>
        </div>

        {/* Message 2: The best loot all in one box, Captain ! (1 sec after CURATED ?) */}
        <div className={styles.storyBubble}>
          <p>
            The best loot all in
            <br />
            one box, Captain !
          </p>
          <svg
            viewBox="0 0 44 42"
            fill="none"
            className={styles.storyTail}
            aria-hidden="true"
          >
            <path
              d="M43 14 C28 10 16 6 3 2 C16 20 28 32 43 38 Z"
              fill="#ffffff"
              stroke="#160b24"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="43"
              y1="13"
              x2="43"
              y2="39"
              stroke="#ffffff"
              strokeWidth="5"
            />
          </svg>
        </div>

        {/* Message 3: EXPLORE NOW! (1 sec after Message 2) */}
        <Link className={styles.cta} href="/products#new-arrivals">
          <span className={styles.ctaButton}>EXPLORE NOW!</span>
          <svg
            viewBox="0 0 38 34"
            fill="none"
            className={styles.ctaTail}
            aria-hidden="true"
          >
            <path
              d="M37 6 C25 11 15 19 3 29 C14 29 26 28 37 27 Z"
              fill="#ffffff"
              stroke="#160b24"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="37"
              y1="5"
              x2="37"
              y2="28"
              stroke="#ffffff"
              strokeWidth="5"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
