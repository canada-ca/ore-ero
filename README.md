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

Note: For PowerShell users, replace the parentheses with brackets (Change ```$(pwd)``` to ```${pwd}```)

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

Remarque: pour les utilisateurs de PowerShell, remplacez les parenthèses par des crochets (Modifiez ```$(pwd)``` en ```${pwd}```)

Le site sera disponible au: http://localhost:4000/ore-ero/
