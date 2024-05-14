let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//avatar
let avatarWidth = 46;
let avatarHeight = 46;
let avatarX = boardWidth / 2 - avatarWidth / 2;
let avatarY = boardHeight * 7 / 8 - avatarHeight;
let avatarRightImg;
let avatarLeftImg;
let avatar = {
    img: null,
    x: avatarX,
    y: avatarY,
    width: avatarWidth,
    height: avatarHeight
}

//physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -7;
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 80;
let platformHeight = 40;
let platformImg;

//game progress
let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    avatarRightImg = new Image();
    avatarRightImg.src = "./luffyright.png";
    avatar.img = avatarRightImg;
    avatarRightImg.onload = function () {
        context.drawImage(avatar.img, avatar.x, avatar.y, avatar.width, avatar.height);
    }

    avatarLeftImg = new Image();
    avatarLeftImg.src = "./luffyleft.png";

    platformImg = new Image();
    platformImg.src = "./goingmerry.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveavatar);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //avatar
    avatar.x += velocityX;
    if (avatar.x > boardWidth) {
        avatar.x = 0;
    }
    else if (avatar.x + avatar.width < 0) {
        avatar.x = boardWidth;
    }

    velocityY += gravity;
    avatar.y += velocityY;
    if (avatar.y > board.height) {
        gameOver = true;
    }
    context.drawImage(avatar.img, avatar.x, avatar.y, avatar.width, avatar.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && avatar.y < boardHeight * 2 / 4) {
            platform.y -= initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
        if (detectCollision(avatar, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }
    }

    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        newPlatform();
    }

    //score
    context.fillStyle = "white";
    context.font = "18px poppins";
    updateScore();
    context.fillText(score-140, 5, 20);

    if (gameOver) {
        context.fillStyle = "red"
        context.font = "16px poppins";
        context.fillText("Game Over: Tap or \"Space\" to Restart", boardWidth / 10, boardHeight / 2);
    }
}

function moveavatar(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD" || e == "right") {
        velocityX = 4;
        avatar.img = avatarRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA" || e == "left") {
        velocityX = -4;
        avatar.img = avatarLeftImg;
    }
    if ((e.code == "Space" || e == "right" || e == "left") && gameOver) {
        avatar = {
            img: avatarRightImg,
            x: avatarX,
            y: avatarY,
            width: avatarWidth,
            height: avatarHeight
        }
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight / 2,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = 10;
    if (velocityY<=-1) {
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}

