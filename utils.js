async function findCoins(val) {
    $(".toggle-one").bootstrapToggle("destroy");
    $(".page-nav").css({ display: "none" });
    if (val === "") {draw(coinsState); $(".page-nav").css({ display: "flex" }); return }
        let searchObj = {}
        if (!coinsState[val]) {
            await api.getCoins().then(res => findCoinFromApi(res, val))
                .then((coin) => { coinsState[val] = new Coin(coin, false, 0) })
                .catch(err => $("#content").html("no results"))
        }
        if (!coinsState[val]) return
        searchObj[val] = { ...coinsState[val] }
        draw(searchObj)
    }

    function findCoinFromApi(res, val) {
        const ans = res.find((coin) => {
            return val === coin.symbol
        })
        if (ans) return ans
    }

    function previousToggle(){
     pageNumber === 1 ? $("#previous-id").addClass('disabled'): $("#previous-id").removeClass("disabled")
     $("#page-number").html(`${pageNumber}`)
    }