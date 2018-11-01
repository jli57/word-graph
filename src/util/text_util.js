export const parseWord = (id) => {
  return id.split("/")[3].replace(/_/g, " ");
}
