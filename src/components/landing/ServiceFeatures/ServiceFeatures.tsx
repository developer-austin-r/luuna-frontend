import styles from "./ServiceFeatures.module.css";

const features = [
  {
    icon: "↗",
    title: "Fast delivery",
  },
  {
    icon: "◇",
    title: "Secure checkout",
  },
  {
    icon: "✦",
    title: "Collector favorites",
  },
  {
    icon: "♡",
    title: "Made for fans",
  },
];

export default function ServiceFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        {features.map((feature) => (
          <div className={styles.featureCard} key={feature.title}>
            <span className={styles.icon}>{feature.icon}</span>

            <span className={styles.title}>{feature.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
