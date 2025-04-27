const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');
const restartBtn = document.getElementById('restart');

const GRAVITY = 0.5;
const FLAP = -8;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2.5;

let bird, pipes, score, gameOver, frame;

function resetGame() {
    bird = {
        x: 80,
        y: canvas.height / 2 - BIRD_SIZE / 2,
        vy: 0,
        width: BIRD_SIZE,
        height: BIRD_SIZE
    };
    pipes = [];
    score = 0;
    gameOver = false;
    frame = 0;
    gameOverDiv.style.display = 'none';
    scoreDiv.textContent = 'Score: 0';
}

function flap() {
    if (!gameOver) bird.vy = FLAP;
}

// Corrige bug do Firefox: força o foco no canvas para garantir que eventos de teclado funcionem corretamente
window.onload = () => {
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        flap();
        e.preventDefault();
    }
});

canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        flap();
        e.preventDefault();
    }
});

restartBtn.onclick = () => {
    resetGame();
    requestAnimationFrame(loop);
};

function drawBird() {
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = '#27ae60';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fundo azul claro
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
}

function update() {
    bird.vy += GRAVITY;
    bird.y += bird.vy;

    // Garante que o pássaro não comece fora da tela
    if (bird.y < 0) bird.y = 0;
    if (bird.y + bird.height > canvas.height) bird.y = canvas.height - bird.height;

    if (frame % 90 === 0) {
        const top = Math.random() * (canvas.height - PIPE_GAP - 100) + 40;
        pipes.push({
            x: canvas.width,
            top: top,
            bottom: top + PIPE_GAP,
            passed: false
        });
    }
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
    });
    // Remove pipes fora da tela
    if (pipes.length && pipes[0].x + PIPE_WIDTH < 0) pipes.shift();

    // Colisão
    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + PIPE_WIDTH &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver = true;
        }
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            score++;
            pipe.passed = true;
            scoreDiv.textContent = 'Score: ' + score;
        }
    });
    // Colisão com chão/teto
    if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
        gameOver = true;
    }
}

function loop() {
    if (!gameOver) {
        update();
        draw();
        frame++;
        requestAnimationFrame(loop);
    } else {
        gameOverDiv.style.display = 'block';
    }
}

resetGame();
draw();
requestAnimationFrame(loop);
