import { data } from './components/data.js'

export const addChart = async (chartProps) => {
    const { chart, width, height } = chartProps

    const sankey = d3
        .sankey()
        .nodeWidth(16)
        // .nodePadding(40)
        .nodeAlign(d3.sankeyLeft)
        .size([width, height])

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
        .attr('stroke', 'black')
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', d => d.width)
        .attr('d', d3.sankeyLinkHorizontal())

    // // format variables
    // const formatNumber = d3.format(',.0f'), // zero decimal places
    //     format = function (d) { return formatNumber(d); },
    const color = d3.scaleOrdinal(d3.schemeCategory10);

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
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .attr('width', sankey.nodeWidth())
        .style('fill', function (d) {
            return d.color = color(d.id.replace(/ .*/, ''));
        })
        .style('stroke', function (d) {
            return d3.rgb(d.color).darker(2);
        })
    // .append('title')
    // .text(function (d) {
    //     return d.stage + '\n' + format(d.value);
    // })

    // add in the title for the nodes
    nodes
        .append('text')
        .attr('x', function (d) { return d.x0 - 6; })
        .attr('y', function (d) { return (d.y1 + d.y0) / 2; })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('pointer-events', 'none')
        .text(function (d) { return d.id; })
        .filter(function (d) { return d.x0 < width / 2; })
        .attr('x', function (d) { return d.x1 + 6; })
        .attr('text-anchor', 'start');
}