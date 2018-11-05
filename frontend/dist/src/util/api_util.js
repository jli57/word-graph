import ajax from './ajax';
import { parseId, parseWord } from './text_util';

export const fetchRelated = (options, callback) => (
  ajax({
    method: "POST",
    url: `/api/conceptnet`,
    options
  }, (res) => {
    let nodes = [];
    let links = [];

    let rootId = parseId(res["@id"]);
    let rootWord = parseWord(rootId);

    const group = rootId;
    nodes.push({  wordId: rootId, word: rootWord, group});

    res.related.filter( (rel, i) => i >= options.offset )
    .forEach( rel => {

      const wordId = parseId(rel["@id"]);
      const word = parseWord(wordId);

      if ( rootWord !== word ) {
        let node = {
          wordId,
          word,
          group
        };
        nodes.push(node);

        let link = {
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




