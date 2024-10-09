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

export const plotAxis = (chart, width, height, palette, x, y, yLabel = 'Humidity Level', showMonths = false) => {
    const datesToShow = []

    if (showMonths) {
        const getDateAddedMonths = (dtReference, months) =>
            new Date(new Date(x.domain()[0]).setMonth(dtReference.getMonth() + months)).toISOString().split('T')[0]

        const firstDate = new Date(x.domain()[0])

        for (let i = 0; i <= 5; i++) {
            datesToShow.push(getDateAddedMonths(firstDate, i))
        }
    } else {
        const xDomainLength = x.domain().length
        const xDomainDivisor = (multiplier = 1) => Math.round(x.domain().length / 4 * multiplier)

        datesToShow.push(x.domain()[0])
        datesToShow.push(x.domain()[xDomainDivisor()])
        datesToShow.push(x.domain()[xDomainDivisor(2)])
        datesToShow.push(x.domain()[xDomainDivisor(3)])
        datesToShow.push(x.domain()[xDomainLength - 1])
    }

    const xLabel = showMonths ? 'Months Without Rain' : 'Days Without Rain'

    const formatXaxis = (d, x) => {
        if (showMonths) {
            return Math.trunc(getDaysWithoutRaining(d, x) / 30)
        } else {
            return getDaysWithoutRaining(d, x)
        }
    }

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xLabel,
        yLabel,
        xFormat: d => datesToShow.includes(d) ? formatXaxis(d, x) : '',
        yFormat: formatHumidity,
        yTickValues: [0, 20, 40, 60, 80, 100],
        hideXdomain: true,
        hideYdomain: true
    })
}