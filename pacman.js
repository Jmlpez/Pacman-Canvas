import Object from "./object.js";
import Map from "./map.js";

export default class Pacman extends Object {
    constructor(images, deathSprites, growFactor) {
        let pos = { x: 14, y: 17 };
        super(images, growFactor, pos);
        this.deathSprites = deathSprites;
        this.finishDeathAnim = false;
        this.lastDir = 5;
        this.type = "pacman";
    }
    move() {
        super.move();
        if (this.lastDir != 5 && this.isValidPos() && Map.canMove(this.pos, this.lastDir)) {
            // console.log(this.pos, this.lastDir);
            this.dir = this.lastDir;

            this.lastDir = 5;
            this.speed = 0.1;
        }
    }
    draw(ctx) {
        let count = Math.floor(this.animCount / 10) % 2;
        let img = count == 0 ? this.images[this.dir] : this.images[4];
        // console.log(img);
        this.animCount++;
        ctx.drawImage(img, this.pos.x * this.growFactor.x, this.pos.y * this.growFactor.y, this.size, this.size);
    }
    setDir(dir) {
        if (
            (dir == 0 && this.dir == 1) ||
            (dir == 2 && this.dir == 3) ||
            (dir == 1 && this.dir == 0) ||
            (dir == 3 && this.dir == 2)
        ) {
            this.dir = dir;
        } else {
            this.lastDir = dir;
        }
        this.speed = 0.1;
    }
    death(ctx) {
        let count = Math.floor(this.animCount / 10) % 6;
        let img = this.deathSprites[count];
        ctx.drawImage(img, this.pos.x * this.growFactor.x, this.pos.y * this.growFactor.y, this.size, this.size);
        this.animCount++;
        if (this.animCount >= 60) this.finishDeathAnim = true;
    }
}
