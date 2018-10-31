const ajax = (options, callback) => {
  const xhr = new XMLHttpRequest();
  const DONE = 4;
  const OK = 200;

  xhr.onreadystatechange = function() {
    if ( xhr.readyState === DONE ) {
      if ( xhr.status === OK ) {
        console.log("success");
        callback(xhr.response);
      } else {
        console.log('request has failed', xhr.status);
      }
    }
  }

  xhr.open(
    options["method"],
    options["url"],
    true
  );

  xhr.responseType = 'json';
  xhr.send();

}

export const fetchWord = (word) => (
  ajax({
    method: "GET",
    url: "http://api.conceptnet.io/c/en/example?format=json"
  }, (res) => {
    // console.log(res);
    // const data = JSON.parse(res);
    const data =  document.getElementById("data");
    res.edges.forEach( (el, i) => {
      data.innerHTML += `<li>${el["start"]["label"]}</li>`;
    });
  })
);

export const fetchRelated = (word, callback) => (
  ajax({
    method: "GET",
    url: `http://api.conceptnet.io/related/c/en/${word}?filter=/c/en&limit=20`
  }, (res) => {
    let nodes = [];
    let links = [];

    const word = getWord(res["@id"]);
    nodes.push({  id: word, name: word, group: 1})
    res.related.forEach( (rel, i) => {
      const relWord = getWord(rel["@id"]);

      if ( relWord !== word ) {
        let node = {};
        node.id = relWord;
        node.name = relWord;
        node.group = i+2;
        nodes.push(node);

        let link = {};
        link.id = i+1;
        link.source = nodes[0];
        link.target = node;
        link.weight = rel.weight;
        links.push(link);
      }

    });

    callback({ nodes, links});

  })
);

const getWord = (id) => {
  return id.split("/")[3].replace("_", " ");
}

