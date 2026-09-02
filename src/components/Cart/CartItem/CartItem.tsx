"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import styles from "./CartItem.module.css";

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
  image: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

export default function CartItem({
  name,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onDelete,
}: CartItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <img src={image} alt={name} className={styles.productImage} />
      </div>

      <div className={styles.info}>
        <h3>{name}</h3>
        <p>Variant: Large / Brown</p>
        <strong>₹{(price * quantity).toFixed(2)}</strong>
      </div>

      <div className={styles.quantity}>
        <button
          type="button"
          onClick={onDecrease}
          disabled={quantity === 1}
          aria-label="Decrease quantity"
        >
          <Minus size={15} />
        </button>

        <span>{quantity}</span>

        <button
          type="button"
          onClick={onIncrease}
          aria-label="Increase quantity"
        >
          <Plus size={15} />
        </button>
      </div>

      <button
        type="button"
        className={styles.delete}
        onClick={onDelete}
        aria-label="Delete product"
      >
        <Trash2 size={19} />
      </button>
    </div>
  );
}
