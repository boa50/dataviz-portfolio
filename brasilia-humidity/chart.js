import { colours, addAxis } from "../node_modules/visual-components/index.js"

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg
    const data = await prepareData()

    const { x, y } = createAxes(data, width, height)
    plotBars(data, chart, palette, x, y)
    plotDesertifiedZone(chart, x, y, width, palette)
    plotAxis(chart, width, height, palette, x, y)
}

async function prepareData() {
    return await d3.csv('brasilia-humidity/data/dataset.csv')
        .then(dt => dt.map(d => {
            return {
                ...d,
                humidityMax: +d.humidityMax,
                humidityMed: +d.humidityMed,
                humidityMin: +d.humidityMin
            }
        }))
}

function createAxes(data, width, height) {
    const x = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])
        .padding(.2)

    const y = d3
        .scaleLinear()
        .domain([0, 100])
        .range([height, 0])

    return { x, y }
}

function plotBars(data, chart, palette, x, y) {
    const colour = d3
        .scaleSequential()
        .domain(d3.extent(data, d => d.humidityMed))
        .range([palette.orange, palette.blue])

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.humidityMax))
        .attr('width', x.bandwidth())
        .attr('height', d => y(d.humidityMin) - y(d.humidityMax))
        .attr('fill', d => colour(d.humidityMed))

    chart
        .selectAll('.data-med-line')
        .data(data)
        .join('line')
        .attr('class', 'data-med-line')
        .attr('x1', d => x(d.date))
        .attr('x2', d => x(d.date) + x.bandwidth())
        .attr('y1', d => y(d.humidityMed))
        .attr('y2', d => y(d.humidityMed))
        .attr('stroke', palette.contrasting)
        .attr('stroke-width', 2)
}

function plotDesertifiedZone(chart, x, y, width, palette) {
    chart
        .append('line')
        .attr('x1', x(x.domain()[0]))
        .attr('x2', width)
        .attr('y1', y(20))
        .attr('y2', y(20))
        .attr('stroke', palette.vermillion)
        .attr('stroke-width', 2)
}

function plotAxis(chart, width, height, palette, x, y) {
    const xDomainLength = x.domain().length
    const xDomainDivisor = (multiplier = 1) => Math.round(x.domain().length / 4 * multiplier)
    const datesToShow = [
        x.domain()[0],
        x.domain()[xDomainDivisor()],
        x.domain()[xDomainDivisor(2)],
        x.domain()[xDomainDivisor(3)],
        x.domain()[xDomainLength - 1]
    ]

    const formatDateString = dt =>
        new Date(dt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xLabel: 'Date',
        yLabel: 'Humidity Level',
        xFormat: d => datesToShow.includes(d) ? formatDateString(d) : '',
        yFormat: d => d3.format('.0%')(d / 100)
    })
}