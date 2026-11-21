import { formatCartPrice } from "@/components/Cart/cart-items";

import CheckoutSection from "../CheckoutSection/CheckoutSection";

import styles from "./ShippingMethod.module.css";

export const shippingOptions = [
  { id: "standard", name: "Standard Courier", days: "5–7 Days", price: 50 },
  { id: "fast", name: "Fast Courier", days: "1–2 Days", price: 100 },
] as const;

type ShippingOption = (typeof shippingOptions)[number];

export default function ShippingMethod({
  selected,
  onSelect,
}: {
  selected: ShippingOption;
  onSelect: (option: ShippingOption) => void;
}) {
  return (
    <CheckoutSection title="Shipping Method">
      <div
        className={styles.options}
        role="radiogroup"
        aria-label="Shipping method"
      >
        {shippingOptions.map((option) => (
          <label className={styles.optionCard} key={option.id}>
            <input
              type="radio"
              name="shippingMethod"
              value={option.id}
              checked={selected.id === option.id}
              onChange={() => onSelect(option)}
            />
            <span>
              <strong>{option.name}</strong>
              <small>{option.days}</small>
            </span>
            <span>{formatCartPrice(option.price)}</span>
          </label>
        ))}
      </div>
    </CheckoutSection>
  );
}
