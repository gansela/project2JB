
let coinsState = {}
let lastCoinInfo = {}
let pageNumber = 1


function init() {
    $("#content").html('<div class="loader"></div>');
    let pageNavSlice = (pageNumber - 1) * 16
    api.getCoins().then(res => storeCoinInState(res.slice(pageNavSlice, pageNavSlice + 16)))
    $("#coin-search").on("input", function () {
        findCoins(this.value)
    })
    $("#next").on("click", function () {
        pageNumber++
        pageNavSlice = (pageNumber - 1) * 16
        $(".toggle-one").bootstrapToggle("destroy");
        api.getCoins().then(res => storeCoinInState(res.slice(pageNavSlice, pageNavSlice + 16)))
    })
    $("#previous").on("click", function () {
        if (pageNumber < 1) return
        pageNumber--
        $(".toggle-one").bootstrapToggle("destroy");
        draw(coinsState)
    })
}

function storeCoinInState(apiCoinsArray) {
    const state = apiCoinsArray.reduce((ecumilator, coin) => {
        const { symbol } = coin;
        if (!coinsState[symbol]) return { ...ecumilator, [symbol]: new Coin(coin, false, pageNumber) }
        coinsState[symbol].page = pageNumber
        return ecumilator
    }, {})
    coinsState = { ...coinsState, ...state }
    $(".page-nav").css({ display: "flex" })
    draw(coinsState)
}

function draw(coinsStateObject) {
    $("#content").html("");
    const pageCards = Object.keys(coinsStateObject).reduce((array, key) => {
        if (coinsState[key].page === pageNumber || key === $("#coin-search").val()) return [...array, coinsState[key]]
        else return array
    }, [])
    pageCards.map((coin) => {
        const { symbol, name, id } = coin
        const clonedCard = $("#coin-card").clone();
        clonedCard.find(".card-body").attr({ "id": symbol });
        clonedCard.find(".card-title").html(symbol)
        clonedCard.find(".card-text").html(name)
        clonedCard.css({ display: "inline-block" });
        clonedCard.find(".more-info").on("click", async () => {
            if (coinsState[symbol].isShowInfo) { lessInfo(symbol); return }
            await api.getCoinInfo(id).then(res => saveCoinInfo(res))
            if ($("#coin-search").val()) { findCoins($("#coin-search").val()); return }
            $(".toggle-one").bootstrapToggle("destroy");
            draw(coinsState)
        })
        clonedCard.find(".toggle-one").on("change", () => {
            coinsState[symbol].isSelected = !coinsState[symbol].isSelected
        })
        if (coinsState[symbol].isShowInfo) { showInfoDiv(clonedCard) }
        $("#content").append(clonedCard);
        if (coinsState[symbol].isSelected) { clonedCard.last().find(".toggle-one").prop('checked', true) }
        else { clonedCard.last().find(".toggle-one").prop('checked', false) }
    })
    previousToggle()
    $(".toggle-one").bootstrapToggle();
    }

function saveCoinInfo(coin) {
    const superIsSelected = coinsState[coin.symbol].isSelected
    const superPage = coinsState[coin.symbol].page
    coinsState[coin.symbol] = new CoinMoreInfo(coin, superIsSelected, superPage)
    coinsState[coin.symbol].isShowInfo = !coinsState[coin.symbol].isShowInfo
}

function showInfoDiv(card) {
    const id = card.find(".card-title").html()
    const { pic, usdRate, eurRate, ilsRate } = coinsState[id]
    const infoDiv = card.find(".info-div")
    infoDiv.css({ display: "flex" });
    infoDiv.find("img").attr({ "src": pic })
    infoDiv.find("#usd").html(`usd: ${usdRate}`)
    infoDiv.find("#eur").html(`eur: ${eurRate}`)
    infoDiv.find("#ils").html(`ils: ${ilsRate}`)
    card.find(".more-info").html("Hide Info")
}

function lessInfo(key) {
    coinsState[key].isShowInfo = false;
    if ($("#coin-search").val()) { findCoins($("#coin-search").val()); return }
    $(".toggle-one").bootstrapToggle("destroy");
    draw(coinsState)
}


init()