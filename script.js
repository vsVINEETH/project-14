let questions = [];
let proposalLines = [];
let currentQuestion = 0;
let score = 0;
let gameScore = 0;

async function loadData() {
  const res = await fetch("data.json");
  const data = await res.json();
  questions = data.questions;
  proposalLines = data.proposalLines;
};

loadData();

function switchScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

function startQuiz() {
  if (questions.length === 0) {
    alert("Loading... please wait ❤️");
    return;
  }

  switchScreen("quiz");
  showQuestion();
};

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;
  const options = document.getElementById("options");
  options.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    options.appendChild(btn);
  });
};

function checkAnswer(selected) {
  const feedback = document.getElementById("feedback");
  const retryActions = document.getElementById("retryActions");

  // Clear previous messages
  feedback.innerText = "";
  retryActions.innerHTML = "";

  if (selected === questions[currentQuestion].answer) {
    score++;
    currentQuestion++;
    updateProgress();

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      setTimeout(() => {
        startMiniGame();
      }, 800);
    }

  } else {
    feedback.innerText = "Oops 😅 That's not right!";

    const tryAgainBtn = document.createElement("button");
    tryAgainBtn.innerText = "Try Again 💕";
    tryAgainBtn.onclick = () => {
      feedback.innerText = "";
      retryActions.innerHTML = "";
    };

    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart Quiz 🔄";
    restartBtn.onclick = restartQuiz;

    retryActions.appendChild(tryAgainBtn);
    retryActions.appendChild(restartBtn);
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;

  document.getElementById("progress").style.width = "0%";
  document.getElementById("feedback").innerText = "";
  document.getElementById("retryActions").innerHTML = "";

  showQuestion();
}


function updateProgress() {
  if (!questions.length) return;

  const percent = (score / questions.length) * 100;
  const progress = document.getElementById("progress");

  progress.style.width = percent + "%";

  if (percent === 100) {
    progress.style.background = "#00ffcc";
  }
};


function startMiniGame() {
  switchScreen("miniGame");

  const interval = setInterval(() => {
    createHeart();
  }, 1000);

function createHeart() {
  const gameArea = document.getElementById("gameArea");
  const heart = document.createElement("div");

  heart.innerHTML = "❤️";
  heart.style.position = "absolute";
  heart.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
  heart.style.top = "-30px";
  heart.style.fontSize = "24px";

  gameArea.appendChild(heart);

  let fall = setInterval(() => {
    heart.style.top = heart.offsetTop + 4 + "px";

    if (heart.offsetTop > gameArea.clientHeight) {
      heart.remove();
      clearInterval(fall);
    }
  }, 20);

  heart.onclick = () => {
    gameScore++;
    document.getElementById("gameScore").innerText = gameScore;
    heart.remove();
    clearInterval(fall);

    if (gameScore >= 10) {
      showProposal();
      clearInterval(interval)
    }
  };
};

};


function showProposal() {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  yesBtn.hidden = true;
  noBtn.hidden = true;

  switchScreen("proposal");
  typeWriter(proposalLines, 0);

  // Wait 3000 milliseconds (3 seconds) before showing
  setTimeout(() => {
    yesBtn.hidden = false;
    noBtn.hidden = false;
  }, 8000); 
}

function typeWriter(lines, index) {
  if (index >= lines.length) {
    document.querySelector(".final-question").style.display = "block";
    return;
  };

  let text = lines[index];
  let i = 0;
  let element = document.getElementById("typewriter");
  element.innerHTML = "";

  let typing = setInterval(() => {
    element.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typing);
      setTimeout(() => typeWriter(lines, index + 1), 1000);
    }
  }, 50);
};

const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);

function moveNoButton(e) {
  e.preventDefault();

  const app = document.querySelector(".app");

  const maxX = app.clientWidth - noBtn.offsetWidth - 20;
  const maxY = app.clientHeight - noBtn.offsetHeight - 20;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noBtn.style.position = "absolute";
  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
};

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);


document.getElementById("yesBtn").addEventListener("click", function() {
  launchConfetti();
  document.getElementById("noBtn").hidden = true;
  document.getElementById("yesBtn").hidden = true;
  document.getElementById("kiss").hidden = false;
  document.getElementById("typewriter").hidden = true;
  document.querySelector(".final-question").innerText = "YAY ❤️ BEST DECISION EVER!";
});

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6,
      d: Math.random() * 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    update();
  }

  function update() {
    pieces.forEach(p => {
      p.y += p.d;
      if (p.y > canvas.height) p.y = 0;
    });
  }

  setInterval(draw, 20);
};
