[![Build Status](https://travis-ci.org/canada-ca/ore-ero.svg?branch=master)](https://travis-ci.org/canada-ca/ore-ero)

([Français](#échange-de-ressources-ouvert))

## Open Resource Exchange

https://canada-ca.github.io/ore-ero/en/index.html

Explore how the Government of Canada creates greater transparency, accountability, increases citizen engagement, and drives innovation and economic opportunities through open Standards, open source software, open data, open information, open dialogue and open Government.

### How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md)

See [data README file](_data) to learn how to contribute data about released open source code or open source software used by Canadian federal, provincial, territorial or municipal administration.

This site uses [Jekyll](https://jekyllrb.com/) and [Github Pages](https://pages.github.com/).

Unless otherwise noted, the source code of this project is covered under Crown Copyright, Government of Canada, and is distributed under the [MIT Licence](LICENSE.txt).

### Development

To test your changes locally, run `jekyll serve`. For example using Docker:

> docker run -p 4000:4000 -v $(pwd):/srv/jekyll -it --rm jekyll/jekyll jekyll serve

Notes:
- For PowerShell users, replace the parentheses with brackets (Change `$(pwd)` to `${pwd}`)
- If Jekyll is not automatically regenerating the site after files are modified, add the build command flags: `--watch` and `--force_polling` to the end of the above command

Site will be available at: http://localhost:4000/ore-ero/
______________________

#### Javascript

If you're working on Javascript in the `/assets/js/src` folder, make sure your code follows the style guidelines. We use ES Lint for checking code style. Ensure you have a recent version of Node.js (>=10.15.3). Run the following to install dependencies. 

``` bash
npm install
```

Now when you want to know if your code is following the guidelines, run 
``` bash
npm run lint
```

We use [Prettier](https://www.npmjs.com/package/prettier) for code formatting. To automatically format your code, run
```bash
npm run prettify
```

## Échange de ressources ouvert

https://canada-ca.github.io/ore-ero/fr/index.html

Découvrez comment le gouvernement du Canada crée davantage de transparence et de responsabilisation, augmente la mobilisation citoyenne et favorise l’innovation et les possibilités économiques au moyen de normes ouvertes, logiciels libres, données ouvertes, d’information ouverte, de dialogue ouvert et du Gouvernement ouvert.

### Comment contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md)

Voir le [fichier README des données](_data) pour savoir comment fournir des données sur le code source ouvert publié ou les logiciels libres utilisés par l'administration fédérale, provinciale, territoriale ou municipale du Canada.

Ce site utilise [Jekyll](https://jekyllrb.com/) et [Github Pages](https://pages.github.com/).

Sauf indication contraire, le code source de ce projet est protégé par le droit d'auteur de la Couronne du gouvernement du Canada et distribué sous la [licence MIT](LICENSE.txt).

### Développement

Pour tester vos modifications localement, exécuter `jekyll serve`. Par exemple avec Docker:

> docker run -p 4000:4000 -v $(pwd):/srv/jekyll -it --rm jekyll/jekyll jekyll serve

Remarques:
- Pour les utilisateurs de PowerShell, remplacez les parenthèses par des crochets (Modifiez `$(pwd)` en `${pwd}`)
- Si Jekyll ne régénère pas automatiquement le site une fois les fichiers modifiés, ajoutez les indicateurs: `--watch` et `--force_polling` à la fin de la commande ci-dessus

Le site sera disponible au: http://localhost:4000/ore-ero/
______________________

#### Javascript

Si vous travaillez sur Javascript dans le dossier `/assets/js/src`, assurez-vous que votre code respecte les directives de style. Nous utilisons ES Lint pour vérifier le style de code. Assurez-vous de disposer d'une version récente de Node.js (>=10.15.3). Exécutez ce qui suit pour installer des dépendances. 

``` bash
npm install
```

Lorsque vous voulez savoir si votre code suit les directives de style, exécutez
``` bash
npm run lint
```

Nous utilisons [Prettier](https://www.npmjs.com/package/prettier) pour le formatage du code. Pour formater automatiquement votre code, exécutez
```bash
npm run prettify
```