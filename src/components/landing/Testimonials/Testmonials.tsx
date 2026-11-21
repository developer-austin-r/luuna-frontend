"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

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
  const [paused, setPaused] = useState(false);

  return (
    <section
      className={styles.testimonials}
      aria-label="Customer reviews"
      data-paused={paused}
    >
      <div className={styles.centerArtWrapper} aria-hidden="true">
        <Image
          src="/images/testimonials-art.png"
          alt=""
          fill
          sizes="100vw"
          className={styles.centerArt}
        />
        <div className={styles.artOverlay} />
      </div>

      <div className={styles.track}>
        {[false, true].map((duplicate) => (
          <div
            key={duplicate ? "repeat" : "reviews"}
            className={styles.reviewGroup}
            aria-hidden={duplicate || undefined}
          >
            {reviewCards.map((item) => (
              <article className={styles.card} key={item.id}>
                <div
                  className={styles.stars}
                  role="img"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <blockquote className={styles.reviewText}>
                  {item.review}
                </blockquote>
                <p className={styles.authorName}>{item.name}</p>
              </article>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        className={styles.playback}
        aria-label={
          paused ? "Resume scrolling reviews" : "Pause scrolling reviews"
        }
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <Play size={15} aria-hidden="true" />
        ) : (
          <Pause size={15} aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
