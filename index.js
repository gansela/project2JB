//  the model of all the cryptocoins
let coinsState = {}

// for use in pagination 
let pageNumber = 1

// 5 coins array for reports and popup 
const reportsArray = []

// init and listeners fo paginations and navbar
function init() {
    $("#content").html('<div class="loader"></div>');
    let pageNavSlice = (pageNumber - 1) * 40
    api.getCoins().then(res => storeCoinInState(res.slice(pageNavSlice, pageNavSlice + 40)))
    $("#coin-search-btn").on("click", function () {
        closeCanvas()
        $("#home-div").css({ display: "block" })
        $("#canvas-div").css({ display: "none" })
        $("#about-div").css({ display: "none" })
        toggleAndDraw()
    })
    $("#home").on("click", function () {
        closeCanvas()
        $("#coin-search").val("")
        $("#home-div").css({ display: "block" })
        $("#canvas-div").css({ display: "none" })
        $("#about-div").css({ display: "none" })
        pageNumber = 1
        toggleAndDraw()
    })
    $("#live-reports").on("click", function () {
        $("#home-div").css({ display: "none" })
        $("#canvas-div").css({ display: "block" })
        $("#about-div").css({ display: "none" })
        canvasInit()
    })
    $("#about").on("click", function () {
        closeCanvas()
        $("#home-div").css({ display: "none" })
        $("#canvas-div").css({ display: "none" })
        $("#about-div").css({ display: "block" })
    })
    $("#next").on("click", function () {
        $("#content").html('<div class="loader"></div>');
        pageNumber++
        pageNavSlice = (pageNumber - 1) * 40
        $(".toggle-one").bootstrapToggle("destroy");
        api.getCoins().then(res => storeCoinInState(res.slice(pageNavSlice, pageNavSlice + 40)))
    })
    $("#previous").on("click", function () {
        if (pageNumber < 1) return
        pageNumber--
        $(".toggle-one").bootstrapToggle("destroy");
        draw(coinsState)
    })
}

// creating coin classes from Api items and sending to draw 
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


// drawing coinsState, enabling previousToggle, creating listenrs for the coin cards 
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
            toggleAndDraw()
        })
        clonedCard.find(".toggle-one").on("change", () => {
            selectCard(symbol)
        })
        if (coinsState[symbol].isShowInfo) { showInfoDiv(clonedCard) }
        $("#content").append(clonedCard);
        if (coinsState[symbol].isSelected) { clonedCard.last().find(".toggle-one").prop('checked', true) }
        else { clonedCard.last().find(".toggle-one").prop('checked', false) }
    })
    previousToggle()
    $(".toggle-one").bootstrapToggle();
}



init()