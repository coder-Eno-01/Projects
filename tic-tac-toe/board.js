CENTER_SPACE = [1, 1]
TOP_LEFT = [0, 0]
TOP_RIGHT = [0, 2]
BOTTOM_LEFT = [2, 0]
BOTTOM_RIGHT = [2, 2]
CORNER_MOVES = [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT]

class Board{
    constructor(){
        this.grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }

    /**
     * Converts a position number (0-8) to row and column indices
     * 
     * @param {Number} position 
     * @returns {Array} - The row and column indices corresponding to the position number
     */
    convertToIndices(position){
        if (position <= 2){
            return [0, position];
        }

        else if (position <= 5){
            return [1, position - 3];
        }

        else if (position <= 8){
            return [2, position - 6];
        }

        else
            return [];
    }

    /**
     * Converts row and column indices to a position number (0-8)
     * 
     * @param  {...Number} indices 
     * @returns {Number} - The position number corresponding to the row and column indices
     */
    convertToPosition(...indices){
        return indices[0] * 3 + indices[1];
    }

    /**
     * Resets the board, wiping every move from it
     */
    resetBoard(){
        this.grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }

    /**
     * Retrieves the symbol (or zero) located at the coordinates provided
     * 
     * @param  {...Number} indices - The coordinates to be referenced (row, column)
     * @returns {String|Number} - Whatever is found at the specified position on the board
     */
    get(...indices){
        return this.grid[indices[0]][indices[1]];
    }

    /**
     * Plays move on given coordinates
     * 
     * @param {String} symbol - Player's symbol to be placed on the board
     * @param  {...Number} indices - Coordinates where the symbol will be placed (row, column)
     */
    set(symbol, ...indices){
        this.grid[indices[0]][indices[1]] = symbol;
    }
    
    /**
     * Validates whether or not the entered position is available for play.
     * 
     * @param  {...Number} indices - The coordinates to be referenced (row, column)
     * @returns {Boolean} - True if the position is free (is a zero), false otherwise
     */
    freePosition(...indices){
        return this.get(...indices) === 0;
    }

    /**
     * Finds the first free available position on board
     * 
     * @returns {Array} - The coordinates of the first free position found (row, column). Empty array if no free spot is found
     */
    freeSpot(){
        for (let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if (this.freePosition(i, j))
                    return [i, j]
            }
        }

        return [];
    }

    /**
     * Checks if a player has won the game
     * 
     * @returns {Boolean} - True if a winning condition is met, false otherwise
     */
    checkWin(){
        // Check horizontal victory
        for (let row of this.grid){
            const symbol = row[0];
            if (symbol !== 0 && equalArrays(row, Array(3).fill(symbol)))
                return true;
        }

        // Check vertical victory
        for (let i = 0; i < 3; i++){
            let column = [];
            for (let j = 0; j < 3; j++){
                column.push(this.get(j, i));
            }

            const symbol = column[0];
            if (symbol !== 0 && equalArrays(column, Array(3).fill(symbol)))
                return true;
        }

        // Check diagnoal victory
        let x1 = this.get(...TOP_LEFT),
            x2 = this.get(...CENTER_SPACE),
            x3 = this.get(...BOTTOM_RIGHT),
            x4 = this.get(...TOP_RIGHT),
            x5 = this.get(...BOTTOM_LEFT);

        return (x1 !== 0 && x1 === x2 && x2 === x3) || (x4 !== 0 && x4 === x2 && x2 === x5);
    }
    
    /**
     * Checks if the two players have reached a stalemate 
     * and this occurs when there are no moves left
     * 
     * @returns {Boolean} - True if they are no moves left, meaning a draw is reached.
     */
    checkDraw(){
        for (let row of this.grid){
            if (row.includes(0))
                return false;
        }

        return true;
    }
}