import { colours } from "../node_modules/visual-components/index.js"
import {
    prepareData, createAxes, plotAxis, plotBars, plotDesertlikeZone, plotColourLegend, plotTooltip, plotArea
} from "./components/script.js"

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height, margin } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg
    const data = await prepareData()

    const colour = d3
        .scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRgbBasis([
            d3.hsl(palette.orange).darker(0.5),
            palette.orange,
            palette.blue,
            d3.hsl(palette.blue).darker(0.5)
        ]))

    const { x, y } = createAxes(data, width, height)
    plotBars(data, chart, palette, x, y, colour)
    plotDesertlikeZone(chart, x, y, width, height, palette)
    plotAxis(chart, width, height, palette, x, y)
    plotColourLegend(chart, colour, palette, width, margin)
    plotTooltip(chart, width, height, x)
}

export const addChartV2 = async (chartProps, theme = 'light') => {
    const { chart, width, height, margin } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg
    const data = await prepareData()

    const colour = d3
        .scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRgbBasis([
            d3.hsl(palette.orange).darker(0.5),
            palette.orange,
            palette.blue,
            d3.hsl(palette.blue).darker(0.5)
        ]))

    const { x, y } = createAxes(data, width, height)
    plotArea(data, chart, palette, x, y, colour)
    plotDesertlikeZone(chart, x, y, width, height, palette)
    plotAxis(chart, width, height, palette, x, y)
}