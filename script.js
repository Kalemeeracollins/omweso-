const board = document.querySelector('.board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const moveSound = new Audio('move.mp3'); // Replace with the path to your sound file
const notification = document.createElement('div');
notification.id = 'notification';
notification.style.display = 'none';
notification.style.position = 'fixed';
notification.style.bottom = '20px';
notification.style.left = '50%';
notification.style.transform = 'translateX(-50%)';
notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
notification.style.color = '#fff';
notification.style.padding = '10px 20px';
notification.style.borderRadius = '5px';
notification.style.zIndex = '1000';
document.body.appendChild(notification);

let pits = new Array(32).fill(4); // 32 pits with 4 seeds each
let currentPlayer = 'Player'; // Player starts first

// Path to the seed image
const seedImagePath = 'seed.png'; // Replace with the path to your seed image

// Generate the board dynamically
function createBoard() {
  board.innerHTML = '';
  pits.forEach((seedCount, index) => {
    const pit = document.createElement('div');
    pit.classList.add('pit');
    pit.dataset.index = index;

    // Add seed images dynamically
    for (let i = 0; i < seedCount; i++) {
      const seedImg = document.createElement('img');
      seedImg.src = seedImagePath;
      seedImg.alt = 'Seed';
      seedImg.classList.add('seed-image');
      pit.appendChild(seedImg);
    }

    // Add click event
    pit.addEventListener('click', () => handlePitClick(index));

    board.appendChild(pit);
  });
}

// Update turn indicator labels
function updateTurnLabel() {
  const playerLabel = document.querySelector('.player-label');
  const botLabel = document.querySelector('.bot-label');
  if (currentPlayer === 'Player') {
    playerLabel.style.color = 'green';
    botLabel.style.color = '#8b5a2b';
  } else {
    playerLabel.style.color = '#8b5a2b';
    botLabel.style.color = 'green';
  }
}

// Play move sound
function playSound() {
  moveSound.currentTime = 0;
  moveSound.play();
}

// Handle click events on all pits
function handlePitClick(pitIndex) {
  if (currentPlayer === 'Player') {
    if (pitIndex >= 16) {
      // Player clicked on the bot's side
      showError('You cannot play on the bot\'s side!');
      return;
    }
    // Valid player move
    handlePlayerMove(pitIndex);
  }
}

// Handle Player's Move
function handlePlayerMove(pitIndex) {
  if (pits[pitIndex] === 0) {
    showError('This pit is empty! Choose another.');
    return;
  }
  playMove(pitIndex);
  currentPlayer = 'Computer';
  status.textContent = "Computer's turn";
  updateTurnLabel();
  setTimeout(computerMove, 1000); // Delay for realism
}

// Handle Computer's Move
function computerMove() {
  const validPits = pits
    .slice(16, 32)
    .map((seeds, i) => (seeds > 0 ? i + 16 : null))
    .filter((i) => i !== null);

  if (validPits.length === 0) {
    showError('Computer has no valid moves! Player wins!');
    return;
  }

  const chosenPit = validPits[Math.floor(Math.random() * validPits.length)];
  playMove(chosenPit);
  currentPlayer = 'Player';
  status.textContent = "Player's turn";
  updateTurnLabel();
}

// Play a move from a selected pit
function playMove(pitIndex) {
  playSound();
  let seeds = pits[pitIndex];
  pits[pitIndex] = 0;
  let currentIndex = pitIndex;

  while (seeds > 0) {
    currentIndex = (currentIndex + 1) % 32; // Wrap around the board
    pits[currentIndex]++;
    seeds--;
  }

  createBoard(); // Refresh the board to reflect the move
}

// Show error notification
function showError(message) {
  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Restart the game
restartBtn.addEventListener('click', () => {
  pits.fill(4); // Reset pits
  currentPlayer = 'Player'; // Reset turn
  status.textContent = "Player's turn";
  updateTurnLabel();
  createBoard(); // Redraw the board
});

// Initialize the game
createBoard();
updateTurnLabel();
