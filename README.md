# Word Graph

* [Live Site](https://word-graph.herokuapp.com/)
* [Background and Overview](#background-and-overview)
* [Functionality and MVP Features](#functionality-and-mvp-features)
* [Architecture and Technologies](#architecture-and-technologies)
* [Credits](#Credits)
* [Implementation Timeline](#implementation-timeline)

## Background and Overview
Word Graph is a word association/analysis visualization tool.

## Functionality and MVP Features

Word Graph will allow users to:
* [ ] Display a graph of words and associated words
* [ ] Search for words on a search bar
* [ ] Zoom in to associated words
* [ ] Word definitions on hover

## Architecture and Technologies
Word Graph uses a simple express backend to handle API calls to ConceptNet and a Vanilla JavaScript frontend. The data visulization is handled through a graph rendered by d3. The force-directed layout is implemented using WebCola.

### Technologies
* Vanilla JavaScript for overall structure of the webpage.
* D3 for DOM manipulation and rendering of data visualizations.
* Cola to layout graphs in a bounded canvas.
* Webpack to bundle and serve up various scripts.
* Express backend to handle HTTP api requests

### Wireframe

<img src="./images/wireframe.png" width="600px"/>

## Credits

A special thanks to the following technologies/resources that made this project possible:
* [Node.js](https://nodejs.org/en/)
* [D3.js](https://d3js.org/)
* [WebCola](https://ialab.it.monash.edu/webcola/)
* [Express.js](https://expressjs.com/)
* [Webpack](https://webpack.js.org/)
* [ConceptNet](http://conceptnet.io/)
* [App Academy](https://www.appacademy.io/)

## Implementation Timeline

* The most important category
  * Display visualizations on the data

* Daily breakdown

10/30/2018
* Create project skeleton
* Go through d3 tutorials
* Create database backend if needed

10/31/2018
* Create API interface
* Create visualization

11/1/2018
* Create search bar

11/2/2018
* Add CSS Styling

Over the weekend
* Add word definitions

## Additional Planned Features
* [ ] Animated visualizations
* [ ] Word cloud
* [ ] Word analysis
* [ ] Allow users to input multiple words