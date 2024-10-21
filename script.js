
/*document.getElementById('start-btn').addEventListener('click' , function(){

let count = 0 ;
let documentLog = 2;
const StopProject = false;

documentLog.style:


}); */


const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score;
let scoreText;
let highScore;
let highScoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

class Player {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTime = 0;
    }

    Animate() {
        if (keys['Space'] || keys['KeyW']) {
            this.Jump();
        } else {
            this.jumpTime = 0;
        }

        if (keys['ShiftLeft'] || keys['KeyS']) {
        this.h = this.originalHeight / 2;
        } else {
            this.h = this.originalHeight;
        }

        this.y += this.dy;

        if (this.y + this.h >= canvas.height) {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h;
        } else {
            this.dy += gravity;
            this.grounded = false;
        }

        this.Draw();
    }

    Jump() {
        if (this.grounded && this.jumpTime == 0) {
            this.jumpTime = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTime > 0 && this.jumpTime < 15) {
            this.jumpTime++;
            this.dy = -this.jumpForce - (this.jumpTime / 50);
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}

class Obstacle {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed;
    }

    Update() {
        this.x += this.dx;
        this.Draw();
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}

class Text {
    constructor(t, x, y, a, c, s) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.t, this.x, this.y);
        ctx.closePath();
    }
}

function SpawnObstacle() {
    let size = RandomIntInRange(20, 70);
    let type = RandomIntInRange(0, 1);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#24B4E5');

    if (type == 1) {
        obstacle.y -= player.originalHeight - 10;
    }
    obstacles.push(obstacle);
}

function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function Start() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = '20px sans-serif';

    gameSpeed = 3;
    gravity = 1;

    score = 0;
    highScore = 0;
    if (localStorage.getItem('highScore')) {
        highScore = localStorage.getItem('highScore');
    }

    player = new Player(25, 0, 50, 50, '#FF5856');

    scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
    highScoreText = new Text("Highscore: " + highScore, canvas.width - 25, 25, "right", "#212121", "20");

    requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update() {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer--;
    if (spawnTimer <= 0) {
        SpawnObstacle();
        spawnTimer = initialSpawnTimer - gameSpeed * 8;
        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
        }

        if (
            player.x < o.x + o.w &&
            player.x + player.w > o.x &&
            player.y < o.y + o.h &&
            player.y + player.h > o.y
        ) {
            obstacles = [];
            score = 0;
            spawnTimer = initialSpawnTimer;
            gameSpeed = 3;
            window.localStorage.setItem("highscore", highScore);
        }
        o.Update();
    }

    player.Animate();

    score++;
    scoreText.t = "Score: " + score;
    scoreText.Draw();

    if (score > highScore) {
        highScore = score;
        highScoreText.t = "Highscore: " + highScore;
    }

    highScoreText.Draw();

    gameSpeed += 0.003;
}

Start();
