import { colours, addAxis } from "../node_modules/visual-components/index.js"

const addDefPattern = ({
    svg,
    id,
    width,
    height,
    path,
    scale,
    colour = '#000000',
    patternTransform = `scale(${scale} ${scale})`,
    strokeWidth = 1
}) => {
    svg
        .append('defs')
        .append('pattern')
        .attr('id', id)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', patternTransform)
        .attr('width', width)
        .attr('height', height)
        .append('path')
        .attr('d', path)
        .attr('stroke', colour)
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'none')
}

const getDiagonals = (scale = 1) => {
    return {
        width: 20,
        height: 10,
        path: 'M0 10h20z',
        patternTransform: `scale(${scale} ${scale}) rotate(45 2 2)`,
        strokeWidth: 2
    }
}

const getWaves = () => {
    return {
        width: 70,
        height: 8,
        path: 'M-.02 22c8.373 0 11.938-4.695 16.32-9.662C20.785 7.258 25.728 2 35 2c9.272 0 14.215 5.258 18.7 10.338C58.082 17.305 61.647 22 70.02 22M-.02 14.002C8.353 14 11.918 9.306 16.3 4.339 20.785-.742 25.728-6 35-6 44.272-6 49.215-.742 53.7 4.339c4.382 4.967 7.947 9.661 16.32 9.664M70 6.004c-8.373-.001-11.918-4.698-16.3-9.665C49.215-8.742 44.272-14 35-14c-9.272 0-14.215 5.258-18.7 10.339C11.918 1.306 8.353 6-.02 6.002'
    }
}

const getCross = () => {
    return {
        width: 20,
        height: 20,
        path: 'M3.25 10h13.5M10 3.25v13.5'
    }
}

const getTriangle = () => {
    return {
        width: 47.35,
        height: 47.8,
        path: 'm23.67 15 8.66-15 15.02 8.66-8.67 15.01Zm0-30 8.66 15 15.02-8.66-8.67-15.01zM0-8.33v17m47.35-17v17M15.01 0h17.32m-8.66 32.8 8.66 15 15.02-8.66-8.67-15.01zM0 39.47v17m47.35-17v17M15.01 47.8h17.32m-56-32.8L-15 0 0 8.65l-8.66 15.01Zm47.35 0L15 0 0 8.65l8.67 15.01Zm0-30L15 0 0-8.66l8.67-15.01Zm47.33 30L62.35 0 47.33 8.65 56 23.67ZM23.67 62.8l8.66-15 15.02 8.66-8.67 15.01zm47.34-30-8.66 15-15.02-8.66L56 24.13Zm-47.33 30L15 47.8 0 56.45l8.67 15.01Zm-47.35-30 8.67 15 15-8.65-8.66-15.01zm47.35 0L15 47.8 0 39.15l8.67-15.01Z'
    }
}

const getScales = () => {
    return {
        width: 20,
        height: 20,
        path: 'M-10-10A10 10 0 00-20 0a10 10 0 0010 10A10 10 0 010 0a10 10 0 00-10-10zM10-10A10 10 0 000 0a10 10 0 0110 10A10 10 0 0120 0a10 10 0 00-10-10zM30-10A10 10 0 0020 0a10 10 0 0110 10A10 10 0 0140 0a10 10 0 00-10-10zM-10 10a10 10 0 00-10 10 10 10 0 0010 10A10 10 0 010 20a10 10 0 00-10-10zM10 10A10 10 0 000 20a10 10 0 0110 10 10 10 0 0110-10 10 10 0 00-10-10zM30 10a10 10 0 00-10 10 10 10 0 0110 10 10 10 0 0110-10 10 10 0 00-10-10z'
    }
}

const addPattern = (type, svg, scale = 1, colour = '#000000') => {
    let id = `${type}Pattern` + (svg.attr('id') !== undefined ? svg.attr('id') : Math.random())
    if (scale !== undefined) id += scale

    const defaultParams = { svg, id, scale, colour }

    switch (type) {
        case 'diagonal':
            addDefPattern({ ...defaultParams, ...getDiagonals(scale) })
            break
        case 'wave':
            addDefPattern({ ...defaultParams, ...getWaves(scale) })
            break
        case 'cross':
            addDefPattern({ ...defaultParams, ...getCross(scale) })
            break
        case 'triangle':
            addDefPattern({ ...defaultParams, ...getTriangle(scale) })
            break
        case 'scales':
            addDefPattern({ ...defaultParams, ...getScales(scale) })
            break

        default:
            addDefPattern({ ...defaultParams, ...getDiagonals(scale) })
            break
    }

    return id
}

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

    const patternId = addPattern('diagonal', chart, 1, palette.vermillion)
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