"use client";

import Link from "next/link";

import { useCart } from "@/components/Cart/cart-items";
import CartItem from "@/components/Cart/CartItem/CartItem";
import CartSummary from "@/components/Cart/CartSummary/CartSummary";
import Footer from "@/components/landing/Footer/Footer";
import Navbar from "@/components/landing/Navbar/Navbar";
import { CartSkeleton } from "@/components/loading/StorefrontSkeletons";
import { removeCartItem, setCartItemQuantity } from "@/services/cart";

import styles from "./page.module.css";

export default function CartPage() {
  const { cart, error, loading, updating, reload, update } = useCart();

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <h1>Your Shopping Cart</h1>
        {loading && <CartSkeleton />}
        {error && !loading && (
          <p role="alert" className="mb-4">
            {error}{" "}
            <button type="button" onClick={reload} className="underline">
              Refresh cart
            </button>
          </p>
        )}
        {!loading && cart && (
          <>
            {cart.notices.length > 0 && (
              <ul
                className="mb-4 list-inside list-disc"
                aria-label="Cart adjustments"
              >
                {cart.notices.map((notice, index) => (
                  <li key={index}>{notice}</li>
                ))}
              </ul>
            )}
            {cart.items.length === 0 ? (
              <p>
                Your cart is empty.{" "}
                <Link href="/products" className="underline">
                  Browse products
                </Link>
              </p>
            ) : (
              <div className={styles.cartLayout}>
                <div className={styles.cartList}>
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      disabled={updating}
                      onIncrease={() =>
                        void update(() =>
                          setCartItemQuantity(item.id, item.quantity + 1),
                        )
                      }
                      onDecrease={() =>
                        void update(() =>
                          setCartItemQuantity(
                            item.id,
                            Math.min(item.availableStock, item.quantity - 1),
                          ),
                        )
                      }
                      onDelete={() =>
                        void update(() => removeCartItem(item.id))
                      }
                    />
                  ))}
                </div>
                <CartSummary items={cart.items} />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
