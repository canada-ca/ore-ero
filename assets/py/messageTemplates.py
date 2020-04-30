class Templates:
    ##This file can be erased once the template is setup on the Notify API
    ##To have this template on the Notify API, replace {} with (())
    plain = """
    English Message:

    Automated message about {EN_NAME} on the ORE platform, last updated {LAST_UPDATED}.
    You are receiving this message because our information concerning {EN_NAME} has not been 
    updated in the last 6 months and your email address is currently listed as the contact 
    information for this {EN_TYPE}.
    If you are no longer the contact for {EN_NAME}, you can use this form 
    "https://code.open.canada.ca/en/{EN_FORM}.html" to update our platform.

    "https://code.open.canada.ca/en/index.html"

    Message en français:
    
    Message automatisé concernant {FR_NAME} sur la plateforme Échange de Ressources Ouvert,
    mise à jour la plus récente {LAST_UPDATED}
    Vous recevez ce message parce que notre information concernant {FR_NAME} n'a pas été
    mis a jour dans les 6 derniers mois et votre adresse email est inscrite comme 
    adresse de contact pour ce {FR_TYPE}.
    Si vous n'êtes plus la personne à contacter pour {FR_NAME}, vous pouvez utiliser
    ce formulaire "https://code.open.canada.ca/en/{FR_FORM}.html" pour mettre 
    a jour notre plateforme.

    "https://code.ouvert.canada.ca/fr/index.html"
    """
    
    
