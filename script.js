const board = document.querySelector('.board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const moveSound = new Audio('move.mp3'); // Sound effect for moves

let pits = new Array(32).fill(4); // 32 pits with 4 seeds each
let currentPlayer = 'Player'; // Start with the player

// Path to the seed image
const seedImagePath = 'seed.png'; // Replace 'seed.png' with the path to your seed image

// Generate the board dynamically
function createBoard() {
  board.innerHTML = '';
  pits.forEach((seedCount, index) => {
    const pit = document.createElement('div');
    pit.classList.add('pit');
    pit.dataset.index = index;

    // Add seed images
    for (let i = 0; i < seedCount; i++) {
      const seedImg = document.createElement('img');
      seedImg.src = seedImagePath;
      seedImg.alt = 'Seed';
      seedImg.classList.add('seed-image');
      pit.appendChild(seedImg);
    }

    pit.addEventListener('click', () => handlePlayerMove(index));
    board.appendChild(pit);
  });
}

// Play move sound
function playSound() {
  moveSound.currentTime = 0;
  moveSound.play();
}

// Handle Player's Move
function handlePlayerMove(pitIndex) {
  if (currentPlayer !== 'Player') return;
  if (pits[pitIndex] === 0 || pitIndex > 15) {
    alert('Choose a valid pit on your side!');
    return;
  }
  playMove(pitIndex);
  currentPlayer = 'Computer';
  status.textContent = "Computer's turn";
  setTimeout(computerMove, 1000); // Add delay for realism
}

// Handle Computer's Move
function computerMove() {
  const validPits = pits.slice(16, 32).map((seeds, i) => (seeds > 0 ? i + 16 : null)).filter((i) => i !== null);
  if (validPits.length === 0) {
    alert('Computer has no valid moves! Player wins!');
    return;
  }
  const chosenPit = validPits[Math.floor(Math.random() * validPits.length)];
  playMove(chosenPit);
  currentPlayer = 'Player';
  status.textContent = "Player's turn";
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
  createBoard();
}

// Restart the game
restartBtn.addEventListener('click', () => {
  pits.fill(4);
  currentPlayer = 'Player';
  status.textContent = "Player's turn";
  createBoard();
});

// Initialize the game
createBoard();
