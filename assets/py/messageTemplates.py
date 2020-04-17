class Templates:
    frTypes = {"code": "code",
        "design": "design",
        "software": "logiciel",
        "standard": "norme",
        "partnership": "partenariat"}

    selector = {"code": {"en": "open-source-code-form", "fr": "code-source-ouvert-formulaire"},
        "design": {"en": "open-design-form", "fr": "design-libre-formulaire"},
        "software": {"en": "open-source-software-form", "fr": "logiciel-libre-formulaire"},
        "standard": {"en": "open-standard-form", "fr": "norme-ouverte-formulaire"},
        "partnership": {"en": "partnership-form", "fr": "partenariat-formulaire"}}

    plain = """
    English Message:

    Automated message about {EN_NAME} on the ORE platform, last updated {LAST_UPDATED}
    You are receiving this message because our information concerning {EN_NAME} has not been updated
    in the last 6 months and your email address is currently listed in the contact information for 
    this {EN_TYPE}.
    If you are no longer the contact for {EN_NAME},
    you can use this form "https://code.open.canada.ca/en/{EN_FORM}.html"
    to update our platform.

    "https://code.open.canada.ca/en/index.html"

    Message en français:
    Message automatisé concernant {FR_NAME} sur la plateforme Échange de Ressources Ouvert,
     mise à jour la plus récente {LAST_UPDATED}
    Vous recevez ce message parce que notre information concernant {FR_NAME} n'a pas été mis a jour
    dans les 6 derniers mois et votre adresse email est inscrite comme adresse de contact pour 
    ce {FR_TYPE}.
    Si vous n'êtes plus la personne à contacter pour {FR_NAME},
    vous pouvez utiliser ce formulaire "https://code.open.canada.ca/en/{FR_FORM}.html"
    pour mettre a jour notre plateforme.

    "https://code.ouvert.canada.ca/fr/index.html"
    """
    html = """

    <h4>English Message:</h4>
    <span>Automated message about {EN_NAME} on the Open Ressource Exchange platform
    , last updated {LAST_UPDATED}</span>
    <div>
    <p>
    You are receiving this message because our information concerning {EN_NAME} has not been updated
    in the last 6 months and your email address is currently listed as the contact address for 
    this {EN_TYPE}.
    </p> 
    <p>
    If you are no longer the contact for {EN_NAME},
    you can use this <a href="https://code.open.canada.ca/en/{EN_FORM}.html">form</a>
    to update our platform.
    </p>
    </div>
    <p><a href="https://code.open.canada.ca/en/index.html">Link to site</a></p>
   
    <h4>Message en français:</h4>
    <span>Message automatisé concernant {FR_NAME} sur la plateforme Échange de Ressources Ouvert,
     mise à jour la plus récente {LAST_UPDATED}</span>
    <div>
    <p>
    Vous recevez ce message parce que notre information concernant {FR_NAME} n'a pas été mis a jour
    dans les 6 derniers mois et votre adresse email est inscrite comme adresse de contact pour 
    ce {FR_TYPE}.
    </p> 
    <p>
    Si vous n'êtes plus la personne à contacter pour {FR_NAME},
    vous pouvez utiliser ce <a href="https://code.open.canada.ca/en/{FR_FORM}.html">formulaire</a>
    pour mettre a jour notre plateforme.
    </p>
    </div>
    <p><a href="https://code.ouvert.canada.ca/fr/index.html">Lien vers le site</a></p>
    """
    enSubject = "Keeping the Open Ressource Exchange platform up to date"

    frSubject = "Maintenir la plateforme Échange de Ressources Ouvert à Jour"

    @staticmethod
    def plainFormat(enName, frName, lastUpdated, category):
        return Templates.plain.format(EN_NAME=enName, FR_NAME=frName, LAST_UPDATED=lastUpdated,
        EN_TYPE=category, FR_TYPE=Templates.frTypes[category],
        EN_FORM=Templates.selector[category]["en"], FR_FORM=Templates.selector[category]["fr"])
    
    @staticmethod
    def htmlFormat(enName, frName, lastUpdated, category):
        return Templates.html.format(EN_NAME=enName, FR_NAME=frName, LAST_UPDATED=lastUpdated,
        EN_TYPE=category, FR_TYPE=Templates.frTypes[category],
        EN_FORM=Templates.selector[category]["en"], FR_FORM=Templates.selector[category]["fr"])
    
    @staticmethod
    def getSubject():
        return Templates.enSubject + " // " + Templates.frSubject
