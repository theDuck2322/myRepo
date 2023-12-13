let canvas = document.getElementById("window");
let width = canvas.clientWidth;
let height = canvas.clientHeight;
let ctx = canvas.getContext("2d");

let gridSize = 30;

let player = {
    px: 240,
    py: 240,
    size: gridSize,
    segments: [{ px: 240, py: 240 }]  // Initial segment
}

let apple = {
    px: 90,
    py: 90
}
let score = 0;
let highScore = 0;

let appleSpawned = false;

let speed = gridSize;
let currentDirection = null;

function drawGrid() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let i = 0; i <= width; i += gridSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }

    for (let j = 0; j <= height; j += gridSize) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
    }

    ctx.stroke();
}

function drawPlayer() {
    ctx.fillStyle = "#22FF00";
    player.segments.forEach(segment => {
        ctx.fillRect(segment.px, segment.py, player.size, player.size);
    });
}

function movePlayer(e) {
    if (e.key === 'w' && currentDirection !== 'down') {
        currentDirection = 'up';
    }
    if (e.key === 'a' && currentDirection !== 'right') {
        currentDirection = 'left';
    }
    if (e.key === 's' && currentDirection !== 'up') {
        currentDirection = 'down';
    }
    if (e.key === 'd' && currentDirection !== 'left') {
        currentDirection = 'right';
    }
}

function move() {
    let newSegment = { px: player.px, py: player.py };
    
    if (currentDirection === 'up') {
        player.py -= speed;
    }
    if (currentDirection === 'left') {
        player.px -= speed;
    }
    if (currentDirection === 'down') {
        player.py += speed;
    }
    if (currentDirection === 'right') {
        player.px += speed;
    }

    // Add the new segment to the front of the segments array
    player.segments.unshift(newSegment);

    // Remove the last segment if the snake's length exceeds the score
    if (player.segments.length > score + 1) {
        player.segments.pop();
    }
}

function plEat() {
    if (player.px == apple.px && player.py == apple.py) {
        score += 1;
        console.log(score);
        appleSpawned = false;
        let text = document.getElementById("score");
        text.innerHTML = "Score: "+ score + " - High Score: " + highScore;
    }
}

function spawnApple() {
    apple.px = generateRandomNumber(0, width - gridSize);
    apple.py = generateRandomNumber(0, height - gridSize);

    apple.px = Math.round(apple.px / gridSize) * gridSize;
    apple.py = Math.round(apple.py / gridSize) * gridSize;
}

function drawApple() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(apple.px, apple.py, gridSize, gridSize);
}

function checkCollision() {
    // Check if the head collides with the body
    const head = player.segments[0];
    for (let i = 1; i < player.segments.length; i++) {
        const segment = player.segments[i];
        if (head.px === segment.px && head.py === segment.py) {
            gameOver();
            return;
        }
    }

    // Check if the head collides with the canvas boundaries
    if (
        head.px < 0 || head.px >= width ||
        head.py < 0 || head.py >= height
    ) {
        gameOver();
    }
}

function gameOver() {
    alert('Game Over! Your score: ' + score);
    // Optionally, you can reset the game state or perform other actions here
    resetGame();
}

function resetGame() {
    player.px = 240;
    player.py = 240;
    player.segments = [{ px: 240, py: 240 }];
    appleSpawned = false;
    if(score > highScore) highScore = score;
    score = 0;
    document.getElementById("score").innerHTML = "Score: 0 - High Score: " + highScore;
    currentDirection = null;
}

function update() {
    move();
    plEat();
    checkCollision();
    if (appleSpawned == false) {
        spawnApple();
        appleSpawned = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawApple();
    drawPlayer();
    drawGrid();
    
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 150);
    //requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', movePlayer);

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

gameLoop();
