import { deal, getCardPointValues, getCardOrder, countCombinations, calculateRuns, countElements, calculatedScore } from '../lib/actions';
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

describe('getCardPointValues', () => {
  test('should return [1, 2, 3, 4] for [a, 2, 3, 4]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "3" },
      { suit: "♦", type: "4" },
    ];
    expect(getCardPointValues(hand)).toEqual([1, 2, 3, 4]);
  });

  test('should return [1, 10, 10, 10] for [a, j, q, k]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "j" },
      { suit: "♥", type: "q" },
      { suit: "♦", type: "k" },
    ];
    expect(getCardPointValues(hand)).toEqual([1, 10, 10, 10]);
  });
});

describe('getCardOrder', () => {
  test('should return [2, 3, 4, 5] for [2, 3, 4, 5]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "2" },
      { suit: "♣", type: "3" },
      { suit: "♥", type: "4" },
      { suit: "♦", type: "5" },
    ];
    expect(getCardOrder(hand)).toEqual([2, 3, 4, 5]);
  });

  test('should return [2, 3, 3, 4] for [2, 3, 3, 4]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "2" },
      { suit: "♣", type: "3" },
      { suit: "♥", type: "3" },
      { suit: "♦", type: "4" },
    ];
    expect(getCardOrder(hand)).toEqual([2, 3, 3, 4]);
  });

  test('should return [2, 2, 2, 2] for [2, 2, 2, 2]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "2" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "2" },
      { suit: "♦", type: "2" },
    ];
    expect(getCardOrder(hand)).toEqual([2, 2, 2, 2]);
  });

  test('should return [1, 1, 1, 1] for [a, a, a, a]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "a" },
      { suit: "♥", type: "a" },
      { suit: "♦", type: "a" },
    ];
    expect(getCardOrder(hand)).toEqual([1, 1, 1, 1]);
  });
  test('should return [1, 11, 12, 13] for [a, j, q, k]', () => {
    const hand: Card[] = [
      { suit: "♠", type: "a" },
      { suit: "♣", type: "j" },
      { suit: "♥", type: "q" },
      { suit: "♦", type: "k" },
    ];
    expect(getCardOrder(hand)).toEqual([1, 11, 12, 13]);
  });
});

describe('countCombinations', () => {
  test('should return 1 for [7, 8] => 15', () => {
    expect(countCombinations([7, 8], 15)).toBe(1);
  });
  test('should return 2 for [7, 8, 8] => 15', () => {
    expect(countCombinations([7, 8, 8], 15)).toBe(2);
  });
  test('should return 4 for [7, 8, 8, 7] => 15', () => {
    expect(countCombinations([7, 8, 8, 7], 15)).toBe(4);
  });
  test('should return 3 for [6, 7, 8, 8, 9] => 15', () => {
    expect(countCombinations([6, 7, 8, 8, 9], 15)).toBe(3);
  });
});

describe('calculateRuns', () => {
  test('should return [4, 4] for [2, 3, 3, 4, 5]', () => {
    expect(calculateRuns([2, 4, 3, 5, 3])).toEqual([4, 4]);
  });

  test('should return [3, 3, 3] for [2, 3, 3, 3, 4]', () => {
    expect(calculateRuns([2, 3, 3, 3, 4])).toEqual([3, 3, 3]);
  });

  test('should return [5] for [2, 3, 4, 5, 6]', () => {
    expect(calculateRuns([2, 3, 4, 5, 6])).toEqual([5]);
  });

  test('should return [] for an empty array', () => {
    expect(calculateRuns([])).toEqual([]);
  });

  test('should return [] for an array with no runs', () => {
    expect(calculateRuns([1, 3, 5, 7, 9])).toEqual([]);
  });
});

describe('countElements', () => {
  test('should return { 2: 3, 3: 2 } for [2, 2, 2, 3, 3]', () => {
    expect(countElements([2, 2, 2, 3, 3])).toEqual({ 2: 3, 3: 2 });
  });

  test('should return { 2: 4 } for [2, 2, 2, 2]', () => {
    expect(countElements([2, 2, 2, 2])).toEqual({ 2: 4 });
  });

  test('should return { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 } for [1, 2, 3, 4, 5]', () => {
    expect(countElements([1, 2, 3, 4, 5])).toEqual({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 });
  });

  test('should return {} for an empty array', () => {
    expect(countElements([])).toEqual({});
  });
});

describe('calculatedScore', () => {
  test('should return 0 for a hand with no matches', () => {
    const hand: Card[] = [
      { suit: "♠", type: "j" },
      { suit: "♣", type: "2" },
      { suit: "♥", type: "4" },
      { suit: "♦", type: "6" },
    ];
    const cut: Card = { suit: "♥", type: "10" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(0);
  });

  test('should return 2 for a hand with a 15', () => {
    const hand: Card[] = [
      { suit: "♠", type: "7" },
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
    const cut: Card = { suit: "♠", type: "8" };
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

describe('Madison score bugs', () => {
  test('Why 9?', () => {
    const hand: Card[] = [
      { suit: "♣", type: "a" },
      { suit: "♦", type: "2" },
      { suit: "♦", type: "4" },
      { suit: "♠", type: "5" },
    ];
    const cut: Card = { suit: "♣", type: "2" };
    const score = calculatedScore(hand, cut);
    expect(score).toBe(2);
  })
});
