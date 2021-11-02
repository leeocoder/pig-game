'use strict';
class PigGame {
  #scoreWinner;
  #players;
  #isPLaying;
  constructor(scoreWinner) {
    this.#scoreWinner = scoreWinner;
    this.#isPLaying = true;
    this.#initGame();
    this.#queryElements();
    this.#actionsGames();
  }
  #queryElements() {
    this.dice = document.querySelector('.dice');
    this.buttonRollDice = document.querySelector('.btn--roll');
    this.buttonHoldDice = document.querySelector('.btn--hold');
    this.buttonNewGame = document.querySelector('.btn--new');
  }
  #actionsGames() {
    this.buttonRollDice.addEventListener('click', this.#rollDice.bind(this));
    this.buttonNewGame.addEventListener('click', this.#newGame.bind(this));
    //prettier-ignore
    this.buttonHoldDice.addEventListener('click', this.#holdScoreDice.bind(this));
  }
  #rollDice() {
    if (!this.#isPLaying) return;
    const currentPlayer = this.#players.currentPlayer;
    const dice = Math.floor(Math.random() * 6) + 1;
    this.dice.src = `./dice-${dice}.png`;

    if (dice === 1) {
      // console.log(this.#players[currentPlayer]);
      this.#resetScoreAndCurrentPlayer.call(
        this.#players[currentPlayer],
        false
      );
      this.#updateUi(currentPlayer, false);
      this.#switchPlayers();
      this.#saveGame();
      return;
    }
    this.#players[currentPlayer].current += dice;
    this.#updateUi(currentPlayer, false);
    this.#saveGame();
  }
  #holdScoreDice() {
    if (!this.#isPLaying) return;
    const currentPlayer = this.#players.currentPlayer;
    this.#holdScorePlayer.call(this.#players[currentPlayer]);
    if (this.#players[currentPlayer].score >= this.#scoreWinner) {
      this.#updateUi(currentPlayer);
      this.#playerWinner(currentPlayer);
      this.#saveGame();
      return;
    }
    this.#updateUi(currentPlayer);
    this.#switchPlayers();
    this.#saveGame();
    console.log(this.#players);
  }
  #newGame() {
    this.#resetScoreAndCurrentPlayer.call(this.#players[0]);
    this.#resetScoreAndCurrentPlayer.call(this.#players[1]);
    this.#players.currentPlayer = 0;
    this.#isPLaying = true;
    this.#clearUi();
    document.querySelector('.player--0').classList.add('player--active');
    this.#updateUi(0);
    this.#updateUi(1);
    this.#saveGame();
  }
  #switchPlayers() {
    const currentPlayer = this.#players.currentPlayer;
    this.#players.currentPlayer = currentPlayer === 0 ? 1 : 0;
    document.querySelector('.player--0').classList.toggle('player--active');
    document.querySelector('.player--1').classList.toggle('player--active');
  }
  #holdScorePlayer() {
    this.score += this.current >= 40 ? this.current * 2 : this.current;
    this.current = 0;
  }
  #resetScoreAndCurrentPlayer(all = true) {
    if (all) this.score = 0;
    this.current = 0;
  }
  #playerWinner(currentPlayer) {
    this.#isPLaying = false;
    //prettier-ignore
    document.querySelector(`.player--${currentPlayer}`).classList.add('player--winner');
    console.log(`Winner: ${currentPlayer}`);
  }
  #updateUi(currentUser, all = true) {
    //prettier-ignore
    if(all) document.querySelector(`#score--${currentUser}`).textContent = this.#players[currentUser].score;
    //prettier-ignore
    document.querySelector(`#current--${currentUser}`).textContent = this.#players[currentUser].current;
  }
  #saveGame() {
    localStorage.setItem('game-dice', JSON.stringify(this.#players));
  }

  #clearUi() {
    document.querySelector('.player--0').classList.remove('player--active');
    document.querySelector('.player--1').classList.remove('player--active');
    document.querySelector('.player--0').classList.remove('player--winner');
    document.querySelector('.player--1').classList.remove('player--winner');
  }

  #initGame() {
    this.#players = JSON.parse(localStorage.getItem('game-dice')) || {
      0: { score: 0, current: 0 },
      1: { score: 0, current: 0 },
      currentPlayer: 0,
    };
    this.#updateUi(0);
    this.#updateUi(1);
    this.#clearUi();
    //prettier-ignore
    document.querySelector(`.player--${this.#players.currentPlayer}`).classList.add('player--active');
    console.log(this.#players);
  }
}

const pigGame = new PigGame(100);
