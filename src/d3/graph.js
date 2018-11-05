import * as d3 from 'd3';
import * as cola from 'webcola';
import * as d3Chromatic from 'd3-scale-chromatic';
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
    // this.group = this.graphLayer.selectAll('.group');

    this.simulation = cola.d3adaptor()
      .linkDistance( (l) => l.weight*200 )
      .handleDisconnected(false)
      .size([this.WIDTH, this.HEIGHT])
      .avoidOverlaps(true);

    this.reset();

    this.simulation.on( 'tick', this.tick.bind(this) );
  }

  tick() {
    this.node
      .attr('x', d =>  d.x - d.width / 2 )
      .attr('y', d => d.y - d.height / 2 )
      .attr('transform', d => `translate(${d.x},${d.y})` );
    this.link
      .attr('x1', d => d.source.x )
      .attr('y1', d => d.source.y )
      .attr('x2', d => d.target.x )
      .attr('y2', d => d.target.y );
    // this.group
    //   .attr('x', d => d.bounds.x )
    //   .attr('y', d => d.bounds.y)
    //   .attr('width', d => d.bounds.width())
    //   .attr('height', d => d.bounds.height());
  }

  reset() {
    this.links = [];
    this.nodes = [];
    this.groups = [];

    this.simulation = this.simulation
      .nodes(this.nodes)
      .links(this.links)
      // .groups(this.groups)
      .start();

  }

  clear() {
    this.graphLayer.selectAll("*").remove();
  }

  applyZoom(svg) {

    const zoom = d3.behavior
      .zoom()
      .on('zoom', () => {
        return this.graphLayer.
          attr(
            'transform',
            `translate(${zoom.translate()})scale(${zoom.scale()})` )
    });

    svg.call(zoom);
  }

  setData(data) {
    const colorVal = (this.groups.length * 100 ) % 360;
    let group = { leaves: [], color: `hsl(${colorVal},70%,70%)`, colorVal };
    this.groups.push(group);

    setTimeout( () => {
      let root = data.nodes.shift();
      let node = this.findNode(root.id);
      group.id = root.id;
      if ( node ) {
        data.links.forEach( link => link.source = node );
        node.group = node.id;
        group.leaves.push( node.index );
      } else {
        const index = this.nodes.length;
        root.index = index;
        this.nodes.push(root);
        group.leaves.push(index);
      }
      this.clear();
      this.render();
      // this.keepNodesOnTop();
    }, 0);

    const addNodes = setInterval( () => {
      if ( data.nodes.length > 0 ) {
        let index;
        const node  = data.nodes.shift();
        const link = data.links.shift();

        const existingNode = this.findNode(node.id);
        if ( existingNode ) {
          index = existingNode.index;
          link.target = existingNode;
        } else {
          index = this.nodes.length;
          node.index = index;
          this.nodes.push(node);
        }
        group.leaves.push(index);
        this.links.push(link);
        this.clear();
        this.render();
      } else {
        clearInterval(addNodes);
      }
    }, 200);
  }

  findNode(id) {
    const node = this.nodes
      .filter( node => node.id === id );
    if ( node.length > 0 ) {
      return node[0];
    }
  }

  findGroup(id) {
    const group = this.groups.filter( group => group.id === id );
    if ( group.length > 0 ) {
      return group[0];
    }
  }

  render() {
    // console.log(this.nodes);
    // console.log(this.groups);
    const R = 20;

    // this.groups.forEach( g => g.padding = 0.01 );
    // this.group = this.graphLayer.selectAll('.group').data(this.groups);

    // this.group.enter()
    //   .append('rect')
    //   .attr('class', 'group')
    //   .attr('rx', 5)
    //   .attr('ry', 5)
    //   .style('fill', d => "#cccccc" );

    this.link = this.graphLayer.selectAll('.link').data(this.links, d => [d.id, d.weight, d.source, d.target] );
    this.link.exit().remove();

    this.link
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', (d) => (
        `hsl(${this.findGroup(d.source.group).colorVal},50%,${d.weight*100}%)`
      ));


    this.node = this.graphLayer.selectAll('.node').data(this.nodes, d => [d.id, d.name, d.group] );
    this.node.exit().remove();

    this.nodes.forEach( node => { node.width = node.height = 4.5 * R });

    this.node.enter()
      .append('g')
      .attr('id', d => d.id )
      .attr('class', 'node')

    this.node
      .append('ellipse')
      .attr('rx', 2.5*R )
      .attr('ry', R )
      .style('fill', (d) => {return this.findGroup(d.group).color } );

    this.node.append('text')
      .text( d => d.name)
      .attr('dy', '0.35em');

    this.node
      .on("click", this.clicked )
      .call( this.simulation.drag()
        .on("dragstart", this.dragStarted)
        .on("drag", this.dragged)
        .on("dragend", (d) => {
          let node = d3.select(`#${d.id}`);
          node.classed("dragging", false);
          // node.attr("cx", d3.event.x).attr("cy", d3.event.y);
          fetchRelated( node.attr('id'), (data) => {
            this.setData(data);
          });
      })
    );

    this.simulation.start();
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
    d3.select(this).attr("cx", d3.event.x).attr("cy", d3.event.y);
  }

  clicked() {
    console.log("click", d3.event );
    if ( d3.event.defaultPevented ) return;
  }

}

export default Graph;