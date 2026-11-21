"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import CheckoutSection from "../CheckoutSection/CheckoutSection";

import styles from "./PaymentMethod.module.css";

const methods = ["Credit Card", "Debit Card", "UPI"] as const;

export default function PaymentMethod() {
  const [paymentType, setPaymentType] =
    useState<(typeof methods)[number]>("Credit Card");

  return (
    <CheckoutSection title="Payment Method">
      <div
        className={styles.paymentTabs}
        role="radiogroup"
        aria-label="Payment method"
      >
        {methods.map((method) => (
          <label className={styles.tab} key={method}>
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentType === method}
              onChange={() => setPaymentType(method)}
            />
            {method === "UPI" ? (
              <Image
                src="/images/checkout/upi.svg"
                alt="UPI"
                width={66}
                height={18}
                unoptimized
              />
            ) : (
              <>
                <Image
                  src={
                    method === "Credit Card"
                      ? "/images/checkout/credit-card.svg"
                      : "/images/checkout/debit-card.svg"
                  }
                  alt=""
                  width={method === "Credit Card" ? 20 : 19}
                  height={method === "Credit Card" ? 16 : 18}
                  unoptimized
                />
                {method}
              </>
            )}
          </label>
        ))}
      </div>

      <div className={styles.paymentDetails}>
        <ShieldCheck aria-hidden="true" size={24} />
        <div>
          <p>
            {paymentType === "UPI"
              ? "Pay with UPI"
              : `Pay by ${paymentType.toLowerCase()}`}
          </p>
          <span>
            Payment details are entered in Razorpay’s secure checkout when
            online ordering is available.
          </span>
        </div>
      </div>
    </CheckoutSection>
  );
}
