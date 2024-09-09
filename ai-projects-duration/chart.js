import { colours, getTextWidth } from '../node_modules/visual-components/index.js'
import { data } from './components/data.js'

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    const sankey = d3
        .sankey()
        .nodeWidth(24)
        .nodePadding(24)
        .nodeSort(null)
        .nodeAlign(d3.sankeyLeft)
        .nodeId(d => d.id)
        .size([width, height])

    const colour = d3
        .scaleOrdinal()
        .domain([...new Set(data.nodes.map(d => d.group))].sort())
        .range([
            palette.axis + '80',
            palette.axis,
            palette.vermillion,
            palette.blue,
            palette.bluishGreen,
            palette.reddishPurple
        ])

    const graph = sankey(data)

    chart
        .append('g')
        .selectAll('.link')
        .data(graph.links)
        .join('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', palette.axis)
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', d => d.width)
        .attr('d', d3.sankeyLinkHorizontal())

    const nodes = chart
        .append('g')
        .selectAll('.node')
        .data(graph.nodes)
        .join('g')
        .attr('class', 'node')

    nodes
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', sankey.nodeWidth())
        .style('fill', d => colour(d.group))
        .style('stroke-width', 0.5)
        .style('stroke', d => !d.id.includes('temp') ? palette.contrasting : 'none')

    nodes
        .append('text')
        .attr('x', d => d.x0 - 4)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('pointer-events', 'none')
        .style('font-size', '0.7rem')
        .style('font-weight', 500)
        .style('fill', d => colour(d.group))
        .text(d => !d.id.includes('temp') ? d.id : '')
        .filter(d => (d.x1 + getTextWidth(d.id, '0.7rem')) < width + 8)
        .attr('x', d => d.x1 + 4)
        .attr('text-anchor', 'start')
}