import InputHandler from "./inputHandler.js";
import Map from "./map.js";
// import Object from "./object.js";
import Pacman from "./pacman.js";
import Enemy from "./enemy.js";
import Game from "./game.js";

// DOM
const rockImg = document.querySelector("#rock");
const foodImg = document.querySelector("#food");
const enemyImg = document.querySelector("#ghosts");
const pacmanImg = document.querySelector("#pacman");
const deathImg = document.querySelector("#death");
const mazeImg = document.querySelector("#maze-parts");

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let map,
    game,
    pacman,
    inputHandler,
    enemys = [];
let pacmanImgArr = [],
    deathPacmanArr = [],
    mazeImgsArr = [],
    mazeImgsObj = {};

let newMapArr = [
    "bkkkkkkkkkkkkRQkkkkkkkkkkkka",
    "dTTTTTTTTTTTTzyTTTTTTTTTTTTc",
    "dTxoowTxooowTzyTxooowTxoowTc",
    "dVzSSyTzSSSyTzyTzSSSyTzSSyVc",
    "dTBuuATBuuuATBATBuuuATBuuATc",
    "dTTTTTTTTTTTTTTTTTTTTTTTTTTc",
    "dTxoowTxwTxoooooowTxwTxoowTc",
    "dTBuuATzyTBuuJIuuATzyTBuuATc",
    "dTTTTTTzyTTTTzyTTTTzyTTTTTTc",
    "fmmmmwTzKoowSzySxooLyTxmmmme",
    "SSSSSdTzIuuASBASBuuJyTcSSSSS",
    "SSSSSdTzySSSSSSSSSSzyTcSSSSS",
    "SSSSSdTzySDmH  GmCSzyTcSSSSS",
    "kkkkkATBAScSSSSSSdSBATBkkkkk",
    "SSSSSSTSSScSSSSSSdSSSTSSSSSS",
    "mmmmmwTxwScSSSSSSdSxwTxmmmmm",
    "SSSSSdTzySFkkkkkkESzyTcSSSSS",
    "SSSSSdTzySSSSSSSSSSzyTcSSSSS",
    "SSSSSdTzySxoooooowSzyTcSSSSS",
    "bkkkkATBASBuuJIuuASBATBkkkka",
    "dTTTTTTTTTTTTzyTTTTTTTTTTTTc",
    "dTxoowTxooowTzyTxooowTxoowTc",
    "dTBuJyTBuuuATBATBuuuATzIuATc",
    "dVTTzyTTTTTTTSSTTTTTTTzyTTVc",
    "howTzyTxwTxoooooowTxwTzyTxog",
    "juATBATzyTBuuJIuuATzyTBATBui",
    "dTTTTTTzyTTTTzyTTTTzyTTTTTTc",
    "dTxooooLKoowTzyTxooLKoooowTc",
    "dTBuuuuuuuuATBATBuuuuuuuuATc",
    "dTTTTTTTTTTTTTTTTTTTTTTTTTTc",
    "fmmmmmmmmmmmmmmmmmmmmmmmmmme",
];

// let mapArr = [
//     "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//     "X  o |o o o XXXXX o o o| o  X",
//     "X XXX XXXXX XXXXX XXXXX XXX X",
//     "XoXXX XXXXX XXXXX XXXXX XXXoX",
//     "X      o|o   o o   o|o      X",
//     "XoXXXoXX XXXXXXXXXXX XXoXXXoX",
//     "X    |XX    |XXX|    XX     X",
//     "XoXXXoXXXXXX XXX XXXXXXoXXXoX",
//     "X XXXoXX ooo|ooo|ooo XXoXXX X",
//     " o   |XX XXXXXXXXXXX XX|   o ",
//     "X XXXoXX XXXXXXXXXXX XXoXXX X",
//     "XoXXXoXX oo |ooo|ooo XXoXXXoX",
//     "X XXXoXXXXXX XXX XXXXXXoXXX X",
//     "X     XX     XXX     XX     X",
//     "X XXXoXX XXXXXXXXXXX XXoXXX X",
//     "XoXXX| o| o o o o o |o |XXXoX",
//     "X XXXoXXXX XXXXXXXX XXX XXX X",
//     "XoXXXoXXXX          XXX XXXoX",
//     "X  o |o o  XXXXXXXX o o| o  X",
//     "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
// ];

// const MAX_ROW = 20, //31
//     MAX_COL = 29; // 28

const MAX_ROW = newMapArr.length, //31
    MAX_COL = newMapArr[0].length; // 28

const maskColor = {
    r: 255,
    g: 0,
    b: 255,
};

//The objects size is 30 in this case
canvas.width = MAX_COL * 20;
canvas.height = MAX_ROW * 20;

let growFactor = {
    x: parseInt(canvas.width) / MAX_COL,
    y: parseInt(canvas.height) / MAX_ROW,
};

window.addEventListener("resize", () => {
    // let bodyStyle = getComputedStyle(document.body);
    // canvas.width = parseInt(bodyStyle.width);
    // canvas.height = parseInt(bodyStyle.height);
    // console.log(canvas.width);
    // growFactor = {
    //     x: parseInt(canvas.width) / MAX_COL,
    //     y: parseInt(canvas.height) / MAX_ROW,
    // };
    // game.changeGrowFactor(growFactor);
});

// Apply mask to the pink color
const applyMask = (maskColor) => {
    const canvasImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = canvasImgData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] == maskColor.r && data[i + 1] == maskColor.g && data[i + 2] == maskColor.b) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(canvasImgData, 0, 0);
};

const updateGame = () => {
    game.update(ctx);
    applyMask(maskColor);
};

const gameLoop = async (timestamp) => {
    updateGame();
    requestAnimationFrame(gameLoop);
};

const createObjects = async () => {
    for (let i = 0; i < 5; i++) {
        pacmanImgArr.push(await createImageBitmap(pacmanImg, i * 33, 0, 33, 33));
    }
    for (let i = 0; i < 7; i++) {
        deathPacmanArr.push(await createImageBitmap(deathImg, i * 33, 0, 33, 33));
    }

    //There are 4 enemys and 8 enemys direction;
    let enemysArrImg = [];
    for (let i = 0; i < 4; i++) {
        let enemySprites = [];
        for (let j = 0; j < 8; j++) {
            enemySprites.push(await createImageBitmap(enemyImg, 16 * j, 16 * i, 16, 16));
        }
        // because of the sprites, is must start left and not right (changing the photo in paint would solve the problem....)
        [enemySprites[0], enemySprites[2]] = [enemySprites[2], enemySprites[0]];
        [enemySprites[1], enemySprites[3]] = [enemySprites[3], enemySprites[1]];
        // because of the sprites, is must start left and not right (changing the photo in paint would solve the problem....)
        enemysArrImg.push(enemySprites);
    }

    mazeImgsArr = [];
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 16; j++) {
            let newImg = await createImageBitmap(mazeImg, 8 * j + j, 8 * i + i, 8, 8);
            mazeImgsArr.push(newImg);
        }

    mazeImgsObj = {};
    let count = 0;
    // Maze parts codes
    for (let i = "a".charCodeAt(); i <= "z".charCodeAt(); i++)
        mazeImgsObj[String.fromCharCode(i)] = mazeImgsArr[count++];
    for (let i = "A".charCodeAt(); i <= "Z".charCodeAt(); i++)
        mazeImgsObj[String.fromCharCode(i)] = mazeImgsArr[count++];
    // Maze parts codes

    pacman = new Pacman(pacmanImgArr, deathPacmanArr, growFactor);

    //Son 4 enemigos distintos
    for (let i = 0; i < enemysArrImg.length; i++) {
        enemys.push(new Enemy(enemysArrImg[i], growFactor));
    }
};

window.addEventListener("load", async () => {
    await createObjects();
    game = new Game([newMapArr], canvas.width, canvas.height, growFactor, mazeImgsObj, [pacman, ...enemys]);
    inputHandler = new InputHandler(pacman);
    requestAnimationFrame(gameLoop);
});
