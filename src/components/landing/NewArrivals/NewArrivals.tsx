"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CollectibleFigure from "@/components/landing/CollectibleFigure";

import styles from "./NewArrivals.module.css";

type FigureVariant = "warrior" | "ninja" | "sunburst" | "web";

export type ArrivalProduct = {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  variant: FigureVariant;
  image?: string;
};

const arrivals: ArrivalProduct[] = [
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
    description: "Anime figure · 15 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "ninja",
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
    description: "Vinyl figures · Set of 2",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
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
    description: "Fantasy figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
  },
];

export function ProductCard({
  product,
  index,
  total,
  className,
}: {
  product: ArrivalProduct;
  index: number;
  total: number;
  className?: string | undefined;
}) {
  return (
    <article
      className={`${styles.productCard} ${className ?? ""}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${product.name}`}
    >
      <div className={styles.artwork}>
        <span className={styles.discount}>-20%</span>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 520px) 72vw, (max-width: 850px) 42vw, 24vw"
            loading="lazy"
          />
        ) : (
          <CollectibleFigure
            className={`${styles.figure} ${styles[`figure${product.variant}`]}`}
            variant={product.variant}
          />
        )}
        <span className={styles.imageGlow} aria-hidden="true" />
      </div>
      <div className={styles.productInfo}>
        <h3>{product.name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.oldPrice}>{product.oldPrice}</span>
          <strong>{product.price}</strong>
        </div>
      </div>
    </article>
  );
}

export function ProductCarousel({
  id,
  title,
  products,
}: {
  id: string;
  title: string;
  products: ArrivalProduct[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const moveCarousel = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.72,
      behavior: "smooth",
    });
  };

  const updateActiveIndex = () => {
    const viewport = viewportRef.current;
    const firstCard = trackRef.current?.querySelector<HTMLElement>("article");
    if (!viewport || !firstCard || !trackRef.current) return;

    const gap =
      Number.parseFloat(getComputedStyle(trackRef.current).columnGap) || 0;
    const cardStep = firstCard.offsetWidth + gap;
    setActiveIndex(
      Math.min(products.length - 1, Math.round(viewport.scrollLeft / cardStep)),
    );
  };

  const goToCard = (index: number) => {
    const viewport = viewportRef.current;
    const card =
      trackRef.current?.querySelectorAll<HTMLElement>("article")[index];
    if (!viewport || !card) return;

    viewport.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <div className={styles.heading}>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>

      <div className={styles.carouselWrap}>
        <button
          className={`${styles.arrow} ${styles.previous}`}
          type="button"
          aria-label={`Scroll to previous ${title.toLowerCase()}`}
          onClick={() => moveCarousel(-1)}
        >
          <ChevronLeft size={19} />
        </button>
        <div
          className={styles.viewport}
          ref={viewportRef}
          onScroll={updateActiveIndex}
          role="region"
          aria-label={title}
          aria-roledescription="carousel"
        >
          <div className={styles.track} ref={trackRef}>
            {products.map((product, index) => (
              <ProductCard
                key={`${index}-${product.name}`}
                product={product}
                index={index}
                total={products.length}
              />
            ))}
          </div>
        </div>
        <button
          className={`${styles.arrow} ${styles.next}`}
          type="button"
          aria-label={`Scroll to next ${title.toLowerCase()}`}
          onClick={() => moveCarousel(1)}
        >
          <ChevronRight size={19} />
        </button>
      </div>

      <div
        className={styles.pagination}
        aria-label={`Choose a ${title.toLowerCase()} product`}
      >
        {products.map((product, index) => (
          <button
            className={index === activeIndex ? styles.activeDot : styles.dot}
            key={`${index}-${product.name}`}
            type="button"
            aria-label={`Show ${product.name}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => goToCard(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default function NewArrivals() {
  return (
    <ProductCarousel
      id="new-arrivals"
      title="NEW ARRIVALS"
      products={arrivals}
    />
  );
}
