// Game Variables
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const gameOverScreen = document.getElementById("game-over");
const restartButton = document.getElementById("restart-button");
const mainMenu = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");
const instructions = document.getElementById("instructions");

canvas.width = 800;
canvas.height = 600;

let nail = { x: 0, y: 0, width: 20, height: 50, placed: false };
let painting = { x: 0, y: 0, width: 300, height: 400, img: null };
let paintingTarget = { x: canvas.width / 2 - 150, y: 100 }; // Target center position
let marginForError = 3;
let isGameOver = false;
let currentPaintingIndex = 0;
const paintingUrls = [
  "https://images.rawpixel.com/image_social_square/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGR2YW5nb2doLXNudmdyb2IuanBn.jpg",
  "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkZm1hNi1wZGZhbW91c3BhaW50aW5nMDAyMDAxLWltYWdlLTgtam9iNTgyLTFfMS5qcGc.jpg",
  "https://tonkawritingcenter.wordpress.com/wp-content/uploads/2020/02/people.png?w=264&h=319"
];

// Nail Image URL
const nailImageUrl = "https://static.vecteezy.com/system/resources/previews/020/050/846/large_2x/nail-isolated-on-transparent-background-free-png.png";
const nailImage = new Image();
nailImage.src = nailImageUrl;

// Start the Game
startButton.addEventListener("click", startGame);

// Restart the Game
restartButton.addEventListener("click", restartGame);

// Mouse Move: Nail Follows Cursor
// Mouse Move: Nail Follows Cursor
canvas.addEventListener("mousemove", (e) => {
  if (!isGameOver) {
    // Adjust the position so the nail is centered more accurately on the cursor
    nail.x = e.clientX - canvas.offsetLeft - nail.width / 2 - 440; // Subtract 3 more pixels to shift it left
    nail.y = e.clientY - canvas.offsetTop - nail.height / 2 + 15;
  }
});


// Nail the Painting
canvas.addEventListener("click", () => {
  if (!isGameOver && !nail.placed && isCursorOnPainting()) {
    nail.placed = true;
    checkNailPlacement();
  }
});

// Start the Game
function startGame() {
  mainMenu.style.display = "none";
  gameScreen.style.display = "block";
  gameOverScreen.classList.add("hidden");
  isGameOver = false;
  nail.placed = false;
  instructions.style.display = "block";

  // Randomly pick a painting
  currentPaintingIndex = Math.floor(Math.random() * paintingUrls.length);
  painting.img = new Image();
  painting.img.src = paintingUrls[currentPaintingIndex];

  painting.x = canvas.width;
  painting.y = Math.random() * (canvas.height - painting.height);

  animateGame();
}

// Game Loop
function animateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the painting into view
  if (painting.x > paintingTarget.x) {
    painting.x -= 5;
  }

  // Draw the painting
  ctx.drawImage(painting.img, painting.x, painting.y, painting.width, painting.height);

  // Draw the nail image (instead of drawing a circle)
  ctx.drawImage(nailImage, nail.x, nail.y, nail.width, nail.height);

  if (isGameOver) {
    triggerGameOver();
  }

  requestAnimationFrame(animateGame);
}

// Check if the cursor is on the painting
function isCursorOnPainting() {
  return nail.x >= painting.x && nail.x <= painting.x + painting.width &&
         nail.y >= painting.y && nail.y <= painting.y + painting.height;
}

// Check if the nail is correctly placed
function checkNailPlacement() {
  const centerX = painting.x + painting.width / 2;
  const centerY = painting.y + painting.height / 2;
  const distanceX = Math.abs(centerX - nail.x);
  const distanceY = Math.abs(centerY - nail.y);

  if (distanceX <= marginForError && distanceY <= marginForError) {
    // Correct placement
    isGameOver = true;
    setTimeout(() => {
      instructions.style.display = "none";
      gameOverScreen.classList.remove("hidden");
      document.body.style.backgroundColor = "#8f8"; // Green for correct nail
    }, 500);
  } else {
    // Incorrect placement
    isGameOver = true;
    setTimeout(() => {
      gameOverScreen.classList.remove("hidden");
      document.body.style.backgroundColor = "red"; // Red for incorrect nail
      document.body.style.animation = "flashRed 1s infinite";
    }, 500);
  }
}

// Trigger Game Over (Flash Red and Return to Menu)
function triggerGameOver() {
  document.body.style.animation = "none";
  setTimeout(() => {
    document.body.style.backgroundColor = "";
    mainMenu.style.display = "block";
    gameScreen.style.display = "none";
  }, 1000);
}

// Restart the Game
function restartGame() {
  isGameOver = false;
  gameOverScreen.classList.add("hidden");
  document.body.style.animation = "none";
  startGame();
}
