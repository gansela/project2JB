
let coinsState = {}
let lastCoinInfo = {}


function init() {
    api.getCoins().then(res => storeCoinInState(res.slice(0, 20)))
    $("#coin-search").on("input", function () {
        findCoins(this.value)
    })
}

function storeCoinInState(apiCoinsArray) {
    const state = apiCoinsArray.reduce((ecumilator, coin) => {
        const { symbol } = coin;
        return { ...ecumilator, [symbol]: new Coin(coin, false) }
    }, {})
    coinsState = { ...state }
    draw(coinsState)
}

function draw(coinsStateObject) {
    $("#content").html("");
    Object.entries(coinsStateObject).map(([key, value]) => {
        const clonedCard = $("#coin-card").clone();
        clonedCard.find(".card-body").attr({ "id": key });
        clonedCard.find(".card-title").html(key)
        clonedCard.find(".card-text").html(value.name)
        clonedCard.css({ display: "inline-block" });
        clonedCard.find(".more-info").on("click", async () => {
            if (coinsState[key].isShowInfo) { lessInfo(key); return }
            await api.getCoinInfo(value.id).then(res => saveCoinInfo(res))
            if ($("#coin-search").val()) { findCoins($("#coin-search").val()); return }
            $(".toggle-one").bootstrapToggle("destroy");
            draw(coinsState)
        })
        clonedCard.find(".toggle-one").on("change", () => {
            coinsState[key].isSelected = !coinsState[key].isSelected
        })
        if (coinsState[key].isShowInfo) { showInfoDiv(clonedCard) }
        $("#content").append(clonedCard);
        if (coinsState[key].isSelected) { clonedCard.last().find(".toggle-one").prop('checked', true) }
        else { clonedCard.last().find(".toggle-one").prop('checked', false) }
    })
    $(".toggle-one").bootstrapToggle();
}

function saveCoinInfo(coin) {
    const superIsSelected = coinsState[coin.symbol].isSelected
    coinsState[coin.symbol] = new CoinMoreInfo(coin, superIsSelected)
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