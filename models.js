// regular class coin 

class Coin {
    constructor(coinApiObject, isSelected, page) {
        const { id, symbol, name } = coinApiObject
        this.name = name
        this.symbol = symbol;
        this.id = id
        this.isSelected = isSelected
        this.isShowInfo = false
        this.page = page || 0
    }

}


// class coin when you enable the more info  button 
class CoinMoreInfo extends Coin {
    constructor(extendedObject, isSelected, page) {
        const { image, market_data } = extendedObject
        super(extendedObject, isSelected, page)
        this.pic = image.thumb
        this.usdRate = market_data.current_price.usd
        this.eurRate = market_data.current_price.eur
        this.ilsRate = market_data.current_price.ils
    }
}

