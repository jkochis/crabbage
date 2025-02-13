"use client";
import Card from "./card";
import type { Card as CardType } from "./lib/types";
import styles from './styles/hand.module.css';
export default function Hand({ hand }: Readonly<{ hand: CardType[] }>) {
  return (
    <div className={styles.hand}>
      {hand.map((card, index) => (
        <Card key={index} suit={card.suit} type={card.type} />
      ))}
    </div>
  );
}
