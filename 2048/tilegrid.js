class TileGrid{
    constructor(tileGrid = null, empty = false){

        if (tileGrid instanceof TileGrid){
            this.grid = [];

            for (let arr of tileGrid.grid){
                let arrCopy = [];
                for (let item of arr){
                    const element = (item instanceof Tile) ? new Tile(null, null, item) : item;
                    arrCopy.push(element);
                }
                this.grid.push(arrCopy);
            }
        }

        else{
            this.grid = (empty) ? [] :  [
                                        [0, 0, 0, 0],
                                        [0, 0, 0, 0],
                                        [0, 0, 0, 0],
                                        [0, 0, 0, 0]
                                        ];
        }
    }

    getTiles(){
        const tiles = [];
        
        for (let row of this.grid){
            for (let item of row){
                if (item instanceof Tile)
                    tiles.push(item);
            }
        }

        return tiles;
    }

    add(row){
        this.grid.push(row);
    }

    set(newTile, pos = null){
        if (pos === null)
            this.grid[newTile.row][newTile.col] = newTile;

        else
            this.grid[pos[0]][pos[1]] = newTile;
    }

    /**
     * 
     * 
     * @param {Number} outerIdx 
     * @param {Number} innerIdx If not given, will return an array
     * @returns {Array|Number|Tile} An array or element given the specified index/indices
     */
    get(outerIdx, innerIdx = -1){
        return (innerIdx === -1) ? this.grid[outerIdx] : this.grid[outerIdx][innerIdx];
    }

    free(...indices){
        return this.get(...indices) === 0;
    }

    updateCoords(){
        this.grid.forEach((element, outerIdx) => {
            element.forEach((item, innerIdx) => {
                if (item instanceof Tile){
                    item.newCoords(outerIdx, innerIdx)
                }
            })
        })
    }

    addBlock(){
        const options = [2, 2, 2, 2, 4, 4]; // Set distribution possibilities
        const random = Math.floor(Math.random() * options.length) // Get random number
        let found = false;

        while (!found){
            // Get random location
            const   x = Math.floor(Math.random() * 4),
                    y = Math.floor(Math.random() * 4);

            // Check and insert number if position is free
            if (this.free(x, y)){
                this.set(new Tile(options[random], [x, y]));
                found = true;
            }
        }
    }

    toString(){
        console.log(this);
    }

    equals(grid0){
        for(let i = 0; i < ROW; i++){
             for (let j = 0; j < ROW; j++){
                const   A = this.get(i, j),
                        B = grid0.get(i, j);

                if (A == 0 && B == 0)
                    continue;

                if (A instanceof Tile && B instanceof Tile){
                    if (A.value != B.value)
                        return false;
                }

                else if (A instanceof Tile && !(B instanceof Tile)){
                    return false;
                }

                else if(!(A instanceof Tile) && B instanceof Tile){
                    return false;
                }
             }
        }
        return true;
    }

    deleteTile(row, col){
        this.grid[row][col] = 0;
    }

    renderBlocks(){
        for (let tile of this.getTiles()){
            tile.recreateBlock();
        }
    }

    updateMergeInfo(){
        for (let tile of this.getTiles()){
            if (tile.isMerging()){
                if (!tile.isDonating()){
                    tile.resetMerge();
                }

                else{
                   this.deleteTile(...tile.position());        // Delete the tile from the grid
                   tile.deleteBlock();                         // Delete the tile's element
                }
            }
        }
    }
}