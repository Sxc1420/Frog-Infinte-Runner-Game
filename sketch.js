var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var frog, frogImage;
var jungle, jungleImage, invisbleGround;

var obstaclesGroup, obstacle1;
var shrubsGroup, shrub1, shrub2, shrub3;

var score = 0;

var game0ver, gameOverImg, restart, restartImg;
var jumpSound, collidedSound;

function preload() {
    frogImage = loadImage("assets/frog.png");
    jungleImage = loadImage("assets/bg.png");
    shrub1 = loadImage("assets/shrub1.png");
    shrub2 = loadImage("assets/shrub2.png");
    shrub3 = loadImage("assets/shrub3.png");
    obstacle1 = loadImage("assets/stone.png");
    gameOverImg = loadImage("assets/gameOver.png");
    restartImg = loadImage("assets/restart.png");

    jumpSound = loadSound("assets/jump.wav");
    collidedSound = loadSound("assets/collided.wav");
}

function setup() {
    createCanvas(800, 400);

    jungle = createSprite(400, 100, 400, 20);
    jungle.addImage("jungle", jungleImage);
    jungle.scale = 0.3;
    jungle.x = width/2;

    frog = createSprite(50, 200, 20, 50);
    frog.addImage("frog", frogImage);
    frog.scale = 0.15;
    frog.setCollider("circle", 0, 0, 300);

    invisbleGround = createSprite(400, 370, 1600, 10);
    invisbleGround.visible = false;

    game0ver = createSprite(400, 100);
    game0ver.addImage("gameOver", gameOverImg);

    restart = createSprite(550, 140);
    restart.addImage("restart", restartImg);

    game0ver.scale = 0.5;
    restart.scale = 0.1;

    game0ver.visible = false;
    restart.visible = false;

    shrubsGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;
}

function draw() {
    background(255);

    frog.x = camera.position.x - 270;

    game0ver.visible = false;
    restart.visible = false;

    if(gameState === PLAY) {
        jungle.velocityX = -3;

        if(jungle.x < 100) {
            jungle.x = 400;
        }

        console.log(frog.y);

        if(keyDown("space") && frog.y > 270) {
            jumpSound.play();
            frog.velocityY = -16;
        }

        frog.velocityY = frog.velocityY + 0.8;

        spawnShrubs();
        spawnObstacles();

        frog.collide(invisbleGround);

        if(obstaclesGroup.isTouching(frog)) {
            collidedSound.play();
            gameState = END;
        }

        if(shrubsGroup.isTouching(frog)) {
            score = score + 1;
            shrubsGroup.destroyEach();
        }
    } else if (gameState === END) {
        game0ver.x = camera.position.x;
        restart.x = camera.position.x;

        game0ver.visible = true;
        restart.visible = true;

        frog.velocityY = 0;
        jungle.velocityX = 0;

        obstaclesGroup.setVelocityEach(0);
        shrubsGroup.setVelocityEach(0);

        obstaclesGroup.setLifetimeEach(-1);
        shrubsGroup.setLifetimeEach(-1);

        if(mousePressedOver(restart)) {
            reset();
        }
    } else if (gameState === WIN) {
        jungle.velocityX = 0;
        frog.velocityY = 0;

        obstaclesGroup.setVelocityEach(0);
        shrubsGroup.setVelocityEach(0);

        obstaclesGroup.setLifetimeEach(-1);
        shrubsGroup.setLifetimeEach(-1);
    }

    drawSprites();

    textSize(20);
    stroke(3);
    fill("black");
    text("Score: " + score, camera.position.x, 50);

    if(score >= 5) {
        frog.visible = false;
         
        textSize(30);
        stroke(3);
        fill("black");
        text("Congratulations!! You won the game!! ", 120, 200);

        gameState = WIN;
    }
}

function spawnShrubs() {
    if(frameCount % 150 === 0) {
        var shrub = createSprite(camera.position.x + 500, 330, 40, 10);

        shrub.velocityX = -(6 + 3 * score/100);
        shrub.scale = 0.6;

        var rand = Math.round(random(1,3));
        
        switch(rand) {
            case 1: shrub.addImage(shrub1);
                    break;
            case 2: shrub.addImage(shrub2);
                    break;
            case 3: shrub.addImage(shrub3);
                    break;
            default: break;
        }

        shrub.scale = 0.05;
        shrub.lifetime = 400;

        shrub.setCollider("rectangle", 0, 0, shrub.width/2, shrub.height/2);
        shrubsGroup.add(shrub);
    }
}

function spawnObstacles() {
    if(frameCount % 120 === 0) {
        var obstacle = createSprite(camera.position.x + 400, 330, 40, 40);

        obstacle.setCollider("rectangle", 0, 0, 200, 200);
        obstacle.addImage(obstacle1);
        obstacle.velocityX = -(6 + 3 * score/100);
        obstacle.scale = 0.15;

        obstacle.lifetime = 400;
        obstaclesGroup.add(obstacle);
    }
}

function reset() {
    gameState = PLAY;

    game0ver.visible = false;
    restart.visisble = false;
    frog.visible = true;

    obstaclesGroup.destroyEach();
    shrubsGroup.destroyEach();

    score = 0;
}
