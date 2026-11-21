"use client";

import Image from "next/image";

import styles from "./Testmonials.module.css";

type Testimonial = {
  id: string;
  name: string;
  rating: number;
  review: string;
};

const genuineReview: Testimonial = {
  id: "review-genuine",
  name: "M. Harshinie",
  rating: 5,
  review:
    "Luuna's products are amazing! The quality is top-notch, and the design are so unique and fun!",
};

const reviewCards: Testimonial[] = [
  { ...genuineReview, id: "review-card-left" },
  { ...genuineReview, id: "review-card-center" },
  { ...genuineReview, id: "review-card-right" },
];

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="#ff6e14"
      className={styles.starIcon}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className={styles.testimonials} aria-label="Customer reviews">
      {/* Background glowing red anime artwork in the center of the reviews section */}
      <div className={styles.centerArtWrapper} aria-hidden="true">
        <Image
          src="/images/testimonials-art.png"
          alt=""
          fill
          unoptimized
          className={styles.centerArt}
        />
        <div className={styles.artOverlay} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.reviewGrid}>
          {reviewCards.map((item) => (
            <article className={styles.card} key={item.id}>
              <div
                className={styles.stars}
                aria-label={`${item.rating} out of 5 stars`}
              >
                {Array.from({ length: item.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className={styles.reviewText}>{item.review}</p>
              <h3 className={styles.authorName}>{item.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
