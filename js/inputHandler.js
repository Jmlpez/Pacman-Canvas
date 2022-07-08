import Game from "./game.js";
import { GAME_STATES } from "./game.js";

export default class InputHandler {
    constructor(pacman, game) {
        this.pacman = pacman;
        this.game = game;
        this.posInicial = {};
        this.handleInput();
    }
    handleInput() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.pacman.setDir(0);
                    break;
                case "ArrowRight":
                    this.pacman.setDir(1);
                    break;
                case "ArrowUp":
                    this.pacman.setDir(2);
                    break;
                case "ArrowDown":
                    this.pacman.setDir(3);
                    break;
                case " ":
                    if (Game.gameState == GAME_STATES.GAMEOVER || Game.gameState == GAME_STATES.WIN) {
                        this.game.reset();
                    }
                    break;
                default:
                    break;
            }
        });
        document.addEventListener("touchstart", (event) => {
            this.posInicial = event.touches[0];
            if (Game.gameState == GAME_STATES.GAMEOVER || Game.gameState == GAME_STATES.WIN) {
                this.game.reset();
            }
        });
        document.addEventListener("touchmove", (event) => {
            const dir = this.handleTouchMove(this.posInicial, event.touches[0]);
            if (dir != undefined) this.pacman.setDir(dir);
        });
    }
    //Handle touch Events
    handleTouchMove(posIni = {}, posFin = {}) {
        let elV = posFin.pageY - posIni.pageY;
        let elH = posFin.pageX - posIni.pageX;
        if (elV >= 65 || elV <= -65) {
            if (elV <= -65) {
                //moveUp

                return 2;
            } else {
                //moveDown

                return 3;
            }
        }
        if (elH >= 65 || elH <= -65) {
            if (elH <= -65) {
                //moveLeft

                return 0;
            } else {
                //moveRight
                return 1;
            }
        }
    }
}
