"use client";

import { useEffect, useRef, useState } from "react";
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
  asSlide = true,
}: {
  product: ArrivalProduct;
  index: number;
  total: number;
  className?: string | undefined;
  asSlide?: boolean;
}) {
  const [failedImage, setFailedImage] = useState<string>();
  const discount = product.discount ?? (product.variant ? 20 : 0);

  return (
    <article
      className={`${styles.productCard} ${className ?? ""}`}
      role={asSlide ? "group" : undefined}
      aria-roledescription={asSlide ? "slide" : undefined}
      aria-label={
        asSlide ? `${index + 1} of ${total}: ${product.name}` : undefined
      }
    >
      <div
        className={
          asSlide ? styles.artwork : `${styles.artwork} ${styles.squareArtwork}`
        }
      >
        {discount > 0 && <span className={styles.discount}>-{discount}%</span>}
        {product.image && product.image !== failedImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={
              asSlide
                ? "(max-width: 520px) 72vw, (max-width: 850px) 42vw, 24vw"
                : "(max-width: 520px) 46vw, (max-width: 760px) 31vw, 23vw"
            }
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
      <div
        className={
          asSlide
            ? styles.productInfo
            : `${styles.productInfo} ${styles.gridProductInfo}`
        }
      >
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
  const [positions, setPositions] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const measure = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const stops = cards
        .map((card) => Math.min(card.offsetLeft, maxScroll))
        .filter(
          (position, index, offsets) =>
            position > (offsets[index - 1] ?? -Infinity),
        );
      setPositions(stops);
      setActiveIndex(closestPosition(stops, viewport.scrollLeft));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [products]);

  const goToCard = (index: number) => {
    const left = positions[index];
    if (left === undefined) return;

    viewportRef.current?.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
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
              disabled={activeIndex === 0}
              onClick={() => goToCard(activeIndex - 1)}
            >
              <ChevronLeft size={19} />
            </button>
            <div
              className={styles.viewport}
              ref={viewportRef}
              onScroll={(event) =>
                setActiveIndex(
                  closestPosition(positions, event.currentTarget.scrollLeft),
                )
              }
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
              disabled={activeIndex >= positions.length - 1}
              onClick={() => goToCard(activeIndex + 1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>

          {positions.length > 1 && (
            <div
              className={styles.pagination}
              aria-label={`Choose a ${title.toLowerCase()} product`}
            >
              {positions.map((position, index) => (
                <button
                  className={
                    index === activeIndex ? styles.activeDot : styles.dot
                  }
                  key={position}
                  type="button"
                  aria-label={`Show products from position ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => goToCard(index)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function closestPosition(positions: number[], scrollLeft: number) {
  return positions.reduce(
    (closest, position, index) =>
      Math.abs(position - scrollLeft) <
      Math.abs((positions[closest] ?? 0) - scrollLeft)
        ? index
        : closest,
    0,
  );
}
