/**
 * Manipulates a grid to prepare it for a left shift which is the simplest.
 * 
 * @param {Number} operation Sets whether the grid should be reversed, rotated or flipped.
 * @param {Grid} grid0 The grid to be manipulated.
 * @returns {Grid} The manipulated grid.
 */
function changeGrid(operation, grid0){
    switch(operation){
        case 0:
            let ourGrid = new TileGrid(grid0);
            for (let i = 0; i < grid0.grid.length; i++){
                ourGrid.grid[i].reverse();
            }
            return ourGrid;

        case 1:
            rotatedGrid = new TileGrid(null, true);

            for (let i = 0; i < ROW; i++){
                let array = [];
                for (let j = 0; j < ROW; j++){
                    array.push(grid0.get(j, i));
                }
                rotatedGrid.add(array);
            }
            return rotatedGrid;
    }
}

function pushLeft(grid0){
    let shiftedGrid = new TileGrid(grid0);

    for (let i = 0; i < ROW; i++){
        const row = shiftedGrid.get(i);
        if (!row.some(item => item instanceof Tile))
            continue;

        while(row.includes(0)){
            row.splice(row.indexOf(0), 1);          // Removes the zeros, this shifting every element to the left
        }

        while(row.length < 4){
            row.push(0);
        }
    }
    return shiftedGrid;
}

function pushRight(grid0){
    const shiftedGrid = pushLeft(changeGrid(0, grid0));     // A right shift is just a left shift in reverse, so we'll reverse the grid then pushLeft
    return changeGrid(0, shiftedGrid);           // We then reverse it again to get our actual result
}

function pushUp(grid0){
    const shiftedGrid = pushLeft(changeGrid(1, grid0));  // An up shift is just a left shift after the grid has been rotated by 90deg to the left
    return changeGrid(1, shiftedGrid);
}

function pushDown(grid0){
    const shiftedGrid = pushRight(changeGrid(1, grid0));
    return changeGrid(1, shiftedGrid);
}

