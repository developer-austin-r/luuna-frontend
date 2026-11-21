import { ShieldCheck } from "lucide-react";

import CheckoutSection from "../CheckoutSection/CheckoutSection";

import styles from "./PaymentMethod.module.css";

export default function PaymentMethod() {
  return (
    <CheckoutSection title="Payment Method">
      <div className={styles.paymentDetails}>
        <ShieldCheck aria-hidden="true" size={24} />
        <div>
          <p>Pay securely with Razorpay</p>
          <span>
            Choose an available payment method when Razorpay Checkout opens.
          </span>
        </div>
      </div>
    </CheckoutSection>
  );
}
