const { ChessBoard, FigureTeam, FigureType } = require("./chessdata");

module.exports.ChessUtils = {

    /**
     * 
     * @param {Number} team (FigureTeam.ABSOLUTE)
     * @param {Number} type (FigureType)
     * @param {ChessBoard} board
     * @param {Number} currentX
     * @param {Number} currentY
     * @returns {{fromX: number, fromY: number, toX: number, toY: number}}
     */
    getPossibleFields: (team, type, board, currentX, currentY) => {
        var fields = [];
        var pushfield = (x, y) => {
            fields.push({fromX: currentX, fromY: currentY, toX: x, toY: y});
        }
        switch(type) {
            case FigureType.KING:
                var figure = board.getFigure(currentX, currentY + 1);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX, currentY + 1);
                
                figure = board.getFigure(currentX, currentY - 1);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX, currentY - 1);
                
                figure = board.getFigure(currentX + 1, currentY);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 1, currentY);
                
                figure = board.getFigure(currentX - 1, currentY);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 1, currentY + 1);
                
                figure = board.getFigure(currentX + 1, currentY + 1);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 1, currentY + 1);
                
                figure = board.getFigure(currentX - 1, currentY - 1);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 1, currentY - 1);
                
                figure = board.getFigure(currentX + 1, currentY - 1);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 1, currentY - 1);
                
                figure = board.getFigure(currentX - 1, currentY + 1);
                if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 1, currentY + 1);

                break;
            case FigureType.QUEEN:
                break;
            case FigureType.ROCK:

                //LEFT
                var newX = currentx - 1;
                for(; newX >= 0; newX--) {
                    var figure = board.getFigure(newX, currenty);
                    if(!figure) {
                        break;
                    } else if (figure.type == 0) {
                        pushfield(newX, currenty);
                    } else if (figure.team != team) {
                        pushfield(newX, currenty);
                        break;
                    } else {
                        break;
                    }
                }
                
                //TOP
                var newY = currenty - 1;
                for(; newY >= 0; newY--) {
                    
                }
                
                //RIGHT
                var newX = currentx + 1;
                for(; newX <= 7; newX++) {
                    
                }
                
                //BOTTOM
                var newY = currenty + 1;
                for(; newY <= 7; newY++) {
                    
                }

                break;
            case FigureType.KNIGHT:
                break;
            case FigureType.BISHOP:
                break;
            case FigureType.PAWN:
                break;
        }
    }
}


class ChessGame {

    constructor() {
        /** @type {ChessBoard} */
        this.board = new ChessBoard();

        /** @type {Number} (FigureTeam.ABSOLUTE) */
        this.currentPlayer = FigureTeam.ABSOLUTE.WHITE;

        this.isBot = {
            0: false,
            1: false
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

}

module.exports.ChessGame = ChessGame;