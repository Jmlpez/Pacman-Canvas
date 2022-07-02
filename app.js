// DOM
const rockDOM = document.querySelector("#rock");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const MAX_ROW = 20,
    MAX_COL = 29;

canvas.width = MAX_COL * 30;
canvas.height = MAX_ROW * 30;

const growFactor = {
    x: parseInt(canvas.width) / MAX_COL,
    y: parseInt(canvas.height) / MAX_ROW,
};

console.log(growFactor);

let map = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "X  o |o o o XXXXX o o o| o  X",
    "X XXX XXXXX XXXXX XXXXX XXX X",
    "XoXXX XXXXX XXXXX XXXXX XXXoX",
    "X      o|o   o o   o|o      X",
    "XoXXXoXX XXXXXXXXXXX XXoXXXoX",
    "X    |XX    |XXX|    XX     X",
    "XoXXXoXXXXXX XXX XXXXXXoXXXoX",
    "X XXXoXX ooo|ooo|ooo XXoXXX X",
    " o   |XX XXXXXXXXXXX XX|   o ",
    "X XXXoXX XXXXXXXXXXX XXoXXX X",
    "XoXXXoXX oo |ooo|ooo XXoXXXoX",
    "X XXXoXXXXXX XXX XXXXXXoXXX X",
    "X     XX     XXX     XX     X",
    "X XXXoXX XXXXXXXXXXX XXoXXX X",
    "XoXXX| o| o o o o o |o |XXXoX",
    "X XXXoXXXX XXXXXXXX XXX XXX X",
    "XoXXXoXXXX          XXX XXXoX",
    "X  o |o o  XXXXXXXX o o| o  X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
];

for (let i = 0; i < map.length; i++)
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "X") {
            ctx.drawImage(rockDOM, j * growFactor.y, i * growFactor.x, growFactor.y, growFactor.x);
        }
    }
