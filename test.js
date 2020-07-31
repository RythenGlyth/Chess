const fs = require('fs');

const { ChessAIData, ChessMove, ChessBoard, ChessFigure, FigureTeam, FigureType } = require("./chessdata.js");
const { ChessGame, ChessUtils } = require("./chessutils.js");

var chessAIData = ChessAIData.readFromBuffer(fs.readFileSync("chess.dat"));

console.log(chessAIData.getMoves(new ChessBoard()));

/*console.log(chessAIData);
var buffer = chessAIData.writeToBuffer();
console.log(buffer);
var newChessAIData = ChessAIData.readFromBuffer(buffer);
console.log(newChessAIData);
*/

fs.writeFileSync("chess.dat", chessAIData.writeToBuffer());