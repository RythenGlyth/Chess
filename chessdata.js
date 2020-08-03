class ChessAIData {

    constructor() {
        /**
         * key: chessboard
         * 
         * value: array of possible moves
         * 
         * @type {Map<String, Array<ChessMove>>}
         */
        this.statuses = new Map();
    }

    /**
     * 
     * @param {ChessBoard} status 
     * @returns {Array} moves
     */
    getMoves(status) {
        return this.statuses.get(status.toString());
    }

    /**
     * 
     * @param {Buffer} buffer 
     * @returns {ChessAIData}
     */
    static readFromBuffer(buffer=Buffer.alloc(34)) {
        var chessAIData = new ChessAIData();

        var offset = 0;
        while(offset < buffer.length) {
            //var board = ChessBoard.readFromBuffer(buffer, offset).;
            var board = buffer.toString("binary", offset, offset + 32);
            offset += 32;

            var movesCount = buffer.readUInt16BE(offset);
            offset += 2;

            var moves = [];
            for(var i = 0; i < movesCount; i++) {
                moves.push(ChessMove.readFromBuffer(buffer, offset));
                offset += 4;
            }

            chessAIData.statuses.set(board, moves);
        }

        return chessAIData;
    }

    /**
     * 
     * @returns {Buffer}
     */
    writeToBuffer() {
        var buffer = Buffer.alloc(0);
        this.statuses.forEach((value, key) => {
            var statusBuffer = Buffer.alloc(32 + 2 + value.length * 4);
            var offset = 0;
            
            statusBuffer.write(key, offset, "binary");
            offset += 32;
            //offset = key.writeToBuffer(statusBuffer, offset);

            offset = statusBuffer.writeUInt16BE(value.length, offset);
            value.forEach(move => {
                offset = move.writeToBuffer(statusBuffer, offset);
            });
            buffer = Buffer.concat([buffer, statusBuffer]);
        });
        return buffer;
    }

    /**
     * 
     * @param {ChessBoard} status 
     */
    addDefaultMovesIfNeeded(status) {
        //TODO add all availables
        if(!this.statuses.has(status.toString())) {
            var arr = [];
            arr.push(new ChessMove(1, 2, 3, 4));

            var stringifiedStatus = status.toString();

            this.statuses.set(stringifiedStatus, arr);
        }
    }

    toString() {
        return this.writeToBuffer().toString("binary");
    }

}

module.exports.ChessAIData = ChessAIData;

class ChessMove {

    constructor(fromX, fromY, toX, toY, weight) {
        /** @type {Number} */
        this.fromX = fromX || 0;

        /** @type {Number} */
        this.fromY = fromY || 0;

        /** @type {Number} */
        this.toX = toX || 0;

        /** @type {Number} */
        this.toY = toY || 0;

        /** @type {Number} */
        this.weight = weight == undefined ? 30000 : weight;
    }

    /**
     * 
     * @param {Buffer} buffer
     * @returns {ChessMove}
     */
    static readFromBuffer(buffer=Buffer.alloc(4), offset=0) {
        var int = buffer.readUInt16BE(offset);
        var chessMove = new ChessMove();
        chessMove.fromX = (int >>  0) & 0b0111;
        chessMove.fromY = (int >>  4) & 0b0111;
        chessMove.toX   = (int >>  8) & 0b0111;
        chessMove.toY   = (int >> 12) & 0b0111;
        chessMove.weight = buffer.readUInt16BE(offset + 2);
        return chessMove;
    }

    /**
     * 2 byte buffer
     * @param {Buffer} buffer
     * @returns {Number} offset plus the number of bytes written.
     */
    writeToBuffer(buffer=Buffer.alloc(2), offset=0) {
        offset = buffer.writeUInt16BE(((this.fromX & 0b0111) << 0) | ((this.fromY & 0b0111) << 4) | ((this.toX & 0b0111) << 8) | ((this.toY & 0b0111) << 12), offset);
        offset = buffer.writeUInt16BE(this.weight & 0b1111111111111111, offset);
        return offset;
    }

    toString() {
        var buffer = Buffer.alloc(2);
        this.writeToBuffer(buffer);
        return buffer.toString("binary");
    }
}

module.exports.ChessMove = ChessMove;

class ChessBoard {

    constructor() {
        /**
         * two dimensional map
         * 
         * first: x, second: y
         * 
         * value: figure
         * 
         * @type {Object.<number, Object.<number, ChessFigure>>}
         */
        this.board = {
            0: { 0: new ChessFigure(FigureType.ROCK, FigureTeam.RELATIVE.OTHER), 1: new ChessFigure(FigureType.KNIGHT, FigureTeam.RELATIVE.OTHER), 2: new ChessFigure(FigureType.BISHOP, FigureTeam.RELATIVE.OTHER), 3: new ChessFigure(FigureType.QUEEN, FigureTeam.RELATIVE.OTHER), 4: new ChessFigure(FigureType.KING, FigureTeam.RELATIVE.OTHER), 5: new ChessFigure(FigureType.BISHOP, FigureTeam.RELATIVE.OTHER), 6: new ChessFigure(FigureType.KNIGHT, FigureTeam.RELATIVE.OTHER), 7: new ChessFigure(FigureType.ROCK, FigureTeam.RELATIVE.OTHER) },
            1: { 0: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 1: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 2: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 3: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 4: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 5: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 6: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER), 7: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.OTHER) },
            2: { 0: new ChessFigure(), 1: new ChessFigure(), 2: new ChessFigure(), 3: new ChessFigure(), 4: new ChessFigure(), 5: new ChessFigure(), 6: new ChessFigure(), 7: new ChessFigure() },
            3: { 0: new ChessFigure(), 1: new ChessFigure(), 2: new ChessFigure(), 3: new ChessFigure(), 4: new ChessFigure(), 5: new ChessFigure(), 6: new ChessFigure(), 7: new ChessFigure() },
            4: { 0: new ChessFigure(), 1: new ChessFigure(), 2: new ChessFigure(), 3: new ChessFigure(), 4: new ChessFigure(), 5: new ChessFigure(), 6: new ChessFigure(), 7: new ChessFigure() },
            5: { 0: new ChessFigure(), 1: new ChessFigure(), 2: new ChessFigure(), 3: new ChessFigure(), 4: new ChessFigure(), 5: new ChessFigure(), 6: new ChessFigure(), 7: new ChessFigure() },
            6: { 0: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 1: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 2: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 3: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 4: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 5: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 6: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS), 7: new ChessFigure(FigureType.PAWN, FigureTeam.RELATIVE.THIS) },
            7: { 0: new ChessFigure(FigureType.ROCK, FigureTeam.RELATIVE.THIS), 1: new ChessFigure(FigureType.KNIGHT, FigureTeam.RELATIVE.THIS), 2: new ChessFigure(FigureType.BISHOP, FigureTeam.RELATIVE.THIS), 3: new ChessFigure(FigureType.QUEEN, FigureTeam.RELATIVE.THIS), 4: new ChessFigure(FigureType.KING, FigureTeam.RELATIVE.THIS), 5: new ChessFigure(FigureType.BISHOP, FigureTeam.RELATIVE.THIS), 6: new ChessFigure(FigureType.KNIGHT, FigureTeam.RELATIVE.THIS), 7: new ChessFigure(FigureType.ROCK, FigureTeam.RELATIVE.THIS) }
        };
    }

    inverted() {
        var newBoard = new ChessBoard();
        for(var x = 0; x < 8; x++) {
            for(var y = 0; y < 8; y++) {
                newBoard.board[x][y] = Object.assign(Object.create(ChessFigure.prototype), this.board[7 - x][7 - y]);
            }
        }
        return newBoard;
    }

    /**
     * 
     * @param {Buffer} buffer 
     * @returns {ChessBoard}
     */
    static readFromBuffer(buffer=Buffer.alloc(32), offset=0) {
        var chessBoard = new ChessBoard();
        for(var x = 0; x < 8; x++) {
            var currentLine = buffer.readInt32BE(offset + x * 4);
            for(var y = 0; y < 8; y++) {
                chessBoard.board[x][y] = ChessFigure.readFromInt((currentLine >> (4 * y)) & 0b1111);
            }
        }
        return chessBoard;
    }

    /**
     * 32 bytes
     * @param {Buffer} buffer
     * @returns {Number} offset plus the number of bytes written.
     */
    writeToBuffer(buffer=Buffer.alloc(32), offset=0) {
        for(var x = 0; x < 8; x++) {
            var currentLine = 0b0;
            for(var y = 0; y < 8; y++) {
                currentLine |= (this.board[x][y].writeToInt() & 0b1111) << (4 * y);
            }
            offset = buffer.writeInt32BE(currentLine, offset);
        }
        return offset;
    }

    /**
     * 
     * @param {Number} x
     * @param {Number} y
     * @returns {ChessFigure}
     */
    getFigure(x, y) {
        return this.board[x] ? this.board[x][y] : null;
    }

    toString() {
        var buffer = Buffer.alloc(32);
        this.writeToBuffer(buffer);
        return buffer.toString("binary");
    }

}

module.exports.ChessBoard = ChessBoard;

class ChessFigure {

    constructor(type=FigureType.NONE, team=FigureTeam.RELATIVE.THIS) {
        /** @type {FigureType} */
        this.type = type;
        /** @type {Number} */
        this.team = team;
    }

    /**
     * 
     * @param {Number} int
     * @returns {Figure}
     */
    static readFromInt(int) {
        var chessFigure = new ChessFigure();
        chessFigure.team = (int & 0b1000) >> 3;
        chessFigure.type = int & 0b0111;
        return chessFigure;
    }

    /**
     * 
     * @returns {Number}
     */
    writeToInt() {
        return this.type + (this.team << 3);
    }

    /**
     * @param {FigureType} type 
     * @returns {ChessFigure}
     */
    setType(type) {
        this.type = type;
        return this;
    }

    /**
     * @param {Number} team 
     * @returns {ChessFigure}
     */
    setTeam(team) {
        this.team = team;
        return this;
    }

    toString() {
        return this.writeToInt().toString(36);
    }
}

module.exports.ChessFigure = ChessFigure;

const FigureType = Object.freeze({
    NONE:   0, //0b000
    KING:   1, //0b001
    QUEEN:  2, //0b010
    ROCK:   3, //0b011
    KNIGHT: 4, //0b100
    BISHOP: 5, //0b101
    PAWN:   6  //0b110
});
module.exports.FigureType = FigureType;

const FigureTeam = Object.freeze({
    RELATIVE: {
        THIS: 0,
        OTHER: 1
    },
    ABSOLUTE: {
        WHITE: 0,
        BLACK: 1
    }
});
module.exports.FigureTeam = FigureTeam;