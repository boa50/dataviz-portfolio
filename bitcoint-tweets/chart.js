import { colours, addAxis, formatCurrency, addLegend, addLineTooltip } from "../node_modules/visual-components/index.js"

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
    legend = true
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
        legend: false
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
}