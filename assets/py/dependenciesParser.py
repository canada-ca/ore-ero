#!/usr/bin/env python3
# This Python file uses the following encoding: utf-8
import io, json, os, re, schedule, time, yaml
import urllib.request
import requests
from datetime import datetime
from zipfile import ZipFile
################################################################################
###From ore-ero folder, run with ./assets/py/dependenciesParser.py           ###
################################################################################
execTime = "00:00"

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
    createDirectory("dependencies", "./_data")
    for level, admins in dependencies.items():
        createDirectory(level, "./_data/dependencies")
        for admin in admins:
            with open("./_data/dependencies" + "/" + level + "/" + admin["adminCode"] + ".yaml", 'w') as file:
                file.write("---\n")
                if admin["adminCode"] == "on":
                    file.write("adminCode: '" + admin["adminCode"] + "'\n")
                else:
                    file.write("adminCode: " + admin["adminCode"] + "\n")
                file.write("releases: ")
                for release in admin["releases"]:
                    file.write("\n" + indent(1) + "- name: ")
                    file.write("\n" + indent(3) + "en: " + release["name"]["en"])
                    file.write("\n" + indent(3) + "fr: " + release["name"]["fr"])
                    file.write("\n" + indent(2) + "dependencySet: ")
                    if release["dependencySet"] == []:
                        file.write("[]")
                    else: 
                        for dependencySet in release["dependencySet"]:
                            file.write("\n" + indent(3) + "- origin: " + dependencySet["origin"])
                            file.write("\n" + indent(4) + "type: " + dependencySet["type"])
                            file.write("\n" + indent(4) + "dependencies: ")
                            if dependencySet["dependencies"] == []:
                                file.write("[]")
                            else: 
                                for dependency in dependencySet["dependencies"]:
                                    if '@' in dependency:
                                        file.write("\n" + indent(5) + "- '" + dependency + "'")
                                    else: file.write("\n" + indent(5) + "- " + dependency)
                file.write("\n")

def parsePackageLock(name, depObj):
    packagelock = urllib.request.urlopen(name)
    data = json.loads(packagelock.read())
    if data.get("dependencies") is not None:
        coreNpm = False
        for val in depObj:
            if (val.get("origin") == "npm" and val.get("type") == "core"):
                coreNpm = True                
                for key in data["dependencies"].keys(): 
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not coreNpm:
            coreDeps = {
                "origin": "npm",
                "type": "core",
                "dependencies": []
            }        
            for key in data["dependencies"].keys(): 
                coreDeps["dependencies"].append(key)
            depObj.append(coreDeps)
    if data.get("devDependencies") is not None:
        devNpm = False
        for val in depObj:
            if (val.get("origin") == "npm" and val.get("type") == "dev"):
                devNpm = True                
                for key in data["devDependencies"].keys():
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not devNpm:
            devDeps = {
                "origin": "npm",
                "type": "dev",
                "dependencies": []
            }
            for key in data["devDependencies"].keys(): 
                devDeps["dependencies"].append(key)
            depObj.append(devDeps)
    if data.get("peerDependencies") is not None:
        peerNpm = False
        for val in depObj:
            if (val.get("origin") == "npm" and val.get("type") == "peer"):
                peerNpm = True                
                for key in data["peerDependencies"].keys():
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not peerNpm:
            peerDeps = {
                "origin": "npm",
                "type": "peer",
                "dependencies": []
            }
            for key in data["peerDependencies"].keys(): 
                peerDeps["dependencies"].append(key)
            depObj.append(peerDeps)

def parsePackage(name, depObj):
    package = urllib.request.urlopen(name)
    data = json.loads(package.read())
    if data.get("dependencies") is not None:
        coreNpm = False
        for val in depObj:
            if (val.get("origin") == "npm" and val.get("type") == "core"):
                coreNpm = True                
                for key in data["dependencies"].keys():
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not coreNpm:
            coreDeps = {
                "origin": "npm",
                "type": "core",
                "dependencies": []
            }        
            for key in data["dependencies"].keys(): 
                coreDeps["dependencies"].append(key)
            depObj.append(coreDeps)
       
    if data.get("devDependencies") is not None:
        devNpm = False
        for val in depObj:
            if (val.get("origin") == "npm" and val.get("type") == "dev"):
                devNpm = True                
                for key in data["devDependencies"].keys():
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not devNpm:
            devDeps = {
                "origin": "npm",
                "type": "dev",
                "dependencies": []
            }
            for key in data["devDependencies"].keys(): 
                devDeps["dependencies"].append(key)
            depObj.append(devDeps)
    if data.get("peerDependencies") is not None:
        peerNpm = False
        for val in depObj:
            if (val.get("origin") == "npm" and val.get("type") == "peer"):
                peerNpm = True                
                for key in data["peerDependencies"].keys(): 
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not peerNpm:
            peerDeps = {
                "origin": "npm",
                "type": "peer",
                "dependencies": []
            }
            for key in data["peerDependencies"].keys(): 
                peerDeps["dependencies"].append(key)
            depObj.append(peerDeps)

def parseRequirements(name, depObj):
    requirements = requests.get(name)
    data = requirements.text
    if data is not None:
        corepypi = False
        for val in depObj:
            if (val.get("origin") == "pypi" and val.get("type") == "core"):
                corepypi = True                
                for dep in data.splitlines():
                    key = dep.split("=")[0].split("<")[0].split(">")[0]
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not corepypi:
            coreDeps = {
                "origin": "pypi",
                "type": "core",
                "dependencies": []
            }        
            for dep in data.splitlines():
                coreDeps["dependencies"].append(dep.split("=")[0].split("<")[0].split(">")[0])
            depObj.append(coreDeps)
       
            
def parseComposer(name, depObj):
    composer = urllib.request.urlopen(name)
    data = json.loads(composer.read())
    if data.get("require") is not None:
        corecomposer = False
        for val in depObj:
            if (val.get("origin") == "composer" and val.get("type") == "core"):
                corecomposer = True                 
                for key in data["require"].keys():
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not corecomposer:
            coreDeps = {
                "origin": "composer",
                "type": "core",
                "dependencies": []
            }        
            for key in data["require"].keys(): 
               coreDeps["dependencies"].append(key)
            depObj.append(coreDeps)
    if data.get("require-dev") is not None:
        devcomposer = False
        for val in depObj:
            if (val.get("origin") == "composer" and val.get("type") == "dev"):
                devcomposer = True                 
                for key in data["require-dev"].keys():
                    if key not in val["dependencies"]:
                        val["dependencies"].append(key)
                break
        if not devcomposer:
            devDeps = {
                "origin": "composer",
                "type": "dev",
                "dependencies": []
            }        
            for key in data["require-dev"].keys(): 
               devDeps["dependencies"].append(key)
            depObj.append(devDeps)

def parseGemfile(name, depObj):
    gemfile = requests.get(name)
    data = gemfile.text
    if data is not None:
        corebundler = False
        for val in depObj:
            if (val.get("origin") == "bundler" and val.get("type") == "core"):
                corebundler = True                 
                for dep in data.splitlines():
                    if (dep.startswith("gem")):
                        key = dep.split("'")[1]
                        if key not in val["dependencies"]:
                            val["dependencies"].append(key)
                break
        if not corebundler:
            coreDeps = {
                "origin": "bundler",
                "type": "core",
                "dependencies": []
            }        
            for dep in data.splitlines():
                if (dep.startswith("gem")):
                    coreDeps["dependencies"].append(dep.split("'")[1])
            depObj.append(coreDeps)
            
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
    dependenciesObject = {
        "aboriginal": [],
        "federal": [],
        "municipal": [],
        "others": [],
        "provincial": []
    }
    for repo in repos:
        release = {
            "name": {
                "en": repo[1],
                "fr": repo[2]
            },
            "dependencySet": [

            ]
        }
        path = defaultBranch(repo[0])
        response = requests.get(repo[0] + path[0])
        if response is not None:
            try:
                with ZipFile(io.BytesIO(response.content)) as zip:
                    for name in zip.namelist():
                        filepath = makePath(repo[0], name, path[1])
                        if ("/package-lock.json" in name):
                           parsePackageLock(filepath, release["dependencySet"])
                        if ("/package.json" in name):
                            parsePackage(filepath, release["dependencySet"])
                        if ("/composer.json" in name):
                            parseComposer(filepath, release["dependencySet"])
                        if ("/Gemfile" in name):
                            parseGemfile(filepath, release["dependencySet"])
                        if ("/requirements.txt" in name):
                            parseRequirements(filepath, release["dependencySet"])
            except Exception as err:
                print("{0} for ".format(err) + repo[0])
        adminSet = False
        for val in dependenciesObject[repo[4]]:
            if val.get("adminCode") == repo[3]:
                val["releases"].append(release)
                adminSet = True
                break
        if not adminSet:
            admin = {
                "adminCode": repo[3],
                "releases": [

                ] 
            }
            admin["releases"].append(release)
            dependenciesObject[repo[4]].append(admin)
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