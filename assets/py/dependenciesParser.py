#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import io, json, os, re, time, yaml
import urllib.request
import requests
from datetime import datetime
from zipfile import ZipFile
################################################################################
###From ore-ero folder, run with ./assets/py/dependenciesParser.py           ###
################################################################################

def indent(level):
    i = 0
    indent = "  "
    result = ""
    while i < level: 
        result += indent
        i += 1
    return result

def createDirectory(dir, path):
    dirExists = dir in os.listdir(path)
    if not dirExists:
        os.mkdir(path + "/" + dir)

def updateData(dependencies):
    with open("./_data/dependencies.yaml", 'w') as file:
        file.write("---")
        dependencies.sort(key=lambda item: item.get("dependency"), reverse=False)
        for value in dependencies:
            if '@' in value["dependency"]:
                file.write("\n" + "- dependency: '" + value["dependency"] + "'")
            else: 
                file.write("\n" + "- dependency: " + value["dependency"])
            
            file.write("\n" + indent(1) + "origin: " + value["origin"])
            file.write("\n" + indent(1) + "type: " + value["type"])
            file.write("\n" + indent(1) + "admins: ")
            if value["admin"] == []:
                file.write("[]")
            else: 
                for admin in sorted(value["admin"]):
                    if admin == "on":
                        file.write("\n" + indent(2) + "- '" + admin + "'")
                    else:
                        file.write("\n" + indent(2) + "- " + admin)
            file.write("\n" + indent(1) + "projects: ")
            if value["project"] == []:
                file.write("[]")
            else: 
                projects = value["project"]
                projects.sort(key=lambda x: x['en'].lower(), reverse=False)
                for project in projects:
                    file.write("\n" + indent(2) + "- projectName: ")
                    file.write("\n" + indent(4) + "en: " + project["en"])
                    file.write("\n" + indent(4) + "fr: " + project["fr"])
        file.write("\n")

def parsePackageLock(name, depObj, repo):
    packagelock = urllib.request.urlopen(name)
    data = json.loads(packagelock.read())
    if data.get("dependencies") is not None:
        for key in data["dependencies"].keys():
            coreNpm = False
            for val in depObj:
                if (val.get("origin") == "npm" and val.get("type") == "core"):                
                    if key == val.get("dependency"):
                        coreNpm = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not coreNpm:
                coreDep = {
                    "origin": "npm",
                    "type": "core",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(coreDep)
    if data.get("devDependencies") is not None:
        for key in data["devDependencies"].keys():
            devNpm = False
            for val in depObj:
                if (val.get("origin") == "npm" and val.get("type") == "dev"):                
                    if key == val.get("dependency"):
                        devNpm = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not devNpm:
                devDep = {
                    "origin": "npm",
                    "type": "dev",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(devDep)
    if data.get("peerDependencies") is not None:
        for key in data["peerDependencies"].keys():
            peerNpm = False
            for val in depObj:
                if (val.get("origin") == "npm" and val.get("type") == "peer"):                
                    if key == val.get("dependency"):
                        peerNpm = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not peerNpm:
                peerDep = {
                    "origin": "npm",
                    "type": "peer",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(peerDep)

def parsePackage(name, depObj, repo):
    package = urllib.request.urlopen(name)
    data = json.loads(package.read())
    if data.get("dependencies") is not None:
        for key in data["dependencies"].keys():
            coreNpm = False
            for val in depObj:
                if (val.get("origin") == "npm" and val.get("type") == "core"):                
                    if key == val.get("dependency"):
                        coreNpm = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not coreNpm:
                coreDep = {
                    "origin": "npm",
                    "type": "core",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(coreDep)
    if data.get("devDependencies") is not None:
        for key in data["devDependencies"].keys():
            devNpm = False
            for val in depObj:
                if (val.get("origin") == "npm" and val.get("type") == "dev"):                
                    if key == val.get("dependency"):
                        devNpm = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not devNpm:
                devDep = {
                    "origin": "npm",
                    "type": "dev",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(devDep)
    if data.get("peerDependencies") is not None:
        for key in data["peerDependencies"].keys():
            peerNpm = False
            for val in depObj:
                if (val.get("origin") == "npm" and val.get("type") == "peer"):                
                    if key == val.get("dependency"):
                        peerNpm = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not peerNpm:
                peerDep = {
                    "origin": "npm",
                    "type": "peer",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(peerDep)

def parseRequirements(name, depObj, repo):
    requirements = requests.get(name)
    data = requirements.text
    if data is not None:
        for dep in data.splitlines():
            if dep.startswith( "#" ):
              continue
            if dep.startswith( "-e " ):
              dep = dep[3:]
            key = dep.split("=")[0].split("<")[0].split(">")[0]
            corepypi = False
            for val in depObj:
                if (val.get("origin") == "pypi" and val.get("type") == "core"):                
                    if key == val.get("dependency"):
                        corepypi = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not corepypi:
                coreDep = {
                    "origin": "pypi",
                    "type": "core",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(coreDep)
            
def parseComposer(name, depObj, repo):
    composer = urllib.request.urlopen(name)
    data = json.loads(composer.read())
    if data.get("require") is not None:
        for key in data["require"].keys():
            corecomposer = False
            for val in depObj:
                if (val.get("origin") == "composer" and val.get("type") == "core"):                
                    if key == val.get("dependency"):
                        corecomposer = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not corecomposer:
                coreDep = {
                    "origin": "composer",
                    "type": "core",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(coreDep)
    if data.get("require-dev") is not None:
        for key in data["require-dev"].keys():
            devcomposer = False
            for val in depObj:
                if (val.get("origin") == "composer" and val.get("type") == "dev"):                
                    if key == val.get("dependency"):
                        devcomposer = True
                        if repo[3] not in val["admin"]:
                            val["admin"].append(repo[3])
                        listed = False
                        for name in val["project"]:
                            if repo[1] == name.get("en"):
                                listed = True
                        if listed == False:
                            val["project"].append({"en": repo[1], "fr": repo[2]})
            if not devcomposer:
                devDep = {
                    "origin": "composer",
                    "type": "dev",
                    "dependency": key,
                    "admin": [repo[3]],
                    "project": [{"en": repo[1], "fr": repo[2]}]
                }        
                depObj.append(devDep)

def parseGemfile(name, depObj, repo):
    gemfile = requests.get(name)
    data = gemfile.text
    if data is not None:
        for dep in data.splitlines():
            if (dep.startswith("gem")):
                key = dep.split("'")[1]
                corebundler = False
                for val in depObj:
                    if (val.get("origin") == "bundler" and val.get("type") == "core"):                
                        if key == val.get("dependency"):
                            corebundler = True
                            if repo[3] not in val["admin"]:
                                val["admin"].append(repo[3])
                            listed = False
                            for name in val["project"]:
                                if repo[1] == name.get("en"):
                                    listed = True
                            if listed == False:
                                val["project"].append({"en": repo[1], "fr": repo[2]})
                if not corebundler:
                    coreDep = {
                        "origin": "bundler",
                        "type": "core",
                        "dependency": key,
                        "admin": [repo[3]],
                        "project": [{"en": repo[1], "fr": repo[2]}]
                    }        
                    depObj.append(coreDep)
            
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
    extension = ".zip"
    if "framagit" in url:
        framagit = "/-"
        ex = r'qa-branch-name.*>.*'
    branches = "/branches"
    download = "/archive/"
    search = ""
    if "bitbucket" in url:
        download = "/get/"
        search = "/?search=default"
        ex = r'css-1waz8j8(.*)>(.*)<'
    if "eclipse" in url:
        download = "/snapshot/"
        branches = ""
        extension = ""
        search = "/commit/?head"
        ex = r"zip'>.*</a"
    response = requests.get(url + framagit + branches + search)    
    regex = re.compile(ex)
    result = regex.search(response.text)
    if result is not None:
        branch = result.group().split(">")[-1].split("<")[0]
        return framagit + download + branch + extension, branch
    return "", ""
    
def getDependencies(repos):
    dependenciesObject = []
    for repo in repos:
        path = defaultBranch(repo[0])
        response = requests.get(repo[0] + path[0])
        if response is not None:
            try:
                with ZipFile(io.BytesIO(response.content)) as zip:
                    for name in zip.namelist():
                        filepath = makePath(repo[0], name, path[1])
                        if ("/package-lock.json" in name):
                           parsePackageLock(filepath, dependenciesObject, repo)
                        if ("/package.json" in name):
                            parsePackage(filepath, dependenciesObject, repo)
                        if ("/composer.json" in name):
                            parseComposer(filepath, dependenciesObject, repo)
                        if ("/Gemfile" in name):
                            parseGemfile(filepath, dependenciesObject, repo)
                        if ("/requirements.txt" in name):
                            parseRequirements(filepath, dependenciesObject, repo)
            except Exception as err:
                print("{0} for ".format(err) + repo[0])
    updateData(dependenciesObject)

print("Started task at: " + datetime.now().isoformat(' ', 'seconds'))
codeDb = urllib.request.urlopen("https://code.open.canada.ca/code.json")
data = json.loads(codeDb.read())
repositories = []
if data is not None:
    for level, admins in data.items():   
        for admin in admins.values():
            for release in admin["releases"]:
                repositories.append((release["repositoryURL"]["en"], release["name"]["en"], 
                release["name"]["fr"], admin["adminCode"]))
getDependencies(repositories)
print("Finished task at: " + datetime.now().isoformat(' ', 'seconds'))
