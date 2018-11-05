import './styles/reset.css';
import './styles/index.css';
import { fetchRelated } from './util/api_util';
import Graph from './d3/graph';

document.addEventListener('DOMContentLoaded', () => {

  const canvas  = document.getElementById("canvas");
  const limit = 15;
  const offset = 0;
  const graph = new Graph(canvas, limit);

  let options = {
    word: "example",
    limit,
    offset
  };

  fetchRelated(options, (data) => {
    graph.reset();
    graph.setData(data);
  });

  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.getElementById("search-text");
    options.word = searchText.value;

    fetchRelated(options, (data) => {
      graph.reset();
      graph.setData(data);
    });
  });

});
