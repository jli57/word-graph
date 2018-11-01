import * as d3 from 'd3';
import * as cola from 'webcola';

class Graph {

  constructor(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.initialize();
  }

  initialize() {
    const svg = d3.select("#canvas")
      .append("svg")
      .attr("width", this.WIDTH)
      .attr("height", this.HEIGHT)
      .style("border", "1px solid black");

    this.graphLayer = svg.append('g');
    this.applyZoom(svg);
  }

  clear() {
    this.graphLayer.selectAll("*").remove();
  }

  applyZoom(svg) {

    const zoom = d3.behavior
      .zoom()
      .scaleExtent([1, 10])
      .on('zoom', () => {
        return this.graphLayer.
          attr(
            'transform',
            `translate(${zoom.translate()})scale(${zoom.scale()})` )
    });

    svg.call(zoom);
  }

  render(data) {

    console.log(data);
    const R = 20;
    let links = this.graphLayer.selectAll('.link').data(data.links);

    links.enter()
      .append('line')
      .attr('class', 'link');
      // .linkDistance( (l) => console.log("test") );

    let nodes = this.graphLayer.selectAll('.node').data(data.nodes, d => d.id );

    let enter_nodes = nodes.enter().append('g').attr('class', 'node');

    enter_nodes.append('ellipse')
      .attr('rx', 2.5*R )
      .attr('ry', R )

    enter_nodes.append('text')
      .text( d => d.name)
      .attr('dy', '0.35em');

    data.nodes.forEach( n => {
      n.width = 4.5 * R;
      n.height = 4.5 * R;
    });


    let d3cola  = cola.d3adaptor(d3)
      .size([this.WIDTH, this.HEIGHT])
      .linkDistance(100)
      .symmetricDiffLinkLengths(5)
      .avoidOverlaps(true)
      .nodes(data.nodes)
      .links(data.links)
      .on( 'tick', () => {
        nodes
          .attr('transform', d => `translate(${d.x},${d.y})` );
        links
          .attr('x1', d => d.source.x )
          .attr('y1', d => d.source.y )
          .attr('x2', d => d.target.x )
          .attr('y2', d => d.target.y );
      });

    console.log(d3cola);
    enter_nodes.call(d3cola.drag);
    d3cola.start(20, 0, 10);
  }
}

export default Graph;