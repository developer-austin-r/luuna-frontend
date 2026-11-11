import Image from "next/image";
import Link from "next/link";

import styles from "./Footer.module.css";

const informationLinks = [
  { label: "About Us", href: "/about" },
  { label: "My Account", href: "/profile" },
  { label: "Contact Us", href: "mailto:luuna@gmail.com" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Replacement Policy", href: "/replacement-policy" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.welcome} aria-labelledby="footer-welcome">
        <div className={styles.welcomeCopy}>
          <h2 id="footer-welcome">
            Welcome to
            <br />
            LÚUNA
          </h2>
          <p>
            Discover unique Anime, Marvel, and DC products that blend elegance
            with a funky twist for every fan.
          </p>
          <Link href="#top-picks" className={styles.shopButton}>
            Shop
          </Link>
        </div>

        <div
          className={styles.gallery}
          aria-label="Luuna collection highlights"
        >
          <Image
            src="/images/wall_poster_image.png"
            alt="A fantasy collectible figure from the Luuna collection"
            width={1325}
            height={1187}
            sizes="(max-width: 600px) 44vw, 230px"
            loading="lazy"
          />
          <Image
            src="/images/car_truck_image.png"
            alt="An anime-inspired collector necklace"
            width={1254}
            height={1254}
            sizes="(max-width: 600px) 44vw, 230px"
            loading="lazy"
          />
        </div>
      </section>

      <div className={styles.footerContent}>
        <section className={styles.brandColumn} aria-labelledby="footer-brand">
          <div className={styles.brandTitle}>
            <h2 id="footer-brand">VIBRANCE</h2>
            <span className={styles.brandIcon}>
              <Image
                src="/images/ellipse.png"
                alt=""
                width={2122}
                height={741}
                sizes="34px"
              />
            </span>
          </div>
          <p>Discover our unique anime and superhero collection since 2024.</p>
          <p className={styles.followTitle}>Follow Us</p>
          <div className={styles.socialLinks} aria-label="Social media links">
            <a href="#facebook" aria-label="Facebook">
              f
            </a>
            <a href="#instagram" aria-label="Instagram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.8"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="#x"
              aria-label="X"
              style={{ height: "16px", width: "16px" }}
            >
              X
            </a>
            <a href="#whatsapp" aria-label="WhatsApp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.2-5.4A8.4 8.4 0 1 1 21 11.5Z" />
                <path d="M9 9a.8.8 0 0 1 1.3-.6l.8 1.2a.8.8 0 0 1-.1 1l-.5.5a6 6 0 0 0 2.4 2.4l.5-.5a.8.8 0 0 1 1-.1l1.2.8a.8.8 0 0 1-.6 1.3A6.8 6.8 0 0 1 9 9Z" />
              </svg>
            </a>
          </div>
        </section>

        <nav className={styles.footerColumn} aria-label="More information">
          <h2>NEED HELP</h2>
          {informationLinks.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.footerColumn} aria-label="Policies">
          <h2>MORE INFO</h2>
          {policyLinks.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>

        <section className={styles.support} aria-labelledby="footer-support">
          <h2 id="footer-support">SUPPORT</h2>
          <a href="tel:+916379736059">+91 63797 36059</a>
          <a href="tel:+919444116084">+91 94441 16084</a>
          <div
            className={styles.subscribe}
            role="group"
            aria-label="Email updates"
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
            />
            <button type="button" aria-label="Submit email">
              ➤
            </button>
          </div>
        </section>
      </div>

      <div className={styles.copyright}>
        All artworks posted on this website are intended as fan art, submitted
        by independent artists, and are not purported to be official.
      </div>
    </footer>
  );
}
