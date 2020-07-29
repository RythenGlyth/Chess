const fs = require('fs');

const { ChessAIData, ChessMove, ChessBoard } = require("./chessdata.js");

var chessAIData = new ChessAIData();
chessAIData.readFromBuffer(fs.readFileSync("chess.dat"));


var buffer = Buffer.alloc(0);
buffer = (new ChessBoard()).writeToBuffer(buffer);
console.log(buffer);

console.log(true << 3);