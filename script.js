// Initialize Sound Settings
let soundEnabled = true;

// Load Sound Effects
const flipSound = new Audio('flip-sound.mp3');
const matchSound = new Audio('match-sound.mp3');
const winSound = new Audio('win-sound.mp3');

// Add event listener for sound toggle
document.getElementById('soundToggle').addEventListener('change', (event) => {
  soundEnabled = event.target.checked;
});

// Add event listener for settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
  document.getElementById('settingsModal').style.display = 'flex';
});

// Close the settings modal
document.getElementById('closeSettingsBtn').addEventListener('click', () => {
  document.getElementById('settingsModal').style.display = 'none';
});

// Dark Mode Toggle
document.getElementById('toggleDarkModeBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Game Logic
document.getElementById('startGameBtn').addEventListener('click', () => {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('gamePage').style.display = 'block';

  resetGame();  // Reset game state when you first start
  startTimer(); // Start the timer when the game starts
});

// Go home button functionality
document.getElementById('goHomeBtn').addEventListener('click', () => {
  document.getElementById('homePage').style.display = 'block';
  document.getElementById('gamePage').style.display = 'none';
});

// Show description modal
document.getElementById('descriptionLink').addEventListener('click', () => {
  document.getElementById('descriptionModal').style.display = 'flex';
});

// Close the description modal
document.getElementById('closeDescriptionBtn').addEventListener('click', () => {
  document.getElementById('descriptionModal').style.display = 'none';
});

// Timer variables
let timer;
let seconds = 0;
let minutes = 0;
let level = 1;
let matchedPairs = 0;
let moves = 0;
let flippedCards = [];

const emojis = ['🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍓', '🍉'];

let cards = [];

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generate and shuffle cards
function generateCards() {
  cards = [...emojis, ...emojis];
  shuffle(cards);
  createCardElements();
}

// Create card elements
function createCardElements() {
  const cardGrid = document.querySelector('.card-grid');
  cardGrid.innerHTML = '';  // Clear any existing cards

  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    const cardText = document.createElement('span');
    cardText.textContent = emoji;
    cardText.style.visibility = 'hidden';

    card.appendChild(cardText);
    cardGrid.appendChild(card);
  });

  startGame();  // Ensure the game logic is initialized and ready to go
}

// Handle flipping cards
function flipCard(card) {
  if (soundEnabled) flipSound.play();

  const cardText = card.querySelector('span');
  cardText.style.visibility = 'visible';
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves').textContent = `Moves: ${moves}`;

    if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
      matchedPairs++;
      document.getElementById('matches').textContent = `Matches: ${matchedPairs}`;

      flippedCards.forEach(card => {
        card.querySelector('span').style.color = 'green';
        card.classList.add('matched');
      });

      if (soundEnabled) matchSound.play();

      flippedCards = [];

      if (matchedPairs === cards.length / 2) {
        if (soundEnabled) winSound.play();
        setTimeout(() => {
          alert('You win!');
          levelUp();
        }, 500);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.classList.remove('flipped');
          card.querySelector('span').style.visibility = 'hidden';
        });
        flippedCards = [];
      }, 1000);
    }
  }
}

// Initialize the game mechanics
function startGame() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('flipped') && flippedCards.length < 2) {
        flipCard(card);
      }
    });
  });
}

// Timer function
function startTimer() {
  // Ensure the timer starts only once
  if (timer) return;

  timer = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    document.getElementById('timer').textContent = `Time: ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }, 1000);
}

function levelUp() {
  level++;
  document.getElementById('level').textContent = `Level: ${level}`;
  if (level > 1) {
    emojis.push('🍕', '🍟', '🍩', '🍔', '🍗', '🍪');
  }
  generateCards();  // Generate new set of cards on level up
}

// Reset game state (called when "Start Game" is clicked)
function resetGame() {
  level = 1;
  matchedPairs = 0;
  moves = 0;
  seconds = 0;
  minutes = 0;

  document.getElementById('moves').textContent = `Moves: ${moves}`;
  document.getElementById('matches').textContent = `Matches: ${matchedPairs}`;
  document.getElementById('level').textContent = `Level: ${level}`;
  document.getElementById('timer').textContent = `Time: 00:00`;

  generateCards();  // Initialize cards and start game
}

// Restart game functionality
document.getElementById('restartGameBtn').addEventListener('click', () => {
  clearInterval(timer);
  resetGame(); // Reset and start the game again
  startTimer();  // Restart the timer
});
