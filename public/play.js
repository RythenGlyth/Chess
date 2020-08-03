var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");


const refreshListener = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
}

const update = () => window.requestAnimationFrame(draw);

window.addEventListener("resize", refreshListener);

refreshListener();

const fieldWidth = 100;

/** @type {Object.<number, Object.<number, {type: number, team: number}>>}*/
var board = {};

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
    this.board = board.board;
    update();
});

draw();

function draw() {
    var ms = new Date().getMilliseconds();

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    {
        var topLeftX = canvas.width / 2 - 4 * fieldWidth;
        var topLeftY = canvas.height / 2 - 4 * fieldWidth;

        for(var x = 0; x < 8; x++) {
            for(var y = 0; y < 8; y++) {
                ctx.fillStyle = (((x + y) % 2) == 0) ? "#ffffff" : "#808080";

                var posX = topLeftX + fieldWidth * x;
                var posY = topLeftY + fieldWidth * y;
                ctx.fillRect(posX, posY, fieldWidth, fieldWidth);

                if(board[x] && board[x][y] && board[x][y].type) {
                    board
                    ctx.drawImage(figureImages[board[x][y].type][board[x][y].team], posX, posY, fieldWidth, fieldWidth);
                }
            }
        }
            
    }
}