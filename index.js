const express = require('express');
const fs = require('fs');
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");

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
    res.render("play", {
        isBlackBot: req.query.isBlackBot == "on" ? true : false,
        isWhiteBot: req.query.isWhiteBot == "on" ? true : false,
        autoReplay: req.query.autoReplay == "on" ? true : false
    });
});

var serv = app.listen(process.env.PORT || 80);

var io = require('socket.io')(serv, {});

function getPos(fromX, fromY, toX, toY) {
    var pos = 0;
    pos |= (fromX - 1) << 0;
    pos |= (fromY - 1) << 3;
    pos |= (toX - 1) << 6;
    pos |= (toY - 1) << 9;
    return pos;
}

io.on("connection", (socket) => {
    socket.on('setDefaults', (data) => {
        var movesJson = getMoves();
        if(!movesJson[data.statusSerialized]) {
            movesJson[data.statusSerialized] = data.moves.map(field => {
                return { p: getPos(field.fromX, field.fromY, field.toX, field.toY), w: 1000 };
            });
            fs.writeFileSync(movesFileName, stringifyJson(movesJson));
        }
    })
    socket.on('requestMove', (data) => {
        var movesJson = getMoves();
        if(movesJson[data.statusSerialized]) {
            var moves = movesJson[data.statusSerialized];
            var length = 0;
            moves.forEach(move => {
                length += move.w;
            });
            var random = Math.floor(Math.random() * length);
            var i = 0;
            for(var move of moves) {
                i += move.w;

                if(random < i) {
                    socket.emit('botMove', { statusSerialized: data.statusSerialized, fromX: ((move.p >> 0) & 0b111) + 1, fromY: ((move.p >> 3) & 0b111) + 1, toX: ((move.p >> 6) & 0b111) + 1, toY: ((move.p >> 9) & 0b111) + 1 });
                    return;
                }
            }
            socket.emit('botMove', { statusSerialized: data.statusSerialized, fromX: ((moves[0].p >> 0) & 0b111) + 1, fromY: ((moves[0].p >> 3) & 0b111) + 1, toX: ((moves[0].p >> 6) & 0b111) + 1, toY: ((moves[0].p >> 9) & 0b111) + 1 });
        }
    });
    socket.on('end', data => {
        var movesJson = getMoves();
        var multiplier = data.won ? 1.1 : 0.9;
        data.moves.forEach(move => {
            movesJson[move.s] = movesJson[move.s].map(m => {
                if(m.p == move.p) m.w *= multiplier;
                return m;
            });
        });
        fs.writeFileSync(movesFileName, stringifyJson(movesJson));
    });
});

function stringifyJson(movesJson) {
    return JSON.stringify(movesJson/*, null, 4).replace(/([0-9].*)\n  +/g, '$1 ').replace(/{\n *(.{1,50}})/g, '{ $1'*/);
}

const movesFileName = "./moves.json";

function getMoves() {
    if(fs.existsSync(movesFileName)) {
        return JSON.parse(fs.readFileSync(movesFileName));
    } else {
        return {};
    }
}