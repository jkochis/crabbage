import { Card } from "./types";
const suits = ["♠", "♣", "♥", "♦"];
const types = [
  "a",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "j",
  "q",
  "k"
];
export const deal = (): { hand: Card[], cut: Card | undefined, score: number } => {
  // create a deck of cards
  const deck: Card[] = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < types.length; j++) {
      deck.push({ suit: suits[i], type: types[j] });
    }
  }
  // shuffle the deck
  deck.sort(() => Math.random() - 0.5);
  // split deck in half and zip together twice
  const shuffled = zip(deck.slice(0, 26), deck.slice(26)).flat();
  // deal the cards
  const hand: Card[] = [];
  for (let i = 0; i < 4; i++) {
    hand.push(shuffled.pop() as Card);
  }
  // cut card from random spot near middle of shuffled deck and remove from deck
  const cut: Card = shuffled[Math.floor(Math.random() * 10) + 23];
  shuffled.splice(shuffled.indexOf(cut), 1);
  // sort the hand
  hand.sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type));
  const score = calculatedScore(hand, cut);
  console.debug('Dealing: ', hand, cut, shuffled, score);
  return { hand, cut, score };
};

export function calculatedScore(hand: Card[], cut: Card): number {
  // face cards are worth 10
  // aces are worth 1
  // all other cards are worth their face value
  // 15s are worth 2 points
  // pairs are worth 2 points
  // three of a kind is worth 6 points
  // four of a kind is worth 12 points
  // a run of three is worth 3 points
  // a run of four is worth 4 points
  // a run of five is worth 5 points
  const cards = [...hand, cut];
  const cardPointValues = cards.map(card => {
    if (card.type === "a") {
      return 1;
    } else if (card.type === "j" || card.type === "q" || card.type === "k") {
      return 10;
    } else {
      return parseInt(card.type);
    }
  });
  const cardRunValues = cards.map(card => {
    switch (card.type) {
      case "a":
        return 1;
      case "j":
        return 11;
      case "q":
        return 12;
      case "k":
        return 13;
      default:
        return parseInt(card.type);
    }
  });
  let score = 0;
  // check for 15s
  // see how may ways we can add the cardValues to get 15
  for (let i = 0; i < cards.length; i++) {
    let total = cardPointValues[i];
    if (total === 15) {
      score += 2;
    }
    for (let j = i + 1; j < cards.length; j++) {
      total += cardPointValues[j];
      if (total === 15) {
        score += 2;
      }
      for (let k = j + 1; k < cards.length; k++) {
        total += cardPointValues[k];
        if (total === 15) {
          score += 2;
        }
        for (let l = k + 1; l < cards.length; l++) {
          total += cardPointValues[l];
          if (total === 15) {
            score += 2;
          }
          total -= cardPointValues[l];
        }
        total -= cardPointValues[k];
      }
      total -= cardPointValues[j];
    }
  }
  // check for pairs, three of a kind, and four of a kind
  for (let i = 0; i < cards.length; i++) {
    let total = 0;
    for (let j = i; j < cards.length; j++) {
      if (cards[i].type === cards[j].type) {
        total++;
      }
    }
    if (total === 2) {
      score += 2;
    } else if (total === 3) {
      score += 6;
    } else if (total === 4) {
      score += 12;
    }
  }
  // check for flushes of the same suit
  for (let i = 0; i < cards.length; i++) {
    let total = 0;
    for (let j = i; j < cards.length; j++) {
      if (cards[i].suit === cards[j].suit) {
        total++;
      }
    }
    if (total === 4) {
      score += 4;
    } else if (total === 5) {
      score += 5;
    }
  }
  // check for multiple runs in cardRunValues
  for (let i = 0; i < cardRunValues.length; i++) {
    let total = 0;
    for (let j = i; j < cardRunValues.length; j++) {
      if (cardRunValues[i] + j - i === cardRunValues[j]) {
        total++;
      }
    }
    if (total === 3) {
      score += 3;
    } else if (total === 4) {
      score += 4;
    } else if (total === 5) {
      score += 5;
    }
  }
  // check for his nobs
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].type === "j" && hand[i].suit === cut.suit) {
      score++;
    }
  }
  return score;
}

type ZipResult<T> = T[];

function zip<T>(...arrays: T[][]): T[] {
  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result: ZipResult<T>[] = [];

  for (let i = 0; i < minLength; i++) {
    const tuple = arrays.map(arr => arr[i]) as ZipResult<T>;
    result.push(tuple);
  }

  return result.flat();
}
