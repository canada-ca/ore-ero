class Templates:
    plain = """
    English Message:
    Test message about {EN_NAME}, last updated {LAST_UPDATED}
    "https://code.open.canada.ca/en/index.html"

    Message en français:
    Message test concernant {FR_NAME}, mise à jour la plus récente {LAST_UPDATED}
    "https://code.ouvert.canada.ca/fr/index.html"
    """
    html = """
    <h4>English Message:</h4>
    <p>Test message about {EN_NAME}, last updated {LAST_UPDATED} </p>
    <p><a href="https://code.open.canada.ca/en/index.html">Link to site</a></p>

    <h4>Message en français:</h4>
    <p>Message test concernant {FR_NAME}, mise à jour la plus récente {LAST_UPDATED} </p>
    <p><a href="https://code.ouvert.canada.ca/fr/index.html">Lien vers le site</a></p>
    """
    enSubject = "Keeping the Open Ressource Exchange platform up to date"

    frSubject = "Maintenir la plateforme Échange de Ressources Ouvert à Jour"

    def plainFormat(enName, frName, lastUpdated):
        return Templates.plain.format(EN_NAME=enName, LAST_UPDATED=lastUpdated, FR_NAME=frName)

    def htmlFormat(enName, frName, lastUpdated):
        return Templates.html.format(EN_NAME=enName, LAST_UPDATED=lastUpdated, FR_NAME=frName)

    def getSubject():
        return Templates.enSubject + " // " + Templates.frSubject