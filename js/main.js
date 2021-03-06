// instantiate war app object
const warApp = {
  deck: [],
  deckSuits: ['SPADES', 'DIAMONDS', 'CLUBS', 'HEARTS'],
  deckValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

  // empty array for when war is declared
  warCardPile: [],

  // player information
  player: {
    name: '',
    score: 0,
  },

  // computer information
  computer: {
    // array of possible computer names
    possibleNames: ['Gen. Harry Hearts', 'Col. Cora Clubs', 'Adm. Denise Diamonds', 'Maj. Steven Spades'],

    // array of possible computer taunts
    possiblePhrases: {
      win: [`Muahahahaha`, `Feel my wrath`, `You don't stand a chance`, `The end is near`, `Aren't you scared?`, `That must hurt`, `You should quit`, `Weakling`],
      lose: [`I'll be back`, `You're stronger than I thought`, `Dumb luck`, `I'll never give up`, `You call that a win?`, `You'll regret that`, `It's not over`, `You won't do that again`]}
  }
};

// init function for app
warApp.init = () => {
  // cache of jquery selectors that are to be called more than once
  // header inputs and modal
  warApp.nameInput = $('#header-about-form-input-name');
  warApp.nameSubmit = $('.header-about-form');
  warApp.headerModal = $('.header-modal');

  // player controls and info
  warApp.battleButton = $('.play-player-area-controls-buttons-battle');
  warApp.ceasefireButton = $('.play-player-area-controls-buttons-ceasefire');
  warApp.playerCountOutput = $('.play-player-area-controls-info-count-output');
  warApp.computerCountOutput = $('.play-computer-area-info-count-output');
  warApp.scoreOutput = $('.play-player-area-controls-info-score-output');

  // instructions
  warApp.instructionsButton = $('.instructions-button');
  warApp.instructionsFun = $('.instructions-text-fun');
  warApp.instructionsPlain = $('.instructions-text-plain');

  // play cards
  warApp.computerCardImageOutput = $('.computer-card');
  warApp.playerCardImageOutput = $('.player-card');
  warApp.cardReverseImage = $('.card-flip-reverse');
  warApp.cardForwardImage = $('.card-flip-forward');

  // playing field
  warApp.battleMessage = $('.play-battle-message-text');
  warApp.computerMessageOutput = $('.play-computer-area-info-message');
  warApp.playingField = $('.play');

  // konami modal
  warApp.konamiModal = $('.footer-konami');
  
  warApp.windowScroll();
  warApp.playerName();
  warApp.toggleRules();
  warApp.buildDeck();
  warApp.playCard();
  warApp.ceasefire();
  warApp.playAgain();
  warApp.konamiCode();

  // skip arrow
  $('.header-skip-arrow').on('click', function(){
    document.querySelector('#instructions').scrollIntoView({
      behavior: 'smooth'
    });
  })

  // instructions skip arrow
  $('.instructions-skip').on('click', function(){
    document.querySelector('#play').scrollIntoView({
      behavior: 'smooth'
    });
  })
}

// prevents the user from scrolling until their name is filled out
warApp.windowScroll = () => {
  // if the user refreshes the page mid game it does not lock the user to the screen unless at the top
  if (window.pageYOffset === 0) {
    $('body').css('overflow', 'hidden');
  }
}

// gets player name from input field
warApp.playerName = () => {
  warApp.nameSubmit.on('submit', (e) => {
    warApp.player.name = warApp.nameInput.val();

    // RegEx for validating name entry
    const re = /^[a-z.-]+$/i;    
    
    // test for valid user name
    if (re.test(warApp.player.name)){
      // update the UI
      // template literal used for instructions to add the space instead of in the HTML.  If the user refreshes the page without entering the name the space won't be visible in the HTML and will just say "General,...".
      $('.instructions-player-name').html(` ${warApp.player.name}`);
      $('.play-player-area-controls-info-name').html(warApp.player.name);

      // gets a random computer name
      warApp.computer.name = warApp.computer.possibleNames[Math.floor(Math.random() * warApp.computer.possibleNames.length)];

      // update UI with computer name
      $('.instructions-computer-name').html(warApp.computer.name);
      $('.play-computer-name').html(warApp.computer.name);

      // enable scroll and show skip arrow
      $('body').css('overflow', 'auto');
      $('.header-skip-arrow').fadeIn();
    } else {
      // clear the input field
      warApp.nameInput.val('');

      // display modal message
      warApp.headerModal.fadeIn();

      // click to close
      $('.header-modal-button').on('click', () => {
        warApp.headerModal.fadeOut()
      });
    }

    e.preventDefault();
  });
};

// toggles the rules and button text
warApp.toggleRules = () => {
  warApp.instructionsButton.on('click', (e) => {
    
    // toggle hiding and showing the instructions
    warApp.instructionsFun = $('.instructions-text-fun').toggleClass('instructions-hide');
    warApp.instructionsPlain = $('.instructions-text-plain').toggleClass('instructions-show');

    // change the text within the button
    (e.target.innerHTML === 'Standard Rules') ? e.target.innerHTML = 'Fun Rules' : e.target.innerHTML = 'Standard Rules';
  });
};

// build the deck from the cards in order by looping through each array and matchig up items
// reached stretch goal of calling Deck of Cards API but not included due to the API crashing the previous week. Code included in a seperate unlinked JS file - stretch.js
// https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
warApp.buildDeck = () => {
  warApp.deckSuits.forEach((suit) => {
    warApp.deckValues.forEach((value) => {
      // each card is an object with an associated suit, value and image
      card =  {
        suit: suit,
        value: value,
        image: `./assets/cards/${suit}${value}.png`
      };
      
      // push the card object onto the deck thereby creating a suited deck
      warApp.deck.push(card);
    });
  });

  warApp.shuffleDeck();
};

// function that randomizes the deck by changing location of array items
warApp.shuffleDeck = () => {
  let shuffleCount = 0;
  while(shuffleCount < 500) {
    // gets two random cards from the deck
    let locationOne = Math.floor(Math.random() * warApp.deck.length),
        locationTwo = Math.floor(Math.random() * warApp.deck.length),
        tempLocation = warApp.deck[locationOne];  
    
    // switch the locations of cards in the deck
    warApp.deck[locationOne] = warApp.deck[locationTwo];
    warApp.deck[locationTwo] = tempLocation;

    shuffleCount++;
  };

  warApp.dealCards();
};

// deal the cards by splicing the now shuffled deck array into two arrays
warApp.dealCards = () => {
  warApp.playerCardPile = warApp.deck.splice(0, 26)
  warApp.computerCardPile = warApp.deck;

  // count the cards
  warApp.cardCount();
};

// calls the battle function when the user plays a card
warApp.playCard = () => {
  warApp.battleButton.on('click', function (e) {
    warApp.battle();
  });
};

// battle function when playing cards
warApp.battle = () => {
  warApp.battleButton.attr('disabled', true).addClass('disabled');
  warApp.ceasefireButton.attr('disabled', true).addClass('disabled');

  // plays card from each deck
  const playerBattleCard = warApp.playerCardPile.shift(),
        computerBattleCard = warApp.computerCardPile.shift();

  // get the values of each card
  const playerBattleValue = playerBattleCard.value,
        computerBattleValue = computerBattleCard.value;

  // get the images of each card
  const playerBattleImage = playerBattleCard.image,
        computerBattleImage = computerBattleCard.image;

  // put the cards into the ui
  warApp.computerCardImageOutput.html(`<img src=${computerBattleImage}>`);
  warApp.playerCardImageOutput.html(`<img src=${playerBattleImage}>`);

  // rotates the cards to reveal values
  warApp.cardReverseImage.addClass('rotate');
  warApp.cardForwardImage.addClass('rotate');

  // time out to return the cards to normal position
  setTimeout(() => {
    warApp.cardReverseImage.removeClass('rotate');
    warApp.cardForwardImage.removeClass('rotate');
  }, 2000)

  // determines if the player wins or loses or war is to be declared
  if (playerBattleValue > computerBattleValue) {
    // show the win message
    setTimeout(() => {
      warApp.battleMessage.html('WIN').fadeIn();

      // gets a random taunt from the computer and outputs to UI
      warApp.computer.phrase = warApp.computer.possiblePhrases.lose[Math.floor(Math.random() * warApp.computer.possiblePhrases.lose.length)];
      warApp.computerMessageOutput.html(`"${warApp.computer.phrase}"`);
      
      setTimeout(() => {
        warApp.battleMessage.fadeOut()
        // enables buttons for play again
        warApp.battleButton.removeAttr('disabled').removeClass('disabled');
        warApp.ceasefireButton.removeAttr('disabled').removeClass('disabled');

        // adds the cards to the players pile
        warApp.playerCardPile = warApp.playerCardPile.concat([playerBattleCard, computerBattleCard]);

        // adds to the player's score based on the card values*5 the player collects
        warApp.player.score += (computerBattleValue * 5);

        // updates the UI score
        warApp.playerScore()

        // count the cards
        warApp.cardCount();
      }, 1000);
    }, 1500);

    // adds cards to the pile if war was declared and won
    if (warApp.warCardPile.length > 0) {
      warApp.playerCardPile = warApp.playerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // adds a score when the player wins a round of war
      warApp.player.score =+ 1500;

      // updates the UI score
      warApp.playerScore()

      // count the cards
      warApp.cardCount();

      // removes camo background 
      warApp.playingField.css('background', ``);
    }

  } else if (playerBattleValue < computerBattleValue) {
    // show the lose message
    setTimeout(() => {
      warApp.battleMessage.html('LOSE').fadeIn();

      // gets a random taunt from the computer and outputs to UI
      warApp.computer.phrase = warApp.computer.possiblePhrases.win[Math.floor(Math.random() * warApp.computer.possiblePhrases.win.length)];
      warApp.computerMessageOutput.html(`"${warApp.computer.phrase}"`);

      setTimeout(() => { 
        warApp.battleMessage.fadeOut() 
        // enables buttons for play again
        warApp.battleButton.removeAttr('disabled').removeClass('disabled');
        warApp.ceasefireButton.removeAttr('disabled').removeClass('disabled');

        // adds the cards to the computers pile and updates the count
        warApp.computerCardPile = warApp.computerCardPile.concat([playerBattleCard, computerBattleCard])
        warApp.cardCount();
      }, 1000);
    }, 1500);

    // adds cards to the pile if war was declared and won by the computer
    if (warApp.warCardPile.length > 0) {
      warApp.computerCardPile = warApp.computerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // count the cards
      warApp.cardCount();

      // removes camo background
      warApp.playingField.css('background', ``);
    }
  
  } else if (playerBattleValue === computerBattleValue) {
    // change the background of the playing field
    setTimeout(() => {
      warApp.playingField.css('background', `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('./assets/camo.jpg')`);
    }, 2800);

    // show the ui message
    setTimeout(() => {
      warApp.battleMessage.html('WAR').fadeIn();

      setTimeout(() => {
        warApp.battleMessage.fadeOut()

        // enables buttons for play again
        warApp.battleButton.removeAttr('disabled').removeClass('disabled');
        warApp.ceasefireButton.removeAttr('disabled').removeClass('disabled');
      }, 1000);
    }, 1500);

    // pushes the current played cards to the empty war array
    warApp.warCardPile.push(playerBattleCard);
    warApp.warCardPile.push(computerBattleCard);

    // splices off two extra cards off of each player and computer pile
    const playerRemoved = warApp.playerCardPile.splice(0, 2),
          computerRemoved = warApp.computerCardPile.splice(0, 2);

    // pushes the extra cards from either player/computer onto the war pile that either will win
    warApp.warCardPile = warApp.warCardPile.concat(playerRemoved, computerRemoved);
  };
};

// updates UI for card count
warApp.cardCount = () => {
  // count the number of cards for both players
  warApp.playerCardCount = warApp.playerCardPile.length;
  warApp.computerCardCount = warApp.computerCardPile.length;

  // updates the UI of forces remaining
  warApp.playerCountOutput.html(warApp.playerCardCount);
  warApp.computerCountOutput.html(warApp.computerCardCount);

  // determines if the player has won or lost
  warApp.determineWin();
};

warApp.playerScore = () => {
  //convert player score to string to add leading zeros
  warApp.playerScoreString = warApp.player.score.toString().padStart(6, '0');

  // update the UI
  warApp.scoreOutput.html(warApp.playerScoreString);
};

// determine if the player or computer has won and passes message to winning modal
warApp.determineWin = () => {
  if (warApp.playerCardCount >= 36) {
    warApp.gameMessage = `General, you have defeated the enemy forces. This is the best thing in life. To be able to crush your enemies, see them driven before you, and to hear the lamentation of the weak! We will rule the enemy nation with an iron fist and wipe out all others that oppose us.`

    warApp.gameModal(`VICTORY!`)

  } else if (warApp.playerCardCount <= 16) {
    warApp.gameMessage = `General, our forces have been depleted and you have lost many lives. You futile attempts to win have caused much suffering and grief. As a result of your failure, the highest powers have deemed that you are now demoted to the rank of Private.`

    warApp.gameModal(`DEFEAT!`)
  };
};

// modal appears when game ends with message
warApp.gameModal = (title) => {
  $('.play-modal').fadeIn();

  // disables buttons and greys them out so user can't play game
  warApp.battleButton.attr('disabled', true).addClass('disabled');
  warApp.ceasefireButton.attr('disabled', true).addClass('disabled');

  // displays the appropriate message and title
  $('.play-modal-title').html(title);
  $('.play-modal-message').html(warApp.gameMessage);
  $('.play-modal-score-output').html(warApp.playerScoreString);

};

// play again button that reloads the window object
warApp.playAgain = () => {
  $('.play-modal-button').on('click', () => {
    window.location.reload(true);
  });
}

// calls for ceasefire
warApp.ceasefire = () => {
  warApp.ceasefireButton.on('click', () => {
    warApp.gameMessage = `General, you've called a ceasefire and made peace. Our two nations will work together to rebuild and attempt to prevent the atrocitiy of war from happening again. Your brilliant negotation and steadfast resolution to peace will usher forth an englightment in the world.  As you know, there are truly no winners of war.`
    
    warApp.gameModal('CEASEFIRE');
  });
};

// https://stackoverflow.com/questions/31626852/how-to-add-konami-code-in-a-website-based-on-html
warApp.konamiCode = () => {
  // a key map of allowed keys
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b'
  };

  // the 'official' Konami Code sequence
  const konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

  // a variable to remember the 'position' the user has reached so far.
  let konamiCodePosition = 0;

  // add keydown event listener
  document.addEventListener('keydown', function (e) {
    // get the value of the key code from the key map
    let key = allowedKeys[e.keyCode];
    // get the value of the required key from the konami code
    let requiredKey = konamiCode[konamiCodePosition];

    // compare the key with the required key
    if (key == requiredKey) {
      // move to the next key in the konami code sequence
      konamiCodePosition++;
      // if the last key is reached, activate cheats
      if (konamiCodePosition == konamiCode.length) {
        warApp.runKonami();
        konamiCodePosition = 0;
      }
    } else {
      konamiCodePosition = 0;
    }
  });
}

// konami function
warApp.runKonami = () => {
  // show modal
  warApp.konamiModal.fadeIn();
  
  // close button 
  // there is a bug that the video will keep playing if it was already started but this is likely can't be controlled
  $('.footer-konami-close').on('click', () => {
    warApp.konamiModal.fadeOut();
  });
}

// document ready
$(function () {
  warApp.init();
});