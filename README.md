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

YAML processing is done using the [js-yaml](https://github.com/nodeca/js-yaml) library.

#### PRB0t - Docker

You can choose to run PRB0t locally using Docker if you like. First, you need to generate a personal access token.

1. In your github account, navigate to settings/Developer settings/Personal access tokens
1. Click Generate a new token, you only need to select the repo option

Note: the token allows the communication between this api and your github repo. It's the equivalent of logging in as the API to your github account.

Now run the following, replacing `{YOUR GITHUB TOKEN}` with your own token.

```bash
docker run -p3000:3000 -e GH_TOKEN={YOUR GITHUB TOKEN} -e HOST_NAME=* jrewerts/prb0t:v1.0.1
```

Now change prbot_url in `_config.yml` to `http://localhost:3000/`.

Now when you fill out our forms, it'll submit the pull request using PRB0t running in your Docker container!

### Release

The core site is a GitHub Pages site, so it's updated whenever code is merged into master. We also depend on an external service called PRB0t to allow users to submit pull requests to ORE without having a GitHub account.

#### Updating PRB0t

This service is hosted in [Heroku](https://dashboard.heroku.com/apps/canada-pr-bot). We currently use Heroku's [git-based](https://devcenter.heroku.com/articles/git) method of updating the application. To do this, you will need Git and the Heroku CLI installed.

First, clone PRB0t to your machine.
``` bash
git clone https://github.com/PRB0t/PRB0t
```

Next, add our app as a remote git repository.
``` bash
heroku git:remote -a canada-pr-bot
```

And finally, push your changes.
``` bash
git push heroku master
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

Le traitement YAML est effectué à l'aide de la bibliothèque [js-yaml](https://github.com/nodeca/js-yaml).

#### PRB0t - Docker

Vous pouvez choisir d'exécuter PRB0t localement à l'aide de Docker si vous le souhaitez. Tout d'abord, vous devez générer un jeton d'accès personnel.

1. Dans votre compte github, accédez à Paramètres / Paramètres du développeur / Jetons d'accès personnel.
1. Cliquez sur Générer un nouveau jeton, il vous suffit de sélectionner l'option Repo.

Remarque: le jeton permet la communication entre cette api et votre dépôt Github. C'est l'équivalent de se connecter en tant qu'API à votre compte github.

Maintenant, lancez ce qui suit, en remplaçant "{YOUR GITHUB TOKEN}" par votre propre jeton.

```bash
docker run -p3000:3000 -e GH_TOKEN={YOUR GITHUB TOKEN} -e HOST_NAME=* jrewerts/prb0t:v1.0.1
```

Maintenant, remplacez prbot_url dans `_config.yml` par `http://localhost:3000/`.

Maintenant, lorsque vous remplissez nos formulaires, il soumet la demande de fusion à l'aide de PRB0t s'exécutant dans votre conteneur Docker!

### Publication

Le site principal est un site GitHub Pages. Il est donc mis à jour chaque fois que le code est fusionné dans le fichier maître. Nous dépendons également d'un service externe appelé PRB0t pour permettre aux utilisateurs de soumettre des demandes de fusion à ORE sans avoir de compte GitHub.

#### Mise à jour PRB0t

Ce service est hébergé sur [Heroku](https://dashboard.heroku.com/apps/canada-pr-bot). Nous utilisons actuellement la méthode de mise à jour de l'application basée sur [Git](https://devcenter.heroku.com/articles/git) de Heroku. Pour ce faire, vous devez avoir installé Git et la CLI Heroku.

Commencez par cloner PRB0t sur votre machine.
``` bash
git clone https://github.com/PRB0t/PRB0t
```

Ensuite, ajoutez notre application en tant que dépôt git distant.
``` bash
heroku git:remote -a canada-pr-bot
```

Et enfin, poussez vos modifications.
``` bash
git push heroku master
```
