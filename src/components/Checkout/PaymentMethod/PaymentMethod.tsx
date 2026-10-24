"use client";

import { useState } from "react";

import styles from "./PaymentMethod.module.css";

type PaymentType = "credit" | "debit" | "upi";

export default function PaymentMethod() {
  const [paymentType, setPaymentType] = useState<PaymentType>("credit");

  return (
    <section className={styles.section}>
      {/* Heading */}
      <div className={styles.heading}>
        <span className={styles.headingBar}></span>
        <h2>Payment Method</h2>
      </div>

      {/* Tabs */}
      <div className={styles.paymentTabs}>
        <button
          type="button"
          onClick={() => setPaymentType("credit")}
          className={`${styles.tab} ${paymentType === "credit" ? styles.activeTab : ""}`}
        >
          ▣ Credit Card
        </button>

        <button
          type="button"
          onClick={() => setPaymentType("debit")}
          className={`${styles.tab} ${paymentType === "debit" ? styles.activeTab : ""}`}
        >
          ▣ Debit Card
        </button>

        <button
          type="button"
          onClick={() => setPaymentType("upi")}
          className={`${styles.tab} ${paymentType === "upi" ? styles.activeTab : ""}`}
        >
          UPI
        </button>
      </div>

      {/* Credit Card */}
      {paymentType === "credit" && (
        <div className={styles.cardForm}>
          <div className={styles.field}>
            <label>Card Number</label>
            <input type="text" placeholder="0000 0000 0000 0000" />
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.field}>
              <label>Expiration Date</label>
              <input type="text" placeholder="MM/YY" />
            </div>

            <div className={styles.field}>
              <label>CVV</label>
              <input type="password" placeholder="***" />
            </div>
          </div>
        </div>
      )}

      {/* Debit Card */}
      {paymentType === "debit" && (
        <div className={styles.cardForm}>
          <div className={styles.field}>
            <label>Debit Card Number</label>
            <input type="text" placeholder="0000 0000 0000 0000" />
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.field}>
              <label>Expiration Date</label>
              <input type="text" placeholder="MM/YY" />
            </div>

            <div className={styles.field}>
              <label>CVV</label>
              <input type="password" placeholder="***" />
            </div>
          </div>
        </div>
      )}

      {/* UPI */}
      {paymentType === "upi" && (
        <div className={styles.upiForm}>
          <label>UPI ID</label>

          <div className={styles.upiInputRow}>
            <input type="text" placeholder="Enter your UPI ID" />
            <button type="button">Verify</button>
          </div>

          <div className={styles.upiApps}>
            <div className={styles.gpay}>G Pay</div>
            <div className={styles.phonepe}>PhonePe</div>
            <div className={styles.paytm}>Paytm</div>
          </div>
        </div>
      )}
    </section>
  );
}
