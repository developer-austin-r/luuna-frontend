"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { type CartItemType, formatCartPrice } from "../cart-items";

import styles from "./CartItem.module.css";

interface CartItemProps {
  item: CartItemType;
  disabled: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

export default function CartItem({
  item,
  disabled,
  onIncrease,
  onDecrease,
  onDelete,
}: CartItemProps) {
  const { id, name, price, quantity, image, availableStock } = item;

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        {image && (
          <Image
            src={image}
            alt=""
            width={100}
            height={100}
            unoptimized
            className={styles.productImage}
          />
        )}
      </div>
      <div className={styles.info}>
        <h3>
          {availableStock > 0 ? (
            <Link href={`/products/${id}`}>{name}</Link>
          ) : (
            name
          )}
        </h3>
        {availableStock === 0 && <p>Currently unavailable</p>}
        {availableStock > 0 && availableStock < quantity && (
          <p>Only {availableStock} available</p>
        )}
        <strong>{formatCartPrice(price * quantity)}</strong>
      </div>
      <div className={styles.quantity}>
        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled || quantity <= 1 || availableStock === 0}
          aria-label={`Decrease quantity of ${name}`}
        >
          <Minus size={15} />
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled || quantity >= availableStock}
          aria-label={`Increase quantity of ${name}`}
        >
          <Plus size={15} />
        </button>
      </div>
      <button
        type="button"
        className={styles.delete}
        onClick={onDelete}
        disabled={disabled}
        aria-label={`Remove ${name} from cart`}
      >
        <Trash2 size={19} />
      </button>
    </div>
  );
}
