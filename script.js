let dealerHand = [];
let playerHand = [];
let wins = 0;
let losses = 0;
let balance = 100;
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function updateBalance() {
    document.getElementById('coins').innerHTML = balance;
}

updateBalance();

function deal() {

    let betAmount = parseInt(document.getElementById('bet').value);

    if (isNaN(betAmount) || betAmount < 1 || betAmount > balance) {
        alert("Please enter a valid bet amount between 10 and your current balance.");
        return;
    }

    balance -= betAmount;
    updateBalance();

    let deck = getDeck();
    shuffle(deck);

    dealerHand = [deck.pop(), deck.pop()];
    playerHand = [deck.pop(), deck.pop()];

    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;

    displayHand(dealerHand, 'dealer-hand');
    displayHand(playerHand, 'player-hand');
    document.getElementById('message').innerHTML = '';
}

function hit() {
    let deck = getDeck();
    shuffle(deck);
    playerHand.push(deck.pop());

    displayHand(playerHand, 'player-hand');
    if (getScore(playerHand) >= 21) {
        endGame();
    }
}

function stand() {
    endGame();
}

function displayHand(hand, elementId, hideDealerCard = true) {
    let handHtml = '';
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];

        // Hide the dealer's second card
        if (hideDealerCard && elementId === 'dealer-hand' && i === 1) {
            handHtml += `<div class="card hidden-card">???</div>`;
        } else {
            handHtml += `<div class="card">${card.value} of ${card.suit}</div>`;
        }
    }
    document.getElementById(elementId).innerHTML = handHtml;
}

function revealDealerCard() {
    let hiddenCard = dealerHand[1];
    let hiddenCardElement = document.querySelector('.hidden-card');

    if (hiddenCard && hiddenCardElement) {
        hiddenCardElement.innerHTML = `${hiddenCard.value} of ${hiddenCard.suit}`;
    }
}

function endGame() {
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;

    let deck = getDeck();
    shuffle(deck);
    
    let dealerScore = getScore(dealerHand);
    
    revealDealerCard();

    // Dealer hits if score is below 17
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = getScore(dealerHand);
        displayHand(dealerHand, 'dealer-hand', false);
    }

    const playerScore = getScore(playerHand);

    let betAmount = parseInt(document.getElementById('bet').value);
    let message;
    if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
        message = 'You lost!';
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        message = 'You won!';
        balance += betAmount * 2; // You win double the bet amount
    } else {
        message = 'It\'s a tie!';
        balance += betAmount; // You get your bet back in case of a tie
    }
    updateBalance();

    document.getElementById('message').innerHTML = message;

    document.getElementById('wins').innerHTML = wins;
    document.getElementById('losses').innerHTML = losses;
}


function getScore(hand) {
    let score = 0;
    let hasAce = false;

    for (let card of hand) {
        if (card.value === 'A') {
            hasAce = true;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value, 10);
        }
    }

    if (hasAce && score > 21) {
        score -= 10;
    }
    return score;
}

function tipDealer() {
    if (balance >= 99) {
        balance -= 99;
        updateBalance();
        alert("You've tipped the dealer 99 coins!");
    } else {
        alert("Your broke ass can't tip the dealer!");
    }
}

