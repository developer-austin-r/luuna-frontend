"use client";

import { useState } from "react";

import styles from "./Testmonials.module.css";

const review =
  "Luuna's products are amazing! The quality is top-notch, and the design are so unique and fun!";

const testimonials = [
  { id: "review-1", name: "M. Harshiline" },
  { id: "review-2", name: "M. Harshiline" },
  { id: "review-3", name: "M. Harshiline" },
  { id: "review-4", name: "M. Harshiline" },
  { id: "review-5", name: "M. Harshiline" },
];

export default function Testimonials() {
  const [activePage, setActivePage] = useState(0);
  const pageCount = testimonials.length - 2;

  const showPage = (page: number) => {
    setActivePage((page + pageCount) % pageCount);
  };

  return (
    <section className={styles.testimonials} aria-label="Customer reviews">
      <div className={styles.carousel}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${activePage * 20}%)` }}
        >
          {testimonials.map((item, index) => (
            <article
              className={`${styles.card} ${index === activePage + 1 ? styles.featured : ""} ${index === activePage ? styles.mobileActive : ""}`}
              key={item.id}
            >
              <div className={styles.rating} aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p>{review}</p>
              <h2>{item.name}</h2>
            </article>
          ))}
        </div>
        <button
          className={`${styles.arrow} ${styles.previous}`}
          type="button"
          onClick={() => showPage(activePage - 1)}
          aria-label="Previous reviews"
        >
          ‹
        </button>
        <button
          className={`${styles.arrow} ${styles.next}`}
          type="button"
          onClick={() => showPage(activePage + 1)}
          aria-label="Next reviews"
        >
          ›
        </button>
      </div>
      <div className={styles.pagination} aria-label="Review pages">
        {Array.from({ length: pageCount }, (_, page) => (
          <button
            className={`${styles.dot} ${page === activePage ? styles.activeDot : ""}`}
            key={page}
            type="button"
            onClick={() => showPage(page)}
            aria-label={`Show review page ${page + 1}`}
            aria-current={page === activePage ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
