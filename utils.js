function findCoins(val) {
    $(".toggle-one").bootstrapToggle("destroy");
    if (val === "") {draw(coinsState); return}
    let searchObj = {}
    if (coinsState[val]) searchObj[val] = { ...coinsState[val] }
    // console.log(searchObj)
    draw(searchObj)
}