// Dark Mode toggle function
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  const modeText = document.body.classList.contains('dark-mode') ? '🌞 Light Mode' : '🌙 Dark Mode';
  document.getElementById('toggleDarkModeBtn').textContent = modeText;
};

// Event listener for dark mode toggle
document.getElementById('toggleDarkModeBtn').addEventListener('click', toggleDarkMode);

// Show the game page when "Start Game" is clicked
document.getElementById('startGameBtn').addEventListener('click', () => {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('gamePage').style.display = 'block';
  resetGame(); // Reset game state when you first start
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
let timeBonus = 0;
let score = 0;
let isPaused = false;

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
  cardGrid.innerHTML = ''; // Clear any existing cards
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
  startGame(); // Ensure the game logic is initialized and ready to go
}

// Handle flipping cards
function flipCard(card) {
  const cardText = card.querySelector('span');
  cardText.style.visibility = 'visible';
  card.classList.add('flipped');
  flippedCards.push(card);
  document.getElementById('flipSound').play(); // Play flip sound
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
      document.getElementById('matchSound').play(); // Play match sound
      flippedCards = [];
      if (matchedPairs === cards.length / 2) {
        timeBonus = Math.max(30 - (minutes * 60 + seconds), 0); // Calculate time bonus
        document.getElementById('timeBonus').textContent = `Time Bonus: ${timeBonus}s`;
        calculateScore(); // Calculate final score
        setTimeout(() => {
          document.getElementById('winSound').play(); // Play win sound
          alert(`You win! Time Bonus: ${timeBonus}s | Score: ${score}`);
          checkForPrize(); // Check if player earned a prize
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
      if (!card.classList.contains('flipped') && flippedCards.length < 2 && !isPaused) {
        flipCard(card);
      }
    });
  });
}

// Timer function
function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    if (!isPaused) {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      document.getElementById('timer').textContent = `Time: ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  }, 1000);
}

// Level Up
function levelUp() {
  level++;
  document.getElementById('level').textContent = `Level: ${level}`;
  if (level > 1) {
    emojis.push('🍕', '🍟', '🍩', '🍔', '🍗', '🍪');
  }
  document.getElementById('levelUpSound').play(); // Play level-up sound
  generateCards(); // Generate new set of cards on level up
}

// Reset game state (called when "Start Game" is clicked)
function resetGame() {
  level = 1;
  matchedPairs = 0;
  moves = 0;
  seconds = 0;
  minutes = 0;
  timeBonus = 0;
  score = 0;
  document.getElementById('moves').textContent = `Moves: ${moves}`;
  document.getElementById('matches').textContent = `Matches: ${matchedPairs}`;
  document.getElementById('level').textContent = `Level: ${level}`;
  document.getElementById('timer').textContent = `Time: 00:00`;
  document.getElementById('timeBonus').textContent = `Time Bonus: 0s`;
  document.getElementById('score').textContent = `Score: 0`;
  generateCards(); // Initialize cards and start game
}

// Restart game functionality
document.getElementById('restartGameBtn').addEventListener('click', () => {
  clearInterval(timer);
  resetGame(); // Reset and start the game again
  startTimer(); // Restart the timer
});

// Pause/Resume Game
document.getElementById('pauseResumeBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(timer);
    document.getElementById('pauseResumeBtn').textContent = '▶️ Resume';
    document.querySelectorAll('.card').forEach(card => {
      card.style.pointerEvents = 'none'; // Disable card clicks
    });
  } else {
    startTimer();
    document.getElementById('pauseResumeBtn').textContent = '⏸️ Pause';
    document.querySelectorAll('.card').forEach(card => {
      card.style.pointerEvents = 'auto'; // Enable card clicks
    });
  }
});

// Calculate Score
function calculateScore() {
  const timePenalty = minutes * 60 + seconds; // Total time taken
  const movePenalty = moves * 5; // Penalty for each move
  score = Math.max(1000 - timePenalty - movePenalty, 0); // Base score formula
  document.getElementById('score').textContent = `Score: ${score}`;
  updateHighScores(); // Update high scores
}

// Check for Prize
function checkForPrize() {
  if (score > 800) {
    alert(`🎉 Congratulations! You earned a prize: Gold Medal! 🥇`);
  } else if (score > 600) {
    alert(`🎉 Congratulations! You earned a prize: Silver Medal! 🥈`);
  } else if (score > 400) {
    alert(`🎉 Congratulations! You earned a prize: Bronze Medal! 🥉`);
  } else {
    alert(`Good job! Keep practicing to earn a prize next time!`);
  }
}

// High Scores
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

function updateHighScores() {
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 5); // Keep top 5 scores
  localStorage.setItem('highScores', JSON.stringify(highScores));
  displayHighScores();
}

function displayHighScores() {
  const highScoresList = document.getElementById('highScoresList');
  highScoresList.innerHTML = highScores.map((score, index) => `<li>${index + 1}. ${score} points</li>`).join('');
}

displayHighScores();
