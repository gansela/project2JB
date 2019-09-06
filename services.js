
const api = {
    getCoins: () => {
        return $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/list ",
            method: "get"
        })
    },
    getCoinInfo: (data) => {
        return $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${data}`,
            method: "get"
        })
    },

}
