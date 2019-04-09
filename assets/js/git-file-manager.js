
const FileWriter = {
    _base: 'https://raw.githubusercontent.com/j-rewerts/ore-ero/master',

    get: (file) => {
        return fetch(`${FileWriter._base}/${file}`)
          .then(res => res.text())
    },

    append: (file, content) => {
        return FileWriter.get(file).then((currentContent) => {
            return currentContent + content;
        });
    }
}