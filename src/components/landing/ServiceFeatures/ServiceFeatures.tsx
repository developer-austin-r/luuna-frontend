import styles from "./ServiceFeatures.module.css";

const features = [
  {
    icon: "🚚",
    title: "Quick Delivery",
  },
  {
    icon: "💳",
    title: "Secure Payment",
  },
  {
    icon: "🛡️",
    title: "Best Quality",
  },
  {
    icon: "📍",
    title: "Quick Delivery",
  },
];

export default function ServiceFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        {features.map((feature, index) => (
          <div className={styles.featureCard} key={index}>
            <span className={styles.icon}>{feature.icon}</span>

            <span className={styles.title}>{feature.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
