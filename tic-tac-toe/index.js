const   pvp = document.getElementById("pvp"), 
        pvc = document.getElementById("pvc"),
        gameSetUp = document.getElementById("gameSetUp"),
        restart = document.getElementById("restart"),
        quit = document.getElementById("quitGame"),
        playerOne = document.getElementById("player1NamePVP"),
        player1 = document.getElementById("player1NamePVC"),
        playerTwo = document.getElementById("player2Name"),
        start = document.getElementById("startGame"),
        warning = document.getElementById("warning"),
        score = document.getElementById("score"),
        boardPieces = Array.from(document.getElementsByClassName("piece")),
        board = document.getElementById("board"),
        gameBoard = document.getElementById("gameBoard"),
        turn = document.getElementById("playerTurn"),
        header = document.querySelector('header'),
        players = document.getElementById('players');

let game;
let mode;
const THOUGHT_DURATION = 4;

function equalArrays(array1, array2){
    if (array1.length !== array2.length)
        return false;

    for (let i = 0; i < array1.length; i++){
        if (array1[i] !== array2[i])
            return false;
    }

    return true;
}

players.addEventListener('change', function(e){
    if (e.target.type === 'radio'){
        if (e.target.id === "pvp"){
            document.getElementById("playerInfoPVP").style.display = "flex";
            document.getElementById("playerInfoPVC").style.display = "none";
        }
        else if (e.target.id === "pvc"){
            document.getElementById("playerInfoPVP").style.display = "none";
            document.getElementById("playerInfoPVC").style.display = "block";
        }

        start.style.display = "inline-block";
        warning.style.display = "inline-block";
        warning.textContent = "Enter Player Names...";
    }
});

start.onclick = function(){
    const   mode1 = pvp.checked,
            mode2 = pvc.checked;
    
    if (!mode1 && !mode2){
        return;
    }

    else if (mode1){
        mode = 1;
        const name1 = playerOne.value.trim();
        const name2 = playerTwo.value.trim();

        if (!name1 && !name2){
            warning.textContent = "Enter both Player Names...";
            return;
        }

        else if (!name1 && name2){
            warning.textContent = "Enter Player One's Name...";
            return;
        }

        else if (name1 && !name2){
            warning.textContent = "Enter Player Two's Name...";
            return;
        }

        else{
            game = new Game(mode, name1, name2);
        }
    }

    else if (mode2){
        mode = 2;
        const name1 = player1.value.trim();

        if (!name1){
            warning.textContent = "Enter Player's Name...";
            return;
        }

        else{
            game = new Game(mode, name1);
        }
    }

    header.style.display = "none";
    players.style.display = "none";
    gameSetUp.style.display = "none";
    score.style.display = "table";
    setUpTable(updateTable);
    currentPlayerTurn();
    setNotices("", "");
    gameBoard.style.display = "block";
}

function setUpTable(callback){
    const name1 = game.p1.name,
          name2 = game.p2.name;

    const tableHeaders = score.querySelectorAll('th');
    tableHeaders[1].textContent = name1;
    tableHeaders[2].textContent = name2;

    callback();
}

function updateTable(){
    const scoreRows = score.querySelectorAll('.scoreItem');

    scoreRows[0].textContent = game.p1.wins;
    scoreRows[1].textContent = game.p2.wins;
    scoreRows[2].textContent = game.lossesAndDraws;
}

function currentPlayerTurn(){
    turn.textContent = `${game.currentPlayer.name}'s Turn (${game.currentPlayer.symbol})`;
}

restart.onclick = function(){
    setNotices("", "");         // Remove win/draw message
    game.board.resetBoard();
    turn.style.display = "block";
    game.setTurn(game.startingPlayer);

    boardPieces.forEach(element => {
        element.disabled = false;   // First, we reactivate every piece
        element.textContent = "";   // Remove the symbol on the piece
    });
    
    if (mode === 1)
        currentPlayerTurn();

    else if (mode === 2){
        if (game.startingPlayer.name === 'Computer')
            think();

        else
            currentPlayerTurn();
    }
        
}

quit.onclick = function(){
    location.reload();
}

function setNotices(message1, message2){
    const notices = document.querySelectorAll('.notice');
    notices[0].textContent = message1;
    notices[1].textContent = message2;
}

function disableRemaining(){
    boardPieces.filter(element => element.disabled === false).forEach(element => element.disabled = true);
}

board.addEventListener('click', function(e){
    if (e.target.classList.contains('piece')){
        if (mode === 1){
            playMove(e);
        }

        else if (mode === 2){
            if (playMove(e))
                return;

            think();
        }
    }
});

function playMove(e){
    const space = e.target;
    space.textContent = game.currentPlayer.symbol;
    space.disabled = true;
    const position = game.board.convertToIndices(boardPieces.indexOf(space));
    game.board.set(game.currentPlayer.symbol, ...position);

    if (handleWin())
        return true;

    else if (handleDraw())
        return true;

    game.switchTurns();
    currentPlayerTurn();
}

function handleWin(){
     if (game.board.checkWin()){
        game.currentPlayer.addWin();
        game.startingPlayer = game.currentPlayer;
        turn.style.display = "none";
        setNotices(`${game.currentPlayer.name} has won the game!`, `🎉✨`);
        disableRemaining();
        updateTable();
        restart.style.display = "inline-block"
        return true;
    }

    return false;
}

function handleDraw(){
    if(game.board.checkDraw()){
        console.log("Reached this point...")
        game.startingPlayer = (game.currentPlayer === game.p1) ? game.p2 : game.p1;
        console.log(game.startingPlayer.toString());
        game.addDraw();
        updateTable();
        turn.style.display = "none";
        setNotices(`It's a draw!`, `None have triumphed🤝`);
        restart.style.display = "inline-block";
        return true;
    }

    return false;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function think(){
    preventIntervention();
    let thought = `Computer (O) is thinking`;

    for (let i = 0; i < THOUGHT_DURATION; i++){
        turn.textContent = `${thought}`;
        thought += `.`;
        await sleep(1000);
    }

    const move = game.computerMove();
          boardPieces[move].textContent = game.currentPlayer.symbol;
          boardPieces[move].disabled = true;

    if (handleWin())
        return;

    else if (handleDraw())
        return;

    afterPrevention();

    game.switchTurns();
    currentPlayerTurn();
}

function preventIntervention(){
    boardPieces.filter((element) => element.disabled === false).forEach((element) => element.disabled = true);
}

function afterPrevention(){
    boardPieces.filter((element) => element.textContent === '').forEach((element) => element.disabled = false);
}
