class Game{
    constructor(mode, ...rest){
        this.gameInfo = this.setupGame(mode, ...rest);
        this.board = new Board();
        this.p1 = new Player(this.gameInfo[0], 0);
        this.p2 = new Player(this.gameInfo[1], 1);
        this.currentPlayer = this.p1;
        this.startingPlayer = this.p1;
        this.lossesAndDraws = 0; // [P1 losses, P2 losses, P1 draws, P2 draws]
    }

    /**
     * Sets up the game with the collected info.
     * 
     * @return {Array} P1's name, P2's name (if PvP else Computer string) 
     */
    setupGame(mode, ...rest){
        if (mode === 1){
            return [...rest];   // rest will be [P1 name, P2 name]
        }
        
        else if(mode === 2){
            return [rest[0], "Computer"]; // rest will be [P1 name]
        }
    }

    addDraw(){
        this.lossesAndDraws++;
    }

    endGame(){
        const notices = document.getElementsByClassName('notice');

        notices[0].textContent = `Since ${this.currentPlayer.name} has decided to quit`;
        this.switchTurns();
        notices[1].textContent = `${this.currentPlayer.name} wins!`;
        currentPlayer.addWin();
        

    }

    switchTurns(){
        this.currentPlayer = this.currentPlayer === this.p1 ? this.p2 : this.p1;
    }

    setTurn(player){
        this.currentPlayer = player;
    }

    /**
     *  Implements the computer's game moves. 
        The AI prefers center space but if that one's taken 
        then it'll play one of the corner spaces.
        Otherwise it'll play a random available spot.\
     */
    computerMove(){
        const winMove = this.findCloseCall(this.p2.symbol);
        const blockMove = this.findCloseCall(this.p1.symbol);

        if (winMove.length > 0 && this.board.freePosition(...winMove)){
            this.board.set(this.p2.symbol, ...winMove);
            return this.board.convertToPosition(...winMove);
        }

        else if (blockMove.length > 0 && this.board.freePosition(...blockMove)){
            this.board.set(this.p2.symbol, ...blockMove);
            return this.board.convertToPosition(...blockMove);
        }

        // This takes precedence if it's available
        if (this.board.freePosition(...CENTER_SPACE)){
            this.board.set(this.p2.symbol, ...CENTER_SPACE);
            return this.board.convertToPosition(...CENTER_SPACE);
        }

        const cornerMove = this.randomizeCornerMove();

        if (cornerMove.length > 0){
            this.board.set(this.p2.symbol, ...cornerMove);
            return this.board.convertToPosition(...cornerMove);
        }

        else{
            const move = this.randomizeInnerMove();
            this.board.set(this.p2.symbol, ...move);
            return this.board.convertToPosition(...move);
        }
    }


    /**
     * Helps Computer determine and locate the position to play to win (if possible) or block player's move.
     * 
     * @param {string} ref Let's the program know which symbol to check for when looking for the pattern.
     * @returns {Array} Positon for computer to play
     */
    findCloseCall(ref){
        // Check horizontal close call
        for (let row of this.board.grid){
            const marks  = row.filter(item => item === ref).length;
            const spaces = row.filter(item => item === 0).length;

            if (marks === 2 && spaces === 1)
                return [this.board.grid.indexOf(row), row.indexOf(0)];
            
        }

        // Check vertical close call
        for (let i = 0; i < 3; i++){
            let column = [];
            for (let j = 0; j < 3; j++){
                column.push(this.board.get(j, i));
            }

            const marks  = column.filter(item => item === ref).length;
            const spaces = column.filter(item => item === 0).length;

            if (marks === 2 && spaces === 1)
                return [column.indexOf(0), i];
            
        }

        // Check diagonal close calls
        const   tl = TOP_LEFT,
                tr = TOP_RIGHT,
                cs = CENTER_SPACE,
                br = BOTTOM_RIGHT,
                bl = BOTTOM_LEFT;

        const   line1 = [this.board.get(...tl), this.board.get(...cs), this.board.get(...br)],
                line2 = [this.board.get(...tr), this.board.get(...cs), this.board.get(...bl)];

        let marks1  = line1.filter(item => item === ref).length;
        let spaces1 = line1.filter(item => item === 0).length;

        if (marks1 === 2 && spaces1 === 1)
            return [tl, cs, br][line1.indexOf(0)]

        let marks2  = line2.filter(item => item === ref).length;
        let spaces2 = line2.filter(item => item === 0).length;

        if (marks2 === 2 && spaces2 === 1)
            return [tr, cs, bl][line2.indexOf(0)];

        return [];
    }

    /**
     * Picks, at random, which corner move to play
     * 
     * @returns {Array} Corner coordinates to play or empty if there are not available corner coordinates.
     */
    randomizeCornerMove(){
        const cms = this.shuffleArray(CORNER_MOVES);

        for (let move of cms){
            if (this.board.freePosition(...move))
                return move;
        }

        return [];
    }

    /**
     * When the corner moves are unavailable, it picks, at random, which available move to play.
     * 
     * @returns {Array} Coordinates (excluding corners) to play.
     */
    randomizeInnerMove(){
        let availableMoves = [];

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                const pos = [i, j];

                if (CORNER_MOVES.some((element) => equalArrays(pos, element)))
                    continue;

                if (this.board.freePosition(...pos)){
                    availableMoves.push(pos);
                }
            }
        }

        const randomizedIM = this.shuffleArray(availableMoves);
        return randomizedIM.length > 0 ? randomizedIM[0] : [];
    }

    /**
     * Randomizes the order of elements in an array
     * @param {Array} array - The array to be shuffled
     * @returns {Array} - The shuffled array
     */
    shuffleArray(array){
        const arr = [...array];

        for (let i = 0; i < arr.length; i++){
            const randomIDX = Math.floor(Math.random() * arr.length);
            
            [arr[i], arr[randomIDX]] = [arr[randomIDX], arr[i]];
        }

        return arr;
    }
}