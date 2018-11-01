import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { fetchRelated } from './util/api_util';

import Graph from './d3/graph';


document.addEventListener('DOMContentLoaded', () => {

  const HEIGHT = 800;
  const WIDTH = 800;
  let word = "example";
  const graph = new Graph(WIDTH, HEIGHT);

  fetchRelated(word, (data) => {
    graph.render(data);
  });

  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.getElementById("search-text");
    word = searchText.value;

    fetchRelated(word, (data) => {
      graph.clear();
      graph.render(data);
    });
  });

});
