const express = require('express');
const fs = require('fs');
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");

const { ChessAIData, ChessMove, ChessBoard, ChessFigure, FigureTeam, FigureType } = require("./chessdata.js");
const { ChessUtils } = require("./chessutils.js");

const chessAIData = ChessAIData.readFromBuffer(fs.readFileSync("chess.dat"));

var app = express();
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'defaultlayout',
    layoutsDir: __dirname + "/layout"
}));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/play", (req, res) => {
    res.render("play");
});

var serv = app.listen(process.env.PORT || 80);

var io = require('socket.io')(serv, {});

io.on("connection", (socket) => {
    /*socket.emit("updateBoard", board);
    socket.on('getMoves', (data) => {
        if(board.board[data.x][data.y] && board.board[data.x][data.y].type) {
            var moves = ChessUtils.getPossibleFields(board, data.x, data.y);
            var selected1 = [];
            var selected2 = [];
            moves.forEach(move => {
                if(board && board.board && board.board[move.toX] && board.board[move.toX][move.toY]) (board.board[move.toX][move.toY].type != 0 ? selected2 : selected1).push({
                    x: move.toX,
                    y: move.toY
                });
            });
            socket.emit('updateSelection', {
                0: {
                    x: data.x,
                    y: data.y
                },
                1: selected1,
                2: selected2
            });
        }
    });*/
});

/** @type {{[id: string]: ChessGame}} */
var games = {};

/**
 * @param {boolean} isWhiteBot
 * @param {boolean} isBlackBot
 * @returns {string} id
 */
function newGame(isWhiteBot, isBlackBot) {
    var id = generateID();
    games[id] = new ChessGame(isWhiteBot, isBlackBot);
    return id;
}

function generateID() {
    var id = Math.random().toString(36).substr(2);
    if(Object.keys(games).includes(id)) {
        return generateID();
    } else return id;
}


class ChessGame {

    constructor(isWhiteBot=false, isBlackBot=false) {
        /** @type {ChessBoard} */
        this.board = new ChessBoard();

        /** @type {Number} (FigureTeam.ABSOLUTE) */
        this.currentPlayer = FigureTeam.ABSOLUTE.WHITE;

        this.isBot = {
            0: isWhiteBot,
            1: isBlackBot
        }
    }

    /**
     * 
     * @param {Number} team (FigureTeam.ABSOLUTE)
     * @returns {ChessBoard}
     */
    getRelativeBoard(team) {
        if(team == FigureTeam.ABSOLUTE.WHITE) return this.board;
        if(team == FigureTeam.ABSOLUTE.BLACK) return this.board.inverted();
    }

    nextPlayer() {
        this.currentPlayer = this.currentPlayer ? 0 : 1;
        if(this.isBot[this.currentPlayer]) {
            chessAIData.addDefaultMovesIfNeeded(this.board);
            this.board.moveMove(chessAIData.getRandomMove(this.board));
        }
    }

}