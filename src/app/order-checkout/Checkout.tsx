"use client";

import { useEffect, useState } from "react";
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
import { CheckoutSkeleton } from "@/components/loading/StorefrontSkeletons";
import { INDIAN_STATES } from "@/constants/indian-states";

import { useCheckoutPayment } from "./use-checkout-payment";

import styles from "./page.module.css";
import fieldStyles from "@/components/Checkout/CheckoutInput/CheckoutInput.module.css";

export default function Checkout() {
  const [shipping, setShipping] = useState<(typeof shippingOptions)[number]>(
    shippingOptions[0],
  );
  const { cart, error, loading, reload } = useCart();
  const payment = useCheckoutPayment();
  const { paidOrder } = payment;
  const payable =
    cart?.items.reduce<number>(
      (total, item) => total + item.price * item.quantity + item.tax,
      shipping.price,
    ) ?? 0;

  useEffect(() => {
    if (paidOrder) void reload();
  }, [paidOrder, reload]);

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

      {paidOrder && (
        <div role="status" className="space-y-2 text-white">
          <p>Payment confirmed for order {paidOrder}.</p>
          <Link href="/profile/myorders" className="font-semibold underline">
            View my orders
          </Link>
        </div>
      )}
      {!paidOrder && payment.message && (
        <p role="status" className="mb-4 text-white">
          {payment.message}
        </p>
      )}
      {payment.needsLogin && (
        <Link
          href="/login?redirect=/order-checkout"
          className="mb-4 block text-white underline"
        >
          Sign in to checkout
        </Link>
      )}
      {payment.pendingPayment && (
        <button
          type="button"
          className="mb-4 rounded-lg bg-white px-4 py-2 text-black"
          disabled={payment.busy}
          onClick={() => void payment.checkStatus()}
        >
          Check payment status
        </button>
      )}
      {!paidOrder && loading && <CheckoutSkeleton />}
      {!paidOrder && error && !loading && (
        <p role="alert" className="text-white">
          {error}{" "}
          <button type="button" onClick={reload} className="underline">
            Try again
          </button>
        </p>
      )}
      {!paidOrder && cart && !loading && !error && (
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
            <form
              className={styles.checkoutLayout}
              onSubmit={(event) => {
                event.preventDefault();
                void payment.submit(
                  new FormData(event.currentTarget),
                  shipping.id,
                  Math.round(payable * 100),
                );
              }}
            >
              <fieldset
                className={styles.details}
                disabled={payment.busy || Boolean(payment.pendingPayment)}
              >
                <CheckoutSection title="Shipping Address">
                  <div className={styles.twoColumn}>
                    <CheckoutInput
                      label="First Name"
                      name="givenName"
                      required
                      maxLength={80}
                      autoComplete="given-name"
                      placeholder="First name"
                    />
                    <CheckoutInput
                      label="Last Name"
                      name="familyName"
                      required
                      maxLength={80}
                      autoComplete="family-name"
                      placeholder="Last name"
                    />
                    <CheckoutInput
                      label="Mobile Number"
                      name="phone"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      title="Enter a 10-digit Indian mobile number"
                      autoComplete="tel"
                      placeholder="Phone number"
                    />
                    <CheckoutInput
                      label="Email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email address"
                    />
                  </div>

                  <div className={styles.addressRow}>
                    <CheckoutInput
                      label="Delivery Address"
                      name="address"
                      required
                      maxLength={240}
                      autoComplete="street-address"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className={styles.locationRow}>
                    <CheckoutInput
                      label="City"
                      name="city"
                      required
                      maxLength={80}
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
                        required
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
                      required
                      pattern="[1-9][0-9]{5}"
                      title="Enter a six-digit Indian pincode"
                    />
                  </div>
                </CheckoutSection>

                <ShippingMethod selected={shipping} onSelect={setShipping} />
                <PaymentMethod />
              </fieldset>
              <OrderSummary
                items={cart.items}
                shipping={shipping.price}
                busy={payment.busy}
                disabled={Boolean(payment.pendingPayment) || payment.needsLogin}
              />
            </form>
          )}
        </>
      )}
    </main>
  );
}
