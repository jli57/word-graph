import ajax from './ajax';
import { parseWord } from './text_util';

export const fetchRelated = (word, callback) => (
  ajax({
    method: "GET",
    url: `http://api.conceptnet.io/related/c/en/${word}?filter=/c/en&limit=20`
  }, (res) => {
    let nodes = [];
    let links = [];

    const word = parseWord(res["@id"]);
    nodes.push({  id: word, name: word, group: 1})
    res.related.forEach( (rel, i) => {
      const relWord = parseWord(rel["@id"]);

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




