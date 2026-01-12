class Tile{
    constructor(value, indices, tile = null){
        if (tile instanceof Tile){
            this.value = tile.value;
            this.row = tile.row;
            this.col = tile.col;
            this.newRow = tile.newRow;
            this.newCol = tile.newCol;
            this.mergeInfo = {
                role: "acceptor",
                partner: null,
            };
            this.element = tile.element;
            tile.element.tile = this;
        }

        else{
            this.value = value;
            this.row = indices[0];
            this.col = indices[1];
            this.newRow = null;
            this.newCol = null;
            this.mergeInfo = {
                role: "acceptor",
                partner: null,
            };

            // DOM element creation and link
            this.element = document.createElement('div');
            this.element.classList.add('piece');
            this.element.dataset.value = this.value;
            this.element.style.backgroundColor = colourScheme.getTile(this.value);
            this.element.tile = this;
            board.appendChild(this.element)
        }
    }

    resetMerge(){
        this.mergeInfo.role = "acceptor";
        this.mergeInfo.partner = null;
    }

    donate(acceptor){
        this.mergeInfo.role = "donor";
        this.mergeInfo.partner = acceptor; 
    }

    accept(donor){
        this.mergeInfo.role = "acceptor";
        this.mergeInfo.partner = donor; 
    }

    isMerging(){
        return this.mergeInfo.partner != null;
    }

    isDonating(){
        return this.mergeInfo.role === "donor";
    }

    postMerge(){
        this.value *= 2;
        this.element.dataset.value = this.value;
        this.element.style.backgroundColor = colourScheme.getTile(this.value);
    }

    deleteBlock(){
        this.element.remove();
    }

    recreateBlock(){
        this.element = document.createElement('div');
        this.element.classList.add('piece');
        this.element.dataset.value = this.value;
        this.element.tile = this;
    }

    newCoords(row, col){
        this.row = row;
        this.col = col;
    }

    setTarget(row, col){
        this.newRow = row;
        this.newCol = col;
    }

    update(){
        this.row = this.newRow ?? this.row;
        this.col = this.newCol ?? this.col;
        this.newRow = null;
        this.newCol = null;
    }

    position(){
        return [this.row, this.col];
    }

    newPosition(){
        return [this.newRow, this.newCol];
    }
}