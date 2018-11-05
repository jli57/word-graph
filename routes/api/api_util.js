const parseId = (id) => {
  return id.split("/")[3];
}

const parseWord = (word) => {
  return word.replace(/_/g, " ");
}

const fetchRelated = ({offset}, res) => {

  let nodes = [];
  let links = [];

  let rootId = parseId(res["@id"]);
  let rootWord = parseWord(rootId);

  const group = rootId;
  nodes.push({  wordId: rootId, word: rootWord, group});

  res.related.filter( (rel, i) => i >= offset )
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
  return { nodes, links };
};

module.exports = fetchRelated;



