/* exported slugify */

function slugify(txt) {
  return txt
    .toLowerCase()
    .replace(/[\W [^-]]+/g, '')
    .replace(/ +/g, '-');
}
