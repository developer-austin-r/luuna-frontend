import styles from "./Testmonials.module.css";

const testimonials = [
  {
    id: 1,
    name: "M. Harshiline",
    date: "July 2026",
    review:
      "Luuna's products are amazing! The quality is top-notch, and the designs are so unique and fun!",
  },
  {
    id: 2,
    name: "M. Harshiline",
    date: "July 2026",
    review:
      "Luuna's products are amazing! The quality is top-notch, and the designs are so unique and fun!",
  },
  {
    id: 3,
    name: "M. Harshiline",
    date: "July 2026",
    review:
      "Luuna's products are amazing! The quality is top-notch, and the designs are so unique and fun!",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <div className={styles.cards}>
        {testimonials.map((item) => (
          <div className={styles.card} key={item.id}>
            <div className={styles.top}>
              <h3>{item.name}</h3>

              <div className={styles.rating}>
                <span>★★★★</span>
                <span className={styles.grayStar}>★</span>
                <small>{item.date}</small>
              </div>
            </div>

            <p>{item.review}</p>
          </div>
        ))}
      </div>

      <div className={styles.divider}></div>
    </section>
  );
}
