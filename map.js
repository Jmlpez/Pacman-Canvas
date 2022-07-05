/*
0 -left
1- right
2- top
3- bottom
*/

import Game from "./game.js";

export default class Map {
    static map = [];
    static limits = {};

    static canMove(pos = {}, dir) {
        if (dir === 0) {
            if (Map.map[pos.y][pos.x - 1] === "X") {
                return false;
            }
        } else if (dir === 1) {
            if (Map.map[pos.y][pos.x + 1] === "X") {
                return false;
            }
        } else if (dir === 2) {
            if (Map.map[pos.y - 1][pos.x] === "X") {
                return false;
            }
        } else if (dir === 3) {
            if (Map.map[pos.y + 1][pos.x] === "X") {
                return false;
            }
        }
        return true;
    }

    constructor(map, width, height, growFactor, images, [pacman, ...enemys]) {
        Map.map = map;
        Map.limits = { x: map[0].length, y: map.length };
        this.width = width;
        this.height = height;
        this.growFactor = growFactor;
        this.images = images;
        this.pacman = pacman;
        this.enemys = enemys;
    }
    drawMap(ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < Map.map.length; i++) {
            for (let j = 0; j < Map.map[i].length; j++) {
                if (Map.map[i][j] === "X") {
                    ctx.drawImage(
                        this.images.rockImg,
                        j * this.growFactor.y,
                        i * this.growFactor.x,
                        this.growFactor.y,
                        this.growFactor.x
                    );
                } else if (Map.map[i][j] === "o") {
                    ctx.drawImage(
                        this.images.foodImg,
                        j * this.growFactor.y,
                        i * this.growFactor.x,
                        this.growFactor.y,
                        this.growFactor.x
                    );
                }
            }
        }
        this.objectCollisions();
        [this.pacman, ...this.enemys].forEach((obj) => {
            obj.updateSprite(ctx);
        });
    }
    updateMap(str = "", pos, char = "") {
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            newStr += pos != i ? str[i] : char;
        }
        return newStr;
    }
    objectCollisions() {
        [this.pacman, ...this.enemys].forEach((obj) => {
            let pos = obj.getPos();
            let collision = !Map.canMove(pos, obj.dir);

            if (Map.map[pos.y][pos.x] === "o" && obj.type == "pacman") {
                Map.map[pos.y] = this.updateMap(Map.map[pos.y], pos.x, " ");
                //increase the score...
                Game.score++;

                let coinAudio = document.querySelector("#coinSound");
                // document.querySelector("audio").p
                coinAudio.currentTime = 0;
                coinAudio.play();
            }
            if (collision) {
                obj.stop();
            }
        });
    }
    deathCollision() {
        for (let i = 0; i < this.enemys.length; i++)
            if (this.pacman.collision(this.enemys[i])) {
                this.pacman.animCount = 0;
                return true;
            }

        return false;
    }
    stop() {
        [this.pacman, ...this.enemys].forEach((obj) => {
            obj.stop();
        });
    }
    resetMap() {
        [this.pacman, ...this.enemys].forEach((obj) => {
            obj.resetPos();
        });
    }
}
