
// search option through the api and drawing only the searcehd coin 
async function findCoins(val) {
    $(".toggle-one").bootstrapToggle("destroy");
    if (!val) {
        $(".page-nav").css({ display: "flex" })
        return draw(coinsState)
    }
    $(".page-nav").css({ display: "none" });
    let searchObj = {}
    if (!coinsState[val]) {
        $("#content").html('<div class="loader"></div>');
        await api.getCoins().then(res => findCoinFromApi(res, val))
            .then((coin) => {
                if (!coin) { return $("#content").html('<div align="center"><h1>No Results</h1></div>') }
                coinsState[val] = new Coin(coin, false, 0)
            })
        if (!coinsState[val]) return
    }
    searchObj[val] = { ...coinsState[val] }
    $("#content").html("")
    draw(searchObj)
    $("#home-div").css({ display: "block" })
}
//  finding the coin from the coin list through index search 
function findCoinFromApi(res, val) {
    const ans = res.find((coin) => {
        return val === coin.symbol
    })
    if (ans) return ans
}

// disabling the previous key in the pagination when you are at page 1
function previousToggle() {
    pageNumber === 1 ? $("#previous-id").addClass('disabled') : $("#previous-id").removeClass("disabled")
    $("#page-number").html(`${pageNumber}`)
}

// replacing the coin item from the coin classto the coin extended class 
function saveCoinInfo(coin) {
    const superIsSelected = coinsState[coin.symbol].isSelected
    const superPage = coinsState[coin.symbol].page
    coinsState[coin.symbol] = new CoinMoreInfo(coin, superIsSelected, superPage)
    coinsState[coin.symbol].isShowInfo = !coinsState[coin.symbol].isShowInfo
}

// sending the new data to cloned version of the mini div inside the card with the rates and photo
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

// toggling of the more info Option, making sure if the search input is not empty to still drwing the search 
function lessInfo(key) {
    coinsState[key].isShowInfo = false;
    toggleAndDraw()
}

// adding selected cards to the reports Array, making sure to popp and switch them with listeners
function selectCard(symbol) {
    if (coinsState[symbol].isSelected) {
        coinsState[symbol].isSelected = !coinsState[symbol]
        const index = reportsArray.findIndex(item => { return item === coinsState[symbol] })
        reportsArray.splice(index, 1)
        return
    }
    if (reportsArray.length < 5) {
        coinsState[symbol].isSelected = !coinsState[symbol].isSelected
        reportsArray.push(coinsState[symbol])
        return
    }
    const waitingList = coinsState[symbol]
    $(".popup").css({ display: "block" })
    $(".toggle-one").prop('disabled', true);
    $(".parallax").css({opacity: "0.2"})
    $("#coins-list").html("")
    const coinsList = reportsArray.map(coin => { return popupCoin(coin, waitingList) });
    $("#coins-list").append(coinsList)
    $(".popup").find(".cancel-btn").on("click", () => {
        $(".popup").css({ display: "none" })
        $(".toggle-one").prop('disabled', false);
        $(".parallax").css({opacity: "1"})
        toggleAndDraw()
    })
    toggleAndDraw()
}

// cloning and showing the selecte coins in the popupdiv
function popupCoin(coin, waitingList) {
    const { name, symbol } = coin
    const clonedCoin = $("#generic-array-coin").clone()
    clonedCoin.removeClass("d-none")
    clonedCoin.attr({ "id": name });
    clonedCoin.find(".coin-span").html(symbol)
    clonedCoin.find(".delete-coin").on("click", () => {
        coinsState[symbol].isSelected = false
        $(".popup").css({ display: "none" })
        const index = reportsArray.findIndex(item => { return item === coinsState[symbol] })
        reportsArray.splice(index, 1)
        reportsArray.push(waitingList)
        waitingList.isSelected = true
        $(".toggle-one").prop('disabled', false);
        $(".parallax").css({opacity: "1"})
        toggleAndDraw()
    })
    return clonedCoin
}

//  pre- draw function, decides if to draw thw search or the pagination view
function toggleAndDraw() {
    if ($("#coin-search").val()) { return findCoins($("#coin-search").val()) }
    $(".toggle-one").bootstrapToggle("destroy");
    $(".page-nav").css({ display: "flex" })
    draw(coinsState)
}




