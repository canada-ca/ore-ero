#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import io, json, os, re, schedule, time
import urllib.request
import requests
from datetime import date, timedelta, datetime
from zipfile import ZipFile
################################################################################
###From ore-ero folder, run with ./assets/py/dependenciesParser.py           ###
################################################################################
execTime = "10:28"

def parsePackageLock(name, depObj):
    packagelock = urllib.request.urlopen(name)
    data = json.loads(packagelock.read())

def parsePackage(name, depObj):
    package = urllib.request.urlopen(name)
    data = json.loads(package.read())

def parseRequirements(name, depObj):
    requirements = urllib.request.urlopen(name)
    data = requirements.read()
    print(data)

def parseComposer(name, depObj):
    composer = urllib.request.urlopen(name)
    data = json.loads(composer.read())

def parseGemfile(name, depObj):
    gemfile = urllib.request.urlopen(name)
    data = gemfile.read()

def makePath(repo, name):
    divName = name.split("/")
    divName.pop(0)
    path = repo
    for part in divName:
        path += "/" + part
    return path    

def defaultBranch(url):
    framagit = ""
    if "framagit" in url:
        framagit = "/-"
    download = "/archive/"
    if "bitbucket" in url:
        download = "/get/"
    response = requests.get(url + framagit + "/branches")
    regex = re.compile(r'branch-name(.*)>(.*)<')
    result = regex.search(response.text)
    if result is not None:
        return framagit + download +  result.group().split(">")[1].split("<")[0] + ".zip"
    return ""
    
def getDependencies(repos):
    dependenciesObject = []
    for repo in repos:
        release = {
            "name": {
                "en": repo[1],
                "fr": repo[2]
            },
            "dependencies": []
        }
        path = defaultBranch(repo[0])
        print(repo[0] + path)
        response = requests.get(repo[0] + path)
        if response is not None:
            try:
                with ZipFile(io.BytesIO(response.content)) as zip:
                    for name in zip.namelist():
                        path = makePath(repo[0], name)
                        if ("package-lock.json" in name):
                           parsePackageLock(path, release["dependencies"])
                        if ("package.json" in name):
                            parsePackage(path, release["dependencies"])
                        if ("composer.json" in name):
                            parseComposer(path, release["dependencies"])
                        if ("Gemfile" in name):
                            parseGemfile(path, release["dependencies"])
                        if ("requirements.txt" in name):
                            parseRequirements(path, release["dependencies"])
            except Exception as err:
                print("{0} for ".format(err) + repo[0])
        dependenciesObject.append(release)

def getRepositories():
    print("Started task at: " + datetime.now().isoformat(' ', 'seconds'))
    codeDb = urllib.request.urlopen("https://code.open.canada.ca/code.json")
    data = json.loads(codeDb.read())
    repositories = []
    if data is not None:
        for level in data.values():   
            for admin in level.values():
                for release in admin["releases"]:
                    repositories.append((release["repositoryURL"]["en"], release["name"]["en"], 
                    release["name"]["fr"]))
    getDependencies(repositories)
    print("Finished task at: " + datetime.now().isoformat(' ', 'seconds'))
    



schedule.every().day.at(execTime).do(getRepositories)

while True:
    schedule.run_pending()
    time.sleep(1)