#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import json, smtplib
import urllib.request
from datetime import date, timedelta, datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from messageTemplates import Templates
from emailInfo import emailInfo
###############################################################################
###From ore-ero folder, run with ./assets/py/emailUpdateScript.py           ###
###############################################################################
#Maximum amount of days since last update, half a year default
maxDaysNoUpdate = 182

def sendEmails(emailData):
    server = smtplib.SMTP_SSL(host='smtp.gmail.com')
    server.login(emailInfo["email"], emailInfo["password"])
    for data in emailData:
        email = MIMEMultipart()
        email['from'] = emailInfo["email"]
        #Replace with any address to test the script
        email['to'] = data[0]
        email['subject'] = Templates.getSubject() 
        plainVersion = MIMEText(Templates.plainFormat(data[1], data[2], data[3], data[4]), 'plain')
        plainVersion.add_header("Content-Disposition",
        "attachment; filename= Plain Text Version.txt")
        htmlVersion = MIMEText(Templates.htmlFormat(data[1], data[2], data[3], data[4]), 'html')
        email.attach(htmlVersion)
        email.attach(plainVersion)
        server.send_message(email)
        del email
    server.quit()
        

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

