class Player{
    constructor(name, pos){
        this.name = name;
        this.isComputer = name === 'Computer';
        this.symbol = pos === 0 ? "X" : "O";
        this.wins = 0;
    }

    addWin(){
        this.wins++;
    }

    toString(){
        return `${this.name}, ${this.symbol}, ${this.wins}`;
    }
}