var score = 0;
var lives = 3;
var timeLeft = 30;
var gameRunning = false;
var dropMaker;
var timerInterval;

var scoreDisplay = document.getElementById("score");
var timerDisplay = document.getElementById("time");
var gameContainer = document.getElementById("game-container");
var startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;
  score = 0;
  lives = 3;
  timeLeft = 30;
  gameRunning = true;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  gameContainer.innerHTML = "";
  startBtn.textContent = "Playing...";
  startBtn.disabled = true;
  dropMaker = setInterval(createDrop, 800);
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame(false);
  }
}

function createDrop() {
  var drop = document.createElement("div");
  var isBad = Math.random() < 0.3;

  drop.style.position = "absolute";
  drop.style.width = "60px";
  drop.style.height = "60px";
  drop.style.borderRadius = "50%";
  drop.style.display = "flex";
  drop.style.alignItems = "center";
  drop.style.justifyContent = "center";
  drop.style.fontSize = "24px";
  drop.style.cursor = "pointer";
  drop.style.zIndex = "50";
  drop.style.userSelect = "none";

  if (isBad) {
    drop.style.backgroundColor = "#ff4444";
    drop.textContent = "☠️";
  } else {
    drop.style.backgroundColor = "#0099ff";
    drop.textContent = "💧";
  }

  var gameWidth = gameContainer.offsetWidth;
  var xPos = Math.random() * (gameWidth - 60);
  drop.style.left = xPos + "px";
  drop.style.top = "-60px";

  gameContainer.appendChild(drop);

  var pos = -60;
  var speed = Math.random() * 2 + 2;
  var falling = setInterval(function() {
    if (!gameRunning) {
      clearInterval(falling);
      if (drop.parentNode) drop.remove();
      return;
    }
    pos += speed;
    drop.style.top = pos + "px";
    if (pos > gameContainer.offsetHeight) {
      clearInterval(falling);
      if (drop.parentNode) {
        if (!isBad) {
          lives--;
          showFeedback("Missed! -1 life", false);
          if (lives <= 0) endGame(false);
        }
        drop.remove();
      }
    }
  }, 20);

  drop.addEventListener("click", function() {
    if (!gameRunning) return;
    clearInterval(falling);
    if (isBad) {
      lives--;
      showFeedback("☠️ Dirty! -1 life", false);
      if (lives <= 0) endGame(false);
    } else {
      score += 10;
      scoreDisplay.textContent = score;
      showFeedback("💧 +10 points!", true);
      if (score >= 100) endGame(true);
    }
    if (drop.parentNode) drop.remove();
  });
}

function showFeedback(text, good) {
  var msg = document.createElement("div");
  msg.textContent = text;
  msg.style.position = "absolute";
  msg.style.top = "10px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.padding = "8px 16px";
  msg.style.borderRadius = "20px";
  msg.style.fontWeight = "bold";
  msg.style.zIndex = "100";
  msg.style.backgroundColor = good ? "#FFC907" : "#ff4444";
  msg.style.color = good ? "#333" : "white";
  msg.style.whiteSpace = "nowrap";
  gameContainer.appendChild(msg);
  setTimeout(function() {
    if (msg.parentNode) msg.remove();
  }, 800);
}

function endGame(won) {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameContainer.innerHTML = "";

  var msg = document.createElement("div");
  msg.style.textAlign = "center";
  msg.style.padding = "40px";
  msg.style.position = "absolute";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.width = "80%";

  if (won) {
    msg.innerHTML = "<div style='font-size:60px'>🎉</div><h2 style='color:#FFC907;font-size:28px'>You Win!</h2><p>Sumi found clean water!</p><p style='font-size:20px;margin-top:10px'>Score: " + score + "</p>";
    launchConfetti();
  } else {
    msg.innerHTML = "<div style='font-size:60px'>💧</div><h2 style='color:#0099d6;font-size:28px'>Game Over</h2><p>Sumi could not find enough water...</p><p style='font-size:20px;margin-top:10px'>Score: " + score + "</p>";
  }

  gameContainer.appendChild(msg);
  startBtn.textContent = "Play Again";
  startBtn.disabled = false;

  startBtn.onclick = function() {
    gameContainer.innerHTML = "";
    scoreDisplay.textContent = 0;
    timerDisplay.textContent = 30;
    startBtn.textContent = "Start Game";
    startBtn.onclick = null;
    startBtn.addEventListener("click", startGame);
  };
}

function launchConfetti() {
  var colors = ["#FFC907", "#0099d6", "#ffffff", "#4fc3f7"];
  for (var i = 0; i < 60; i++) {
    setTimeout(function() {
      var c = document.createElement("div");
      c.style.position = "absolute";
      c.style.width = "10px";
      c.style.height = "10px";
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.left = Math.random() * 100 + "%";
      c.style.top = "0px";
      c.style.borderRadius = "50%";
      c.style.zIndex = "200";
      c.style.transition = "top 2s ease";
      gameContainer.appendChild(c);
      setTimeout(function() { c.style.top = Math.random() * 100 + "%"; }, 50);
      setTimeout(function() { if (c.parentNode) c.remove(); }, 3000);
    }, i * 40);
  }
}