class Coin {
    constructor(coinApiObject) {
        const { id, symbol, name } = coinApiObject
        this.name = name
        this.symbol = symbol;
        this.id = id
        this.isSelected = false;
     }

}