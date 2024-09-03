import { addHighlightTooltip } from "../../node_modules/visual-components/index.js"
import { getDaysWithoutRaining, formatHumidity } from "./utils.js"

export const plotTooltip = (chart, width, height, x) => {
    addHighlightTooltip({
        chart,
        htmlText: d => `
        <strong>${getDaysWithoutRaining(d.date, x)} days without raining</strong>
        <br>
        <strong>Humidity Levels</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Maximum:&emsp;</span>
            <span>${formatHumidity(d.humidityMax)}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Median:&emsp;</span>
            <span>${formatHumidity(d.humidityMed)}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Minimum:&emsp;</span>
            <span>${formatHumidity(d.humidityMin)}</span>
        </div>
        `,
        elements: d3.selectAll('.data-point'),
        initialOpacity: 1,
        chartWidth: width,
        chartHeight: height
    })
}