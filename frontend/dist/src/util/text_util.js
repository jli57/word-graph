export const parseId = (id) => {
  return id.split("/")[3];
}

export const parseWord = (word) => {
  return word.replace(/_/g, " ");
}
