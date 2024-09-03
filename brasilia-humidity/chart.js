import { colours, addAxis, addPattern } from "../node_modules/visual-components/index.js"

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg
    const data = await prepareData()

    const { x, y } = createAxes(data, width, height)
    plotBars(data, chart, palette, x, y)
    plotDesertlikeZone(chart, x, y, width, height, palette)
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

function plotDesertlikeZone(chart, x, y, width, height, palette) {
    chart
        .append('rect')
        .attr('x', x(x.domain()[0]))
        .attr('y', y(20))
        .attr('width', width)
        .attr('height', height - y(20))
        .attr('fill', palette.vermillion)
        .attr('opacity', 0.25)

    const patternId = addPattern('diagonal', chart, 0.5, palette.vermillion)
    chart
        .append('rect')
        .attr('x', x(x.domain()[0]))
        .attr('y', y(20))
        .attr('width', width)
        .attr('height', height - y(20))
        .attr('fill', `url(#${patternId})`)

    const textLabelBackground = chart
        .append('rect')

    const textLabel = chart
        .append('text')
        .attr('x', width / 2)
        .attr('y', y(10))
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1rem')
        .attr('font-weight', 500)
        .attr('fill', palette.contrasting)
        .text('Desertlike Zone')

    const textLabelBackgroundSquare = textLabel.node().getBBox()
    textLabelBackground
        .attr('x', textLabelBackgroundSquare.x - 6)
        .attr('y', textLabelBackgroundSquare.y - 4)
        .attr('width', textLabelBackgroundSquare.width + 12)
        .attr('height', textLabelBackgroundSquare.height + 8)
        .attr('fill', palette.vermillion)
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
        yFormat: d => d3.format('.0%')(d / 100),
        hideXdomain: true,
        hideYdomain: true
    })
}