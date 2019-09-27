const canvas = document.querySelector("canvas");
const brush = canvas.getContext("2d")

canvas.width = 800
canvas.height = 400

let liveArray = []
async function canvasInit() {
    liveArrayPre = [
        { ...reportsArray[0], color: "green" },
        { ...reportsArray[1], color: "red" },
        { ...reportsArray[2], color: "navy" },
        { ...reportsArray[3], color: "purple" },
        { ...reportsArray[4], color: "lightblue" }
    ]
    liveArray = liveArrayPre.filter(item => item.symbol)
    const info = await getInfo()
    liveArray.forEach((item) => {
        const { symbol } = item
        if (info[symbol.toUpperCase()]) {
            item.usd = info[symbol.toUpperCase()].USD
            item.data = true
        } else item.data = false
    })
    $(".reports-item").each((i, sqr) => {
        if (liveArray[i]) {
            if (!liveArray[i].data) {
                $(sqr).css({ backgroundColor: "grey" })
                $(sqr).prev().html(`${liveArray[i].symbol} (No Data)` || "...")
            }
            else {
                $(sqr).css({ backgroundColor: liveArray[i].color })
                $(sqr).prev().html(liveArray[i].symbol)
            }
        }
    });
    const arrFiltered = liveArray.filter((item) => { if (item.data) return item })
    const arrSorted = arrFiltered.reduce((reasult, num) => {
        return [...reasult, num.usd].sort(function (a, b) { return b - a });
    }, [])
    const arrDraw = setHieghts(arrSorted, arrFiltered)
    console.log(arrFiltered)
    drawLines(100)
    drawLines(200)
    drawLines(300)
    const barWidth = 10
    let barX = 150
    arrDraw.forEach((item, i) => {
        brush.beginPath()
        brush.fillStyle = arrFiltered[i].color
        if (item < 1) item += 2
        brush.fillRect(barX, canvas.height - item, barWidth, 10)
        // barX += barWidth + 120
    })
}



function drawLines(h) {
    brush.beginPath()
    brush.moveTo(0, h);
    brush.lineTo(800, h)
    brush.lineWidth = 1;
    brush.strokeStyle = "rgb(29, 40, 47)"
    brush.stroke()
}

function drawlinesvals(content, value) {
    brush.font = "15px Arial";
    brush.fillStyle = "rgb(29, 40, 47)"
    brush.fillText(content, 5, value)
}

async function getInfo() {
    let ans = {}
    const reportsData = liveArray.map(item => item.symbol.toUpperCase()).join(",")
    await api.getReportsInfo(reportsData).then(res => ans = { ...res })
    console.log(ans)
    return ans
}

function setHieghts(sort, arr) {
    let mult = 1
    let x = sort[0]
    if (x < 400 && x > 200) return arr.map(bar => bar.usd)
    else if (x > 400) {
        while (x > 400) {
            mult *= 2
            x /= 2
        }
        drawlinesvals(`${200 * mult}`, 195)
        drawlinesvals(`${100 * mult}`, 95)
        drawlinesvals(`${300 * mult}`, 295)
        return arr.map(bar => bar.usd / mult)
    }
    else while (x < 200) {
        mult *= 2
        x *= 2
    }
    drawlinesvals(`${200 / mult}`, 195)
    drawlinesvals(`${100 / mult}`, 95)
    drawlinesvals(`${300 / mult}`, 295)
    return arr.map((bar) => bar.usd * mult)
}

