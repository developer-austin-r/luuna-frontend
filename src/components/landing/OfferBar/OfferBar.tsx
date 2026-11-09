import styles from "./OfferBar.module.css";

const offers = Array.from({ length: 10 }, () => "10% OFF!");

function OfferGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.offerGroup} aria-hidden={hidden}>
      {offers.map((offer, index) => (
        <span key={`${index}-${offer}`}>{offer}</span>
      ))}
    </div>
  );
}

export default function OfferBar() {
  return (
    <div className={styles.offerBar} aria-label="10% off selected offers">
      <div className={styles.offerTrack}>
        <OfferGroup />
        <OfferGroup hidden />
      </div>
    </div>
  );
}
