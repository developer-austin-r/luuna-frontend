"use client";

import { useState } from "react";

import CartItem from "@/components/Cart/CartItem/CartItem";
import CartProductCard from "@/components/Cart/CartProductCard/CartProductCard";
import CartSummary from "@/components/Cart/CartSummary/CartSummary";
import ProductSlider from "@/components/Cart/ProductSlider/ProductSlider";
import Footer from "@/components/landing/Footer/Footer";
import Navbar from "@/components/landing/Navbar/Navbar";

import styles from "./page.module.css";

interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ProductType {
  id: number;
  name: string;
  price: number;
  image: string;
}

/* =========================
   INITIAL CART PRODUCTS
========================= */

const initialCart: CartItemType[] = [
  {
    id: 1,
    name: "Toy",
    price: 24,
    quantity: 1,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 2,
    name: "Toy",
    price: 24,
    quantity: 1,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 3,
    name: "Toy",
    price: 24,
    quantity: 1,
    image: "/images/recommendation-toy.png",
  },
];

/* =========================
   PAIRS WELL WITH
========================= */

const pairProducts: ProductType[] = [
  {
    id: 101,
    name: "God of War bundle",
    price: 2500,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 102,
    name: "God of War bundle",
    price: 2500,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 103,
    name: "God of War bundle",
    price: 2500,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 104,
    name: "God of War bundle",
    price: 2500,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 105,
    name: "God of War bundle",
    price: 2500,
    image: "/images/recommendation-toy.png",
  },
  {
    id: 106,
    name: "God of War bundle",
    price: 2500,
    image: "/images/recommendation-toy.png",
  },
];

/* =========================
   ACCESSORIES
========================= */

const accessories: ProductType[] = [
  {
    id: 201,
    name: "Chain",
    price: 2500,
    image: "/images/chain.png",
  },
  {
    id: 202,
    name: "Chain",
    price: 2500,
    image: "/images/chain.png",
  },
  {
    id: 203,
    name: "Chain",
    price: 2500,
    image: "/images/chain.png",
  },
  {
    id: 204,
    name: "Chain",
    price: 2500,
    image: "/images/chain.png",
  },
  {
    id: 205,
    name: "Chain",
    price: 2500,
    image: "/images/chain.png",
  },
  {
    id: 206,
    name: "Chain",
    price: 2500,
    image: "/images/chain.png",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCart);

  /* =========================
     INCREASE
  ========================= */

  const increaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  /* =========================
     DECREASE
  ========================= */

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item,
      ),
    );
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (product: ProductType) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);

      if (existingProduct) {
        alert(`${product.name} quantity increased!`);

        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      alert(`${product.name} added to cart!`);

      return [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
        ...prevItems,
      ];
    });
  };

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <h1>← Your Shopping Cart</h1>

        {/* =====================
            CART
        ====================== */}

        <div className={styles.cartLayout}>
          <div className={styles.cartList}>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
                onIncrease={() => increaseQuantity(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}

            {cartItems.length === 0 && <p>Your cart is empty.</p>}
          </div>

          <CartSummary />
        </div>

        {/* =====================
            PAIRS WELL WITH
        ====================== */}

        <ProductSlider title="Pairs Well With...">
          {pairProducts.map((product) => (
            <CartProductCard
              key={product.id}
              name={product.name}
              oldPrice="₹3500"
              price={product.price}
              image={product.image}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </ProductSlider>

        {/* =====================
            ACCESSORIES
        ====================== */}

        <ProductSlider title="Accessories">
          {accessories.map((product) => (
            <CartProductCard
              key={product.id}
              name={product.name}
              oldPrice="₹3500"
              price={product.price}
              image={product.image}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </ProductSlider>
      </main>

      <Footer />
    </>
  );
}
