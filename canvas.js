const canvas = document.querySelector("canvas");
const brush = canvas.getContext("2d")

canvas.width = 800
canvas.height = 400

let isCanvas = false

let liveArray = []

let interval

let radius = 10

let isLoader = true

async function canvasInit() {
    if (!reportsArray[0]) {
        brush.font = "50px Arial";
        brush.fillStyle = "rgb(29, 40, 47)"
        brush.fillText("No Coins selected", 200, 200)
        return
    }
    radius = 10
    isLoader = true
    canvasLoader()
    liveArrayPre = [
        { ...reportsArray[0], color: "green" },
        { ...reportsArray[1], color: "red" },
        { ...reportsArray[2], color: "navy" },
        { ...reportsArray[3], color: "purple" },
        { ...reportsArray[4], color: "darkorange" }
    ]
    liveArray = liveArrayPre.filter(item => item.symbol)
    const reportsData = liveArray.map(item => item.symbol.toUpperCase()).join(",")
    const info = await getInfo(reportsData)
    liveArray.forEach((item) => {
        const { symbol } = item
        if (info[symbol.toUpperCase()]) {
            item.usd = []
            for (let i = 0; i < 5; i++) {
                item.usd.push(info[symbol.toUpperCase()].USD)
            }
            item.data = true
        } else item.data = false
    })
    $(".reports-item").each((i, sqr) => {
        if (liveArray[i]) {
            if (!liveArray[i].data) {
                $(sqr).css({ backgroundColor: "grey" })
                $(sqr).html(`${liveArray[i].symbol} (No Data)` || "...")
            }
            else {
                $(sqr).css({ backgroundColor: liveArray[i].color })
                $(sqr).html(liveArray[i].symbol)
            }
        }
    });
    const arrFiltered = liveArray.filter((item) => { if (item.data) return item })
        .map(item => { return { "symbol": item.symbol, "usd": item.usd, "color": item.color } })
    // let count = 1
    interval = setInterval(async function () {
        isCanvas = true
        brush.clearRect(0, 0, 800, 400)
        drawLines(100)
        drawLines(200)
        drawLines(300)
        drawVerticalLine()
        const bigNum = arrFiltered.reduce((reasult, item) => {
            for (let i = 0; i < item.usd.length; i++) {
                if (item.usd[i] > reasult) reasult = item.usd[i]
            }
            return reasult
        }, 0)
        const arrDraw = setHieghts(bigNum, arrFiltered)
        drawGraphPoints(arrDraw, arrFiltered)
        const NewInfo = await getInfo(reportsData)
        console.log(arrFiltered)
        arrFiltered.forEach(item => {
            const { usd, symbol } = item
            usd.splice(0, 1)
            usd.push(NewInfo[symbol.toUpperCase()].USD)
        })
        let count = 0
        $(".reports-item").each((i, sqr) => {
            if (liveArray[i]) {
                if (!liveArray[i].data) return
                $(sqr).html(`${liveArray[i].symbol} (${arrFiltered[count].usd[4]})`)
                count++
            }
        })
    }, 3000);
}

function drawLines(h) {
    brush.beginPath()
    brush.moveTo(0, h);
    brush.lineTo(800, h)
    brush.lineWidth = 1;
    brush.strokeStyle = "rgb(29, 40, 47)"
    brush.stroke()
}

function drawVerticalLine() {
    brush.beginPath()
    brush.moveTo(185, 0);
    brush.lineTo(185, 500)
    brush.lineWidth = 1;
    brush.strokeStyle = "rgb(29, 40, 47)"
    brush.stroke()
}

function drawlinesvals(content, value) {
    brush.font = "15px Arial";
    brush.fillStyle = "rgb(29, 40, 47)"
    brush.fillText(content, 5, value)
}

async function getInfo(reportsData) {
    let ans = {}
    await api.getReportsInfo(reportsData).then(res => ans = { ...res })
    return ans
}

function setHieghts(bigNum, arr) {
    let mult = 1
    let x = bigNum
    if (x < 400 && x > 200) {
        const result = allPointsPosition(arr, mult, true)
        drawGraphLines(mult, true)
        return result
    }
    else if (x > 400) {
        while (x > 400) {
            mult *= 2
            x /= 2
        }
        const result = allPointsPosition(arr, mult, false)
        drawGraphLines(mult, true)
        return result
    }
    else while (x < 200) {
        mult *= 2
        x *= 2
    }
    const result = allPointsPosition(arr, mult, true)
    drawGraphLines(mult, false)
    return result
}

function allPointsPosition(arr, mult, bol) {
    if (!bol) {
        const ret = arr.reduce((ecumilator, item) => {
            let cell = []
            for (let i = 0; i < item.usd.length; i++) {
                const num = item.usd[i] / mult
                cell = [...cell, num]
            }
            return [...ecumilator, cell]
        }, [])
        return ret
    }
    else {
        const ret = arr.reduce((ecumilator, item) => {
            let cell = []
            for (let i = 0; i < item.usd.length; i++) {
                const num = item.usd[i] * mult
                cell = [...cell, num]
            }
            return [...ecumilator, cell]
        }, [])
        return ret
    }
}

function drawGraphLines(mult, bol) {
    if (bol) {
        drawlinesvals(`${200 * mult}`, 195)
        drawlinesvals(`${300 * mult}`, 95)
        drawlinesvals(`${100 * mult}`, 295)
    }
    else {
        drawlinesvals(`${200 / mult}`, 195)
        drawlinesvals(`${300 / mult}`, 95)
        drawlinesvals(`${100 / mult}`, 295)
    }

}

function drawGraphPoints(arrDraw, arrFiltered) {
    const barWidth = 10
    arrDraw.forEach((item, i) => {
        let barX = 190
        item.forEach((point) => {
            brush.beginPath()
            brush.fillStyle = arrFiltered[i].color
            point += 5
            brush.fillRect(barX, canvas.height - point, barWidth, 10)
            barX += barWidth + 140
        })
        drawCoinLines(item, arrFiltered[i].color)
    })
}

function drawCoinLines(item, color) {
    let x = 190
    brush.beginPath()
    brush.strokeStyle = color
    brush.lineWidth = 1;
    brush.moveTo(x, canvas.height - item[0]);
    for (let i = 1; i < item.length; i++) {
        x += 150
        brush.lineTo(x, canvas.height - item[i])
    }
    brush.stroke()
}

function closeCanvas() {
    if (isCanvas) clearInterval(interval)
    brush.clearRect(0, 0, 800, 400)
    isCanvas = false
    $(".reports-item").each((i, sqr) => {
        $(sqr).css({ backgroundColor: "grey" })
        $(sqr).html("")
    })
}


function canvasLoader() {
    console.log("hi")
    if (!isLoader) return
    brush.clearRect(0, 0, 800, 400)
    brush.beginPath();
    brush.arc(400, 200, radius, 0, Math.PI * 2, false);
    brush.fillStyle = "green"
    brush.fill();
    radius += 2
    requestAnimationFrame(canvasLoader)
    setTimeout(() => {
        isLoader = false
    }, 3000);
}
