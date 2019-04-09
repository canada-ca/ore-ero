
class FileWriter {

    constructor(user, repo, branch='master') {
        this._user = user;
        this._repo = repo;
        this._branch = branch
        this._base = `https://raw.githubusercontent.com/${this._user}/${this._repo}/${this._branch}`
    }

    get = (file) => {
        return fetch(`${this._base}/${file}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed getting ${this._base}/${file}`);
                }
                return res;
            })
            .then(res => res.text())
    }

    append = (file, content) => {
        return this.get(file).then((currentContent) => {
            return currentContent + content;
        });
    }
}