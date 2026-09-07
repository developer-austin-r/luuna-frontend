import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Subscribe */}
        <div className={styles.subscribe}>
          <div className={styles.logo}>LUUNA</div>

          <h3>Subscribe</h3>

          <p>Get 10% off your first order</p>

          <div className={styles.subscribeBox}>
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
            />

            <button type="button" aria-label="Subscribe">
              ➤
            </button>
          </div>
        </div>

        {/* Support */}
        <div className={styles.footerColumn}>
          <h3>Support</h3>

          <p>ChennaiChennai</p>
          <p>ChennaiChennai</p>

          <div className={styles.columnSpace}>
            <p>luuna@gmail.com</p>
            <p>+00000-00000</p>
          </div>
        </div>

        {/* Account */}
        <div className={styles.footerColumn}>
          <h3>Account</h3>

          <a href="#">My Account</a>
          <a href="#">Login / Register</a>
          <a href="#">Cart</a>
          <a href="#">Wishlist</a>
          <a href="#">Shop</a>
        </div>

        {/* Quick Link */}
        <div className={styles.footerColumn}>
          <h3>Quick Link</h3>

          <a href="#">Privacy Policy</a>
          <a href="#">Terms Of Use</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>

        {/* Follow Us */}
        <div className={styles.footerColumn}>
          <h3>Follow Us</h3>

          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="Twitter">
              𝕏
            </a>

            <a href="#" aria-label="Instagram">
              ◎
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © Copyright Luuna 2026. All right reserved
      </div>
    </footer>
  );
}
