import { type ReactNode } from "react";

import styles from "./CheckoutSection.module.css";

interface CheckoutSectionProps {
  title: string;
  children: ReactNode;
}

export default function CheckoutSection({
  title,
  children,
}: CheckoutSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span className={styles.headingBar}></span>

        <h2>{title}</h2>
      </div>

      <div className={styles.content}>{children}</div>
    </section>
  );
}
