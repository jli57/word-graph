import * as d3 from 'd3';
import * as cola from 'webcola';
import { fetchRelated } from '../util/api_util';

class Graph {

  constructor(canvas, limit) {
    this.canvas = canvas;
    this.nodes = [];
    this.links = [];
    this.groups = [];
    this.initialize();
    this.LIMIT = 10;
  }

  initialize() {

    const svg = d3.select("#canvas")
      .append("svg")
      .attr("width", this.WIDTH)
      .attr("height", this.HEIGHT)
      .attr("class", "graph");

    this.svg = svg;
    this.graphLayer = svg.append('g');

    this.applyZoom(svg);

    this.node = this.graphLayer.selectAll('.node');
    this.link = this.graphLayer.selectAll('.link');

    this.simulation = cola.d3adaptor()
      .linkDistance( (l) => 100/(2*l.weight) )
      .handleDisconnected(false)
      .avoidOverlaps(true);

    const redraw = () => {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      svg
        .attr("width", width)
        .attr("height", height);

      this.simulation.size([width, height]).start();

    }
    redraw();

    window.addEventListener("resize", redraw);

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
  }

  reset() {
    this.links = [];
    this.nodes = [];

    this.simulation = this.simulation
      .nodes(this.nodes)
      .links(this.links)
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
      let node = this.findNode(root.wordId);
      group.id = root.wordId;

      if ( node ) {
        data.links.forEach( link => link.source = node );
        node.group = node.wordId;
        group.leaves.push( node.index );
      } else {
        const index = this.nodes.length;
        root.index = index;
        this.addNode(root);
        group.leaves.push(index);
      }
      this.clear();
      this.render();
    }, 0);

    const addNodes = setInterval( () => {
      if ( data.nodes.length > 0 ) {
        let index;
        const node  = data.nodes.shift();
        const link = data.links.shift();

        const existingNode = this.findNode(node.wordId);
        if ( existingNode ) {
          index = existingNode.index;
          link.target = existingNode;
        } else {
          index = this.nodes.length;
          node.index = index;
          this.addNode(node);
        }

        group.leaves.push(index);
        this.addLink(link);
        this.clear();
        this.render();
      } else {
        clearInterval(addNodes);
      }
    }, 200);
  }

  findNode(wordId) {
    const node = this.nodes
      .filter( node => node.wordId === wordId );
    if ( node.length > 0 ) {
      return node[0];
    }
  }

  findGroup(wordId) {
    const group = this.groups.filter( group => group.id === wordId );
    if ( group.length > 0 ) {
      return group[0];
    }
  }

  render() {

    const R = 20;

    this.link = this.graphLayer
      .selectAll('.link')
      .data(this.links, d => [d.id, d.weight, d.source, d.target] );
    this.link.exit().remove();

    this.link
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', (d) => (
        `hsl(${this.findGroup(d.source.group).colorVal},50%,${d.weight*100}%)`
      ));

    this.node = this.graphLayer
      .selectAll('.node').data(this.nodes, d => [d.id, d.wordId, d.name, d.group] );
    this.node.exit().remove();

    this.node.enter()
      .append('g')
      .attr('id', d => `word${d.id}` )
      .attr('class', 'node')
      .attr('wordId', d => d.wordId );

    this.node
      .append('ellipse')
      .attr('rx', 2.5*R )
      .attr('ry', R )
      .style('fill', (d) => {return this.findGroup(d.group).color } );

    this.node.append('text')
      .text( d => d.word )
      .attr('dy', '0.35em');

    this.node
      .on("click", this.clicked )
      .call( this.simulation.drag()
        .on("dragstart", this.dragStarted)
        .on("drag", this.dragged)
        .on("dragend", (d) => {
          let node = d3.select(`#word${d.id}`);
          node.classed("dragging", false);
          const word = node.attr('wordId');
          const group = this.findGroup(word);
          const offset = group ? group.leaves.length+1 : 0;

          let options = {
            word,
            offset,
            limit: this.LIMIT
          };

          fetchRelated( options, (data) => {
            this.setData(data);
          });
      })
    );

    this.simulation.start();
  }

  addNode(node) {
    node.id = this.nodes.length + 1;
    this.nodes.push(node);
  }

  addLink(link) {
    link.id = this.links.length + 1;
    console.log(link);
    this.links.push(link);
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