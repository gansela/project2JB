
let coinsState = {}


function init() {
    api.getCoins().then(res => storeCoinInState(res.slice(0, 4)))
}

function storeCoinInState(apiCoinsArray) {
    const state = apiCoinsArray.reduce((ecumilator, coin) => {
        const { symbol } = coin;
        return { ...ecumilator, [symbol]: new Coin(coin) }
    }, {})
    coinsState = { ...state }
    console.log(coinsState)
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
        clonedCard.find(".more-info").on("click", () => {
            api.getCoinInfo(value.id).then(res => console.log(res))
            $(".toggle-one").bootstrapToggle("destroy");
            draw(coinsState)
        })
        clonedCard.find(".toggle-one").on("change", () => {
            coinsState[key].isSelected = !coinsState[key].isSelected
        })
        $("#content").append(clonedCard);
        if (coinsState[key].isSelected) clonedCard.find(".toggle-one").prop('checked', true)
    })
    $(".toggle-one").bootstrapToggle();

}
init()