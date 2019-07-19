/* exported slugify */

function slugify(txt) {
  return txt
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
