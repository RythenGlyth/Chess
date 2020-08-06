var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");

const refreshListener = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", refreshListener);

window.addEventListener("click", (e) => {
    var topLeftX = canvas.width / 2 - 4 * fieldWidth;
    var topLeftY = canvas.height / 2 - 4 * fieldWidth;

    var x = Math.floor((e.pageX - topLeftX) / fieldWidth);
    var y = Math.floor((e.pageY - topLeftY) / fieldWidth);
    if(x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        socket.emit('getMoves', {
            x,
            y 
        });
    }
});

socket.on('updateSelection', (moves) => {
    selected = moves;
    /*selected[0] = {
        x: moves[0].fromX,
        y: moves[0].fromY
    };
    selected[1] = [];
    selected[2] = [];

    moves.forEach(move => {
        selected[board.board[move.toX][move.toY].type != 0 ? 2 : 1].push({
            x: move.toX,
            y: move.toY
        });
    });*/
});

refreshListener();

var fieldWidth = 100;

/**
 * @typedef {{type: number, team: number}} Figure
 */

/** @type {{board: {[x: number]: {[y: number]: Figure}}, killed: {0: Figure[], 1: Figure[]}}} */
var board = {};

/** 
 * @type {{0: {x: number, y: number}, 1: {x: number, y: number}[], 2: {x: number, y: number}[]}} */
var selected = {
    0: {},
    1: [],
    2: []
};

const figureImages = {
    1: {
        0: new Image(90, 90),
        1: new Image(90, 90)
    },
    2: {
        0: new Image(90, 90),
        1: new Image(90, 90)
    },
    3: {
        0: new Image(90, 90),
        1: new Image(90, 90)
    },
    4: {
        0: new Image(90, 90),
        1: new Image(90, 90)
    },
    5: {
        0: new Image(90, 90),
        1: new Image(90, 90)
    },
    6: {
        0: new Image(90, 90),
        1: new Image(90, 90)
    }
};
figureImages[1][0].src = "./figures/10.png";
figureImages[1][1].src = "./figures/11.png";
figureImages[2][0].src = "./figures/20.png";
figureImages[2][1].src = "./figures/21.png";
figureImages[3][0].src = "./figures/30.png";
figureImages[3][1].src = "./figures/31.png";
figureImages[4][0].src = "./figures/40.png";
figureImages[4][1].src = "./figures/41.png";
figureImages[5][0].src = "./figures/50.png";
figureImages[5][1].src = "./figures/51.png";
figureImages[6][0].src = "./figures/60.png";
figureImages[6][1].src = "./figures/61.png";

socket.on('updateBoard', (board) => {
    this.board = board;
    console.log(board);
});

draw();

function draw() {
    var ms = Date.now();

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    {
        let topLeftX = canvas.width / 2 - 4 * fieldWidth;
        let topLeftY = canvas.height / 2 - 4 * fieldWidth;

        {
            for(let x = 0; x < 8; x++) {
                for(let y = 0; y < 8; y++) {
                    ctx.fillStyle = (((x + y) % 2) == 0) ? "#808080" : "#ffffff";

                    let posX = topLeftX + fieldWidth * x;
                    let posY = topLeftY + fieldWidth * y;
                    ctx.fillRect(posX, posY, fieldWidth, fieldWidth);
                    if(board && board.board && board.board[x] && board.board[x][y]) {
                        if(board.board[x][y].type) {
                            ctx.drawImage(figureImages[board.board[x][y].type][board.board[x][y].team], posX, posY, fieldWidth, fieldWidth);
                        }
                    }
                }
            }
        }

        {
            drawSelection(topLeftX, topLeftY, selected[0].x, selected[0].y, 0);
            selected[1].forEach(selection => {
                drawSelection(topLeftX, topLeftY, selection.x, selection.y, 1);
            });
            selected[2].forEach(selection => {
                drawSelection(topLeftX, topLeftY, selection.x, selection.y, 2);
            });
        }
    }

    if(board.killed) {
        if(board.killed[0]) {
            let topLeftX = canvas.width / 2 - 5.5 * fieldWidth;
            let topLeftY = canvas.height / 2 - (((board.killed[0].length / 3) * fieldWidth) / 2);
            for(var i = 0; i < board.killed[0].length; i++) {
                ctx.drawImage(figureImages[board.killed[0][i].type][0], topLeftX - ((i % 3) * fieldWidth), topLeftY + (Math.floor(i / 3) * fieldWidth), fieldWidth, fieldWidth);
            }
        }

        if(board.killed[1]) {
            let topLeftX = canvas.width / 2 + 4.5 * fieldWidth;
            let topLeftY = canvas.height / 2 - (((board.killed[1].length / 3) * fieldWidth) / 2);
            for(var i = 0; i < board.killed[1].length; i++) {
                ctx.drawImage(figureImages[board.killed[1][i].type][1], topLeftX + ((i % 3) * fieldWidth), topLeftY + (Math.floor(i / 3) * fieldWidth), fieldWidth, fieldWidth);
            }
        }
    }
    
    window.requestAnimationFrame(draw)
}

function drawSelection(topLeftX, topLeftY, x, y, selectedType) {
    var posX = topLeftX + fieldWidth * x;
    var posY = topLeftY + fieldWidth * y;

    ctx.strokeStyle = (() => {
        switch(selectedType) {
            case 0:
                return "#aaa";
            case 1:
                return "#00ff00";
            case 2:
                return "#cc0000";
        }
    })();
    ctx.lineWidth = fieldWidth / 10;
    ctx.strokeRect(posX + (ctx.lineWidth / 2), posY + (ctx.lineWidth / 2), fieldWidth - ctx.lineWidth, fieldWidth - ctx.lineWidth);
}