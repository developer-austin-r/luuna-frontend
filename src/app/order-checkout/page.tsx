import CheckoutInput from "@/components/Checkout/CheckoutInput/CheckoutInput";
import CheckoutSection from "@/components/Checkout/CheckoutSection/CheckoutSection";
import OrderSummary from "@/components/Checkout/OrderSummary/OrderSummary";
import PaymentMethod from "@/components/Checkout/PaymentMethod/PaymentMethod";
import ShippingMethod from "@/components/Checkout/ShippingMethod/ShippingMethod";
import Footer from "@/components/landing/Footer/Footer";
import Navbar from "@/components/landing/Navbar/Navbar";

import styles from "./page.module.css";

export default function OrderCheckoutPage() {
  return (
    <>
      {/* Existing Navbar */}
      <Navbar />

      <main className={styles.page}>
        {/* Back Button */}
        <button type="button" className={styles.backButton}>
          ← Back to Cart
        </button>

        {/* Checkout Layout */}
        <div className={styles.checkoutLayout}>
          {/* LEFT SIDE */}
          <div className={styles.leftColumn}>
            {/* Shipping Address */}
            <CheckoutSection title="Shipping Address">
              {/* First Name / Last Name */}
              <div className={styles.twoColumn}>
                <CheckoutInput
                  label="First Name"
                  placeholder="Enter your First name"
                />
                <CheckoutInput
                  label="Last Name"
                  placeholder="Enter your Last Name"
                />
                <CheckoutInput
                  label="Mobile Number"
                  placeholder="Enter your Mobile Number"
                  type="tel"
                />
                <CheckoutInput
                  label="Email"
                  placeholder="Enter your mail"
                  type="email"
                />
              </div>

              {/* Delivery Address */}
              <div className={styles.addressRow}>
                <CheckoutInput
                  label="Delivery Address"
                  placeholder="Enter Your Address"
                />
              </div>

              {/* City / State / Pincode */}
              <div className={styles.locationRow}>
                <CheckoutInput label="City" placeholder="Enter Your City" />

                <div className={styles.selectField}>
                  <label>State</label>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select State
                    </option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    <option value="kerala">Kerala</option>
                    <option value="karnataka">Karnataka</option>
                  </select>
                </div>

                <CheckoutInput label="Pincode" placeholder="" />
              </div>
            </CheckoutSection>

            {/* Shipping Method */}
            <ShippingMethod />

            {/* Payment Method */}
            <PaymentMethod />
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.rightColumn}>
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
