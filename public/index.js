const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
let height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

ctx.canvas.width = width;
ctx.canvas.height = height;

let gameStarted = false;
let winner = null;
// const obstacles = [
//   { x: 200, y: 100, width: 50, height: 150, visible: true },
//   { x: 400, y: 250, width: 100, height: 50, visible: true },
//   // Add more obstacles as needed
// ];
// ...

// ...

// ...
function showNotification() {
  var popupContainer = document.getElementById("popupContainer");
  var popupMessage = document.getElementById("popupMessage");
  popupMessage.textContent = "Made 99% by AI";
  popupContainer.style.display = "flex";
}

function hideNotification(event) {
  var popupContainer = document.getElementById("popupContainer");
  if (event.target === popupContainer) {
    popupContainer.style.display = "none";
  }
}
function hideNotificationForced() {
  var popupContainer = document.getElementById("popupContainer");
  popupContainer.style.display = "none";
}
var obstacles = [];

function generateObstacles() {
  obstacles = [];
  var numObstacles = 5; // Number of obstacles to generate
  var fixedArea = 4000; // Fixed area for all obstacles
  var minDistance = 200; // Minimum distance from the borders
  var maxHeight = 70; // Maximum height of the obstacles
  var maxWidth = 150; // Maximum width of the obstacles
  var sideProbability = 0.55; // Probability of spawning on the sides

  obstacles = [];

  for (var i = 0; i < numObstacles; i++) {
    var isSide = Math.random() < sideProbability;
    var width = Math.floor(
      Math.min(maxWidth, Math.sqrt(fixedArea) * Math.random() + 1)
    );
    var height = Math.floor(Math.min(maxHeight, fixedArea / width));

    var x, y;
    if (isSide) {
      x =
        Math.random() < 0.5
          ? minDistance
          : window.innerWidth - minDistance - width;
      y = Math.random() * (window.innerHeight - height);
    } else {
      x = Math.random() * (window.innerWidth - width);
      y =
        Math.random() < 0.5
          ? minDistance
          : window.innerHeight - minDistance - height;
    }

    obstacles.push({ x: x, y: y, width: width, height: height });
  }
}

// ...

generateObstacles();

let gameOverScreenVisible = false;
// Tank objects
const tank1 = {
  x: 50,
  y: canvas.height / 2,
  width: 50,
  height: 30,
  color: "blue",
  dx: 0,
  dy: 0,
  speed: 3,
};

const tank2 = {
  x: canvas.width - 100,
  y: canvas.height / 2,
  width: 50,
  height: 30,
  color: "red",
  dx: 0,
  dy: 0,
  speed: 3,
};
let score1 = 0;
let score2 = 0;
const bullets = [];
const bulletSpeed = 5;

// Add this function to handle shooting
function tankShoot(tank) {
  let bullet = {};
  if (tank === tank1) {
    bullet = {
      x: tank.x + tank.width,
      y: tank.y + tank.height / 2,
      tankIndex: tank === tank1 ? 1 : 2,
    };
  } else {
    bullet = {
      x: tank.x,
      y: tank.y + tank.height / 2,
      tankIndex: tank === tank1 ? 1 : 2,
    };
  }
  console.log(bullet);
  bullets.push(bullet);
}
function gameOverScreen(winner) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(
    `Game Over! Player ${winner} wins!`,
    canvas.width / 2 - 220,
    canvas.height / 2
  );

  gameOverScreenVisible = true;
}

function restartGame() {
  gameStarted = false;
  gameOverScreenVisible = false;
  winner = null;
  score1 = 0;
  score2 = 0;

  tank1.x = 50;
  tank1.y = canvas.height / 2;

  tank2.x = canvas.width - 100;
  tank2.y = canvas.height / 2;

  bullets.length = 0;
  const restartButton = document.getElementById("restartButton");
  restartButton.style.display = "none";
}
// Update the tanks' positions
function update() {
  clearCanvas();
  // Check for the loss condition
  if (score1 >= 5) {
    gameOver = true;
    gameOverScreen(1);
  } else if (score2 >= 5) {
    gameOver = true;
    gameOverScreen(2);
  }

  tank1.x += tank1.dx;
  tank1.y += tank1.dy;
  // Player 1 boundary check
  const player1MaxPosY = canvas.height + 20 - tank1.height;
  if (tank1.y < -20) {
    tank1.y = -20;
  } else if (tank1.y > player1MaxPosY) {
    tank1.y = player1MaxPosY;
  }

  tank2.x += tank2.dx;
  tank2.y += tank2.dy;

  // Player 2 boundary check
  const player2MaxPosY = canvas.height + 20 - tank2.height;
  if (tank2.y < -20) {
    tank2.y = -20;
  } else if (tank2.y > player2MaxPosY) {
    tank2.y = player2MaxPosY;
  }

  drawTank(tank1);
  drawTank(tank2);
  drawObstacles();

  drawTank(tank1);
  drawTank(tank2);
  // Update and draw the bullets
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    if (bullet.tankIndex === 1) {
      bullet.x += bulletSpeed;
    } else {
      bullet.x -= bulletSpeed;
    }

    drawBullet(bullet);

    // Detect bullet collision with tanks
    if (collisionDetection(bullet, tank1)) {
      score2++;
      bullets.splice(i, 1);
      i--;
    } else if (collisionDetection(bullet, tank2)) {
      score1++;
      bullets.splice(i, 1);
      i--;
    }
  }

  // Check for the loss condition
  if (!gameStarted && (score1 >= 5 || score2 >= 5)) {
    gameStarted = true;
    winner = score1 >= 5 ? 1 : 2;
    console.log("cool", winner);
    gameOverScreen(winner);

    const restartButton = document.getElementById("restartButton");
    restartButton.style.display = "block";
    restartButton.addEventListener("click", restartGame);
  }

  // Display the scores
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Player 1: ${score1} - Player 2: ${score2}`, 10, 30);

  requestAnimationFrame(update);
}

// Draw a tank
function drawTank(tank) {
  ctx.fillStyle = tank.color;
  ctx.fillRect(tank.x, tank.y, tank.width, tank.height);
}
function drawObstacles() {
  if (!gameOverScreenVisible) {
    obstacles.forEach((obstacle) => {
      if (obstacle.visible) {
        ctx.fillStyle = "gray";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    });
  }
}
// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function toggleObstacleVisibilityRandomly() {
  generateObstacles();
  obstacles.forEach((obstacle) => {
    if (Math.random() < 0.4) {
      obstacle.visible = !obstacle.visible;
    }
  });

  const randomTimeout = Math.floor(Math.random() * (8000 - 2000)) + 2000; // Random timeout between 2s and 8s
  setTimeout(toggleObstacleVisibilityRandomly, randomTimeout);
}
toggleObstacleVisibilityRandomly();

document.addEventListener("keydown", function (event) {
  if (!gameOverScreenVisible) {
    // Player 1 movement
    if (event.code === "KeyW") {
      tank1.dy = -tank1.speed;
    }
    if (event.code === "KeyS") {
      tank1.dy = tank1.speed;
    }

    // Player 2 movement
    if (event.code === "ArrowUp") {
      tank2.dy = -tank2.speed;
    }
    if (event.code === "ArrowDown") {
      tank2.dy = tank2.speed;
    }
  }
});

document.addEventListener("keyup", function (event) {
  if (!gameOverScreenVisible) {
    // Player 1 movement
    if (event.code === "KeyW" || event.code === "KeyS") {
      tank1.dy = 0;
    }

    // Player 2 movement
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      tank2.dy = 0;
    }

    // Shooting
    if (event.keyCode === 32) {
      // Space key
      tankShoot(tank1);
    } else if (event.keyCode === 13) {
      // Enter key
      tankShoot(tank2);
    }
  }
});
// Handle keydown event
// function keyDownHandler(event) {
//   if (event.keyCode === 87 && tank1.y < canvas.height - 50 - tank1.height) {
//     // W key
//     tank1.dy = -tank1.speed;
//   } else if (event.keyCode === 83 && tank1.y > 50) {
//     // S key
//     tank1.dy = tank1.speed;
//   } else if (event.keyCode === 38 && tank2.y < canvas.height - 50 - tank2.height) {
//     // Up arrow key
//     tank2.dy = -tank2.speed;
//   } else if (event.keyCode === 40 && tank2.y > 50) {
//     // Down arrow key
//     tank2.dy = tank2.speed;
//   }
//   if (event.keyCode === 32) {
//     // Space key
//     tankShoot(tank1);
//   } else if (event.keyCode === 13) {
//     // Enter key
//     tankShoot(tank2);
//   }
// }

// Add this function to draw the bullets
function drawBullet(bullet) {
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);

  ctx.fillStyle = bullet.tankIndex === 1 ? "blue" : "red";
  ctx.fill();
  ctx.closePath();
}

// Add this function to check for collision between a bullet and a tank
function collisionDetection(bullet, tank) {
  // Check for collision with visible obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    if (
      obstacle.visible &&
      bullet.x > obstacle.x &&
      bullet.x < obstacle.x + obstacle.width &&
      bullet.y > obstacle.y &&
      bullet.y < obstacle.y + obstacle.height
    ) {
      // bullets.splice(i, 1);
      const bulletIndex = bullets.indexOf(bullet);
      if (bulletIndex > -1) {
        bullets.splice(bulletIndex, 1);
        console.log("del");
      }
      return false;
    }
  }
  if (
    bullet.x > tank.x &&
    bullet.x < tank.x + tank.width &&
    bullet.y > tank.y &&
    bullet.y < tank.y + tank.height
  ) {
    return true;
  }
  return false;
}

// Handle keyup event
function keyUpHandler(event) {
  if (event.keyCode === 87 || event.keyCode === 83) {
    tank1.dy = 0;
  }
  if (event.keyCode === 38 || event.keyCode === 40) {
    tank2.dy = 0;
  }
}

// Bind keydown and keyup event handlers
// document.addEventListener('keydown', keyDownHandler);
// document.addEventListener('keyup', keyUpHandler);

// Initiate the game loop
update();
