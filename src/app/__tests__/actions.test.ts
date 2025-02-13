import { deal, calculatedScore } from '../lib/actions';
import { Card } from '../lib/types';

describe('deal', () => {
  test('should return a hand of 4 cards', () => {
    const result = deal();
    expect(result.hand).toHaveLength(4);
  });

  test('should return a cut card', () => {
    const result = deal();
    expect(result.cut).toBeDefined();
  });

  test('should return a score', () => {
    const result = deal();
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  test('should return cards with valid suits and types', () => {
    const result = deal();
    const validSuits = ["♠", "♣", "♥", "♦"];
    const validTypes = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];

    result.hand.forEach(card => {
      expect(validSuits).toContain(card.suit);
      expect(validTypes).toContain(card.type);
    });

    if (result.cut) {
      expect(validSuits).toContain(result.cut.suit);
      expect(validTypes).toContain(result.cut.type);
    }
  });

  test('should shuffle the deck', () => {
    const deck1 = deal().hand;
    const deck2 = deal().hand;
    expect(deck1).not.toEqual(deck2);
  });
});

describe('calculatedScore', () => {
  test('should return 0 for a hand with no matches', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "4" },
      { suit: "♦", type: "5" },
    ];
    const cut: Card = { suit: "♠", type: "5" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(0);
  });

  test('should return 2 for a hand with a 15', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "3" },
      { suit: "♦", type: "9" },
    ];
    const cut: Card = { suit: "♠", type: "k" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(2);
  });

  test('should return 2 for a hand with a pair', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "2" },
      { suit: "♦", type: "9" },
    ];
    const cut: Card = { suit: "♠", type: "k" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(2);
  });

  test('should return 6 for a hand with three of a kind', () => {
    const hand: Card[] = [
      { suit: "♠", type: "2" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "2" },
      { suit: "♦", type: "7" },
    ];
    const cut: Card = { suit: "♠", type: "k" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(6);
  });

  test('should return 12 for a hand with four of a kind', () => {
    const hand: Card[] = [
      { suit: "♠", type: "2" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "2" },
      { suit: "♦", type: "2" },
    ];
    const cut: Card = { suit: "♠", type: "k" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(12);
  });
});
