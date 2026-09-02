"use client";

import { type ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./ProductSlider.module.css";

interface ProductSliderProps {
  title: string;
  children: ReactNode;
}

export default function ProductSlider({ title, children }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>

        <div className={styles.controls}>
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous products"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next products"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div ref={sliderRef} className={styles.slider}>
        {children}
      </div>
    </section>
  );
}
