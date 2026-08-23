import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand / Subscribe */}
        <div className={styles.brandColumn}>
          <div className={styles.logo}>LUUNA</div>

          <h3>Subscribe</h3>

          <p>Get 10% off your first order</p>

          <form className={styles.subscribeForm}>
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
            />

            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </form>
        </div>

        {/* Support */}
        <div className={styles.column}>
          <h3>Support</h3>

          <p>ChennaiChennai</p>
          <p>ChennaiChennai</p>
          <p className={styles.space}>luuna@gmail.com</p>
          <p>+00000-00000</p>
        </div>

        {/* Account */}
        <div className={styles.column}>
          <h3>Account</h3>

          <a href="#">My Account</a>
          <a href="#">Login / Register</a>
          <a href="#">Cart</a>
          <a href="#">Wishlist</a>
          <a href="#">Shop</a>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h3>Quick Link</h3>

          <a href="#">Privacy Policy</a>
          <a href="#">Terms Of Use</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>

        {/* Social */}
        <div className={styles.column}>
          <h3>Follow Us</h3>

          <div className={styles.socialLinks}>
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

      {/* Bottom line */}
      <div className={styles.bottomLine}>
        <p>© 2026 Luuna. All rights reserved.</p>
      </div>
    </footer>
  );
}
