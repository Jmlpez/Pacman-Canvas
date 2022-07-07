import Map from "./map.js";
export default class Game {
    static lives = 3;
    static score = 0;
    constructor(levels, width, height, growFactor, images, objects) {
        this.levels = levels;
        this.width = width;
        this.height = height;
        this.growFactor = growFactor;
        this.images = images;
        this.objects = objects;
        this.currentLevel = 0;
        this.isColliding = false;
        this.initGame();
    }
    changeGrowFactor(growFactor) {
        this.growFactor = growFactor;
        this.map.changeGrowFactor(growFactor);
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
    update(ctx) {
        this.map.drawMap(ctx);
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
            }
        }
    }
}
