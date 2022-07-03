import Object from "./object.js";
import Map from "./map.js";

export default class Enemy extends Object {
    constructor(images, growFactor) {
        super(images, growFactor);
        this.pos = { x: 11, y: 11 };
        this.dir = 1;
        this.type = "monster";
    }
    move() {
        super.move();
        if (this.isValidPos()) {
            let newDirs = [];
            for (let d = 0; d < 4; d++) {
                if (this.inverseDir() == d) continue;
                if (Map.canMove(this.pos, d)) newDirs.push(d);
            }
            let rand = Math.floor(Math.random() * newDirs.length);
            this.dir = newDirs[rand];
        }
    }
    draw(ctx) {
        ctx.drawImage(
            this.images[0],
            this.pos.x * this.growFactor.x,
            this.pos.y * this.growFactor.y,
            this.size,
            this.size
        );
    }
}
