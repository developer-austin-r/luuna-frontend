import { ShoppingCart } from "lucide-react";

import styles from "./CartProductCard.module.css";

interface CartProductCardProps {
  name: string;
  oldPrice: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

export default function CartProductCard({
  name,
  oldPrice,
  price,
  image,
  onAddToCart,
}: CartProductCardProps) {
  return (
    <article className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.discount}>-20%</span>
        <img src={image} alt="" className={styles.productImage} />

        <div className={styles.details}>
          <h3>{name}</h3>

          <p>
            <del>{oldPrice}</del>
            <strong>₹{price}</strong>
          </p>
        </div>
      </div>

      <button type="button" className={styles.addButton} onClick={onAddToCart}>
        <ShoppingCart size={15} />
        Add to Cart
      </button>
    </article>
  );
}
