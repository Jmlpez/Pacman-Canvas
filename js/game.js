import Map from "./map.js";
import Score from "./score.js";

export const GAME_STATES = {
    RUNNING: 0,
    GAMEOVER: 1,
    WIN: 2,
};

export const saveLevel = (map = []) => {
    let copiaMap = [];
    for (let i = 0; i < map.length; i++) {
        copiaMap.push(map[i].slice(0));
    }
    return copiaMap;
};

export default class Game {
    static lives = 1;
    static scoreValue = 0;
    static gameState = GAME_STATES.RUNNING;
    static updateLives = () => {
        Game.lives--;
        if (Game.lives == 0) {
            Game.gameState = GAME_STATES.GAMEOVER;
        }
    };

    constructor(levels, width, height, growFactor, images, objects) {
        this.levels = levels;
        this.currentLevel = 0;
        this.copiaLevel = saveLevel(levels[this.currentLevel]);
        this.width = width;
        this.height = height;
        this.growFactor = growFactor;
        this.images = images;
        this.objects = objects;
        this.currentLevel = 0;
        this.isColliding = false;

        this.score = new Score(growFactor, { x: 0, y: 11 });
        this.livesImg = this.objects[0].images[0]; //primera imagen del pacman representa las vidas
        this.initGame();
    }
    changeGrowFactor(growFactor) {
        this.growFactor = growFactor;
        this.map.changeGrowFactor(growFactor);
        this.score.changeGrowFactor(growFactor);
        this.objects.forEach((obj) => {
            obj.changeGrowFactor(growFactor);
        });
    }
    initGame() {
        this.map = new Map(
            this.levels[this.currentLevel],
            this.width,
            this.height,
            this.growFactor,
            this.images,
            this.objects
        );
    }
    drawLives(ctx) {
        let pos = { x: 24, y: 11 };
        for (let i = 0; i < Game.lives; i++) {
            ctx.drawImage(
                this.livesImg,
                pos.x * this.growFactor.x + i * this.growFactor.x,
                pos.y * this.growFactor.y,
                this.growFactor.x,
                this.growFactor.y
            );
        }
    }
    checkDeathCollision(ctx) {
        if (!this.isColliding && this.map.deathCollision()) {
            this.map.stop();
            this.isColliding = true;
            this.map.pacman.animCount = 0;
        } else if (this.isColliding) {
            this.map.pacman.stop();
            document.querySelector("#deathSound").play();
            this.map.pacman.death(ctx);
            if (this.map.pacman.finishDeathAnim) {
                this.isColliding = false;
                this.map.pacman.finishDeathAnim = false;
                this.map.resetMap();

                //Cuando termine la animacion de la muerte de pacman actualizo las vidas
                Game.updateLives();
            }
        }
    }
    update(ctx) {
        if (Game.gameState == GAME_STATES.RUNNING) {
            this.map.drawMap(ctx);
            this.score.drawScore(ctx, `score ${Game.scoreValue}`);
            this.drawLives(ctx);
            this.checkDeathCollision(ctx);
        } else if (Game.gameState == GAME_STATES.GAMEOVER) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, this.width, this.height);
            let deathText = [`game over`, `score ${Game.scoreValue}`, "Press spacebar to play again"];
            for (let i = 0; i < deathText.length; i++) {
                this.score.drawText(ctx, deathText[i].toLowerCase(), { x: 0, y: i * 2 + 12 }, this.growFactor);
            }
        } else if (Game.gameState == GAME_STATES.WIN) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, this.width, this.height);
            let winText = ["You Win", "You got all the points", "Press spacebar to play again"];
            for (let i = 0; i < winText.length; i++) {
                this.score.drawText(ctx, winText[i].toLowerCase(), { x: 0, y: i * 2 + 12 }, this.growFactor);
            }
        }
    }
    reset() {
        this.map.resetMap();
        this.map.changeMap(this.copiaLevel);
        Game.gameState = GAME_STATES.RUNNING;
        Game.lives = 3;
        Game.scoreValue = 0;
        this.map.maxScore = this.map.getMaxScore();
    }
}
