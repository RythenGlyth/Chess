const { ChessBoard, FigureTeam, FigureType } = require("./chessdata.js");

module.exports.ChessUtils = {

    /**
     * @param {ChessBoard} board
     * @param {Number} currentX
     * @param {Number} currentY
     * @returns {{fromX: number, fromY: number, toX: number, toY: number}[]}
     */
    getPossibleFields: (board, currentX, currentY, allowOnlyX=-1, allowOnlyY=-1) => {
        /** @type {{fromX: number, fromY: number, toX: number, toY: number}[]} */
        var fields = [];
        if(board.board && board.board[currentX] && board.board[currentX][currentY] && board.board[currentX][currentY].type) {
            var team = board.board[currentX][currentY].team;
            var type = board.board[currentX][currentY].type;

            var pushfield = (x, y) => {
                if((allowOnlyX == -1 || x == allowOnlyX) && (allowOnlyY == -1 || y == allowOnlyY)) fields.push({fromX: currentX, fromY: currentY, toX: x, toY: y});
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
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 1, currentY);
                    
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
                    //LEFT
                    var newX = currentX - 1;
                    for(; newX >= 0; newX--) {
                        var figure = board.getFigure(newX, currentY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, currentY);
                        } else if (figure.team != team) {
                            pushfield(newX, currentY);
                            break;
                        } else {
                            break;
                        }
                    }
                    
                    //TOP
                    var newY = currentY - 1;
                    for(; newY >= 0; newY--) {
                        var figure = board.getFigure(currentX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(currentX, newY);
                        } else if (figure.team != team) {
                            pushfield(currentX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    
                    //RIGHT
                    var newX = currentX + 1;
                    for(; newX <= 7; newX++) {
                        var figure = board.getFigure(newX, currentY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, currentY);
                        } else if (figure.team != team) {
                            pushfield(newX, currentY);
                            break;
                        } else {
                            break;
                        }
                    }
                    
                    //BOTTOM
                    var newY = currentY + 1;
                    for(; newY <= 7; newY++) {
                        var figure = board.getFigure(currentX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(currentX, newY);
                        } else if (figure.team != team) {
                            pushfield(currentX, newY);
                            break;
                        } else {
                            break;
                        }
                    }

                    //LEFT-TOP
                    var newX = currentX - 1;
                    var newY = currentY - 1;
                    for(; (newX >= 0) && (newY >= 0); newX--, newY--) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    //RIGHT-TOP
                    var newX = currentX + 1;
                    var newY = currentY - 1;
                    for(; (newX <= 7) && (newY >= 0); newX++, newY--) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    //RIGHT-BOTTOM
                    var newX = currentX + 1;
                    var newY = currentY + 1;
                    for(; (newX <= 7) && (newY <= 7); newX++, newY++) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    //LEFT-BOTTOM
                    var newX = currentX - 1;
                    var newY = currentY + 1;
                    for(; (newX >= 0) && (newY <= 7); newX--, newY++) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    break;
                case FigureType.ROCK:

                    //LEFT
                    var newX = currentX - 1;
                    for(; newX >= 0; newX--) {
                        var figure = board.getFigure(newX, currentY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, currentY);
                        } else if (figure.team != team) {
                            pushfield(newX, currentY);
                            break;
                        } else {
                            break;
                        }
                    }
                    
                    //TOP
                    var newY = currentY - 1;
                    for(; newY >= 0; newY--) {
                        var figure = board.getFigure(currentX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(currentX, newY);
                        } else if (figure.team != team) {
                            pushfield(currentX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    
                    //RIGHT
                    var newX = currentX + 1;
                    for(; newX <= 7; newX++) {
                        var figure = board.getFigure(newX, currentY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, currentY);
                        } else if (figure.team != team) {
                            pushfield(newX, currentY);
                            break;
                        } else {
                            break;
                        }
                    }
                    
                    //BOTTOM
                    var newY = currentY + 1;
                    for(; newY <= 7; newY++) {
                        var figure = board.getFigure(currentX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(currentX, newY);
                        } else if (figure.team != team) {
                            pushfield(currentX, newY);
                            break;
                        } else {
                            break;
                        }
                    }

                    break;
                case FigureType.KNIGHT:

                    var figure = board.getFigure(currentX + 1, currentY + 2);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 1, currentY + 2);
                    
                    figure = board.getFigure(currentX + 1, currentY - 2);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 1, currentY - 2);
                    
                    figure = board.getFigure(currentX - 1, currentY + 2);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 1, currentY + 2);
                    
                    figure = board.getFigure(currentX - 1, currentY - 2);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 1, currentY - 2);
                    
                    figure = board.getFigure(currentX + 2, currentY + 1);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 2, currentY + 1);
                    
                    figure = board.getFigure(currentX + 2, currentY - 1);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX + 2, currentY - 1);
                    
                    figure = board.getFigure(currentX - 2, currentY + 1);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 2, currentY + 1);
                    
                    figure = board.getFigure(currentX - 2, currentY - 1);
                    if(figure && (figure.type == 0 || figure.team != team)) pushfield(currentX - 2, currentY - 1);

                    break;
                case FigureType.BISHOP:
                    //LEFT-TOP
                    var newX = currentX - 1;
                    var newY = currentY - 1;
                    for(; (newX >= 0) && (newY >= 0); newX--, newY--) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    //RIGHT-TOP
                    var newX = currentX + 1;
                    var newY = currentY - 1;
                    for(; (newX <= 7) && (newY >= 0); newX++, newY--) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    //RIGHT-BOTTOM
                    var newX = currentX + 1;
                    var newY = currentY + 1;
                    for(; (newX <= 7) && (newY <= 7); newX++, newY++) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    //LEFT-BOTTOM
                    var newX = currentX - 1;
                    var newY = currentY + 1;
                    for(; (newX >= 0) && (newY <= 7); newX--, newY++) {
                        var figure = board.getFigure(newX, newY);
                        if(!figure) {
                            break;
                        } else if (figure.type == 0) {
                            pushfield(newX, newY);
                        } else if (figure.team != team) {
                            pushfield(newX, newY);
                            break;
                        } else {
                            break;
                        }
                    }
                    break;
                case FigureType.PAWN:

                    var figure = board.getFigure(currentX + (team == 0 ? 1 : -1), currentY);
                    if(figure && figure.type == 0) {
                        pushfield(currentX + (team == 0 ? 1 : -1), currentY);

                        if(currentX == (team == 0 ? 1 : 6)) {
                            var figure = board.getFigure(currentX + (team == 0 ? 2 : -2), currentY);
                            if(figure && figure.type == 0) {
                                pushfield(currentX + (team == 0 ? 2 : -2), currentY);
                            }
                        }
                    }

                    var figure = board.getFigure(currentX + (team == 0 ? 1 : -1), currentY + 1);
                    if(figure && figure.type && figure.team != team) pushfield(currentX + (team == 0 ? 1 : -1), currentY + 1);

                    var figure = board.getFigure(currentX + (team == 0 ? 1 : -1), currentY - 1);
                    if(figure && figure.type && figure.team != team) pushfield(currentX + (team == 0 ? 1 : -1), currentY - 1);
                    
                    break;
            }
        }
        if(type == FigureType.KING) {
            fields = fields.filter(field => {
                if(board.board[field.toX][field.toY].type == FigureType.KING) return true;
                var newBoard = board.copy();
                newBoard.move(field.fromX, field.fromY, field.toX, field.toY);
                return !this.ChessUtils.checkIfOpponentCanGoTo(newBoard, field.toX, field.toY, team);
            });
        } else {
            for(var kingX = 0; kingX <= 7; kingX++) {
                for(var kingY = 0; kingY <= 7; kingY++) {
                    if(board.board[kingX][kingY].type == FigureType.KING && board.board[kingX][kingY].team == team) {
                        fields = fields.filter(field => {
                            if(board.board[field.toX][field.toY].type == FigureType.KING) return true;
                            var newBoard = board.copy();
                            newBoard.move(field.fromX, field.fromY, field.toX, field.toY);
                            return !this.ChessUtils.checkIfOpponentCanGoTo(newBoard, kingX, kingY, team);
                        });
                    }
                }
            }
        }

        /*var isKingAttacked = false;
        for(var x = 0; x <= 7; x++) for(var y = 0; y <= 7; y++) {
            board.board[x][y]
        }
        board.board
        if() {
            
        }*/
        return fields;
    },
    /**
     * @param {ChessBoard} board
     * @param {number} checkX
     * @param {number} checkY
     * @param {number} team
     * @returns {boolean}
     */
    checkIfOpponentCanGoTo: (board, checkX, checkY, team) => {
        if(board && board.board) {
            for(var x = 0; x <= 7; x++) {
                for(var y = 0; y <= 7; y++) {
                    if(board.board[x] && board.board[x][y] && board.board[x][y].type && board.board[x][y].team != team) {
                        let moves = this.ChessUtils.getPossibleFields(board, x, y, checkX, checkY);
                        for(let move of moves) {
                            if(move.toX == checkX && move.toY == checkY) {
                                if(checkX == 7 && checkY == 4) {
                                    console.log(move.fromX);
                                    console.log(move.fromY);
                                }
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}