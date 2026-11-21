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
        <img
          src={getS3AssetUrl("assets/Curated-img/nami 1.png")}
          alt="Nami"
          className={`${styles.character} ${styles.leftCharacter}`}
          loading="eager"
        />

        {/* Zoro - Center Character */}
        <img
          src={getS3AssetUrl("assets/Curated-img/zoro 1.png")}
          alt="Zoro"
          className={`${styles.character} ${styles.centerCharacter}`}
          loading="eager"
        />

        {/* Luffy - Right Character with laugh sound lines */}
        <div className={styles.luffyWrapper}>
          <img
            src={getS3AssetUrl("assets/Curated-img/luffy png 1.png")}
            alt="Luffy"
            className={`${styles.character} ${styles.rightCharacter}`}
            loading="eager"
          />
          <div className={styles.soundLines} aria-hidden="true">
            <svg viewBox="0 0 32 32" className={styles.soundLinesSvg}>
              <line
                x1="28"
                y1="16"
                x2="6"
                y2="5"
                stroke="#160B24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="28"
                y1="16"
                x2="2"
                y2="16"
                stroke="#160B24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="28"
                y1="16"
                x2="6"
                y2="27"
                stroke="#160B24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Message 1: CURATED ? (Populates right after characters land) */}
        <div className={styles.topBubble}>
          <h2 id="curated-title">CURATED ?</h2>
          <svg
            viewBox="0 0 50 42"
            fill="none"
            className={styles.topTail}
            aria-hidden="true"
          >
            <path
              d="M2 1 C14 12 30 24 48 39 C40 24 34 10 28 1 Z"
              fill="#ffffff"
              stroke="#160b24"
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="1"
              y1="1"
              x2="29"
              y2="1"
              stroke="#ffffff"
              strokeWidth="4.5"
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
            viewBox="0 0 44 40"
            fill="none"
            className={styles.storyTail}
            aria-hidden="true"
          >
            <path
              d="M42 12 C28 9 16 5 2 2 C14 16 26 26 42 34 Z"
              fill="#ffffff"
              stroke="#160b24"
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="42"
              y1="11"
              x2="42"
              y2="35"
              stroke="#ffffff"
              strokeWidth="4.5"
            />
          </svg>
        </div>

        {/* Message 3: EXPLORE NOW! (1 sec after Message 2) */}
        <Link className={styles.cta} href="/products#new-arrivals">
          <span className={styles.ctaButton}>
            <span className={styles.ctaTopText}>EXPLORE</span>
            <span className={styles.ctaBottomText}>NOW!</span>
          </span>
          <svg
            viewBox="0 0 36 32"
            fill="none"
            className={styles.ctaTail}
            aria-hidden="true"
          >
            <path
              d="M34 4 C24 10 14 18 2 28 C12 28 22 26 34 24 Z"
              fill="#ffffff"
              stroke="#160b24"
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line
              x1="34"
              y1="3"
              x2="34"
              y2="25"
              stroke="#ffffff"
              strokeWidth="4.5"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
