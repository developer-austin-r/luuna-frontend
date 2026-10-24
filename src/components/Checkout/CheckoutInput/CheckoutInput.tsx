import styles from "./CheckoutInput.module.css";

interface CheckoutInputProps {
  label: string;
  placeholder?: string;
  type?: string;
}

export default function CheckoutInput({
  label,
  placeholder,
  type = "text",
}: CheckoutInputProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} type={type} placeholder={placeholder} />
    </div>
  );
}
