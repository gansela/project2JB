//  api's, full list and only one coin 
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
    getReportsInfo: (data) => {
        return $.ajax({
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${data}&tsyms=USD`,
            method: "get"
        })
    },
}
