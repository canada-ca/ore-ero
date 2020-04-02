#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import io, json, os, re, schedule, time, yaml
import urllib.request
import requests
from datetime import date, timedelta, datetime
from zipfile import ZipFile
################################################################################
###From ore-ero folder, run with ./assets/py/dependenciesParser.py           ###
################################################################################
execTime = "15:34"

def createDirectory(dir, path):
    dirExists = dir in os.listdir(path)
    if not dirExists:
        os.mkdir(path + "/" + dir)

def updateData(dependencies):
    createDirectory("dependencies", "./_data")
    for level, admins in dependencies.items():
        createDirectory(level, "./_data/dependencies")
        for admin, releases in admins.items():
            with open("./_data/dependencies" + "/" + level + "/" + admin + ".yaml", 'w') as file:
                yaml.dump(releases, file)

    

def parsePackageLock(name, depObj):
    packagelock = urllib.request.urlopen(name)
    data = json.loads(packagelock.read())
    if data.get("dependencies") is not None:
        if depObj["core"].get("npm") is None:
            depObj["core"]["npm"] = []
        for key in data["dependencies"].keys(): 
            depObj["core"]["npm"].append(key)
    if data.get("devDependencies") is not None:
        if depObj["dev"].get("npm") is None:
            depObj["dev"]["npm"] = []
        for key in data["devDependencies"].keys(): 
            depObj["dev"]["npm"].append(key)
    if data.get("peerDependencies") is not None:
        if depObj["peer"].get("npm") is None:
            depObj["peer"]["npm"] = []
        for key in data["peerDependencies"].keys(): 
            depObj["peer"]["npm"].append(key)

def parsePackage(name, depObj):
    package = urllib.request.urlopen(name)
    data = json.loads(package.read())
    if data.get("dependencies") is not None:
        if depObj["core"].get("npm") is None:
            depObj["core"]["npm"] = []
        for key in data["dependencies"].keys(): 
            depObj["core"]["npm"].append(key)
    if data.get("devDependencies") is not None:
        if depObj["dev"].get("npm") is None:
            depObj["dev"]["npm"] = []
        for key in data["devDependencies"].keys(): 
            depObj["dev"]["npm"].append(key)
    if data.get("peerDependencies") is not None:
        if depObj["peer"].get("npm") is None:
            depObj["peer"]["npm"] = []
        for key in data["peerDependencies"].keys(): 
            depObj["peer"]["npm"].append(key)

def parseRequirements(name, depObj):
    requirements = requests.get(name)
    data = requirements.text
    if data is not None:
        if depObj["core"].get("pypi") is None:
                depObj["core"]["pypi"] = []
        for dep in data.splitlines():
            depObj["core"]["pypi"].append(dep.split("=")[0].split("<")[0].split(">")[0])
            
def parseComposer(name, depObj):
    composer = urllib.request.urlopen(name)
    data = json.loads(composer.read())
    if data.get("require") is not None:
        if depObj["core"].get("composer") is None:
            depObj["core"]["composer"] = []
        for key in data["require"].keys(): 
            depObj["core"]["composer"].append(key)
    if data.get("require-dev") is not None:
        if depObj["dev"].get("composer") is None:
            depObj["dev"]["composer"] = []
        for key in data["require-dev"].keys(): 
            depObj["dev"]["composer"].append(key)

def parseGemfile(name, depObj):
    gemfile = requests.get(name)
    data = gemfile.text
    if data is not None:
        if depObj["core"].get("bundler") is None:
                depObj["core"]["bundler"] = []
        for dep in data.splitlines():
            if (dep.startswith("gem")):
                depObj["core"]["bundler"].append(dep.split("'")[1])
            
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
    
    download = "/archive/"
    if "bitbucket" in url:
        download = "/get/"
        ex = r'css-1waz8j8(.*)>(.*)<'
        
    response = requests.get(url + framagit + "/branches")    
    regex = re.compile(ex)
    result = regex.search(response.text)
    if result is not None:
        branch = result.group().split(">")[-1].split("<")[0]
        return framagit + download + branch + ".zip", branch
    return "", ""
    
def getDependencies(repos):
    dependenciesObject = {
        "aboriginal": {},
        "federal": {},
        "municipal": {},
        "others": {},
        "provincial": {}
    }
    for repo in repos:
        release = {
            "name": {
                "en": repo[1],
                "fr": repo[2]
            },
            "dependencies": {
                "core": {},
                "dev": {},
                "peer": {}
            }
        }
        path = defaultBranch(repo[0])
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
        if dependenciesObject[repo[4]].get(repo[3]) is None:
            dependenciesObject[repo[4]][repo[3]] = []
        dependenciesObject[repo[4]][repo[3]].append(release)
    updateData(dependenciesObject)

def getRepositories():
    print("Started task at: " + datetime.now().isoformat(' ', 'seconds'))
    codeDb = urllib.request.urlopen("https://code.open.canada.ca/code.json")
    data = json.loads(codeDb.read())
    repositories = []
    if data is not None:
        for level, admins in data.items():   
            for admin in admins.values():
                for release in admin["releases"]:
                    repositories.append((release["repositoryURL"]["en"], release["name"]["en"], 
                    release["name"]["fr"], admin["adminCode"], level))
    getDependencies(repositories)
    print("Finished task at: " + datetime.now().isoformat(' ', 'seconds'))
    



schedule.every().day.at(execTime).do(getRepositories)

while True:
    schedule.run_pending()
    time.sleep(1)