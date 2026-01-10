let score = [0, 0];
let specialMoves = {
    undoMoves: 1,
    deleteMoves: 1,
    swapMoves: 1,
    outOfMoves(){return (this.undoMoves === 0 && this.deleteMoves === 0 && this.swapMoves === 0)},
    undos(){return this.undoMoves},
    deletes(){return this.deleteMoves},
    swaps(){return this.swapMoves},
    decreaseDelete(){this.deleteMoves--},
    decreaseUndo(){this.undoMoves--},
    decreaseSwap(){this.swapMoves--},
    increaseDelete(){this.deleteMoves++},
    increaseUndo(){this.undoMoves++},
    increaseSwap(){this.swapMoves++}
};

const   board = document.querySelector('#board'),
        newGame = document.querySelector('#newGame'),
        scoreBoard = document.querySelectorAll('#scoreBoard h3'),
        deleteTile = document.querySelector('#delete'),
        undoMove = document.querySelector('#undo'),
        switchTiles = document.querySelector('#switch'),
        specialFeatures = document.querySelectorAll('.numMoves'),
        specialButtons = document.querySelectorAll('.SPB');

const allowed = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];

const ROW = 4, U = 0, D = 1, S = 2;
const colours = ['yellow', 'orange', 'red', 'pink', 'purple', 'lightblue', 'blue', 'lightgreen', 'green', 'darkgreen', 'brown'];
const sizes = {
    tile: 85,
    gap: 15,
    updateTile(newSize){this.tile = newSize},
    updateGap(newGap){this.gap = newGap}
}
let grid, savedGrids = [], dataCopy = [], blocksToSwitch = [];
let busy = false;
let deleting = false;
let switching = false;
let rewardGiven = false;

// Recording where swip starts for mobile support
let touchStartX = 0;
let touchStartY = 0;

const previousHighScore = localStorage.getItem('highScore') !== null;

document.addEventListener('keydown', async (e) => {
    if (busy)
        return;

    if (!allowed.includes(e.key))
        return;

    busy = true;
    let newGrid = push(e.key);
            
    if (!grid.equals(newGrid)){
        await gameLogic(e.key, newGrid, false);
    }
    
    else if (mergeAvailable(grid, e.key))
        await gameLogic(e.key, newGrid, true);

    busy = false;

    if (checkLost(grid)){
        if (specialMoves.outOfMoves()){
            window.alert("Game Over! Start a new game to try again.");
        }
    }
});

board.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    console.log(touch);
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

board.addEventListener('touchend', async (e) => {
    if (busy) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Ignoring tiny swipes
    if (Math.max(absX, absY) < 30) return;

    let key;

    if (absX > absY) {
        key = deltaX > 0 ? "ArrowRight" : "ArrowLeft";
    } else {
        key = deltaY > 0 ? "ArrowDown" : "ArrowUp";
    }

    // Reusing existing keyboard logic
    busy = true;

    let newGrid = push(key);

    if (!grid.equals(newGrid)){
        await gameLogic(key, newGrid, false);
    }
    else if (mergeAvailable(grid, key)){
        await gameLogic(key, newGrid, true);
    }

    busy = false;

    if (checkLost(grid) && specialMoves.outOfMoves()){
        alert("Game Over! Start a new game to try again.");
    }
});

async function gameLogic(key, newGrid, justMerge){
    preserveData();      // Saving data for possible undo

    grid = new TileGrid(newGrid);           // To ensure that the grids are exactly the same
    updateTargets(grid, newGrid);           // We update the coordinates of the tiles in newGrid but set these new coordinates as targets for the tiles in grid

    if (!justMerge){
        await slide()
        grid.updateCoords();
    }

    prepareForMerge(grid, key);

    await merge();

    // Handling compression post-merge
    newGrid = push(key);
            
    if (!grid.equals(newGrid)){
        grid = new TileGrid(newGrid);
        updateTargets(grid, newGrid);

        await slide();
        grid.updateCoords();
    }

    await pause(80);    // Slight pause before new tile spawns for user comfort

    grid.addBlock();
    populate();
}

document.addEventListener('click', async (e) => {
    const element = e.target.closest('.piece');

    if (!element) return;

    if (deleting){
        preserveData();
        
        await tileDeletion(element);

        deleting = false;
        specialMoves.decreaseDelete();
        updateSpecialMoves();
        specialMoveAnimation(D);

        // After handling the visual delete, we're removing it from the grid.
        element.tile.deleteBlock();
        grid.deleteTile(...element.tile.position())

        undoMove.disabled = false;
        switchTiles.disabled = false;
        deleteTile.style.backgroundColor = '#415a77'
        deleteTile.style.color = '#e0e1dd'
    }

    else if (switching){

        if (blocksToSwitch.length < 2){
            if (blocksToSwitch.includes(element)){      // It's the same tile being clicked again
                element.style.border = '1px black solid';
                blocksToSwitch = [];
                return;
            }

            blocksToSwitch.push(element);
            element.style.border = `3px solid ${colours[Math.floor(Math.random() * colours.length)]}`;

            
            if (blocksToSwitch.length === 2){
                preserveData();

                // Swapping the two tiles in the grid prior to animating.
                const tileA = blocksToSwitch[0].tile;
                const posA = tileA.position();
                const tileB = blocksToSwitch[1].tile;
                const posB = tileB.position();

                grid.set(tileA, posB);
                grid.set(tileB, posA);
                grid.updateCoords();
                // **************************

                await switchAnimation(...blocksToSwitch);

                blocksToSwitch.forEach(el => el.style.border = '1px black solid');          // Reset coz clicking changed border size and colour
                switching = false;
                specialMoves.decreaseSwap();
                updateSpecialMoves();
                specialMoveAnimation(S);

                switchTiles.style.backgroundColor = '#415a77'
                switchTiles.style.color = '#e0e1dd'
                undoMove.disabled = false;
                deleteTile.disabled = false;
                blocksToSwitch = [];
            }
        }
    }
})

function start(){
    grid = new TileGrid();
    grid.addBlock(); grid.addBlock();
    updateScore(null);
    backgroundTiles();
    populate();
}

function gameOver(){
    if (!checkLost(grid))
        return false;

    return true;
}

function populate(){
    for(let tile of grid.getTiles()){
        place(tile.element, tile.position());
        tile.element.textContent = `${tile.value}`
    }
}

function layoutSizes(){
    const boardSize = board.clientWidth;
    const gap = boardSize * 0.04;
    const tileSize = (boardSize - 5 * gap) / 4;
    sizes.updateGap(gap);
    sizes.updateTile(tileSize);
}

function backgroundTiles(){
    layoutSizes();

    for (let row = 0; row < ROW; row++){
        for (let col = 0; col < ROW; col++){
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const top  = row * (sizes.tile + sizes.gap) + sizes.gap;
            const left = col * (sizes.tile + sizes.gap) + sizes.gap;

            cell.style.top  = `${top}px`;
            cell.style.left = `${left}px`;

            board.appendChild(cell);
        }
    }
}

function preserveData(){
    savedGrids.push(new TileGrid(grid));
    dataCopy.push({
        score: score[0], 
        deletes: specialMoves.deletes(), 
        swaps: specialMoves.swaps(),
        undos: specialMoves.undos()
    });

    if (savedGrids.length > 5){
        savedGrids.splice(0, 1);
        dataCopy.splice(0, 1);
    }
}

function push(key){
    switch(key){
        case 'ArrowLeft': return pushLeft(grid);
        case 'ArrowRight': return pushRight(grid);
        case 'ArrowUp': return pushUp(grid);
        case 'ArrowDown': return pushDown(grid);
    }
}

function updateScore(value){
    if (value != null){
        score[0] += value;
        scoreBoard[0].textContent = score[0];

        switch(value){
            case 256:
                specialMoves.increaseSwap();
                updateSpecialMoves();
                specialMoveAnimation(S);
                break;
            case 512:
                specialMoves.increaseDelete();
                updateSpecialMoves();
                specialMoveAnimation(D);
                break;
            case 1024:
                if (specialMoves.undos() < 5){
                    specialMoves.increaseUndo();
                    updateSpecialMoves();
                    specialMoveAnimation(U);
                }

                break;
        }
        
        if (score[0] > score[1]){
            if (!rewardGiven && previousHighScore){
                specialMoves.increaseUndo();
                specialMoves.increaseDelete();
                specialMoves.increaseSwap();
                rewardGiven = true;
                updateSpecialMoves();
                specialMoveAnimation(null, true);
            }

            score[1] = score[0];
            localStorage.setItem('highScore', score[1]);
            scoreBoard[1].textContent = score[1];
        }
    }

    else{
        const savedScore = localStorage.getItem('highScore');
        score[1] = (savedScore !== null) ? Number(savedScore):0;
        scoreBoard[0].textContent = score[0];
        scoreBoard[1].textContent = score[1];
    }
}

function updateSpecialMoves(){
    specialFeatures[0].textContent = specialMoves.undos();
    specialFeatures[1].textContent = specialMoves.deletes();
    specialFeatures[2].textContent = specialMoves.swaps();
}

function clearBoard(){
    board.replaceChildren();
}

async function slide(){
    const animations = []; 

    for (let tile of grid.getTiles()){
        const currentPos = convertToPosition(...tile.position());
        const newPos = convertToPosition(...tile.newPosition());
        
        animations.push(tile.element.animate(
            [   {top: `${currentPos[0]}px`, left: `${currentPos[1]}px`},
                {top: `${newPos[0]}px`, left: `${newPos[1]}px`}
            ], 
            {   duration: 120,
                fill: 'forwards'
            }
        ).finished);        // animate() returns an animation object which has the finished property that is a Promise
    }

    await Promise.all(animations)       // Ensuring all Promises are finished before proceeding (All start simultaneously)
}

async function merge(){
    const animations = [];

    for (let tile of grid.getTiles()){
        if (tile.isMerging()){

            if (tile.isDonating()){         // As in this is the moving tile, that will disappear after the merge
                const currentPos = convertToPosition(...tile.position());
                const newPos = convertToPosition(...tile.mergeInfo.partner.position());

                animations.push(tile.element.animate(
                    [   {top: `${currentPos[0]}px`, left: `${currentPos[1]}px`, backgroundColor: 'white'},
                        {top: `${newPos[0]}px`, left: `${newPos[1]}px`, opacity: 0, transform: 'scale(1.2)'}
                    ],
                    {   duration: 80,
                        fill: "forwards"
                    }
                ).finished)
            }

            else{
                tile.postMerge();
                updateScore(tile.value);

                animations.push(tile.element.animate(
                    [   {transform: `scale(1.2)`, backgroundColor: 'white'}],
                    {   duration: 80,
                    }
                ).finished)
            }
        }
    }

    await Promise.all(animations)
    grid.updateMergeInfo();
}

async function undoAnimation(){
    await board.animate(
        [
            { transform: 'scale(1)' },
            { transform: 'scale(0.96)' },
            { transform: 'scale(1)' }
        ],
        {
            duration: 300,
            easing: 'ease-out'
        }
    ).finished
}

async function pause(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tileDeletion(element){

    await element.animate(
        [
            {backgroundColor: `hsl(0, 93%, 48%)`},
            {backgroundColor: `hsl(37, 93%, 48%)`},
            {backgroundColor: `hsl(53, 93%, 48%)`},
            {transform: 'scale(0) rotate(360deg)', backgroundColor: 'hsl(101, 93%, 48%)'}
        ],
        {
            duration: 1000,
            fill: 'forwards',
            easing: 'ease-in-out'
        }
    ).finished;
}

async function switchAnimation(elementA, elementB){
    const posA = convertToPosition(...elementA.tile.position());
    const posB = convertToPosition(...elementB.tile.position());

    const animationA = elementA.animate(
        [
            {top: `${posA[0]}px`, left: `${posA[1]}px`}     // Coz the tiles have already swapped positions in the grid, so we're just updating this visually.
        ],
        {
            duration: 500,
            fill: 'forwards',
            easing: 'ease-in-out'
        }
    ).finished;
    const animationB = elementB.animate(
        [
            {top: `${posB[0]}px`, left: `${posB[1]}px`}
        ],
        {
            duration: 500,
            fill: 'forwards',
            easing: 'ease-in-out'
        }
    ).finished;

    await Promise.all([animationA, animationB]);
}

function specialMoveAnimation(idx, all = false){
    if (!all){
        specialButtons[idx].animate(
            [
                {transform: 'scale(1)'},
                {transform: 'scale(1.2)', backgroundColor: `${colours[Math.floor(Math.random() * colours.length)]}`},
                {transform: 'scale(1)', backgroundColor: '#415a77'}
            ],
            {
                duration: 400,
                easing: 'ease-in-out'
            }
        );
    }

    else{
        specialButtons.forEach((button) => {
            button.animate(
                [
                {transform: 'scale(1)'},
                {transform: 'scale(2)', backgroundColor: `${colours[Math.floor(Math.random() * colours.length)]}`},
                {transform: 'scale(1)', backgroundColor: '#415a77'}
                ],
                {
                    duration: 400,
                    easing: 'ease-in-out'
                }
            )
        })
    }
}

deleteTile.onclick = function(){
    if (specialMoves.deletes() === 0) return;

    if (deleting){
        deleting = false;
        deleteTile.style.backgroundColor = '#415a77'
        deleteTile.style.color = '#e0e1dd'
        undoMove.disabled = false;
        switchTiles.disabled = false;
    }

    else{
        deleting = true;
        deleteTile.style.backgroundColor = 'hsla(163, 87%, 44%, 1.00)';
        deleteTile.style.color = 'black'
        undoMove.disabled = true;
        switchTiles.disabled = true;
    }
}

undoMove.onclick = async function(){
    if (specialMoves.undos() == 0 || savedGrids.length == 0) return;

    grid = new TileGrid(savedGrids.pop());
    grid.renderBlocks();
    const data = dataCopy.pop();

    score[0] = data.score;
    clearBoard();

    await undoAnimation();
    
    specialMoves.deleteMoves = data.deletes;
    specialMoves.swapMoves = data.swaps;
    specialMoves.undoMoves = data.undos;
    specialMoves.decreaseUndo();
    populate();
    backgroundTiles();
    updateSpecialMoves();
    specialMoveAnimation(U);
}

switchTiles.onclick = async function(){
    if (specialMoves.swaps() === 0) return;

    if (switching){
        switching = false;
        switchTiles.style.backgroundColor = '#415a77'
        switchTiles.style.color = '#e0e1dd'
        blocksToSwitch.forEach(el => el.style.border = '1px black solid')
        undoMove.disabled = false;
        deleteTile.disabled = false;
    }

    else{
        switching = true;
        switchTiles.style.backgroundColor = 'hsla(163, 87%, 44%, 1.00)';
        switchTiles.style.color = 'black'
        undoMove.disabled = true;
        deleteTile.disabled = true;
    }
}

newGame.onclick = () => {
    location.reload();
    grid = new TileGrid();
    savedGrid = null;
    populate();
}

start();