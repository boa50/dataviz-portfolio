import { addColourLegend } from "../../node_modules/visual-components/index.js"
import { formatHumidity } from "./utils.js"

export const plotColourLegend = (chart, colour, palette, width, margin) => {
    const legendWidth = 125
    const colourLegendAxis = d3
        .scaleLinear()
        .domain(colour.domain())
        .range([0, legendWidth])

    addColourLegend({
        chart,
        title: 'Median Humidity Level',
        colourScale: colour,
        width: legendWidth,
        axis: colourLegendAxis,
        textColour: palette.axis,
        xPosition: width - legendWidth - 8,
        yPosition: -margin.top,
        axisTickFormat: formatHumidity
    })
}