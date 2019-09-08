class Coin {
    constructor(coinApiObject, isSelected) {
        const { id, symbol, name } = coinApiObject
        this.name = name
        this.symbol = symbol;
        this.id = id
        this.isSelected = isSelected
        this.isShowInfo = false
     }

}

class CoinMoreInfo extends Coin{
    constructor(extendedObject, isSelected){
        const { image, market_data} = extendedObject 
        super(extendedObject, isSelected)
        this.pic = image.thumb
        this.usdRate = market_data.current_price.usd
        this.eurRate = market_data.current_price.eur
        this.ilsRate = market_data.current_price.ils
    }
}