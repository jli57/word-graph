import * as d3 from 'd3';
import * as cola from 'webcola';
import { fetchRelated } from '../util/api_util';

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

    this.node = this.graphLayer.selectAll('.node');
    this.link = this.graphLayer.selectAll('.link');
    this.group = this.graphLayer.selectAll('.group');

    this.simulation = cola.d3adaptor()
      .size([this.WIDTH, this.HEIGHT])
      .linkDistance( (l) => l.weight*200 )
      // .jaccardLinkLengths(40, 0.7)
      .avoidOverlaps(true)
      .on( 'tick', () => {
        this.node
          .attr('transform', d => `translate(${d.x},${d.y})` )
          // .attr("x", function (d) { return d.x - d.width / 2; })
          // .attr("y", function (d) { return d.y - d.height / 2; });
        this.link
          .attr('x1', d => d.source.x )
          .attr('y1', d => d.source.y )
          .attr('x2', d => d.target.x )
          .attr('y2', d => d.target.y );
        this.group
          .attr('transform', d => `translate(${d.x},${d.y})` );
          // .attr('x', d => d.bounds.x )
          // .attr('y', d => d.bounds.y)
          // .attr('width', d => d.bounds.width())
          // .attr('height', d => d.bounds.height());
    });

    this.reset();

  }

  reset() {
    this.links = [];
    this.nodes = [];
    this.groups = [];

    this.simulation = this.simulation
      .nodes(this.nodes)
      .links(this.links)
      // .groups(this.groups);

  }

  clear() {
    this.graphLayer.selectAll("*").remove();
  }

  applyZoom(svg) {

    const zoom = d3.behavior
      .zoom()
      .scaleExtent([-10, 10])
      .on('zoom', () => {
        return this.graphLayer.
          attr(
            'transform',
            `translate(${zoom.translate()})scale(${zoom.scale()})` )
    });

    svg.call(zoom);
  }

  setData(data) {
    let leaves = [];
    setTimeout( () => {
      const root = data.nodes.shift();
      const node = this.findNode(root.id);

      if ( node ) {
        data.links.forEach( link => link.source = node );
        // leaves.push(this.nodes.length-1);
      } else {
        this.nodes.push(root);
        leaves.push(this.nodes.length-1);
      }
      this.clear();
      this.render();
      this.keepNodesOnTop();
    }, 0);

    const addNodes = setInterval( () => {
      if ( data.nodes.length > 0 ) {
        const node  = data.nodes.shift();
        const link = data.links.shift();

        const existingNode = this.findNode(node.id);
        if ( existingNode ) {
          link.target = existingNode;
        } else {
          this.nodes.push(node);
        }
        leaves.push(this.nodes.length - 1);
        this.links.push(link);
        this.clear();
        // this.keepNodesOnTop();
        this.render();
      } else {
        clearInterval(addNodes);

        // this.groups.push({ leaves });

        // // this.clear();
        // this.render();
        // this.keepNodesOnTop();
      }
    }, 200);
  }

  findNode(id) {
    const node = this.nodes.filter( node => node.id === id );
    if ( node.length > 0 ) {
      return node[0];
    }
  }

  render() {

    const R = 20;

    // this.groups.forEach( g => g.padding = 0.01 );
    // this.group = this.graphLayer.selectAll('.group').data(this.groups);
    // // this.group.exit().remove();

    // this.group.enter()
    //   .append('rect')
    //   .attr('class', 'group')
    //   .attr('rx', 5)
    //   .attr('ry', 5);

    this.link = this.graphLayer.selectAll('.link').data(this.links);
    this.link.exit().remove();
    this.link
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', (d) => `hsl(${d.weight},70%,70%` );

    this.node = this.graphLayer.selectAll('.node').data(this.nodes, d => d.id );
    this.node.exit().remove();

    this.node.enter()
      .append('g')
      .attr('id', (d) => d.id )
      .attr('class', 'node')

    this.node
      .append('ellipse')
      .attr('rx', 2.5*R )
      .attr('ry', R )
      .style('fill', () =>  `hsl(${Math.random()*360},70%,70%)` );

    this.node.append('text')
      .text( d => d.name)
      .attr('dy', '0.35em');

    this.nodes.forEach( node => { node.width = node.height = 4.5 * R })

    this.node.call( this.simulation.drag()
      .on("dragstart", this.dragStarted)
      .on("drag", this.dragged)
      .on("dragend", (d) => {
        let node = d3.select(`#${d.id}`);
        node.classed("dragging", false);
        node.attr("x", d.cx = d3.event.x).attr("y", d.cy = d3.event.y);
        fetchRelated( node.attr('id'), (data) => {
          this.setData(data);
        });

      })
    );
    this.simulation.start();
  }

  addNode(node) {

  }

  keepNodesOnTop() {
    const nodes = document.getElementsByClassName("node");
    for (let node of nodes) {
      var gnode = node.parentNode;

      gnode.parentNode.appendChild(gnode);
    }
  }

  dragStarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }

  dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  }


}

export default Graph;