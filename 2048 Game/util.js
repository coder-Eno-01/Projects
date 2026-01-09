/**
 * Converts coordinates in the form (row, col) to an absolute position on the board.
 * This is where the tile is placed visually.
 * 
 * @param  {...Number} indices 
 * @returns {Number[]}
 */
function convertToPosition(...indices){
    layoutSizes();
    return indices.map(coord => sizes.gap + (sizes.gap + sizes.tile) * coord);
}

/**
 * Places a tile on the board after converting the coordinates to an absolute board position
 * 
 * @param {div} element 
 * @param {Number} row 
 * @param {Number} col 
 */
function place(element, indices){
    if (!board.contains(element)) board.appendChild(element);
    
    const newSpot = convertToPosition(...indices);
    element.style.top = `${newSpot[0]}px`;
    element.style.left = `${newSpot[1]}px`
}

/**
 * Maps the absolute position of the element to coordinates on the grid
 * 
 * @param {Number[]} position The absolute position on the board (pixels)
 * @returns {Number[]}
 */
function convertToIndices(position){
    return position.map((element) => (element - GAP)/(GAP + SIZE));
}

/**
 * Converts 2D grid form indicing to a 1D index system
 * [ i ][ j ] --> k
 * 
 * @param  {...Number} indices 
 * @returns {Number}
 */
function convertToIndex(...indices){
    return indices[0]*4 + indices[1];
}

/**
 * Converts 1D index system to 2D grid form
 * k --> [ i ][ j ]
 * 
 * @param {Number} position Index of array with 16 elements (0 to 15)
 * @returns {Number[]} Two element array with outer and inner index
 */
function getIndices(position){
    if (position < 4)
        return [0, position]

    else if (position < 8)
        return [1, position - 4]

    else if (position < 12)
        return [2, position - 8]

    else if (position < 16)
        return [3, position - 12]

    else
        return [];
}

/**
 * Checks if two arrays have exactly the same elements stored
 * 
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns True if the arrays are exactly the same
 */
function equalArrays(array1, array2){
    if (array1.length !== array2.length)
        return false;

    for (let i = 0; i < array1.length; i++){
        if (array1[i] !== array2[i])
            return false;
    }

    return true;
}

function checkLost(grid0){
    for(let innerGrid of grid0.grid){
        if (innerGrid.includes(0))
            return false;
    }

    for (let key of allowed){
        if (mergeAvailable(grid0, key))
            return false;
    }

    return true;
}

function updateTargets(grid, shiftedGrid){
    shiftedGrid.updateCoords();

    for (let i = 0; i < ROW; i++){
        for (let j = 0; j < ROW; j++){
            const item1 = shiftedGrid.get(i, j);
            const item2 = grid.get(i, j);

            if (item1 instanceof Tile && item2 instanceof Tile) {
                const target = item1.position();
                item2.setTarget(...target);
            }
        }
    }
}

function mergeAvailable(grid0, key){switch(key){
        case "ArrowLeft":

            for (let row of grid0.grid){
                if (checkMerge(row))
                    return true;
            }

            break;

        case "ArrowRight":

            for (let j = 0; j < ROW; j++){
                const row = [...grid0.get(j)].reverse();
                if (checkMerge(row)){
                    return true;
                }
            }

            break;

        case "ArrowUp":

            for (let row of verticalGrid(grid0)){
                if (checkMerge(row))
                    return true;
            }

            break;

        case "ArrowDown":
            const tempGrid = verticalGrid(grid0);

            for (let j = 0; j < ROW; j++){
                const row = [...tempGrid[j]].reverse();

                if (checkMerge(row)){
                    return true;
                }
            }

            break;
    }

    return false;
}

function prepareForMerge(grid0, key){
    switch(key){
        case "ArrowLeft":

            for (let row of grid0.grid){
                configureMerge(row);
            }

            break;

        case "ArrowRight":

            for (let j = 0; j < ROW; j++){
                const row = grid0.get(j).reverse();
                configureMerge(row);
                row.reverse();
            }

            break;

        case "ArrowUp":

            for (let row of verticalGrid(grid0)){
                configureMerge(row);
            }

            break;

        case "ArrowDown":
            const tempGrid = verticalGrid(grid0);

            for (let j = 0; j < ROW; j++){
                const row = tempGrid[j].reverse();
                configureMerge(row);
                row.reverse();
            }

            break;
    }
}

function verticalGrid(grid0){
    const tempGrid = [];

    for (let i = 0; i < ROW; i++){
        const innerTemp = [];
        for (let j = 0; j < ROW; j++){
            innerTemp.push(grid0.get(j, i));
        }
        tempGrid.push(innerTemp);
    }

    return tempGrid;
}

function configureMerge(row){
    for (let i = 0; i < (ROW - 1); i++){
        const item1 = row[i];
        const item2 = row[i + 1];

        if (item1 instanceof Tile && item2 instanceof Tile){
            if (item1.value === item2.value){
                item1.accept(item2);
                item2.donate(item1);
                i++;
            }
        }
    }
}

function checkMerge(row){
    for (let i = 0; i < (ROW - 1); i++){
        const item1 = row[i];
        const item2 = row[i + 1];

        if (item1 instanceof Tile && item2 instanceof Tile){
            if (item1.value === item2.value){
                return true;
            }
        }
    }
}