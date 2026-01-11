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

const board = document.querySelector('#board'),
      newGame = document.querySelector('#newGame'),
      scoreBoard = document.querySelectorAll('#scoreBoard h3'),
      deleteTile = document.querySelector('#delete'),
      undoMove = document.querySelector('#undo'),
      switchTiles = document.querySelector('#switch'),
      specialFeatures = document.querySelectorAll('.numMoves'),
      specialButtons = document.querySelectorAll('.SPB');

const allowed = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];

const ROW = 4, U = 0, D = 1, S = 2;
const colours = ['yellow','orange','red','pink','purple','lightblue','blue','lightgreen','green','darkgreen','brown'];

const sizes = {
    tile: 85,
    gap: 15,
    updateTile(newSize){this.tile = newSize},
    updateGap(newGap){this.gap = newGap}
};

let grid, savedGrids = [], dataCopy = [], blocksToSwitch = [];
let busy = false, deleting = false, switching = false, rewardGiven = false;

let touchStartX = 0, touchStartY = 0;
const previousHighScore = localStorage.getItem('highScore') !== null;

/* ---------------- INPUT HANDLING ---------------- */

document.addEventListener('keydown', async e => {
    if (busy || !allowed.includes(e.key)) return;

    busy = true;
    let newGrid = push(e.key);

    if (!grid.equals(newGrid)) await gameLogic(e.key, newGrid, false);
    else if (mergeAvailable(grid, e.key)) await gameLogic(e.key, newGrid, true);

    busy = false;

    if (checkLost(grid) && specialMoves.outOfMoves())
        alert("Game Over! Start a new game to try again.");
});

board.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
});

board.addEventListener('touchend', async e => {
    if (busy) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;

    const key = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? "ArrowRight" : "ArrowLeft")
        : (dy > 0 ? "ArrowDown" : "ArrowUp");

    busy = true;
    let newGrid = push(key);

    if (!grid.equals(newGrid)) await gameLogic(key, newGrid, false);
    else if (mergeAvailable(grid, key)) await gameLogic(key, newGrid, true);

    busy = false;

    if (checkLost(grid) && specialMoves.outOfMoves())
        alert("Game Over! Start a new game to try again.");
});

/* ---------------- GAME LOGIC ---------------- */

async function gameLogic(key, newGrid, justMerge){
    preserveData();
    grid = new TileGrid(newGrid);
    updateTargets(grid, newGrid);

    if (!justMerge){
        await slide();
        grid.updateCoords();
    }

    prepareForMerge(grid, key);
    await merge();

    newGrid = push(key);
    if (!grid.equals(newGrid)){
        grid = new TileGrid(newGrid);
        updateTargets(grid, newGrid);
        await slide();
        grid.updateCoords();
    }

    await pause(80);
    grid.addBlock();
    tileColours();
    populate();
}

/* ---------------- TILE INTERACTION ---------------- */

document.addEventListener('click', async e => {
    const element = e.target.closest('.piece');
    if (!element) return;

    if (deleting){
        preserveData();
        await tileDeletion(element);

        deleting = false;
        specialMoves.decreaseDelete();
        updateSpecialMoves();
        specialMoveAnimation(D);

        element.tile.deleteBlock();
        grid.deleteTile(...element.tile.position());

        undoMove.disabled = false;
        switchTiles.disabled = false;
        deleteTile.style.backgroundColor = colourScheme.second;
        deleteTile.style.color = colourScheme.base;
    }

    else if (switching){
        if (blocksToSwitch.includes(element)){
            element.style.border = '1px black solid';
            blocksToSwitch = [];
            return;
        }

        blocksToSwitch.push(element);
        element.style.border = `3px solid ${colourScheme.accent ?? colourScheme.second}`;

        if (blocksToSwitch.length === 2){
            preserveData();

            const [a,b] = blocksToSwitch.map(el => el.tile);
            grid.set(a, b.position());
            grid.set(b, a.position());
            grid.updateCoords();

            await switchAnimation(...blocksToSwitch);

            blocksToSwitch.forEach(el => el.style.border = '1px black solid');
            switching = false;
            specialMoves.decreaseSwap();
            updateSpecialMoves();
            specialMoveAnimation(S);

            switchTiles.style.backgroundColor = colourScheme.second;
            switchTiles.style.color = colourScheme.base;
            undoMove.disabled = false;
            deleteTile.disabled = false;
            blocksToSwitch = [];
        }
    }

    loadTheme();
});

/* ---------------- ANIMATIONS ---------------- */

async function merge(){
    const animations = [];

    for (let tile of grid.getTiles()){
        if (!tile.isMerging()) continue;

        const accent = colourScheme.accent ?? colourScheme.second;

        if (tile.isDonating()){
            const cur = convertToPosition(...tile.position());
            const nxt = convertToPosition(...tile.mergeInfo.partner.position());

            animations.push(tile.element.animate(
                [
                    {top:`${cur[0]}px`,left:`${cur[1]}px`,backgroundColor:accent},
                    {top:`${nxt[0]}px`,left:`${nxt[1]}px`,opacity:0,transform:'scale(1.2)'}
                ],
                {duration:80,fill:'forwards'}
            ).finished);
        }
        else{
            tile.postMerge();
            updateScore(tile.value);

            animations.push(tile.element.animate(
                [{transform:'scale(1.2)',backgroundColor:accent}],
                {duration:80}
            ).finished);
        }
    }

    await Promise.all(animations);
    grid.updateMergeInfo();
}

function specialMoveAnimation(idx, all=false){
    const accent = colourScheme.accent ?? colourScheme.second;

    const animate = btn => btn.animate(
        [
            {transform:'scale(1)'},
            {transform:'scale(1.2)',backgroundColor:accent},
            {transform:'scale(1)',backgroundColor:colourScheme.second}
        ],
        {duration:400,easing:'ease-in-out'}
    );

    if (!all) animate(specialButtons[idx]);
    else specialButtons.forEach(animate);
}

/* ---------------- BUTTON STATES ---------------- */

deleteTile.onclick = () => {
    if (!specialMoves.deletes()) return;

    deleting = !deleting;
    deleteTile.style.backgroundColor = deleting
        ? (colourScheme.accent ?? colourScheme.second)
        : colourScheme.second;
    deleteTile.style.color = colourScheme.base;

    undoMove.disabled = deleting;
    switchTiles.disabled = deleting;
};

switchTiles.onclick = () => {
    if (!specialMoves.swaps()) return;

    switching = !switching;
    switchTiles.style.backgroundColor = switching
        ? (colourScheme.accent ?? colourScheme.second)
        : colourScheme.second;
    switchTiles.style.color = colourScheme.base;

    undoMove.disabled = switching;
    deleteTile.disabled = switching;
};

/* ---------------- START ---------------- */

newGame.onclick = () => location.reload();

start();
renderTheme();
