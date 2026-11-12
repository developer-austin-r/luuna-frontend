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
            src="/images/recommendation-toy.png"
            alt="A fantasy collectible figure from the Luuna collection"
            width={1325}
            height={1187}
            sizes="(max-width: 600px) 44vw, 230px"
            loading="lazy"
          />
          <Image
            src="/images/chain.png"
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
                src="/images/luuna.png"
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
              ◎
            </a>
            <a href="#x" aria-label="X">
              X
            </a>
            <a href="#whatsapp" aria-label="WhatsApp">
              ◉
            </a>
          </div>
        </section>

        <nav className={styles.footerColumn} aria-label="More information">
          <h2>MORE INFO</h2>
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
