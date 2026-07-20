// Difficulty settings
var difficulties = {
  easy: { time: 90, speed: 1.5, goalScore: 80, badChance: 0.2, desc: "90 seconds • Slow speed • Reach 80 points" },
  normal: { time: 60, speed: 2.5, goalScore: 100, badChance: 0.3, desc: "60 seconds • Normal speed • Reach 100 points" },
  hard: { time: 30, speed: 4, goalScore: 120, badChance: 0.4, desc: "30 seconds • Fast speed • Reach 120 points" }
};

var currentDifficulty = "normal";
var goalScore = 100;

// Milestone messages
var milestones = [
  { score: 20, msg: "💧 Great start! Keep collecting!" },
  { score: 40, msg: "🌊 Sumi is getting closer!" },
  { score: 60, msg: "⭐ More than halfway there!" },
  { score: 80, msg: "🔥 Almost there! Don't give up!" },
  { score: 100, msg: "🎉 Amazing! Sumi found clean water!" }
];
var shownMilestones = [];

// Game state
var score = 0;
var lives = 3;
var timeLeft = 60;
var gameRunning = false;
var dropMaker;
var timerInterval;

// Get elements
var scoreDisplay = document.getElementById("score");
var timerDisplay = document.getElementById("time");
var gameContainer = document.getElementById("game-container");
var startBtn = document.getElementById("start-btn");
var milestoneDisplay = document.getElementById("milestone");

// Set difficulty
function setDifficulty(level) {
  currentDifficulty = level;
  var d = difficulties[level];
  timeLeft = d.time;
  goalScore = d.goalScore;
  timerDisplay.textContent = d.time;
  document.getElementById("difficultyDesc").textContent = d.desc;

  // Update active button
  document.getElementById("easyBtn").classList.remove("active");
  document.getElementById("normalBtn").classList.remove("active");
  document.getElementById("hardBtn").classList.remove("active");
  document.getElementById(level + "Btn").classList.add("active");
}

startBtn.addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;
  var d = difficulties[currentDifficulty];
  score = 0;
  lives = 3;
  timeLeft = d.time;
  goalScore = d.goalScore;
  shownMilestones = [];
  gameRunning = true;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  updateLives();
  gameContainer.innerHTML = "";
  milestoneDisplay.style.display = "none";
  startBtn.textContent = "Playing...";
  startBtn.disabled = true;
  document.getElementById("difficultySection").style.display = "none";
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

function updateLives() {
  var hearts = "";
  for (var i = 0; i < lives; i++) {
    hearts += "❤️";
  }
  document.getElementById("lives").textContent = hearts;
}

function checkMilestone() {
  for (var i = 0; i < milestones.length; i++) {
    var m = milestones[i];
    if (score >= m.score && shownMilestones.indexOf(m.score) === -1) {
      shownMilestones.push(m.score);
      milestoneDisplay.textContent = m.msg;
      milestoneDisplay.style.display = "block";
      setTimeout(function() {
        milestoneDisplay.style.display = "none";
      }, 2000);
    }
  }
}

function createDrop() {
  var drop = document.createElement("div");
  var d = difficulties[currentDifficulty];
  var isBad = Math.random() < d.badChance;

  drop.style.position = "absolute";
  drop.style.width = "60px";
  drop.style.height = "60px";
  drop.style.borderRadius = "50%";
  drop.style.display = "flex";
  drop.style.alignItems = "center";
  drop.style.justifyContent = "center";
  drop.style.fontSize = "28px";
  drop.style.cursor = "pointer";
  drop.style.zIndex = "50";
  drop.style.userSelect = "none";
  drop.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  drop.style.transition = "transform 0.1s";

  if (isBad) {
    drop.style.backgroundColor = "#ff4444";
    drop.textContent = "☠️";
  } else {
    drop.style.backgroundColor = "#2E9DF7";
    drop.textContent = "💧";
  }

  var gameWidth = gameContainer.offsetWidth;
  var xPos = Math.random() * (gameWidth - 60);
  drop.style.left = xPos + "px";
  drop.style.top = "-60px";

  gameContainer.appendChild(drop);

  var pos = -60;
  var falling = setInterval(function() {
    if (!gameRunning) {
      clearInterval(falling);
      if (drop.parentNode) drop.remove();
      return;
    }
    pos += d.speed;
    drop.style.top = pos + "px";
    if (pos > gameContainer.offsetHeight) {
      clearInterval(falling);
      if (drop.parentNode) {
        if (!isBad) {
          lives--;
          updateLives();
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

    // Scale animation
    drop.style.transform = "scale(1.4)";
    setTimeout(function() {
      if (drop.parentNode) drop.remove();
    }, 100);

    if (isBad) {
      lives--;
      updateLives();
      showFeedback("☠️ Dirty water! -1 life", false);
      if (lives <= 0) endGame(false);
    } else {
      score += 10;
      scoreDisplay.textContent = score;
      showFeedback("💧 +10 points!", true);
      checkMilestone();
      if (score >= goalScore) endGame(true);
    }
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
  msg.style.fontFamily = "Nunito, sans-serif";
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
  document.getElementById("difficultySection").style.display = "block";

  var msg = document.createElement("div");
  msg.style.textAlign = "center";
  msg.style.padding = "40px";
  msg.style.position = "absolute";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.width = "80%";
  msg.style.fontFamily = "Nunito, sans-serif";

  if (won) {
    msg.innerHTML = "<div style='font-size:60px'>🎉</div><h2 style='color:#FFC907;font-size:28px'>You Win!</h2><p>Sumi found clean water for her village!</p><p style='font-size:20px;margin-top:10px'>Score: " + score + "</p><p style='margin-top:10px'><a href='https://www.charitywater.org/donate' target='_blank' style='color:#2E9DF7;font-weight:bold'>Help real communities get clean water →</a></p>";
    launchConfetti();
  } else {
    msg.innerHTML = "<div style='font-size:60px'>💧</div><h2 style='color:#2E9DF7;font-size:28px'>Game Over</h2><p>Sumi couldn't find enough clean water...</p><p style='font-size:20px;margin-top:10px'>Score: " + score + "</p><p style='margin-top:10px'><a href='https://www.charitywater.org' target='_blank' style='color:#2E9DF7;font-weight:bold'>Learn about the real water crisis →</a></p>";
  }

  gameContainer.appendChild(msg);
  startBtn.textContent = "Play Again";
  startBtn.disabled = false;

  startBtn.onclick = function() {
    gameContainer.innerHTML = "";
    scoreDisplay.textContent = 0;
    var d = difficulties[currentDifficulty];
    timerDisplay.textContent = d.time;
    document.getElementById("lives").textContent = "❤️❤️❤️";
    startBtn.textContent = "Start Game";
    startBtn.onclick = null;
    startBtn.addEventListener("click", startGame);
  };
}

function launchConfetti() {
  var colors = ["#FFC907", "#2E9DF7", "#ffffff", "#4FCB53", "#FF902A"];
  for (var i = 0; i < 80; i++) {
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
    }, i * 30);
  }
}
