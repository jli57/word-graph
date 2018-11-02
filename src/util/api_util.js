import ajax from './ajax';
import { parseWord } from './text_util';

export const fetchRelated = (word, callback) => (
  ajax({
    method: "GET",
    url: `http://api.conceptnet.io/related/c/en/${word}?filter=/c/en&limit=20`
  }, (res) => {
    let nodes = [];
    let links = [];
    const group = 1;

    const word = parseWord(res["@id"]);
    nodes.push({  id: word, name: word, group})
    res.related.forEach( (rel, i) => {
      const relWord = parseWord(rel["@id"]);

      if ( relWord !== word ) {
        let node = {
          id: relWord,
          name: relWord,
          group
        };
        nodes.push(node);

        let link = {
          id: i+1,
          source: nodes[0],
          target: node,
          weight: rel.weight
        };
        links.push(link);
      }

    });

    callback({ nodes, links});

  })
);




