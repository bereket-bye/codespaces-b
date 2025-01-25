// Dark Mode toggle function
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const modeText = document.body.classList.contains('dark-mode') ? '🌞 Light Mode' : '🌙 Dark Mode';
    document.getElementById('toggleDarkModeBtn').textContent = modeText;
    document.getElementById('toggleDarkModeBtnGame').textContent = modeText;
  };
  
  // Event listener for dark mode toggle
  document.getElementById('toggleDarkModeBtn').addEventListener('click', toggleDarkMode);
  document.getElementById('toggleDarkModeBtnGame').addEventListener('click', toggleDarkMode);
  
  // Show the game page when "Start Game" is clicked
  document.getElementById('startGameBtn').addEventListener('click', () => {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('gamePage').style.display = 'block';
    startGame();
    startTimer(); // Start the timer when the game starts
  });
  
  // Go back to home page
  document.getElementById('goHomeBtn').addEventListener('click', () => {
    document.getElementById('gamePage').style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
  });
  
  // Show the description modal
  document.getElementById('descriptionLink').addEventListener('click', () => {
    document.getElementById('descriptionModal').style.display = 'flex';
  });
  
  // Close the description modal
  document.getElementById('closeDescriptionBtn').addEventListener('click', () => {
    document.getElementById('descriptionModal').style.display = 'none';
  });
  
  // Game variables: emojis
  let emojis = [
    '🍎', '🍌', '🍒', '🍇', '🍋', '🍊',
    '🍓', '🍉'
  ];
  
  let level = 1;
  let moves = 0;
  let matchedPairs = 0;
  let flippedCards = [];
  let cards = [];
  
  // Timer variables
  let timer;
  let seconds = 0;
  let minutes = 0;
  
  // Shuffle function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Create and shuffle cards based on the current level
  function generateCards() {
    cards = [...emojis, ...emojis];
    shuffle(cards);
    createCardElements();
  }
  
  // Create card elements for the game grid
  function createCardElements() {
    const cardGrid = document.querySelector('.card-grid');
    cardGrid.innerHTML = '';
    
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
    
    startGame();
  }
  
  // Level up function: Increase the number of cards based on the level
  function levelUp() {
    level++;
    document.getElementById('level').textContent = `Level: ${level}`;
    if (level > 1) {
      emojis.push('🍕', '🍟', '🍩', '🍔', '🍗', '🍪');  // Adding new emojis to increase card count
    }
    generateCards();
  }
  
  // Functions to handle card flipping
  function flipCard(card) {
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
        flippedCards = [];
        
        if (matchedPairs === cards.length / 2) {
          setTimeout(() => {
            alert('You win!');
            levelUp();
          }, 500);
        }
      } else {
        setTimeout(() => {
          flippedCards[0].classList.remove('flipped');
          flippedCards[1].classList.remove('flipped');
          flippedCards[0].querySelector('span').style.visibility = 'hidden';
          flippedCards[1].querySelector('span').style.visibility = 'hidden';
          flippedCards = [];
        }, 1000);
      }
    }
  }
  
  // Event listener for card clicks
  function startGame() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('flipped') && flippedCards.length < 2) {
          flipCard(card);
        }
      });
    });
  }
  
  // Restart the game
  document.getElementById('restartGameBtn').addEventListener('click', () => {
    level = 1;
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    minutes = 0;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
    document.getElementById('matches').textContent = `Matches: ${matchedPairs}`;
    document.getElementById('level').textContent = `Level: ${level}`;
    document.getElementById('timer').textContent = `Time: 00:00`;
    
    emojis = ['🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍓', '🍉'];
    generateCards();
    clearInterval(timer); // Clear previous timer
    startTimer(); // Start new timer
  });
  
  // Timer function
  function startTimer() {
    timer = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      document.getElementById('timer').textContent = `Time: ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
  }
  