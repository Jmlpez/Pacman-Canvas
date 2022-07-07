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
    static nonObstacles = [];

    static canMove(pos = {}, dir) {
        if (dir === 0) {
            // pos.y--;
            if (Map.isObstacle({ y: pos.y, x: pos.x - 1 })) {
                return false;
            }
        } else if (dir === 1) {
            if (Map.isObstacle({ y: pos.y, x: pos.x + 1 })) {
                return false;
            }
        } else if (dir === 2) {
            if (Map.isObstacle({ y: pos.y - 1, x: pos.x })) {
                return false;
            }
        } else if (dir === 3) {
            if (Map.isObstacle({ y: pos.y + 1, x: pos.x })) {
                return false;
            }
        }
        return true;
    }

    static isObstacle(pos = {}) {
        let flag = Map.nonObstacles.find((obs) => obs == Map.map[pos.y][pos.x]);
        if (flag) return false;
        return true;
    }

    constructor(map, width, height, growFactor, images, [pacman, ...enemys]) {
        Map.map = map;
        Map.limits = { x: map[0].length, y: map.length };
        Map.nonObstacles = ["S", "T", "V", " "];

        this.width = width;
        this.height = height;
        this.growFactor = growFactor;
        this.images = images;
        this.pacman = pacman;
        this.enemys = enemys;
    }
    changeGrowFactor(growFactor) {
        this.growFactor = growFactor;
    }
    drawMap(ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < Map.map.length; i++) {
            for (let j = 0; j < Map.map[i].length; j++) {
                if (Map.map[i][j] != " ")
                    ctx.drawImage(
                        this.images[Map.map[i][j]],
                        j * this.growFactor.y,
                        i * this.growFactor.x,
                        this.growFactor.y,
                        this.growFactor.x
                    );
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

            if ((Map.map[pos.y][pos.x] === "T" || Map.map[pos.y][pos.x] === "V") && obj.type == "pacman") {
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
