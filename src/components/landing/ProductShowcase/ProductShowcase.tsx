import styles from "./ProductShowcase.module.css";

const products = [
  {
    id: 1,
    name: "Classic Oversized T-Shirt",
    price: "₹799",
    oldPrice: "₹1,199",
    discount: "33% OFF",
    rating: "4.8",
  },
  {
    id: 2,
    name: "Premium Graphic T-Shirt",
    price: "₹899",
    oldPrice: "₹1,299",
    discount: "31% OFF",
    rating: "4.7",
  },
  {
    id: 3,
    name: "Anime Printed T-Shirt",
    price: "₹749",
    oldPrice: "₹1,099",
    discount: "32% OFF",
    rating: "4.9",
  },
  {
    id: 4,
    name: "Minimal Streetwear T-Shirt",
    price: "₹849",
    oldPrice: "₹1,199",
    discount: "29% OFF",
    rating: "4.8",
  },
];

export default function ProductShowcase() {
  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleBar}></span>

          <h2>Product Showcase</h2>
        </div>

        <a href="#" className={styles.viewAll}>
          View All Products <span>→</span>
        </a>
      </div>

      {/* Products */}
      <div className={styles.productGrid}>
        {products.map((product) => (
          <article className={styles.productCard} key={product.id}>
            {/* Image */}
            <div className={styles.imageWrapper}>
              <span className={styles.discount}>{product.discount}</span>

              <div className={styles.imagePlaceholder}>Product Image</div>
            </div>

            {/* Details */}
            <div className={styles.productDetails}>
              <h3>{product.name}</h3>

              <div className={styles.rating}>
                <span>★</span>
                <strong>{product.rating}</strong>
                <small>Rating</small>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>{product.price}</span>

                <span className={styles.oldPrice}>{product.oldPrice}</span>
              </div>

              <button className={styles.cartButton}>Add to Cart</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
