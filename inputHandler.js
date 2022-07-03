export default class InputHandler {
    constructor(pacman) {
        this.pacman = pacman;
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
                default:
                    break;
            }
        });
    }
}
