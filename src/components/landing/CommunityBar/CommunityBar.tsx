import styles from "./CommunityBar.module.css";

export default function CommunityBar() {
  return (
    <section className={styles.communityBar}>
      <div className={styles.communityContent}>
        {/* Follow the journey */}
        <div className={styles.followSection}>
          <p>FOLLOW THE JOURNEY</p>

          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="Instagram">
              ◎
            </a>

            <a href="#" aria-label="WhatsApp">
              ◉
            </a>
          </div>
        </div>

        {/* Join community */}
        <div className={styles.joinSection}>
          <span>JOIN THE COMMUNITY</span>

          <button className={styles.arrowButton} aria-label="Join community">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
