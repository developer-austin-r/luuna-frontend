"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/Cart/cart-items";
import CheckoutInput from "@/components/Checkout/CheckoutInput/CheckoutInput";
import CheckoutSection from "@/components/Checkout/CheckoutSection/CheckoutSection";
import OrderSummary from "@/components/Checkout/OrderSummary/OrderSummary";
import PaymentMethod from "@/components/Checkout/PaymentMethod/PaymentMethod";
import ShippingMethod, {
  shippingOptions,
} from "@/components/Checkout/ShippingMethod/ShippingMethod";
import { INDIAN_STATES } from "@/constants/indian-states";

import styles from "./page.module.css";
import fieldStyles from "@/components/Checkout/CheckoutInput/CheckoutInput.module.css";

export default function Checkout() {
  const [shipping, setShipping] = useState<(typeof shippingOptions)[number]>(
    shippingOptions[0],
  );
  const { cart, error, loading, reload } = useCart();

  return (
    <main className={styles.page} aria-label="Checkout">
      <Link href="/cart" className={styles.backButton}>
        <Image
          src="/images/checkout/back-arrow.svg"
          alt=""
          width={33}
          height={24}
          unoptimized
        />
        Back to Cart
      </Link>

      {loading && (
        <p role="status" className="text-white">
          Loading your cart…
        </p>
      )}
      {error && !loading && (
        <p role="alert" className="text-white">
          {error}{" "}
          <button type="button" onClick={reload} className="underline">
            Try again
          </button>
        </p>
      )}
      {cart && !loading && !error && (
        <>
          {cart.notices.length > 0 && (
            <ul
              aria-label="Cart adjustments"
              className="mb-4 list-inside list-disc text-white"
            >
              {cart.notices.map((notice, index) => (
                <li key={index}>{notice}</li>
              ))}
            </ul>
          )}
          {cart.items.length === 0 ? (
            <p className="text-white">
              Your cart is empty.{" "}
              <Link href="/products" className="underline">
                Browse products
              </Link>
            </p>
          ) : cart.items.some((item) => item.quantity > item.availableStock) ? (
            <p role="alert" className="text-white">
              Update or remove unavailable items from your cart before checkout.
            </p>
          ) : (
            <div className={styles.checkoutLayout}>
              <div className={styles.details}>
                <CheckoutSection title="Shipping Address">
                  <div className={styles.twoColumn}>
                    <CheckoutInput
                      label="First Name"
                      name="givenName"
                      autoComplete="given-name"
                      placeholder="First name"
                    />
                    <CheckoutInput
                      label="Last Name"
                      name="familyName"
                      autoComplete="family-name"
                      placeholder="Last name"
                    />
                    <CheckoutInput
                      label="Mobile Number"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone number"
                    />
                    <CheckoutInput
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                    />
                  </div>

                  <div className={styles.addressRow}>
                    <CheckoutInput
                      label="Delivery Address"
                      name="address"
                      autoComplete="street-address"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className={styles.locationRow}>
                    <CheckoutInput
                      label="City"
                      name="city"
                      autoComplete="address-level2"
                      placeholder="Enter your city"
                    />
                    <label className={fieldStyles.field}>
                      <span className={fieldStyles.label}>State</span>
                      <select
                        className={`${fieldStyles.input} ${styles.stateSelect}`}
                        name="state"
                        autoComplete="address-level1"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select State
                        </option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state}>{state}</option>
                        ))}
                      </select>
                    </label>
                    <CheckoutInput
                      label="Pincode"
                      name="pincode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                    />
                  </div>
                </CheckoutSection>

                <ShippingMethod selected={shipping} onSelect={setShipping} />
                <PaymentMethod />
              </div>
              <OrderSummary items={cart.items} shipping={shipping.price} />
            </div>
          )}
        </>
      )}
    </main>
  );
}
