type Card = {
    suit: string;
    type: string;
};

const deal = (): { hand: Card[], cut: Card | undefined } => {
    const suits = ["♠", "♣", "♥", "♦"];
    const types = [
        "ace",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "jack",
        "queen",
        "king"
    ];
    // create a deck of cards
    let deck: Card[] = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < types.length; j++) {
            deck.push({ suit: suits[i], type: types[j] });
        }
    }
    // shuffle the deck
    deck.sort(() => Math.random() - 0.5);
    // deal the cards
    let hand: Card[] = [];
    for (let i = 0; i < 4; i++) {
        hand.push(deck.pop() as Card);
    }
    // cut the deck
    let cut: Card | undefined = deck.pop();
    // sort the hand
    hand.sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type));

    return { hand, cut };
};
