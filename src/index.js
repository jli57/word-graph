import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { fetchRelated } from './util/api_util';
import * as d3 from 'd3';
import * as cola from 'webcola';
// window.d3 = d3;

const WIDTH = 800;
const HEIGHT = 800;

document.addEventListener('DOMContentLoaded', () => {

  let word = "example";
  const svg = d3.select("#canvas")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("border", "1px solid black");

  const graph_layer = svg.append('g');

  const zoom = d3.behavior
    .zoom()
    .scaleExtent([1, 10])
    .on('zoom', () => {
      return graph_layer.
        attr(
          'transform',
          `translate(${zoom.translate()})scale(${zoom.scale()})` )
  });

  svg.call(zoom);
  fetchRelated(word, (graph) => {
    render(graph, graph_layer);
  });

  const searchForm = document.getElementById("search-form");
  const searchText = document.getElementById("search-text");

  searchForm.addEventListener("submit", (e) => {
    console.log(searchText.value, word);
    word = searchText.value;
    console.log(word);
    // fetchRelated(word, (graph) => {
    //   // graph_layer.selectAll("*").remove();
    //   render(graph, graph_layer);
    // });
  });
  /*
  // const root = document.getElementById('root');
  // ReactDOM.render(<App />, root);
  // serviceWorker.unregister();
  */


});

const render = (graph, graph_layer) => {
    const R = 20;
    console.log(graph);
    let links = graph_layer.selectAll('.link').data(graph.links, d => d.id );
    links.enter().append('line').attr('class', 'link');

    let nodes = graph_layer.selectAll('.node').data(graph.nodes, d => d.id );

    let enter_nodes = nodes.enter().append('g').attr('class', 'node');

    enter_nodes.append('ellipse')
      .attr('rx', 2.5*R )
      .attr('ry', R )

    enter_nodes.append('text')
      .text( d => d.name)
      .attr('dy', '0.35em');

    graph.nodes.forEach( (v) => {
      v.width = 4.5 * R;
      v.height = 4.5 * R;
    });

    let d3cola  = cola.d3adaptor(d3)
      .size([WIDTH, HEIGHT])
      .linkDistance(100)
      .symmetricDiffLinkLengths(5)
      .avoidOverlaps(true)
      .nodes(graph.nodes)
      .links(graph.links)
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
