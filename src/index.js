import './styles/reset.css';
import './styles/index.css';
import { fetchRelated } from './util/api_util';
import Graph from './d3/graph';

document.addEventListener('DOMContentLoaded', () => {

  const canvas  = document.getElementById("canvas");
  let word = "example";
  const graph = new Graph(canvas);




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



  var chartDiv = document.getElementById("chart");
  var svg = d3.select(chartDiv).append("svg");


});
