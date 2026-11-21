"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CollectibleFigure from "@/components/landing/CollectibleFigure";

import styles from "./NewArrivals.module.css";

type FigureVariant = "warrior" | "ninja" | "sunburst" | "web";

export type ArrivalProduct = {
  id?: string;
  href?: string | undefined;
  name: string;
  description: string;
  price: string;
  oldPrice?: string | undefined;
  discount?: number;
  variant?: FigureVariant;
  image?: string | undefined;
};

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
  const [failedImage, setFailedImage] = useState<string>();
  const discount = product.discount ?? (product.variant ? 20 : 0);

  return (
    <article
      className={`${styles.productCard} ${className ?? ""}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${product.name}`}
    >
      <div className={styles.artwork}>
        {discount > 0 && <span className={styles.discount}>-{discount}%</span>}
        {product.image && product.image !== failedImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 520px) 72vw, (max-width: 850px) 42vw, 24vw"
            loading="lazy"
            unoptimized={!product.image.startsWith("/")}
            onError={() => setFailedImage(product.image)}
          />
        ) : product.variant ? (
          <CollectibleFigure
            className={`${styles.figure} ${styles[`figure${product.variant}`]}`}
            variant={product.variant}
          />
        ) : null}
        <span className={styles.imageGlow} aria-hidden="true" />
      </div>
      <div className={styles.productInfo}>
        <h3>
          {product.href ? (
            <Link
              className={styles.productLink}
              href={product.href}
              prefetch={false}
            >
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>
        {!product.variant && product.description && (
          <p>{product.description}</p>
        )}
        <div className={styles.priceRow}>
          {product.oldPrice && (
            <span className={styles.oldPrice}>{product.oldPrice}</span>
          )}
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
  emptyMessage = "No products available yet.",
}: {
  id: string;
  title: string;
  products: ArrivalProduct[];
  emptyMessage?: string;
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

      {products.length === 0 ? (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      ) : (
        <>
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
                    key={product.id ?? `${index}-${product.name}`}
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
                className={
                  index === activeIndex ? styles.activeDot : styles.dot
                }
                key={product.id ?? `${index}-${product.name}`}
                type="button"
                aria-label={`Show ${product.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goToCard(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
