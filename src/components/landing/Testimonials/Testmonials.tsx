"use client";

import Image from "next/image";

import styles from "./Testmonials.module.css";

type Testimonial = {
  id: string;
  name: string;
  rating: number;
  review: string;
  isCenter?: boolean;
};

// Available genuine customer review data from the project
const genuineReview: Testimonial = {
  id: "review-genuine",
  name: "M. Harshinie",
  rating: 5,
  review:
    "Luuna's products are amazing! The quality is top-notch, and the design are so unique and fun!",
};

// Three visible cards matching Abu's reference screenshot layout (Left, Center genuine review, Right)
const reviewCards: Testimonial[] = [
  {
    ...genuineReview,
    id: "review-card-left",
    isCenter: false,
  },
  {
    ...genuineReview,
    id: "review-card-center",
    isCenter: true,
  },
  {
    ...genuineReview,
    id: "review-card-right",
    isCenter: false,
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials} aria-label="Customer reviews">
      <div className={styles.contentContainer}>
        <div className={styles.reviewGrid}>
          {reviewCards.map((item) => {
            const isCenter = item.isCenter;
            return (
              <article
                className={`${styles.card} ${isCenter ? styles.centerCard : styles.sideCard}`}
                key={item.id}
              >
                {/* Background Anime Character Artwork dedicated behind the middle review card */}
                {isCenter && (
                  <div className={styles.centerArtWrapper} aria-hidden="true">
                    <Image
                      src="/images/testimonials-art.png"
                      alt=""
                      fill
                      className={styles.centerArt}
                    />
                    <div className={styles.artOverlay} />
                  </div>
                )}

                <div className={styles.cardContent}>
                  <div
                    className={styles.rating}
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {"★".repeat(item.rating)}
                  </div>
                  <p className={styles.reviewText}>{item.review}</p>
                  <h3 className={styles.authorName}>{item.name}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
