import { colours, addAxis, formatCurrency } from "../node_modules/visual-components/index.js"

const line = ({ chartProps, data, theme = 'light', colour = 'blue', xField, yField, x, axis }) => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    x = x !== undefined ? x : d3
        .scaleUtc()
        .domain(d3.extent(data, d => d[xField]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d[yField]) * 1.05])
        .range([height, 0])

    const line = d3
        .line()
        .x(d => x(d[xField]))
        .y(d => y(d[yField]))

    chart
        .selectAll('.data-line')
        .data([data])
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', palette[colour])
        .attr('stroke-width', 1)
        .attr('d', line)

    if (axis !== undefined) {
        axis()
    } else {
        addAxis({
            chart,
            width,
            height,
            colour: palette.axis,
            x,
            y
        })
    }

    return { x, y }
}

export const addChart = async (chartProps, theme = 'light') => {
    const tweets = await d3.csv('bitcoint-tweets/data/tweets.csv')
        .then(data => data.map(d => {
            return {
                date: new Date(d.date + 'T00:00:00Z'),
                tweets: +d.count
            }
        }).sort((a, b) => a.date - b.date)
        )

    const prices = await d3.csv('bitcoint-tweets/data/prices.csv')
        .then(data => data.map(d => {
            return {
                date: new Date(d.date + 'T00:00:00Z'),
                price: +d.close
            }
        }))

    const { chart, width, height } = chartProps

    const x = d3
        .scaleUtc()
        .domain(d3.extent(prices, d => d.date))
        .range([0, width])

    const tweetsAxes = line({ chartProps, data: tweets, xField: 'date', yField: 'tweets', x, axis: () => { }, theme, colour: 'orange' })
    const pricesAxes = line({ chartProps, data: prices, xField: 'date', yField: 'price', x, axis: () => { }, theme, colour: 'blue' })

    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    addAxis({
        chart,
        width,
        height,
        colour: palette.axis,
        x,
        y: pricesAxes.y,
        yRight: tweetsAxes.y,
        xLabel: 'Date',
        yLabel: 'Price (U$D)',
        yRightLabel: 'Tweets',
        yFormat: d => formatCurrency(d, false, 1),
        yRightFormat: d3.format('.2s')
    })
}