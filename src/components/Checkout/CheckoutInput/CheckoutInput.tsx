import type { ComponentPropsWithoutRef } from "react";

import styles from "./CheckoutInput.module.css";

interface CheckoutInputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
}

export default function CheckoutInput({
  label,
  ...inputProps
}: CheckoutInputProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} {...inputProps} />
    </label>
  );
}
