const startMenu = document.getElementById("startMenu");
const startBtn = document.getElementById("startBtn");

startBtn.onclick = () => {
  startMenu.style.display = "none";
  startGame();
};

function startGame() {
  const player = document.getElementById("player");
  const world = document.getElementById("world");
  const enemy = document.querySelector(".enemy");
  const flag = document.getElementById("flag");

  const levelText = document.getElementById("level");
  const livesText = document.getElementById("lives");

  const btnLeft = document.getElementById("left");
  const btnRight = document.getElementById("right");
  const btnJump = document.getElementById("jump");

  const jumpSound = document.getElementById("jumpSound");
  const hitSound = document.getElementById("hitSound");
  const deadSound = document.getElementById("deadSound");

  let px = 100, py = 60;
  let vy = 0;
  let jumping = false;

  let moveLeft = false;
  let moveRight = false;
  let doJump = false;

  let level = 1;
  let lives = 3;

  let enemyX = 700;
  let enemyDir = 1;
  let enemySpeed = 2;
  let enemyAlive = true;

  btnLeft.ontouchstart = () => moveLeft = true;
  btnLeft.ontouchend = () => moveLeft = false;
  btnRight.ontouchstart = () => moveRight = true;
  btnRight.ontouchend = () => moveRight = false;
  btnJump.ontouchstart = () => doJump = true;
  btnJump.ontouchend = () => doJump = false;

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
    if (e.key === " ") doJump = true;
  });
  document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
    if (e.key === " ") doJump = false;
  });

  function loop() {
    if (moveRight) px += 4;
    if (moveLeft) px -= 4;
    if (px < 0) px = 0;

    if (doJump && !jumping) {
      vy = 15;
      jumping = true;
      jumpSound.play();
    }

    py += vy;
    vy -= 0.8;

    if (py <= 60) {
      py = 60;
      vy = 0;
      jumping = false;
    }

    player.style.left = px + "px";
    player.style.bottom = py + "px";

    document.getElementById("viewport").style.backgroundPositionX = -px/2 + "px";

    if (enemyAlive) {
      enemyX += enemySpeed * enemyDir;
      if (enemyX > 1200 || enemyX < 400) enemyDir *= -1;
      enemy.style.left = enemyX + "px";
    }

    world.style.left = -(px - 150) + "px";

    if (enemyAlive && collide(player, enemy)) {
      const p = player.getBoundingClientRect();
      const e = enemy.getBoundingClientRect();

      if (p.bottom - e.top < 20 && vy < 0) {
        enemyAlive = false;
        enemy.style.display = "none";
        vy = 10;
        hitSound.play();
      } else {
        lives--;
        livesText.textContent = "❤️ " + lives;
        deadSound.play();
        px = 100;
        if (lives <= 0) {
          alert("💀 انتهت اللعبة");
          location.reload();
        }
      }
    }

    if (collide(player, flag)) nextLevel();

    requestAnimationFrame(loop);
  }

  function nextLevel() {
    level++;
    if (level > 50) {
      alert("🎉 مبروك! أنهيت كل المراحل!");
      location.reload();
    }
    levelText.textContent = "🌍 المرحلة: " + level;
    px = 100;
    enemyX = 600 + level * 10;
    enemySpeed += 0.3;
    enemyAlive = true;
    enemy.style.display = "block";
  }

  function collide(a, b) {
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();
    return r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top;
  }

  loop();
}