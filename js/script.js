//Game
let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Q', 'K', 'J', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'Q': 10, 'K': 10, 'J': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCards();
        console.log(card);
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);

    }
}

//function to select the cards randomly 
function randomCards() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}


//function to show the cards
function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
    }
}

function blackjackDeal() {
    if (blackjackGame['turnOver'] === true) {

        blackjackGame['isStand'] = false;

        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');

        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';

        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnOver'] = false;

    }

}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        // if adding 11 keeps the player below 21, add 11 otherwise add 1
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }

    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'black';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

//function 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//function for stand
async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 18 && blackjackGame['isStand'] === true) {
        let card = randomCards();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjackGame['turnOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// compute winner and return who just won
//update, wins ,losses and draws
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        // if
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;

        }
        // 
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;

        //
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }

    console.log('Winner is', winner);
    return winner;

}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnOver'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';

        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'black';

        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You tied!';
            messageColor = 'white';

        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;

    }


}