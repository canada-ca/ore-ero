/* global jsyaml DeepObject */

/* exported FileWriter */
class FileWriter {
  /**
   * Helps make reading and writing text files in GitHub easier.
   * @param {String} user The username where the repo is hosted (canada-ca).
   * @param {String} repo The name of the repository (ore-ero).
   * @param {String} [branch=master] The branch to work on.
   */
  constructor(user, repo, branch = 'master') {
    this._user = user;
    this._repo = repo;
    this._branch = branch;
    this._base = `https://raw.githubusercontent.com/${this._user}/${
      this._repo
    }/${this._branch}`;
  }

  /**
   * Read a file hosted in GitHub.
   * @param {String} file The file to read.
   * @return {Promise<String>} Resolves with the text of the file.
   */
  get(file) {
    return fetch(`${this._base}/${file}`)
      .then(res => {
        if (!res.ok && res.status == 404) {
          throw res;
        } else if (!res.ok) {
          throw new Error(`Failed getting ${this._base}/${file}`);
        }
        return res;
      })
      .then(res => res.text());
  }

  /**
   * Appends text to a file hosted in GitHub.
   * @param {String} file The file to append to.
   * @param {String} content The content to append.
   */
  append(file, content) {
    return this.get(file).then(currentContent => {
      return currentContent + content;
    });
  }
}

/* exported YamlWriter */
class YamlWriter extends FileWriter {
  /**
   * Helps make reading and writing YAML files in GitHub easier.
   * @param {String} user The username where the repo is hosted (canada-ca).
   * @param {String} repo The name of the repository (ore-ero).
   * @param {String} [branch=master] The branch to work on.
   */
  constructor(user, repo, branch = 'master') {
    super(user, repo, branch);
  }

  /**
   * Attempts to parse a file as YAML and return the results.
   * @param {string} file The file to fetch.
   * @return {Promise<Object>} A Promise that resolves with a POJO.
   */
  get(file) {
    return FileWriter.prototype.get.call(this, file).then(content => {
      return jsyaml.load(content, { schema: jsyaml.JSON_SCHEMA });
    });
  }

  /**
   *
   * @param {String} file The file to merge on.
   * @param {Object} newObject The contents to merge into file.
   * @param {String} propPath The path to the property you want to merge.
   * @param {String} onValue The property to treat as the id. If this is
   * the same in both, then we overwrite the object. If it exists in
   * contents but not file, we simply add it into propPath.
   * @return {Promise<Object>} A Promise that resolves with the merged file.
   */
  merge(file, newObject, propPath, onValue) {
    let newObjects = DeepObject.get(newObject, propPath);

    // Get an Object of the new ids using the onValue
    let newIds = {};
    for (let newItem of newObjects) {
      newIds[DeepObject.get(newItem, onValue)] = newItem;
    }

    return this.get(file).then(result => {
      let items = DeepObject.get(result, propPath);

      // Update the object if there's a match.
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let id = DeepObject.get(item, onValue);
        if (newIds[id]) {
          items.splice(i, 1, newIds[id]);
          delete newIds[id];
        }
      }
      // Or add as a new one.
      items = items.concat(Object.values(newIds));

      DeepObject.set(result, propPath, items);
      return result;
    });
  }
}
