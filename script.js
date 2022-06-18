class Board {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = []
        this.snake = new Snake(10, 10, this)
        this.applePositionX = 0;
        this.applePositionY = 0;
        this.sizeX = width;
        this.sizeY = height;
    }

    init() {

        let board_container = document.getElementById("board")

        for (let i = 0; i < this.sizeY; i++) {
            this.board[i] = []
            for (let j = 0; j < this.sizeX; j++) {
                this.board[i][j] = " "
                let div = document.createElement("div");
                div.classList.add("field")
                if (i == 0 || i == 20 || j == 0 || j == 20) {
                    div.innerHTML = "x"
                }
                if ((this.sizeX * i + j) % this.sizeX == 0) {
                    div.style.clear = "both"
                }
                board_container.appendChild(div);
                this.board[i][j] = div;
            }
        }
        console.table(this.board)
        this.snake.draw()
        this.spawnApple();

        window.addEventListener("keydown", (e) => { this.snake.changeDirection(this, e.keyCode) })

        setInterval(() => {
            this.cleanBoard()
            this.snake.move()
            this.snake.draw()
        }, 100);
    }

    cleanBoard() {
        for (let i = 0; i < this.sizeY; i++) {
            for (let j = 0; j < this.sizeX; j++) {
                if (this.board[i][j].innerHTML === "o") {
                    this.board[i][j].style.backgroundColor = "green"
                }
                else {
                    this.board[i][j].style.backgroundColor = "#286ba1"
                }
            }
        }
    }

    randomPosition() {
        this.applePositionY = Math.floor(Math.random() * (this.sizeX - 2)) + 1;
        this.applePositionX = Math.floor(Math.random() * (this.sizeY - 2)) + 1;
        console.log(this.applePositionX, this.applePositionY)
    }

    spawnApple() {
        let ok = true
        this.randomPosition();
        do {
            ok = true
            for (let i = 0; i < this.snake.listElements.length; i++) {
                if (this.applePositionX == this.snake.listElements[i].x && this.applePositionY == this.snake.listElements[i].y) {
                    console.log("NA MNIE")
                    ok = false
                    this.randomPosition()
                    break
                }
            }
        } while (ok == false)
        this.board[this.applePositionX][this.applePositionY].innerHTML = "o"
    }

    eatApple() {
        this.snake.listElements.push({ x: this.snake.head_position_x - (this.snake.listElements.length - 1), y: this.snake.head_position_y - (this.snake.listElements.length - 1) })
        this.board[this.applePositionX][this.applePositionY].innerHTML = ""
        this.spawnApple()
    }
}

class Snake {
    constructor(head_position_x, head_position_y, board) {
        this.board = board;
        this.listElements = [{ x: head_position_x, y: head_position_y }, { x: head_position_x - 1, y: head_position_y }]
        this.i = 0;
        this.direction_x = 1;
        this.direction_y = 0;
    }

    draw() {
        for (let i = 0; i < this.listElements.length; i++) {
            this.board.board[this.listElements[i].x][this.listElements[i].y].style.backgroundColor = "pink"
        }
    }

    move() {
        if (this.listElements[0].x == this.board.applePositionX && this.listElements[0].y == this.board.applePositionY) {
            this.board.eatApple()
        }

        if (this.listElements[0].x == 0 || this.listElements[0].x == this.board.sizeX - 1 || this.listElements[0].y == 0 || this.listElements[0].y == this.board.sizeY - 1 || this.listElements.slice(1).find(el => el.x == this.listElements[0].x && el.y == this.listElements[0].y) != undefined) {
            this.die()
        }
        this.listElements = [{ x: this.listElements[0].x + this.direction_x, y: this.listElements[0].y + this.direction_y }].concat(this.listElements)
        this.listElements.splice(-1, 1)
    }

    changeDirection(element, pressedKey) {
        if (pressedKey === 38 || pressedKey === 87) {
            this.direction_x = -1;
            this.direction_y = 0;
        }
        else if (pressedKey === 40 || pressedKey === 83) {
            this.direction_x = 1;
            this.direction_y = 0;
        }
        else if (pressedKey === 39 || pressedKey === 68) {
            this.direction_y = 1;
            this.direction_x = 0;
        }
        else if (pressedKey === 37 || pressedKey === 65) {
            this.direction_y = -1;
            this.direction_x = 0;
        }
    }

    die() {
        this.listElements.splice(1, (this.listElements.length - 1))
        this.listElements[0].x = 10;
        this.listElements[0].y = 10;
    }
}

const board = new Board(21, 21)
