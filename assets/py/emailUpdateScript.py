#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import json, os
import urllib.request
from datetime import date, timedelta, datetime
from notifications_python_client.notifications import NotificationsAPIClient
###############################################################################
###From ore-ero folder, run with ./assets/py/emailUpdateScript.py           ###
###############################################################################
#Maximum amount of days since last update, half a year default
maxDaysNoUpdate = 182

frTypes = {"code": "code",
        "design": "design",
        "software": "logiciel",
        "standard": "norme",
        "partnership": "partenariat"}

formName = {"code": {"en": "open-source-code-form", "fr": "code-source-ouvert-formulaire"},
        "design": {"en": "open-design-form", "fr": "design-libre-formulaire"},
        "software": {"en": "open-source-software-form", "fr": "logiciel-libre-formulaire"},
        "standard": {"en": "open-standard-form", "fr": "norme-ouverte-formulaire"},
        "partnership": {"en": "partnership-form", "fr": "partenariat-formulaire"}}


def sendEmails(emailData):
    client = NotificationsAPIClient(os.getenv("API_KEY"), "https://api.notification.alpha.canada.ca")
    for data in emailData:
        #Replace data[0] with any address to test the script
        client.send_notification(
            data[0], os.getenv("TEMPLATE_ID"),
            {'EN_NAME': data[1], 'FR_NAME': data[2], 'LAST_UPDATED': data[3],
            'EN_TYPE': data[4], 'FR_TYPE': frTypes[data[4]],
            'EN_FORM': formName[data[4]]["en"], 'FR_FORM': formName[data[4]]["fr"]})
        

def checkCodeEmails():
    codeDb = urllib.request.urlopen("https://code.open.canada.ca/code.json")
    data = json.loads(codeDb.read())
    codeData = []
    if data is not None:
        for level in data.values():   
            for admin in level.values():
                for release in admin["releases"]:
                    if (datetime.strptime(release["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()):
                        if "noreply" not in release["contact"]["email"]:
                            codeData.append((release["contact"]["email"], release["name"]["en"],
                            release["name"]["fr"], release["date"]["metadataLastUpdated"],
                            "code"))
    return codeData
        

def checkDesignEmails():
    designDb = urllib.request.urlopen("https://code.open.canada.ca/design.json")
    data = json.loads(designDb.read())
    designData = []
    if data is not None:
        for project in data.values():
            for administration in project["administrations"]:
                for use in administration["uses"]: 
                    if (datetime.strptime(use["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()):
                        if "noreply" not in use["contact"]["email"]: 
                            designData.append((use["contact"]["email"], project["name"]["en"],
                            project["name"]["fr"], use["date"]["metadataLastUpdated"],
                            "design"))
    return designData

def checkSoftwareEmails():
    softwareDb = urllib.request.urlopen("https://code.open.canada.ca/software.json")
    data = json.loads(softwareDb.read())
    softwareData = []
    if data is not None:
        for project in data.values():
            for administration in project["administrations"]:
                for use in administration["uses"]: 
                    if (datetime.strptime(use["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()):
                        if "noreply" not in use["contact"]["email"]: 
                            softwareData.append((use["contact"]["email"], project["name"]["en"],
                            project["name"]["fr"], use["date"]["metadataLastUpdated"],
                            "software"))
    return softwareData

def checkStandardEmails():
    standardDb = urllib.request.urlopen("https://code.open.canada.ca/standard.json")
    data = json.loads(standardDb.read())
    standardData = []
    if data is not None:
        for project in data.values(): 
            for administration in project["administrations"]:
                if (datetime.strptime(administration["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                + timedelta(days=maxDaysNoUpdate) < date.today()):
                        if "noreply" not in administration["contact"]["email"]: 
                            standardData.append((administration["contact"]["email"], project["standardAcronym"],
                            project["standardAcronym"], administration["date"]["metadataLastUpdated"],
                            "standard"))
    return standardData

def checkPartnershipEmails():
    partnershipDb = urllib.request.urlopen("https://code.open.canada.ca/partnership.json")
    data = json.loads(partnershipDb.read())
    partnershipData = []
    if data is not None:
        for level in data.values():   
            for admin in level.values():
                for project in admin["projects"]:
                    if (datetime.strptime(project["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()): 
                        if "noreply" not in project["contact"]["email"]:
                            partnershipData.append((project["contact"]["email"], project["name"]["en"],
                            project["name"]["fr"], project["date"]["metadataLastUpdated"],
                            "partnership"))
    return partnershipData


print("Started task at: " + datetime.now().isoformat(' ', 'seconds'))
sendEmails(checkCodeEmails() + checkDesignEmails() + checkSoftwareEmails()
        + checkStandardEmails() + checkPartnershipEmails())
print("Finished task at: " + datetime.now().isoformat(' ', 'seconds'))

