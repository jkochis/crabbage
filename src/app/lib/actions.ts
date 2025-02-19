import { run } from "node:test";
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
export function deal(): { hand: Card[], cut: Card | undefined, score: number } {
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
  return { hand, cut, score };
};
// return the point value of each card
export function getCardPointValues(cards: Card[]) {
  return cards.map(card => {
    if (card.type === "a") {
      return 1;
    } else if (card.type === "j" || card.type === "q" || card.type === "k") {
      return 10;
    } else {
      return parseInt(card.type);
    }
  })
};
// return the numeric order of the cards in the hand sorted
export function getCardOrder(cards: Card[]) {
  return cards.map(card => {
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
  }).sort((a, b) => a - b);
};
// Used to find 15s
// count the number of ways to sum to target
export function countCombinations(arr: number[], target: number): number {
  let count = 0;
  function backtrack(index: number, currentSum: number) {
    if (index === arr.length) {
      if (currentSum === target) {
        count++;
      }
      return;
    }
    // Include the current element
    backtrack(index + 1, currentSum + arr[index]);
    // Exclude the current element
    backtrack(index + 1, currentSum);
  }
  backtrack(0, 0);
  return count;
}
// count the number of times each element appears in the array
export function countElements(arr: number[] | string[]): { [key: string]: number } {
  const counts: { [key: string]: number } = {};

  for (const element of arr) {
    counts[element] = (counts[element] || 0) + 1;
  }

  return counts;
}
// Used to find runs
// check for multiple runs in cardRunValues
// a run is worth its length
// use the index of the elements in the run to create a signature of the run
// so 2, 3, 3, 3, 4  would be ['014','024','034']
export function calculateRuns(cardRunValues: number[]): number[] {
  let runSignature = "";
  const runs = cardRunValues.map((value, index) => {
    runSignature = "";
    for (let i = index; i < cardRunValues.length; i++) {
      if (runSignature.length === 0) {
        // start the runSignature
        runSignature += i.toString();
        continue;
      } else if (value === cardRunValues[i + 1]) {
        // if the next card is the same as the current card
        continue;
      } else if (value + 1 === cardRunValues[i + 1]) {
        // if the next card is the next in the run
        runSignature += i.toString();
        continue;
      } else {
        // if the next card is not in the run
        runSignature += i.toString();
        break;
      }
    }
    console.log(runSignature);
    return runSignature.length;
  }).filter(run => run > 2);
  return runs;
}
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
  const cardPointValues = getCardPointValues(cards);
  const cardOrder = getCardOrder(cards).sort((a, b) => a - b);

  let score = 0;
  // check for 15s
  const fifteens = countCombinations(cardPointValues, 15);
  score += fifteens * 2;

  // check for pairs, three of a kind, and four of a kind
  const kinds = countElements(cardOrder);
  for (const count of Object.values(kinds)) {
    if (count === 2) {
      score += 2;
    } else if (count === 3) {
      score += 6;
    } else if (count === 4) {
      score += 12;
    }
  }
  // check for flushes of the same suit
  // flush of 4 can only come from hand
  // flush of 5 can come from hand and cut
  const handSuits = countElements(hand.map(card => card.suit));
  for (const count of Object.values(handSuits)) {
    if (count === 4) {
      score += 4;
    }
  }
  const handAndCutSuits = countElements(cards.map(card => card.suit));
  for (const count of Object.values(handAndCutSuits)) {
    if (count === 5) {
      score += 5;
    }
  }

  // check for runs
  const cardRunValues = cardOrder;
  const runs = calculateRuns(cardRunValues.sort((a, b) => a - b));
  score += runs.reduce((acc, run) => acc + run, 0);

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
