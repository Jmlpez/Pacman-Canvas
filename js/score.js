const numbers = document.querySelector("#numbers");
const textImg = document.querySelector("#text");

const getScoreBitmap = async () => {
    let textArr = {};
    for (let c = 0, char = "a".codePointAt(); c <= 26 && char <= "z".codePointAt(); c++, char++) {
        textArr[String.fromCharCode(char)] = await createImageBitmap(textImg, c * 8, 0, 8, 8);
    }
    for (let c = 0, char = "0".codePointAt(); c <= 9 && char <= "9".codePointAt(); c++, char++) {
        textArr[String.fromCharCode(char)] = await createImageBitmap(numbers, c * 8, 0, 8, 8);
    }

    return textArr;
};

export default class Score {
    constructor(growFactor, pos = {}) {
        this.pos = pos;
        this.growFactor = growFactor;
        Promise.resolve(
            getScoreBitmap().then((arr) => {
                this.textArr = arr;
            })
        );
    }
    changeGrowFactor(growFactor) {
        this.growFactor = growFactor;
    }
    drawScore(ctx, str = "") {
        for (let i = 0; i < str.length; i++) {
            if (str[i] == " ") {
                continue;
            }
            ctx.drawImage(
                this.textArr[str[i]],
                this.pos.x * this.growFactor.x + (i * this.growFactor.x) / 2,
                this.pos.y * this.growFactor.y,
                this.growFactor.x / 2,
                this.growFactor.y / 2
            );
        }
    }
    drawText(ctx, str = "", pos, growFactor) {
        for (let i = 0; i < str.length; i++) {
            if (str[i] == " ") {
                continue;
            }
            ctx.drawImage(
                this.textArr[str[i]],
                pos.x * growFactor.x + i * growFactor.x,
                pos.y * growFactor.y,
                growFactor.x,
                growFactor.y
            );
        }
    }
}
