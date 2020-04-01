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
execTime = "09:19"

def parsePackageLock(name, depObj):
    packagelock = urllib.request.urlopen(name)
    data = json.loads(packagelock.read())
    print(data)
    
def parsePackage(name, depObj):
    package = urllib.request.urlopen(name)
    data = json.loads(package.read())
    print(data)

def parseRequirements(name, depObj):
    requirements = urllib.request.urlopen(name)
    data = requirements.read()
    print(data)

def parseComposer(name, depObj):
    composer = urllib.request.urlopen(name)
    data = json.loads(composer.read())
    print(data)

def parseGemfile(name, depObj):
    gemfile = urllib.request.urlopen(name)
    data = gemfile.read()
    print(data)

def makePath(repo, name, branch):
    divName = name.split("/")
    divName.pop(0)
    path = repo.replace("github.com", "raw.githubusercontent.com") + "/" + branch
    for part in divName:
        path += "/" + part
    return path  

def defaultBranch(url):
    ex = r'branch-name(.*)>(.*)<'
    framagit = ""
    if "framagit" in url:
        framagit = "/-"
        ex = r'(.*)qa-branch-name(.*)>(.*)<'
    
    response = requests.get(url + framagit + "/branches")
    download = "/archive/"
    if "bitbucket" in url:
        download = "/get/"
        ex = r'css-1waz8j8(.*)>(.*)<'
    
    regex = re.compile(ex)
    result = regex.search(response.text)
    if result is not None:
        branch = result.group().split(">")[-1].split("<")[0]
        return [framagit + download + branch + ".zip", branch]
    return "", ""
    
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
        print(repo[0] + path[0])
        response = requests.get(repo[0] + path[0])
        if response is not None:
            try:
                with ZipFile(io.BytesIO(response.content)) as zip:
                    for name in zip.namelist():
                        filepath = makePath(repo[0], name, path[1])
                        if ("package-lock.json" in name):
                           parsePackageLock(filepath, release["dependencies"])
                        if ("package.json" in name):
                            parsePackage(filepath, release["dependencies"])
                        if ("composer.json" in name):
                            parseComposer(filepath, release["dependencies"])
                        if ("Gemfile" in name):
                            parseGemfile(filepath, release["dependencies"])
                        if ("requirements.txt" in name):
                            parseRequirements(filepath, release["dependencies"])
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