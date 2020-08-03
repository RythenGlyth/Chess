const fs = require('fs');

const { ChessAIData, ChessMove, ChessBoard, ChessFigure, FigureTeam, FigureType } = require("./chessdata.js");
const { ChessGame, ChessUtils } = require("./chessutils.js");

const chessAIData = ChessAIData.readFromBuffer(fs.readFileSync("chess.dat"));