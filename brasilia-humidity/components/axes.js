import { addAxis } from "../../node_modules/visual-components/index.js"
import { getDaysWithoutRaining, formatHumidity } from "./utils.js"

export const createAxes = (data, width, height) => {
    const x = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, 100])
        .range([height, 0])

    return { x, y }
}

export const plotAxis = (chart, width, height, palette, x, y) => {
    const xDomainLength = x.domain().length
    const xDomainDivisor = (multiplier = 1) => Math.round(x.domain().length / 4 * multiplier)
    const datesToShow = [
        x.domain()[0],
        x.domain()[xDomainDivisor()],
        x.domain()[xDomainDivisor(2)],
        x.domain()[xDomainDivisor(3)],
        x.domain()[xDomainLength - 1]
    ]

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xLabel: 'Days Without Rain',
        yLabel: 'Humidity Level',
        xFormat: d => datesToShow.includes(d) ? getDaysWithoutRaining(d, x) : '',
        yFormat: formatHumidity,
        hideXdomain: true,
        hideYdomain: true
    })
}