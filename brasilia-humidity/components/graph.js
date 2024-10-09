import { addPattern } from '../../node_modules/visual-components/index.js'

export const plotBars = (data, chart, palette, x, y, colour) => {
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
        .attr('stroke', palette.contrasting)
        .attr('stroke-width', 0.5)

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

export const plotDesertlikeZone = (chart, x, y, width, height, palette) => {
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

export const plotArea = (data, chart, width, x, y) => {
    const area = d3
        .area()
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.humidityMed))
        .curve(d3.curveBasis)

    const defs = chart.append('defs')

    defs
        .append('clipPath')
        .attr('id', 'areaClip')
        .append('path')
        .attr('d', area(data))

    // img from Photo by Jonathan Borba: https://www.pexels.com/photo/fine-sandy-dunes-in-dry-desert-5489194/

    chart
        .append('svg:image')
        .attr('clip-path', 'url(#areaClip)')
        .attr('x', 0)
        .attr('y', -100)
        .attr('width', width)
        .attr('height', width * 2)
        .attr('xlink:href', 'brasilia-humidity/img/sand.webp')
}