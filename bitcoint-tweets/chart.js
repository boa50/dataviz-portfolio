import { colours, addAxis, formatCurrency, addLegend, addLineTooltip, addVerticalTooltip } from "../node_modules/visual-components/index.js"

const line = ({
    chartProps,
    data,
    theme = 'light',
    colour = 'blue',
    xField,
    yField,
    x,
    y,
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

    y = y !== undefined ? y : d3
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

    const { chart, width, height, margin } = chartProps

    const x = d3
        .scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.price) * 1.1])
        .range([height, 0])

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

    line({
        ...defaultProps,
        data: tweets,
        yField: 'tweets',
        colour: 'orange'
    })
    line({
        ...defaultProps,
        data: prices,
        yField: 'price',
        colour: 'blue'
    })

    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    chart.append('svg:image')
        .attr('x', x(new Date('2022/10/01')))
        .attr('y', y(70000))
        .attr('width', 86)
        .attr('height', 86)
        .attr('opacity', 0.25)
        .attr('xlink:href', 'bitcoint-tweets/img/bitcoin.webp')

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

    addLegend({
        chart,
        legends: ['Price', 'Tweets'],
        colours: [palette.blue, palette.orange],
        xPosition: -margin.left,
        yPosition: -12
    })

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