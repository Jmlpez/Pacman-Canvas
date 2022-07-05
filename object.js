import Map from "./map.js";

export default class Object {
    static collision_dist = 0.7;
    constructor(images, growFactor, pos) {
        this.pos = pos;
        this.initialPos = { ...this.pos };
        this.speed = 0.1;
        this.dir = 1;
        this.images = images;
        this.growFactor = growFactor;
        this.size = Math.min(growFactor.x, growFactor.y);
        this.animCount = 0;
    }

    trunc() {
        this.pos.x = Math.round(this.pos.x * 10) / 10;
        this.pos.y = Math.round(this.pos.y * 10) / 10;
    }
    isValidPos() {
        return Number.isInteger(this.pos.x) && Number.isInteger(this.pos.y);
    }
    inverseDir() {
        if (this.dir == 0) return 1;
        if (this.dir == 1) return 0;
        if (this.dir == 2) return 3;
        if (this.dir == 3) return 2;
    }
    move() {
        if (this.dir == 0) {
            this.pos.x -= this.speed;
        } else if (this.dir == 1) {
            this.pos.x += this.speed;
        } else if (this.dir == 2) {
            this.pos.y -= this.speed;
        } else if (this.dir == 3) {
            this.pos.y += this.speed;
        }
        if (this.pos.x < 0) this.pos.x = Map.limits.x - 1;
        else if (this.pos.x == Map.limits.x) this.pos.x = 0;
        else if (this.pos.y == 0) this.pos.y = Map.limits.y - 1;
        else if (this.pos.y == Map.limits.y - 1) this.pos.y = 0;

        this.trunc();
    }
    getPos() {
        let pos = {};
        if (this.dir == 0) {
            pos.x = Math.ceil(this.pos.x);
            pos.y = Math.floor(this.pos.y);
        } else if (this.dir == 1) {
            pos.x = Math.floor(this.pos.x);
            pos.y = Math.floor(this.pos.y);
        } else if (this.dir == 2) {
            pos.x = Math.floor(this.pos.x);
            pos.y = Math.ceil(this.pos.y);
        } else if (this.dir == 3) {
            pos.x = Math.floor(this.pos.x);
            pos.y = Math.floor(this.pos.y);
        }
        return pos;
    }
    stop() {
        this.speed = 0;
    }
    updateSprite(ctx) {
        this.move();
        this.draw(ctx);
    }
    draw(ctx) {}

    collision(object = {}) {
        return (
            Math.abs(this.pos.x - object.pos.x) < Object.collision_dist &&
            Math.abs(this.pos.y - object.pos.y) < Object.collision_dist
        );
    }
    resetPos() {
        this.pos = { ...this.initialPos };
        this.dir = Math.floor(Math.random() * 4);
        this.speed = 0.1;
        this.animCount = 0;
    }
}
