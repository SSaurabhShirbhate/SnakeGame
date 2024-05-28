// Constants and Variables
let inputDir = { x: 0, y: 0 };
const foodAudio = new Audio("food.mp3");
const gameOverAudio = new Audio("gameover.mp3");
const gameSound = new Audio("gamesound.mp3");
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 5 };

// Game Functions
function main(cTime) {
    window.requestAnimationFrame(main);
    if ((cTime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = cTime;
    gameEngine();
}

function isCollide(snake) {
    // Check if snake hits itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Check if snake hits wall
    if (snake[0].x >= 36 || snake[0].x <= 0 || snake[0].y >= 24 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Check for collision
    if (isCollide(snakeArr)) {
        gameOverAudio.play();
        gameSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again.");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        speed = 8; // Reset speed
        scoreBox.innerHTML = "Score: " + score;
        gameSound.currentTime = 0; // Reset game sound
        // gameSound.play();
        return;
    }

    // Check if snake eats food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodAudio.play();
        score += 1;
        if (score > hiscoreVal) {
            hiscoreVal = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreVal));
            hiscoreBox.innerHTML = "High Score: " + hiscoreVal;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: 2 + Math.round(34 * Math.random()), y: 2 + Math.round(22 * Math.random()) };
        // Increase speed as score increases
        speed = 8 + Math.floor(score / 5);
    } else {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        snakeArr.pop();
    }

    // Display snake and food
    const panel = document.getElementById("panel");
    panel.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("body");
        }
        panel.appendChild(snakeElement);
    });

    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    panel.appendChild(foodElement);
}

// Main logic
let hiscore = localStorage.getItem("hiscore");
let hiscoreVal = hiscore ? JSON.parse(hiscore) : 0;
hiscoreBox.innerHTML = "High Score: " + hiscoreVal;

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (inputDir.x === 0 && inputDir.y === 0) {
        gameSound.currentTime = 0;
        // gameSound.play();
    }

    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
        default:
            break;
    }
});
