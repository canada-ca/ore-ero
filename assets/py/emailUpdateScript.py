#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import json, schedule, smtplib, time
import urllib.request
from datetime import date, timedelta, datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from messageTemplates import Templates
###############################################################################
###From ore-ero folder, run with ./assets/py/emailUpdateScript.py           ###
###############################################################################
##Replace with whichever gmail will be used to send the messages, can use this one for tests
sender = "scheduledupdatescripttester@gmail.com"
#App password for the gmail
password = "koppttrkbyodglmc"
#Maximum amount of days since last update, half a year default
maxDaysNoUpdate = 182
##For the scheduler
#weeksToExec if we want to make sure it's done at a specific day of the week, half a year default
weeksToExec = 26
#daysToExec can be changed to whatever number as long as it's long enough not to spam contacts, half a year default
daysToExec = 182
#execTime doesn't really matter considering speed of execution, default at midnight
#To test it change this to a time at least 1 minute after your current time
execTime = "00:00"

def sendEmails(emailData):
    server = smtplib.SMTP_SSL(host='smtp.gmail.com')
    server.login(sender, password)
    for data in emailData:
        email = MIMEMultipart()
        email['from'] = sender
        ##Replace with data[0] to actually send the mails to the right place
        email['to'] = "Simon_moreau@hotmail.ca"
        email['subject'] = Templates.getSubject() 
        plainVersion = MIMEText(Templates.plainFormat(data[1], data[2], data[3]), 'plain')
        plainVersion.add_header("Content-Disposition",
        "attachment; filename= Plain Text Version.txt")
        htmlVersion = MIMEText(Templates.htmlFormat(data[1], data[2], data[3]), 'html')
        email.attach(htmlVersion)
        email.attach(plainVersion)
        server.send_message(email)
        del email
        ##limit how many emails are sent during testing
        break
    server.quit()
        

def checkCodeEmails():
    codeDb = urllib.request.urlopen("https://canada-ca.github.io/ore-ero/code.json")
    data = json.loads(codeDb.read())
    codeData = []
    if data is not None:
        for level in data.values():   
            for admin in level.values():
                for release in admin["releases"]:
                    if (datetime.strptime(release["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()): 
                            codeData.append((release["contact"]["email"], release["name"]["en"],
                            release["name"]["fr"], release["date"]["metadataLastUpdated"]))
    return codeData
        

def checkDesignEmails():
    designDb = urllib.request.urlopen("https://canada-ca.github.io/ore-ero/design.json")
    data = json.loads(designDb.read())
    designData = []
    if data is not None:
        for project in data.values():
            for administration in project["administrations"]:
                for use in administration["uses"]: 
                    if (datetime.strptime(use["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()): 
                            designData.append((use["contact"]["email"], project["name"]["en"],
                            project["name"]["fr"], use["date"]["metadataLastUpdated"]))
    return designData

def checkSoftwareEmails():
    softwareDb = urllib.request.urlopen("https://canada-ca.github.io/ore-ero/software.json")
    data = json.loads(softwareDb.read())
    softwareData = []
    if data is not None:
        for project in data.values():
            for administration in project["administrations"]:
                for use in administration["uses"]: 
                    if (datetime.strptime(use["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()): 
                            softwareData.append((use["contact"]["email"], project["name"]["en"],
                            project["name"]["fr"], use["date"]["metadataLastUpdated"]))
    return softwareData

def checkStandardEmails():
    standardDb = urllib.request.urlopen("https://canada-ca.github.io/ore-ero/standard.json")
    data = json.loads(standardDb.read())
    standardData = []
    if data is not None:
        for project in data.values(): 
            for administration in project["administrations"]:
                if (datetime.strptime(administration["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                + timedelta(days=maxDaysNoUpdate) < date.today()): 
                        standardData.append((administration["contact"]["email"], project["standardAcronym"],
                        project["standardAcronym"], administration["date"]["metadataLastUpdated"]))
    return standardData

def checkPartnershipEmails():
    partnershipDb = urllib.request.urlopen("https://canada-ca.github.io/ore-ero/partnership.json")
    data = json.loads(partnershipDb.read())
    partnershipData = []
    if data is not None:
        for level in data.values():   
            for admin in level.values():
                for project in admin["projects"]:
                    if (datetime.strptime(project["date"]["metadataLastUpdated"], '%Y-%m-%d').date()
                    + timedelta(days=maxDaysNoUpdate) < date.today()): 
                            partnershipData.append((project["contact"]["email"], project["name"]["en"],
                            project["name"]["fr"], project["date"]["metadataLastUpdated"]))
    return partnershipData

def checkOutdatedEmails():
    print("Started task at: " + datetime.now().isoformat(' ', 'seconds'))
    sendEmails(checkCodeEmails() + checkDesignEmails() + checkSoftwareEmails()
            + checkStandardEmails() + checkPartnershipEmails())
    print("Finished task at: " + datetime.now().isoformat(' ', 'seconds'))

#Implementation
##schedule.every(weeksToExec).weeks.at(execTime).do(checkOutdatedEmails)
##schedule.every(daysToExec).days.at(execTime).do(checkOutdatedEmails) 
#For testing
schedule.every().day.at(execTime).do(checkOutdatedEmails)

while True:
    schedule.run_pending()
    time.sleep(1)