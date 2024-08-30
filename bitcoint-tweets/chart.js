import { colours, addAxis, formatCurrency, addLegend, addVerticalTooltip, plot } from "../node_modules/visual-components/index.js"

export const addChart = async (chartProps, theme = 'light') => {
    const { data, prices, tweets } = await prepareData()
    const { chart, width, height, margin } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    const { x, y } = createAxes(data, width, height)

    plotLines(chartProps, x, y, theme, tweets, prices)
    plotImage(chart, x, y)
    plotAxis(chart, width, height, palette, x, y)
    plotLegend(chart, palette, margin)
    plotTooltip(data, chart, x, y, width, height, palette)
}

async function prepareData() {
    const data = await d3.csv('bitcoint-tweets/data/dataset.csv')
        .then(dt => dt.map(d => {
            return {
                date: new Date(d.date + 'T00:00:00Z'),
                price: +d.price,
                tweets: d.tweets !== '' ? +d.tweets : 0
            }
        }))

    const prices = data.map(d => { return { date: d.date, price: d.price } })
    const tweets = data.map(d => { return { date: d.date, tweets: d.tweets } })

    return { data, prices, tweets }
}

function createAxes(data, width, height) {
    const x = d3
        .scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.price) * 1.1])
        .range([height, 0])

    return { x, y }
}

function plotLines(chartProps, x, y, theme, tweets, prices) {
    const defaultProps = {
        chartProps,
        xField: 'date',
        x,
        y,
        axis: () => { },
        theme,
        strokeWidth: 2,
        legend: false,
        tooltip: false
    }

    plot().line({
        ...defaultProps,
        data: tweets,
        yField: 'tweets',
        colour: 'orange'
    })
    plot().line({
        ...defaultProps,
        data: prices,
        yField: 'price',
        colour: 'blue'
    })
}

function plotImage(chart, x, y) {
    chart.append('svg:image')
        .attr('x', x(new Date('2022/10/01')))
        .attr('y', y(70000))
        .attr('width', 86)
        .attr('height', 86)
        .attr('opacity', 0.25)
        .attr('xlink:href', 'bitcoint-tweets/img/bitcoin.webp')
}

function plotAxis(chart, width, height, palette, x, y) {
    addAxis({
        chart,
        width,
        height,
        colour: palette.axis,
        x,
        y,
        yRight: y,
        xLabel: 'Date',
        yLabel: 'Price (U$D)',
        yRightLabel: 'Tweets',
        yFormat: d => formatCurrency(d, false, 1),
        yRightFormat: d3.format('.1s'),
        hideXdomain: true,
        hideYdomain: true
    })
}

function plotLegend(chart, palette, margin) {
    addLegend({
        chart,
        legends: ['Price', 'Tweets'],
        colours: [palette.blue, palette.orange],
        xPosition: -margin.left,
        yPosition: -12
    })
}

function plotTooltip(data, chart, x, y, width, height, palette) {
    const tooltipData = {}
    for (let i = 0; i < data.length; i++) {
        tooltipData[data[i].date.getTime()] = {
            x: data[i].date.getTime(),
            ys: [data[i].price, data[i].tweets],
            price: data[i].price,
            tweets: data[i].tweets
        }
    }

    addVerticalTooltip({
        chart,
        htmlText: d => `
        <strong>${new Date(d.x).toLocaleDateString()}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Price:&emsp;</span>
            <span>${formatCurrency(d.price, true)}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Tweets:&emsp;</span>
            <span>${d.tweets}</span>
        </div>
        `,
        chartWidth: width,
        chartHeight: height,
        x,
        y,
        colour: palette.axis,
        data: data,
        xVariable: 'date',
        tooltipData,
        keyFunction: d => d.getTime()
    })
}