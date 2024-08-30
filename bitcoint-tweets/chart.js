import { colours, addAxis, formatCurrency, addLegend, addLineTooltip, addVerticalTooltip } from "../node_modules/visual-components/index.js"

const line = ({
    chartProps,
    data,
    theme = 'light',
    colour = 'blue',
    xField,
    yField,
    x,
    axis,
    strokeWidth = 1,
    legend = true,
    tooltip = true
}) => {
    const { chart, width, height, margin } = chartProps
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
        .attr('stroke-width', strokeWidth)
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

    if (legend) {
        addLegend({
            chart,
            legends: [yField].map(d => d.charAt(0).toUpperCase() + d.slice(1)),
            colours: [colour],
            xPosition: -margin.left,
            yPosition: -12
        })
    }

    if (tooltip) {
        addLineTooltip({
            chart,
            htmlText: d => `
            <strong>${d[xField]}</strong>
            <div style="display: flex; justify-content: space-between">
                <span>Value:&emsp;</span>
                <span>${d[yField]}</span>
            </div>
            `,
            colour,
            data,
            cx: d => x(d[xField]),
            cy: d => y(d[yField]),
            chartWidth: width,
            chartHeight: height
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

    const data = []
    await d3.csv('bitcoint-tweets/data/dataset.csv')
        .then(dt => dt.forEach(d => {
            dt.columns.slice(1).forEach(column => {
                data.push({
                    date: new Date(d.date + 'T00:00:00Z'),
                    group: column,
                    value: d[column] !== '' ? +d[column] : undefined
                })
            })
        }))


    const { chart, width, height, margin } = chartProps

    const x = d3
        .scaleUtc()
        .domain(d3.extent(prices, d => d.date))
        .range([0, width])

    const defaultProps = {
        chartProps,
        xField: 'date',
        x,
        axis: () => { },
        theme,
        strokeWidth: 2,
        legend: false,
        tooltip: false
    }

    const tweetsAxes = line({
        ...defaultProps,
        data: tweets,
        yField: 'tweets',
        colour: 'orange'
    })
    const pricesAxes = line({
        ...defaultProps,
        data: prices,
        yField: 'price',
        colour: 'blue'
    })

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
        yRightFormat: d3.format('.1s'),
        hideXdomain: true,
        hideYdomain: true
    })

    addLegend({
        chart,
        legends: ['Price', 'Tweets'],
        colours: [palette.blue, palette.orange],
        xPosition: -margin.left,
        yPosition: -12
    })

    const getTweets = date => {
        const filtered = tweets.filter(t => t.date.getTime() == date.getTime())
        const nTweets = filtered.length > 0 ? filtered[0].tweets : 0

        return nTweets
    }

    const joinedData = prices.map(d => {
        return {
            date: d.date,
            tweets: getTweets(d.date),
            price: d.price
        }
    })

    const tooltipData = {}
    for (let i = 0; i < joinedData.length; i++) {
        tooltipData[joinedData[i].date.getTime()] = {
            x: joinedData[i].date.getTime(),
            ys: [joinedData[i].price, joinedData[i].tweets],
            price: joinedData[i].price,
            tweets: joinedData[i].tweets
        }
    }

    addVerticalTooltip({
        chart,
        htmlText: d => `
        <strong>${new Date(d.x).toLocaleDateString()}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Price:&emsp;</span>
            <span>${d.price}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Tweets:&emsp;</span>
            <span>${d.tweets}</span>
        </div>
        `,
        chartWidth: width,
        chartHeight: height,
        x,
        y: pricesAxes.y,
        colour: palette.axis,
        data: joinedData,
        xVariable: 'date',
        tooltipData,
        keyFunction: d => d.getTime()
    })

}