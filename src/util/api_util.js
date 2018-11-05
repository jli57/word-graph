import ajax from './ajax';
import { parseId, parseWord } from './text_util';

export const fetchRelated = (word, callback) => (
  ajax({
    method: "GET",
    url: `http://api.conceptnet.io/related/c/en/${word}?filter=/c/en&limit=20`
  }, (res) => {
    let nodes = [];
    let links = [];

    const rootId = parseId(res["@id"]);
    const rootWord = parseWord(rootId);
    const group = rootId;
    nodes.push({  id: rootId, name: rootWord, group})
    res.related.forEach( rel => {
      const id = parseId(rel["@id"]);
      const name = parseWord(id);

      if ( name !== rootWord ) {
        let node = {
          id,
          name,
          group
        };
        nodes.push(node);

        let link = {
          id: `${rootId}-${id}`,
          source: nodes[0],
          target: node,
          weight: rel.weight
        };
        links.push(link);
      }
    });
    callback({ nodes, links });

  })
);




