const express = require('express');
const fs = require('fs');
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");

const { ChessAIData, ChessMove, ChessBoard, ChessFigure, FigureTeam, FigureType } = require("./chessdata.js");
const { ChessGame, ChessUtils } = require("./chessutils.js");

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
    socket.emit("updateBoard", new ChessBoard());
});