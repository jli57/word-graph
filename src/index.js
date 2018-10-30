import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { fetchRelated } from './util/api_util';
import * as d3 from 'd3';
import * as cola from 'webcola';
// window.d3 = d3;


document.addEventListener('DOMContentLoaded', () => {


  const word = "example";
  const width = 600;
  const height = 400;
  const R = 15;

  const svg = d3.select("#canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black");

  fetchRelated(word, (graph) => {
    console.log(graph);

    let links = svg.selectAll('.link').data(graph.links, d => d.id );
    links.enter().append('line').attr('class', 'link');

    let nodes = svg.selectAll('.node').data(graph.nodes, d => d.id );

    let enter_nodes = nodes.enter().append('g').attr('class', 'node');

    enter_nodes.append('circle').attr('r', R );
    enter_nodes.append('text')
      .text( d => d.name)
      .attr('dy', '0.35em');

    graph.nodes.forEach( (v) => {
      v.width = 2.5 * R;
      return v.height = 2.5 * R;
    });

    let d3cola  = cola.d3adaptor(d3)
      .size([width, height])
      .linkDistance(50)
      .symmetricDiffLinkLengths(5)
      .avoidOverlaps(true)
      .nodes(graph.nodes)
      .links(graph.links)
      .on( 'tick', () => {
        nodes.attr('transform', d => `translate(${d.x},${d.y})` );
        return links
          .attr('x1', d => d.source.x )
          .attr('y1', d => d.source.y )
          .attr('x2', d => d.target.x )
          .attr('y2', d => d.target.y );
      });

      console.log(enter_nodes);
      console.log(d3cola);

      enter_nodes.call(d3cola.drag);

      d3cola.start();

  });

  // const root = document.getElementById('root');
  // ReactDOM.render(<App />, root);
  // serviceWorker.unregister();


});

