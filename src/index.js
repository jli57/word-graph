import './styles/index.css';
import { fetchRelated } from './util/api_util';
import Graph from './d3/graph';

document.addEventListener('DOMContentLoaded', () => {

  const HEIGHT = 800;
  const WIDTH = 1000;
  let word = "example";
  const graph = new Graph(WIDTH, HEIGHT);

  fetchRelated(word, (data) => {
    graph.reset();
    graph.setData(data);
  });

  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.getElementById("search-text");
    word = searchText.value;

    fetchRelated(word, (data) => {
      graph.reset();
      graph.setData(data);
    });
  });
});
