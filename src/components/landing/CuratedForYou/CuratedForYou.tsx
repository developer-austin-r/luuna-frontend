import Link from "next/link";

import CollectibleFigure from "@/components/landing/CollectibleFigure";

import styles from "./CuratedForYou.module.css";

export default function CuratedForYou() {
  return (
    <section className={styles.section} aria-labelledby="curated-title">
      <div className={styles.banner}>
        <div className={styles.topBubble}>
          <h2 id="curated-title">CURATED ?</h2>
        </div>
        <CollectibleFigure
          className={`${styles.character} ${styles.leftCharacter}`}
          variant="sunburst"
        />
        <div className={styles.storyBubble}>
          <p>The best loot all in one box, Captain!</p>
        </div>
        <CollectibleFigure
          className={`${styles.character} ${styles.rightCharacter}`}
          variant="ninja"
        />
        <Link className={styles.cta} href="#new-arrivals">
          EXPLORE
          <br />
          NOW!
        </Link>
        <span className={styles.sparkleOne} aria-hidden="true">
          ✦
        </span>
        <span className={styles.sparkleTwo} aria-hidden="true">
          ✧
        </span>
      </div>
    </section>
  );
}
