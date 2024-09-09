import { colours, getTextWidth } from '../node_modules/visual-components/index.js'
import { data } from './components/data.js'

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    const sankey = d3
        .sankey()
        .nodeWidth(24)
        .nodePadding(16)
        .nodeSort(null)
        .nodeAlign(d3.sankeyLeft)
        .size([width, height])

    const colour = d3
        .scaleOrdinal()
        .domain([...new Set(data.nodes.map(d => d.group))].sort())
        .range([
            d3.hsl(palette.axis).darker(0.5),
            palette.contrasting,
            palette.vermillion,
            palette.blue,
            palette.bluishGreen,
            palette.reddishPurple
        ])

    // loop through each link replacing the text with its index from node
    const nodesArray = data.nodes.map(d => d.id)
    data.links.forEach(d => {
        d.source = nodesArray.indexOf(d.source)
        d.target = nodesArray.indexOf(d.target)
    })

    const graph = sankey(data)

    // add in the links
    const links = chart
        .append('g')
        .selectAll('.link')
        .data(graph.links)
        .join('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', palette.axis)
        .attr('stroke-opacity', 0.75)
        .attr('stroke-width', d => d.width)
        .attr('d', d3.sankeyLinkHorizontal())

    // // format variables
    // const formatNumber = d3.format(',.0f'), // zero decimal places
    //     format = function (d) { return formatNumber(d); },


    // // add the link titles
    // links
    //     .append('title')
    //     .text(function (d) {
    //         return d.source.stage + ' → ' +
    //             d.target.stage + '\n' + format(d.value);
    //     });

    // add in the nodes
    const nodes = chart
        .append('g')
        .selectAll('.node')
        .data(graph.nodes)
        .join('g')
        .attr('class', 'node')

    // add the rectangles for the nodes
    nodes
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', sankey.nodeWidth())
        .style('fill', d => colour(d.group))
        .style('stroke-width', 0.5)
        .style('stroke', d => !d.id.includes('temp') ? palette.contrasting : 'none')
    // .append('title')
    // .text(function (d) {
    //     return d.stage + '\n' + format(d.value);
    // })

    // add in the title for the nodes
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