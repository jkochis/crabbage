import styles from './styles/card.module.css';

export default function Card(props: { suit: string, type: string }) {
  return (
    <div className={styles.card}>
      <div className={[
        styles.cardSuit,
        styles[props.suit]]
        .join(' ')}
      >{props.suit}</div>
      <div className={styles.cardType}>{props.type}</div>
    </div >
  );
}
