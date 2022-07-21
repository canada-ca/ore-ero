([Français](#données-pour-léchange-de-ressources-ouvert))

# Open Resource Exchange Data

This folder contains all the data used to generate the [Open Resource Exchange Website](https://canada-ca.github.io/ore-ero/en/index.html).

See [Documentation](https://canada-ca.github.io/ore-ero/en/docs.html) for how to update and contribute to data using the following forms:

- The [Open Design Form](https://canada-ca.github.io/ore-ero/en/open-design-form.html)
- The [Open Source Code Form](https://canada-ca.github.io/ore-ero/en/open-source-code-form.html)
- The [Open Source Software Form](https://canada-ca.github.io/ore-ero/en/open-source-software-form.html)
- The [Open Standard Form](https://canada-ca.github.io/ore-ero/en/open-standard-form.html)
- The [Looking for Partners Form](https://canada-ca.github.io/ore-ero/en/partnership-form.html)

If you wish to collaborate directly via GitHub, here how you can add to the different types of projects:

## Add your data

### Add your administration

In the [administrations](https://github.com/canada-ca/ore-ero/tree/master/_data/administrations) directory add your adinistration in the [federal.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/federal.yml), [provincial.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/provincial.yml), [municipal.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/municipal.yml), [aboriginal.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/aboriginal.yml) or [others.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/others.yml) file.

### Adding Open Source Code

The [schema metadata file](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaCode.yaml) shows how the file are structured. The structure of the file and the required fields are explained in the [metadata schema page](https://canada-ca.github.io/ore-ero/en/open-source-code-schema.html).

You can use the [code template with only mandatory fields](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/code_mandatory.yml) as an example.

#### Your administration is already there?

If there is already a file for your adminstration under the [code](https://github.com/canada-ca/ore-ero/tree/master/_data/code) directory, you can edit that file directly.

#### You administration needs to be added?

If your adminstration doesn't have a file under the [code](https://github.com/canada-ca/ore-ero/tree/master/_data/code) directory, you need to create a new file for your administration. Its name should corresponds with the value you add to the `adminCode` field.

### Adding Open Design Resource

The [schema metadata file](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaDesign.yaml) shows how the file are structured. The structure of the file and the required fields are explained in the [metadata schema page] (<https://raw.githubusercontent.com/canada-ca/ore-ero/open-design-schema.html>)

You can use the [design template with only mandatory fields](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/design_mandatory.yml) as an example

#### The design is already there?

If there is already a file for the design under the [design](https://github.com/canada-ca/ore-ero/tree/master/_data/design) directory, you need to check if your administration is already listed as using the open design. If it's there, you can update it directly in the file. Otherwise, you need to add your administration data under the `uses` field.

#### The design doesn't exist yet?

If the design doesn't have a file under the [design](https://github.com/canada-ca/ore-ero/tree/master/_data/design) directory, you need to create a new file for the software. It's name should correspond to a slugified version of it's english name

### Adding Open Source Software

The [schema metadata file](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaSoftware.yaml) shows how the file are structured. The structure of the file and the required fields are explained in the [metadata schema page](https://canada-ca.github.io/ore-ero/en/open-source-software-schema.html).

You can use the [software template with only mandatory fields](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/software_mandatory.yml) as an example.

#### The software is already there?

If there is already a file for the software under the [software](https://github.com/canada-ca/ore-ero/tree/master/_data/software) directory, you need to check if your administration is already listed as using the open source software. If it's there, you can update it directly in the file. Otherwise, you need to add your administration data under the `uses` field.

#### The software does not exist yet?

If the software doesn't have a file under the [software](https://github.com/canada-ca/ore-ero/tree/master/_data/software) directory, you need to create a new file for the software. It's name should corresponds to a slugified version of it's english name.

### Adding Open Standard

The [schema metadata file](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaStandard.yaml) shows how the file are structured. The structure of the file and the required fields are explained in the [metadata schema page](https://canada-ca.github.io/ore-ero/en/open-standard-schema.html).

You can use the [standard template with only mandatory fields](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/standard_mandatory.yml) as an example.

#### The standard is already there?

If there is already a file for the standard under the [standard](https://github.com/canada-ca/ore-ero/tree/master/_data/standard) directory, you need to check if your adminstration is already listed as using the open standard. If it's there, you can update it directly in the file. Otherwise, you need to add your administration data under the `administrations` field.

#### The standard does not exist yet?

If the standard doesn't have a file under the [standard](https://github.com/canada-ca/ore-ero/tree/master/_data/standard) directory, you need to create a new file for the standard. Its name should corresponds to a slugified version of the value you add to the `standardAcronym` field.

### Adding Partnership Projects

The [schema metadata file](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaPartnership.yaml) shows how the file are structured. The structure of the file and the required fields are explained in the [metadata schema page](https://canada-ca.github.io/ore-ero/en/partnership-schema.html).

You can use the [partnership template with only mandatory fields](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/partnership_mandatory.yml) as an example.

#### Your administration is already there?

If there is already a file for your adminstration under the [partnership](https://github.com/canada-ca/ore-ero/tree/master/_data/partnership) directory, you can edit that file directly.

#### You administration needs to be added?

If your adminstration doesn't have a file under the [partnership](https://github.com/canada-ca/ore-ero/tree/master/_data/partnership) directory, you need to create a new file for your administration. Its name should corresponds with the value you add to the `adminCode` field.

## Directory structure

### Administrations

List of Canadian federal, provincial, territorial, municipal and aboriginal administrations. Used to lookup bilingual names.

### Code

A list of released open source code by administrations. Sub-folders contain data files. One file per administration

- Federal
- Provincial
- Municipal
- Aboriginal

### Design

List of open design used by administrations

### Software

List of open source software used by administrations.

### Standard

List of open standards endorsed or used by administrations.

### Partnership

List of projects looking for partnership or investors by administrations. Sub-folders contain data files. One file per administration

- Federal
- Provincial
- Municipal
- Aboriginal

______________________

# Données pour l'Échange de ressources ouvert

Ce dossier contient toutes les données utilisées pour générer le [site Web de l'Échange de ressources ouvert](https://canada-ca.github.io/ore-ero/fr/index.html).

Voir la [Documentation](https://canada-ca.github.io/ore-ero/fr/docs.html) pour savoir comment mettre à jour et contribuer aux données grâce à l'utilisation des formulaires suivants :

- Le [formulaire de code source ouvert](https://canada-ca.github.io/ore-ero/fr/code-source-ouvert-formulaire.html)
- Le [formulaire de design libre](https://canada-ca.github.io/ore-ero/fr/design-libre-formulaire.html)
- Le [formulaire du logiciel libre](https://canada-ca.github.io/ore-ero/fr/logiciel-libre-formulaire.html)
- Le [formulaire des normes ouvertes](https://canada-ca.github.io/ore-ero/fr/norme-ouverte-formulaire.html)
- Le [formulaire des projets en recherche d’investisseurs et partenaires](https://canada-ca.github.io/ore-ero/fr/partenariat-formulaire.html)

Si vous souhaitez collaborer directement à l'aide de GitHub, les informations suivantes vont vous informer sur comment ajouter vos données selon les différents types de projets :

## Comment ajouter vos données

### Ajouter votre administration

dans le répertoire [administrations](https://github.com/canada-ca/ore-ero/tree/master/_data/administrations) ajouter votre administration dans le fichier [federal.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/federal.yml), [provincial.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/provincial.yml), [municipal.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/municipal.yml), [aboriginal.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/aboriginal.yml) ou [others.yml](https://github.com/canada-ca/ore-ero/blob/master/_data/administrations/others.yml).

### Ajouter un projet de code source ouvert

Le [schéma des métadonnées](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaCode.yaml) montre comment les fichiées de données sont structurées. La structure et les champs requis sont expliqués sur la [page des métadonnées](https://canada-ca.github.io/ore-ero/fr/code-source-ouvert-schema.html).

Utilisez le [modèle de code avec uniquement les champs obligatoires](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/code_mandatory.yml) comme exemple.

#### Votre administration est déjà présente?

S'il existe déjà un fichier pour votre administration sous le répertoire [code](https://github.com/canada-ca/ore-ero/tree/master/_data/code) vous pouvez modifier directement ce fichier pour ajouter votre code source ouvert.

#### Votre administration doit être ajoutée?

Si votre administration n'a pas de fichier sous le répertoire [code](https://github.com/canada-ca/ore-ero/tree/master/_data/code) vous devez créer un nouveau fichier pour votre administration. Le nom de ce fichier doit correspondre avec la valeur que vous ajoutez au champ `adminCode`.

### Ajouter des design libres

Le [schéma des métadonnées](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaDesign.yaml) montre comment les fichiers de données sont structurés. La structure et les champs requis sont expliqués sur la [page des métadonnées](https://canada-ca.github.io/ore-ero/fr/design-libre-schema.html).

Utilisez le [modèle de design avec uniquement les champs obligatoires](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/design_mandatory.yml) comme exemple.

#### Le design est déjà là?

S'il existe déjà un fichier pour le design libre que vous utilisez dans le répertoire [design](https://github.com/canada-ca/ore-ero/tree/master/_data/design) vous devez vérifier si votre administration est déjà répertoriée comme utilisant le design libre. Si c'est le cas, vous pouvez mettre à jour le fichier directement. Sinon, vous devez ajouter votre administration sous le champ `uses`.

#### Le design n'existe pas?

Si le logiciel que vous utilisez n'a pas de fichier dans le répertoire [design](https://github.com/canada-ca/ore-ero/tree/master/_data/design) vous devez créer un nouveau fichier pour le design libre. Le nom du fichier doit correspondre avec une version simplifiée pour les urls du nom anglais du design.

### Ajouter des logiciels libres

Le [schéma des métadonnées](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaSoftware.yaml) montre comment les fichiers de données sont structurés. La structure et les champs requis sont expliqués sur la [page des métadonnées](https://canada-ca.github.io/ore-ero/fr/logiciel-libre-schema.html).

Utilisez le [modèle de logiciel avec uniquement les champs obligatoires](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/software_mandatory.yml) comme exemple.

#### Le logiciel est déjà là?

S'il existe déjà un fichier pour le logiciel libre que vous utilisez dans le répertoire [software](https://github.com/canada-ca/ore-ero/tree/master/_data/software) vous devez vérifier si votre administration est déjà répertoriée comme utilisant le logiciel libre. Si c'est le cas, vous pouvez mettre à jour le fichier directement. Sinon, vous devez ajouter votre administration sous le champ `uses`.

#### Le logiciel n'existe pas?

Si le logiciel que vous utilisez n'a pas de fichier dans le répertoire [software](https://github.com/canada-ca/ore-ero/tree/master/_data/software) vous devez créer un nouveau fichier pour le logiciel libre. Le nom du fichier doit correspondre avec une version simplifiée pour les urls du nom anglais du logiciel.

### Ajouter une norme ouverte

Le [schéma des métadonnées](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaStandard.yaml) montre comment les fichiées de données sont structurées. La structure et les champs requis sont expliqués sur la [page des métadonnées](https://canada-ca.github.io/ore-ero/en/open-standard-schema.html).

Utilisez le [modèle de norme avec uniquement les champs obligatoires](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/standard_mandatory.yml) comme exemple.

#### La norme existe déjà?

S'il existe déjà un fichier pour la norme que vous utilisez dans le répertoire [standard](https://github.com/canada-ca/ore-ero/tree/master/_data/standard) vous devez vérifier si votre administration est déjà répertoriée comme utilisant la norme ouverte. Si c'est le cas, vous pouvez mettre à jour le fichier directement. Sinon, vous devez ajouter votre administration sous le champ `administrations`.

#### La norme n'existe pas?

Si la norme que vous utilisez n'a pas de fichier dans le répertoire [standard](https://github.com/canada-ca/ore-ero/tree/master/_data/standard) directory, you need to create a new file for the standard. Le nom de ce fichier doit correspondre avec la valeur que vous ajoutez au champ `standardAcronym`, sans majuscules.

### Ajouter un projet en recherche de partenariat

Le [schéma des métadonnées](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data/schemaPartnership.yaml) montre comment les fichiées de données sont structurées. La structure et les champs requis sont expliqués sur la [page des métadonnées schema page](https://canada-ca.github.io/ore-ero/fr/partenariat-schema.html).

Utilisez le [modèle de partenariat avec uniquement les champs obligatoires](https://raw.githubusercontent.com/canada-ca/ore-ero/master/_data_templates/partnership_mandatory.yml) comme exemple.

#### Votre administration est déjà présente?

S'il existe déjà un fichier pour votre administration sous le répertoire [partnership](https://github.com/canada-ca/ore-ero/tree/master/_data/partnership) vous pouvez modifier directement ce fichier pour ajouter votre projet en recherche de partenariat.

#### Votre administration doit être ajoutée?

Si votre administration n'a pas de fichier sous le répertoire [partnership](https://github.com/canada-ca/ore-ero/tree/master/_data/partnership) vous devez créer un nouveau fichier pour votre administration. Le nom de ce fichier doit correspondre avec la valeur que vous ajoutez au champ `adminCode`.

## Structure du répertoire

### Administrations

Liste des administrations fédérales, provinciales, territoriales, municipales et aboriginales du Canada. Utilisé pour recherche les noms bilingues.

### Code

Liste des codes sources ouverts publiés par les administrations. Les sous-répertoire contiennent les fichiers de données. Un fichier par administration.

- Federal
- Provincial
- Municipal
- Aboriginal

### Design

Liste des designs libres utilisés par les administrations

### Software

Liste des logiciels libres utilisés par les administrations.

### Standard

Liste des normes ouvertes approuvées ou utilisées par les administrations.

### Partnership

Liste des projets en recherche d'investisseurs ou de partenaires par les administrations.
List of projects looking for partnership or investors by administrations. Les sous-répertoire contiennent les fichiers de données. Un fichier par administration.

- Federal
- Provincial
- Municipal
- Aboriginal
