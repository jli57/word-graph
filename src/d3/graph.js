import * as d3 from 'd3';
import * as cola from 'webcola';

class Graph {

  constructor(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.nodes = [];
    this.links = [];
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

    this.node = this.graphLayer.selectAll('.node');
    this.link = this.graphLayer.selectAll('.link');

    this.reset();

    this.node.call( this.simulation.drag);

  }

  reset() {
    this.links = [];
    this.nodes = [];

    this.simulation = cola.d3adaptor()
      .size([this.WIDTH, this.HEIGHT])
      .linkDistance(100)
      .avoidOverlaps(true)
      .nodes(this.nodes)
      .links(this.links)
      .on( 'tick', () => {
        this.node
          .attr('transform', d => `translate(${d.x},${d.y})` );
        this.link
          .attr('x1', d => d.source.x )
          .attr('y1', d => d.source.y )
          .attr('x2', d => d.target.x )
          .attr('y2', d => d.target.y );
      });
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

  setData(data) {
    // this.nodes = data.nodes;
    // this.links = data.links;
    setTimeout( () => {
      const root = data.nodes.shift();
      this.nodes.push(root);
      this.clear();
      this.render();
      this.keepNodesOnTop();
    }, 0);

    const addNodes = setInterval( () => {
      if ( data.nodes.length > 0 ) {
        this.nodes.push(data.nodes.shift());
        this.links.push(data.links.shift());
        this.clear();
        this.render();
        this.keepNodesOnTop();
      } else {
        clearInterval(addNodes);
      }
    }, 100);
  }

  render() {

    const R = 20;

    this.link = this.graphLayer.selectAll('.link').data(this.links, d => d.id );
    this.link.exit().remove();
    this.link
      .enter()
      .append('line')
      .attr('class', 'link');

    this.node = this.graphLayer.selectAll('.node').data(this.nodes, d => d.id );
    this.node.exit().remove();

    this.node.enter()
      .append('g')
      .attr('class', 'node');

    this.node.append('ellipse')
      .attr('rx', 2.5*R )
      .attr('ry', R )

    this.node.append('text')
      .text( d => d.name)
      .attr('dy', '0.35em');

    this.node.forEach( n => {
      n.width = 4.5 * R;
      n.height = 4.5 * R;
    });

    this.simulation.start();
  }


  keepNodesOnTop() {
    const nodes = document.getElementsByClassName("node");
    for (let node of nodes) {
      var gnode = node.parentNode;
      gnode.parentNode.appendChild(gnode);
    }
  }
}

export default Graph;