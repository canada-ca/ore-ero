// Inspired by Object Path
// https://github.com/mariocasciaro/object-path
// @author j-rewerts

/* exported DeepObject */
const DeepObject = {
  /**
   * Attempts to get the object at path.
   * @param {Object} obj The Object to try to find.
   */
  get: (obj, path, defaultValue) => {
    if (typeof path === 'number') {
      path = [path];
    }
    if (!path || path.length === 0) {
      return obj;
    }
    if (obj == null) {
      return defaultValue;
    }
    if (typeof path === 'string') {
      path = path.split('.');
    }

    return path.reduce((accumulator, currentValue) => {
      return accumulator[currentValue];
    }, obj);
  },
  /**
   * Attempts to set the object at path to value.
   * @param {Object} obj The Object to try to set on.
   * @param {String} path The path within obj to set to:
   * @param {Object|String|Number} value The value to set at path.
   */
  set: (obj, path, value) => {
    if (typeof path === 'string') {
      path = path.split('.');
    }

    let i;
    for (i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }

    obj[path[i]] = value;
  }
};
