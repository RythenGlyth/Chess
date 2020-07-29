class ChessAIData {

    constructor() {
        /**
         * key: chessboard
         * 
         * value: array of possible moves
         */
        this.statuses = {
            
        };
    }

    /**
     * 
     * @param {ChessBoard} status 
     * @returns {Array} moves
     */
    getAvailableMoves(status) {
        return this.statuses.get(status);
    }

    /**
     * 
     * @param {Buffer} buffer 
     * @returns {ChessAIData}
     */
    writeToBuffer(buffer) {
        return this;
    }

    /**
     * 
     * @returns {Buffer}
     */
    readFromBuffer() {
        return Buffer.alloc(0);
    }

}

class ChessMove {

    /**
     * 
     * @param {Buffer} buffer
     * @returns {ChessMove}
     */
    readFromBuffer(buffer) {
        return this;
    }

    /**
     * 
     * @returns {Buffer}
     */
    writeToBuffer() {
        return Buffer.alloc(0);
    }



}

class ChessBoard {

    constructor() {
        /**
         * two dimensional map
         * 
         * first: x, second: y
         * 
         * value: figure
         * 
         */
        this.board = {
            0: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            1: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            2: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            3: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            4: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            5: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            6: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() },
            7: { 0: new Figure(), 1: new Figure(), 2: new Figure(), 3: new Figure(), 4: new Figure(), 5: new Figure(), 6: new Figure(), 7: new Figure() }
        };
    }

    /**
     * 
     * @param {*} buffer 
     * @returns {ChessBoard}
     */
    readFromBuffer(buffer) {
        return this;
    }

    /**
     * 
     * @returns {Buffer}
     */
    writeToBuffer() {
        var buffer = Buffer.alloc(32);
        for(var x = 0; x < 8; x++) {
            var currentLine = 0b0;
            for(var y = 0; y < 8; y++) {
                currentLine |= (this.board[x][y].writeToInt() & 0b1111) << (4 * y);
            }
            buffer.writeInt32BE(currentLine, x * 4);
        }
        return buffer;
    }

}

class Figure {

    constructor() {

    }

    /**
     * 
     * @param {*} buffer
     * @returns {Figure}
     */
    readFromBuffer(buffer) {
        return this;
    }

    /**
     * 
     * @returns {Number}
     */
    writeToInt() {
        return buffer;
    }
}

ChessAIData.prototype.toString = () => {
    return writeToBuffer(Buffer.alloc(0));
}

ChessMove.prototype.toString = () => {
    return writeToBuffer(Buffer.alloc(0));
}

ChessBoard.prototype.toString = () => {
    return writeToBuffer(Buffer.alloc(0));
}

Figure.prototype.toString = () => {
    return writeToBuffer(Buffer.alloc(0));
}

const FigureType = Object.freeze({
    NONE: 0,
    KING: 1,
    QUEEN: 2,
    ROCK: 3,
    KNIGHT: 4,
    BISHOP: 5,
    PAWN: 6
});

module.exports.ChessAIData = ChessAIData;
module.exports.ChessMove = ChessMove;
module.exports.ChessBoard = ChessBoard;
module.exports.Figure = Figure;