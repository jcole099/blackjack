/*==========================================*/
/*          GLOBAL VARIABLES                 */
/*==========================================*/

var shuffledCard, theIndex;
var dealerHand = [];
var playerHand = [];
var deck = [];
var suits;
var p = 'p';
var d = 'd';
var playerTurnOver = false;
var playerHandValue = 0;
var playerHandValueOr = 0;
var playerHand2Value = 0;
var playerHand2ValueOr = 0;
var dealerHandValue = 0;
var dealerHandValueOr = 0;
var blackjack = false;
var bank = 150;
var wager = 10;
var originalWager = 0;
var playerBusts = false;
var doubleDownAvailable = true;
var doubleDownActive = false;

/*==========================================*/
/*          GAME INITIALIZATION             */
/*==========================================*/
disableButton('hit');
disableButton('stand');
disableButton('double');
fixArrows('disablebottom');

/*==========================================*/
/*          END SCREEN                 */
/*==========================================*/
function gameOver() {
    document.querySelector('.gameoverText').textContent = "GAME OVER";
    document.querySelector('.gameover').style.animationName = "gameoverscreen";
    document.querySelector('.gameover').style.backgroundColor = "rgba(80, 0, 0, 0.95)";
    setTimeout(showgameoverbox, 1500);
}
function showgameoverbox() {
    document.querySelector('.gameoverBox').style.visibility = "visible";
}
function gameWon() {
    document.querySelector('.gameoverText').textContent = "RENT MONEY ACQUIRED!";
    document.querySelector('.gameover').style.animationName = "gameoverscreen";
    document.querySelector('.gameover').style.backgroundColor = "rgba(0, 80, 12, 0.95)";
    setTimeout(showgameoverbox, 1500);
}

document.querySelector('#newgame').addEventListener('click', function() {
    document.querySelector('.gameover').style.animationName = "";
    document.querySelector('.gameoverBox').style.visibility = "hidden";
    hideMsg();
    bank = 150;
    wager = 10;
    document.querySelector('#wager').textContent = wager;
    document.querySelector('#bank').textContent = bank;
    fixArrows('disablebottom');
    
    
    
    for (var i = 1; i <= 20; i++) {
        if (i < 3) {
            document.querySelector('#player-card-' + i).style.display = "inline-block";
            document.querySelector('#dealer-card-' + i).style.display = "inline-block";
            document.querySelector('#dealer-card-' + i).src = "img/zcard_back.png";
            document.querySelector('#player-card-' + i).src = "img/zcard_back.png";
        } else {
            document.querySelector('#player-card-' + i).style.display = "none";
            document.querySelector('#dealer-card-' + i).style.display = "none";
        }

        document.querySelector('#player-card-' + i).style.position = "static";
        document.querySelector('#dealer-card-' + i).style.position = "static";
        document.querySelector('#player-card-' + i).style.left = 0;
        document.querySelector('#dealer-card-' + i).style.left = 0;
        document.querySelector('#player-card-' + i).style.right = 0;
        document.querySelector('#dealer-card-' + i).style.right = 0;
    }
    document.querySelector('.dealer-card-area').style.textAlign = "center";
    document.querySelector('.player-card-area').style.textAlign = "center";
})

    


/*==========================================*/
/*          CONTROL BUTTONS                */
/*==========================================*/
document.querySelector('#deal').addEventListener('click', function() {
    if (wager <= (bank / 2)) {
        doubleDownAvailable = true;
    } else {
        doubleDownAvailable = false;
    } 
    newGame();
    
});

document.querySelector('#hit').addEventListener('click', function() {
    disableButton('double');
    dealCard(p); 
    updateScores();
});

document.querySelector('#stand').addEventListener('click', function() {
    dealerTurn();
});

document.querySelector('#double').addEventListener('click', function() {
    doubleDown();
});





document.querySelector('.up-arrow').addEventListener('click', function() {
    if (wager < bank) {
        wager += 10;
        document.querySelector('#wager').textContent = wager;
    }
    if (wager === bank) {
        document.querySelector('.up-arrow').classList.add('disable-arrow-top');
    }
    if (wager === 20) {
        document.querySelector('.down-arrow').classList.remove('disable-arrow-bottom'); 
    }

    
    
        
});
document.querySelector('.down-arrow').addEventListener('click', function() {
    if (wager >= 20) {
        wager -= 10;
        document.querySelector('#wager').textContent = wager;
    }
    if (wager === 10) {
        document.querySelector('.down-arrow').classList.add('disable-arrow-bottom');   
    }
    if (wager < bank) {
        document.querySelector('.up-arrow').classList.remove('disable-arrow-top'); 
    }
    
});

/*==========================================*/
/*          FIX ARROWS             */
/*==========================================*/
function fixArrows(subprocedure) {
    if (subprocedure == 'disableall') {
        document.querySelector('.down-arrow').classList.remove('disable-arrow-bottom');
        document.querySelector('.up-arrow').classList.remove('disable-arrow-top');
        document.querySelector('.down-arrow').classList.add('disable-arrow-bottom');
        document.querySelector('.up-arrow').classList.add('disable-arrow-top');  
    }
    if (subprocedure == 'enableall') {
        document.querySelector('.down-arrow').classList.remove('disable-arrow-bottom');
        document.querySelector('.up-arrow').classList.remove('disable-arrow-top');  
    }
    if (subprocedure == 'disablebottom') {
        document.querySelector('.down-arrow').classList.remove('disable-arrow-bottom');
        document.querySelector('.up-arrow').classList.remove('disable-arrow-top');
        document.querySelector('.down-arrow').classList.add('disable-arrow-bottom');  
    }
    if (subprocedure == 'disabletop') {
        document.querySelector('.down-arrow').classList.remove('disable-arrow-bottom');
        document.querySelector('.up-arrow').classList.remove('disable-arrow-top');
        document.querySelector('.up-arrow').classList.add('disable-arrow-top');  
    }

    if (subprocedure == 'dealerwins') {
        if (bank === 0) {
           gameOver();
        }
        if (bank < wager) {
            wager = bank;
            document.querySelector('#wager').textContent = wager;
            fixArrows('disabletop');
            if (wager === 10) {
                fixArrows('disableall');
            }
        } else if (bank === wager) {
            fixArrows('disabletop');
        } else if (wager === 10) {
            fixArrows('disablebottom');

        } else {
            fixArrows('enableall');
        }
    }
    if (subprocedure == 'playerwins') {
        bank += (wager * 2);
        document.querySelector('#bank').textContent = bank;
        fixArrows('enableall');
        if (wager === 10) {
            fixArrows('disablebottom');
        }
        if (bank >= 1200) {
            gameWon();
        }
    }
    if (subprocedure == 'blackjack') {
        bank += (wager * 2) + (wager * 0.5);
        document.querySelector('#bank').textContent = bank;
        fixArrows('enableall');
        if (wager === 10) {
            fixArrows('disablebottom');
        }
        if (bank >= 1200) {
            gameWon();
        }
    }
    if (subprocedure == 'push') {
        bank += wager;
        document.querySelector('#bank').textContent = bank;
        fixArrows('enableall');
        if (wager === 10) {
            fixArrows('disablebottom');
        } else if (wager === bank) {
            fixArrows('disabletop');
        }
    }

}

/*==========================================*/
/*          NEW GAME                       */
/*==========================================*/
function newGame() {
    fixArrows('disableall');
    playerBusts = false;
    playerTurnOver = false;
    for (var i = 1; i <= 20; i++) {
        if (i < 3) {
            document.querySelector('#player-card-' + i).style.display = "inline-block";
            document.querySelector('#dealer-card-' + i).style.display = "inline-block";
        } else {
            document.querySelector('#player-card-' + i).style.display = "none";
            document.querySelector('#dealer-card-' + i).style.display = "none";
        }

        document.querySelector('#player-card-' + i).style.position = "static";
        document.querySelector('#dealer-card-' + i).style.position = "static";
        document.querySelector('#player-card-' + i).style.left = 0;
        document.querySelector('#dealer-card-' + i).style.left = 0;
        document.querySelector('#player-card-' + i).style.right = 0;
        document.querySelector('#dealer-card-' + i).style.right = 0;
    }
    
    document.querySelector('.dealer-card-area').style.textAlign = "center";
    document.querySelector('.player-card-area').style.textAlign = "center";
    document.querySelector('#dealer-card-2').src = "img/zcard_back.png";
    dealerHand = [];
    playerHand = [];
    hideMsg();
    if (deck.length < 312 / 2) {
        getNewShoe();
    } else {
        console.log("Current shoe size: " + deck.length);
    }
    dealHands();
    updateScores();
}
/*==========================================*/
/*          DEAL HANDS                 */
/*==========================================*/


function dealHands() {
    playerHand.push(deck[0]);
    deck.shift();
    dealerHand.push(deck[0]);
    deck.shift();
    playerHand.push(deck[0]);
    deck.shift();
    
    
    document.querySelector('#dealer-card-1').src = translateCard(dealerHand[0]);
    document.querySelector('#player-card-1').src = translateCard(playerHand[0]);
    document.querySelector('#player-card-2').src = translateCard(playerHand[1]);
    disableButton('deal');
    bank -= wager;
    document.querySelector('#bank').textContent = bank;
};

/*==========================================*/
/*   UPDATE SCORES                            */
/*==========================================*/

function updateScores() {
    var aceOccured = false;
    dealerHandValue = 0;
    playerHandValue = 0;
    dealerHandValueOr = 0;
    playerHandValueOr = 0;
    
/*=================================DEALER============================*/  
    var i = 0;
    while (i < dealerHand.length) {
        if (dealerHand[i][0] > 10) {
            dealerHandValue += 10;
            dealerHandValueOr += 10;
            i++;  
        } else if (dealerHand[i][0] == 1 && aceOccured === false) {
            dealerHandValue += 1;
            dealerHandValueOr += 11;
            aceOccured = true; //to prevent 2 or more aces from added additional 11 values to hand
            i++;  
        } else {
            dealerHandValue += dealerHand[i][0];
            dealerHandValueOr += dealerHand[i][0];
            i++;
        }
    }
    if (dealerHandValue > 21) {
        dealerBustsMsg();
        document.querySelector('#dealer-score').textContent = dealerHandValue;
    } else {
        if (dealerHandValue != dealerHandValueOr) {
            if (dealerHandValueOr <= 21) {
                if (dealerHandValueOr == 0) {
                    document.querySelector('#dealer-score').textContent = dealerHandValue;
                } else {
                    document.querySelector('#dealer-score').textContent = dealerHandValue + " or " + dealerHandValueOr;
                }
            } else {
                 
            }

        } else {
            document.querySelector('#dealer-score').textContent = dealerHandValue;
        }
    }
    

    
/*=================================PLAYER============================*/  
    if (playerTurnOver == false) {
        var j = 0;
        while (j < playerHand.length) {
            if (playerHand[j][0] > 10) {
                playerHandValue += 10;
                playerHandValueOr += 10;
                j++;  
            } else if (playerHand[j][0] == 1 && aceOccured === false) {
                playerHandValueOr += 11;
                playerHandValue += 1;
                aceOccured = true;
                j++;  
            } else {
                playerHandValueOr += playerHand[j][0];
                playerHandValue += playerHand[j][0];
                j++;
            }
        };
        if (playerHandValue > 21) {
            playerBustsMsg();
            disableButton('hit');
            disableButton('stand');
            disableButton('double');
            enableButton('deal');
            document.querySelector('#player-score').textContent = playerHandValue;
            fixArrows('dealerwins');
            playerBusts = true; //used to stop the game while DOUBLE DOWN function is active
        } else {
            if (playerHandValue != playerHandValueOr) {
                if (playerHandValueOr <= 21) {
                    document.querySelector('#player-score').textContent = playerHandValue + " or " + playerHandValueOr;
                } else {
                    document.querySelector('#player-score').textContent = playerHandValue;
                }

            } else {
                document.querySelector('#player-score').textContent = playerHandValue;
            }
        }
    }
    if (playerHand.length == 2) { // blackjack logic ##############################################
        if (playerHandValueOr == 21) {
            if (dealerHandValueOr === 10 || dealerHandValueOr === 11) {
                dealCard(d);
/*                if (dealerHandValueOr === 11) {
                    if dealerHand[1][0] 
                }*/
                if (dealerHand[1][0] >= 10) {
                    dealerHandValueOr += 10;
                } else if (dealerHand[1][0] == 1) {
                    if (dealerHandValueOr === 11) {
                        dealerHandValueOr += 1
                    } else {
                        dealerHandValueOr += 11;
                    }   
                } else {
                    dealerHandValueOr += dealerHand[1][0];
                }
                if (dealerHandValueOr === 21) {
                    //DEALER ALSO HAS A NATURAL
                    document.querySelector('#dealer-score').textContent = dealerHandValueOr;
                    pushMsg();
                    disableButton('hit');
                    disableButton('stand');
                    disableButton('double');
                    enableButton('deal');
                    fixArrows('push');
                } else {
                    blackjackMsg();
                    playerHandValue = 21;
                    document.querySelector('#player-score').textContent = playerHandValue;
                    document.querySelector('#dealer-score').textContent = dealerHandValueOr;
                    disableButton('hit');
                    disableButton('stand');
                    disableButton('double');
                    enableButton('deal');
                    fixArrows('blackjack'); 
                }
            
            } else {
                blackjackMsg();
                playerHandValue = 21;
                document.querySelector('#player-score').textContent = playerHandValue;
                disableButton('hit');
                disableButton('stand');
                disableButton('double');
                enableButton('deal');
                fixArrows('blackjack'); 
            }
        } else {
            enableButton('hit');
            enableButton('stand');
            if (doubleDownAvailable === true) {
                enableButton('double');
            } else {
                disableButton('double');
            }
        }
    } else {
        if (playerHandValue == 21 || playerHandValueOr == 21) { // automatically starts dealer's turn if player score is 21 ======================================================================
        
            playerHandValue = 21;
            document.querySelector('#player-score').textContent = playerHandValue;
            if (doubleDownActive === false) { //prevents dealer turn from being called twice. It is already being called in the double down function.
                dealerTurn();
            }
            
        }
    }
}


/*==========================================*/
/*         GET NEW SHOE                  */
/*==========================================*/
function getNewShoe() {
    deck = [];
    generateShoe();
    shuffle();
}

/*==========================================*/
/*          SHOE GENERATOR                  */
/*==========================================*/

function generateShoe() {
    for (var j = 0; j < 6; j++) {
        for (var k = 0; k < 4; k++) { //generates a full deck
            switch (k) { 
                case 0:
                    suits = "hearts";
                    break;
                case 1:
                    suits = "spades";
                    break;
                case 2:
                    suits = "diamonds";
                    break;
                case 3:
                    suits = "clubs";
                    break;
            }
            for (var i = 1; i < 14; i++) { //generates each 13 cards of a suit
                deck.push([i, suits]);
            }
        }
    }
}


/*==========================================*/
/*          SHUFFLE                         */
/*==========================================*/
function shuffle() {
    for (var s = 0; s < 1000; s++) {
        theIndex = Math.floor(Math.random() * 312);
        shuffledCard = deck[theIndex];
        deck.push(shuffledCard);
        deck.splice(theIndex, 1);
    }
};

/*==========================================*/
/*          DEAL CARD                         */
/*==========================================*/

function dealCard(whoseCard) {       
    
    if (whoseCard === 'p') {
        playerHand.push(deck[0]);
        deck.shift();
        document.querySelector('#player-card-' + playerHand.length).src = translateCard(playerHand[playerHand.length - 1]);
        if (playerHand.length > 3) {
            document.querySelector('.player-card-area').style.textAlign = "left";
            for (var i = 2; i <= playerHand.length; i++){
                if (i != playerHand.length) {
                    document.querySelector('#player-card-' + i).style.display = "inline-block";
                    document.querySelector('#player-card-' + i).style.position = "absolute";
                    document.querySelector('#player-card-' + i).style.left = ((i * 15) - 15) + "px";
                } else {
                    document.querySelector('#player-card-' + i).style.display = "inline-block";
                    document.querySelector('#player-card-' + i).style.position = "absolute";
                    document.querySelector('#player-card-' + i).style.left = "160px";
                }
            }   
        } else {
            document.querySelector('#player-card-3').style.display = "inline-block";
        }
    } 
    
    if (whoseCard === 'd') {
        dealerHand.push(deck[0]);
        deck.shift();
        document.querySelector('#dealer-card-' + dealerHand.length).src = translateCard(dealerHand[dealerHand.length - 1]); //assigns correct picture to card
        if (dealerHand.length > 2) { //helps stop third card from appearing too soon
            if (dealerHand.length > 3) {
                document.querySelector('.dealer-card-area').style.textAlign = "left";
                for (var j = 2; j <= dealerHand.length; j++){
                    if (j != dealerHand.length) {
                        document.querySelector('#dealer-card-' + j).style.display = "inline-block";
                        document.querySelector('#dealer-card-' + j).style.position = "absolute";
                        document.querySelector('#dealer-card-' + j).style.left = ((j * 15) - 15) + "px";
                    } else {
                        document.querySelector('#dealer-card-' + j).style.display = "inline-block";
                        document.querySelector('#dealer-card-' + j).style.position = "absolute";
                        document.querySelector('#dealer-card-' + j).style.left = "160px";
                    }
                }   
            } else {
                document.querySelector('#dealer-card-3').style.display = "inline-block";
            } 
        }
    }
};

/*==========================================*/
/*   TRANSLATE ARRAY VALUE TO FILENAME       */
/*==========================================*/

function translateCard(theCard) {
    var fileName;
    
    if (theCard[0] == 1 ) {
        fileName = "img/ace_of_" + theCard[1] + '.png';
    } else if (theCard[0] == 11) {
        fileName = "img/jack_of_" + theCard[1] + '.png';
    } else if (theCard[0] == 12) {
        fileName = "img/queen_of_" + theCard[1] + '.png';
    } else if (theCard[0] == 13) {
        fileName = "img/king_of_" + theCard[1] + '.png';
    } else {
        fileName = "img/" + theCard[0] + "_of_" + theCard[1] + ".png";
    }
    return fileName;  
};
    
/*==========================================*/
/*      DEALER'S TURN                     */
/*==========================================*/

function dealerTurn() {
    var playerFinalScore = 0;
    var dealerStands = false;
    playerTurnOver = true; //prevents messing with the player score in fn updatescores
    
    if (playerHandValue <= 21 && playerHandValueOr <= 21) { //assigns the higher score in the event that an ace is present
        playerHandValue = playerHandValueOr;
        document.querySelector('#player-score').textContent = playerHandValue;
    };
    playerFinalScore = playerHandValue; //uses this variable because the updatescores fn resets playerhandvalue (because playerTurnOver switch is turned on which prevents the player score from receiving an update)
    
    while (dealerHandValue <= 21 || dealerHandValueOr <= 21) {
        
        if (dealerHandValueOr <= 21 && dealerHandValueOr >= 18) {
            dealerHandValue = dealerHandValueOr;
            document.querySelector('#dealer-score').textContent = dealerHandValue;
            dealerStands = true;
            break;
        }
        if (dealerStands === false) {
            if (dealerHandValue <= 21 && dealerHandValue >= 17) {
                document.querySelector('#dealer-score').textContent = dealerHandValue;
                dealerStands = true;
                break;
            }
        }
        dealCard(d); 
        updateScores();
    }
    
    if (dealerStands == false) {
        dealerBustsMsg();
        disableButton('hit');
        disableButton('stand');
        disableButton('double');
        enableButton('deal');
         fixArrows('playerwins');
    }
    
    if (dealerStands == true) {
        if (playerFinalScore == dealerHandValue) {
            pushMsg();
            disableButton('hit');
            disableButton('stand');
            disableButton('double');
            enableButton('deal');
            fixArrows('push');
        } else if (playerFinalScore > dealerHandValue) {
            playerWinsMsg();
            disableButton('hit');
            disableButton('stand');
            disableButton('double');
            enableButton('deal');
            fixArrows('playerwins');
        } else if (playerFinalScore < dealerHandValue) {
            dealerWinsMsg();
            disableButton('hit');
            disableButton('stand');
            disableButton('double');
            enableButton('deal');
            fixArrows('dealerwins');
        }
    }
};

/*==========================================*/
/*          DISABLE BUTTON                   */
/*==========================================*/
function disableButton(buttonID) {
    document.querySelector('#' + buttonID).classList.add('disabled');

}

/*==========================================*/
/*          ENABLE BUTTON                  */
/*==========================================*/
function enableButton(buttonID) {
    document.querySelector('#' + buttonID).classList.remove('disabled');

}

/*==========================================*/
/*   DOUBLE DOWN                          */
/*==========================================*/
function doubleDown() {
    doubleDownActive = true;
    originalWager = wager;
    bank -= wager;
    wager *= 2;
    
    document.querySelector('#wager').textContent = wager;
    document.querySelector('#bank').textContent = bank;
    disableButton('hit');
    disableButton('stand');
    disableButton('double');
    dealCard(p);
    updateScores();
    if (playerBusts === false) {
        dealerTurn();
    }
    wager = originalWager;
    document.querySelector('#wager').textContent = wager;
    if (wager === 10) {
        fixArrows('disablebottom');
    }
    doubleDownActive = false;
}

/*==========================================*/
/*   END OF GAME MSGS                       */
/*==========================================*/
function playerBustsMsg() {
    document.querySelector('.the-message').innerHTML = "PLAYER BUSTS";
    document.querySelector('.game-message').style.display = "block";
    document.querySelector('.game-message').style.background = "rgb(255,0,0, 0.85)";
    document.querySelector('.game-message').style.visibility = "visible";
}

function dealerWinsMsg() {
    document.querySelector('.the-message').innerHTML = "DEALER WINS";
    document.querySelector('.game-message').style.display = "block";
    document.querySelector('.game-message').style.background = "rgb(255,0,0, 0.85)";
    document.querySelector('.game-message').style.visibility = "visible";
}

function dealerBustsMsg() {
    document.querySelector('.the-message').innerHTML = "DEALER BUSTS!";
    document.querySelector('.game-message').style.display = "block";
    document.querySelector('.game-message').style.background = "rgb(0,255,0, 0.85)";
    document.querySelector('.game-message').style.visibility = "visible";
}

function playerWinsMsg() {
    document.querySelector('.the-message').innerHTML = "PLAYER WINS!";
    document.querySelector('.game-message').style.display = "block";
    document.querySelector('.game-message').style.background = "rgb(0,255,0, 0.85)";
    document.querySelector('.game-message').style.visibility = "visible";
}

function blackjackMsg() {
    document.querySelector('.the-message').innerHTML = "BLACK JACK!";
    document.querySelector('.game-message').style.display = "block";
    document.querySelector('.game-message').style.background = "rgb(0,255,0, 0.85)";
    document.querySelector('.game-message').style.visibility = "visible";
}

function pushMsg() {
    document.querySelector('.the-message').innerHTML = "PUSH";
    document.querySelector('.game-message').style.display = "block";
    document.querySelector('.game-message').style.background = "rgba(165, 165, 165, 0.83)";
    document.querySelector('.game-message').style.visibility = "visible";
}

function hideMsg() {
    document.querySelector('.game-message').style.visibility = "hidden";
}