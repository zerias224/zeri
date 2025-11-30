const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let score = 0;
let running = false;
let ball = null;
let spawnInterval = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnBall() {
  const r = randomInt(15, 30);
  ball = {
    x: randomInt(r, canvas.width - r),
    y: randomInt(r, canvas.height - r),
    r,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    color:'hls(${randomInt(0,360)},70%,60%)'
  };
}

function update() {
  if (!running) return;
  if (!ball) spawnBall();

  ball.x += ball.vx;
  ball.y += ball.vy;

  // отскакивание от стен
  if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
  if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fillStyle = ball.color;
    ctx.fill();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener('click', (e) => {
  if (!running || !ball) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const dist = Math.hypot(mx - ball.x, my - ball.y);
  if (dist <= ball.r) {
    score += Math.max(1, Math.round(50 / ball.r)); // больше очков за маленький шар
   scoreE1.textContent = 'очки: ${score}';
    // притормаживаем и спавним новый шар
    ball = null;
  }
});

startBtn.addEventListener('click', () => {
  if (!running) {
    running = true;
    startBtn.textContent = 'Пауза';
    if (!ball) spawnBall();
  } else {
    running = false;
    startBtn.textContent = 'Старт';
  }
});

resetBtn.addEventListener('click', () => {
  running = false;
  startBtn.textContent = 'Старт';
  score = 0;
 scoreE1.textContent = 'Очки ${score}';
  ball = null;
});

loop(); // старт рендера