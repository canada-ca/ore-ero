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

dependencies = {}

def updateData():
    with open("./_data/dependencies.yaml", 'w') as file:
        file.write("---")
        for item in sorted(dependencies):
            value = dependencies[item]
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

def parsePackageLock(filepath, repo):
    packagelock = urllib.request.urlopen(filepath)
    data = json.loads(packagelock.read())
    if data.get("dependencies") is not None:
        for key in data["dependencies"].keys():
            addDependency(repo, key, "npm", "core")

    if data.get("devDependencies") is not None:
        for key in data["devDependencies"].keys():
            addDependency(repo, key, "npm", "dev")

    if data.get("peerDependencies") is not None:
        for key in data["peerDependencies"].keys():
            addDependency(repo, key, "npm", "peer")

def parsePackage(filepath, repo):
    package = urllib.request.urlopen(filepath)
    data = json.loads(package.read())
    if data.get("dependencies") is not None:
        for key in data["dependencies"].keys():
            addDependency(repo, key, "npm", "core")

    if data.get("devDependencies") is not None:
        for key in data["devDependencies"].keys():
            addDependency(repo, key, "npm", "dev")

    if data.get("peerDependencies") is not None:
        for key in data["peerDependencies"].keys():
            addDependency(repo, key, "npm", "peer")

def parseRequirements(filepath, repo):
    requirements = requests.get(filepath)
    data = requirements.text
    if data is not None:
        for dep in data.splitlines():
            if dep.startswith( "#" ):
              continue
            if dep.startswith( "-e " ):
              dep = dep[3:]
            key = dep.split("=")[0].split("<")[0].split(">")[0]
            addDependency(repo, key, "pypi", "core")

def parseComposer(filepath, repo):
    composer = urllib.request.urlopen(filepath)
    data = json.loads(composer.read())
    if data.get("require") is not None:
        for key in data["require"].keys():
            addDependency(repo, key, "composer", "core")

    if data.get("require-dev") is not None:
        for key in data["require-dev"].keys():
            addDependency(repo, key, "composer", "dev")

def parseGemfile(filepath, repo):
    gemfile = requests.get(filepath)
    data = gemfile.text
    if data is not None:
        for dep in data.splitlines():
            if (dep.startswith("gem")):
                key = dep.split("'")[1]
                addDependency(repo, key, "bundler", "core")

def addDependency(repo, dependency, origin, deptype):
  key = f'{dependency}~{origin}~{deptype}'
  if key in dependencies:
      if repo[3] not in dependencies[key]["admin"]:                
          dependencies[key]["admin"].append(repo[3])
      if {"en": repo[1], "fr": repo[2]} not in dependencies[key]["project"]:
          dependencies[key]["project"].append({"en": repo[1], "fr": repo[2]})
  else:
      dependencies[key] = {
          "dependency": dependency,
          "origin": origin,
          "type": deptype,
          "admin": [repo[3]],
          "project": [{"en": repo[1], "fr": repo[2]}]
      }        

def makePath(repo, filepath, branch):
    divName = filepath.split("/")
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
    for repo in repos:
        path = defaultBranch(repo[0])
        response = requests.get(repo[0] + path[0])
        if response is not None:
            try:
                with ZipFile(io.BytesIO(response.content)) as zip:
                    for filepath in zip.namelist():
                        filepath = makePath(repo[0], filepath, path[1])
                        if ("/package-lock.json" in filepath):
                           parsePackageLock(filepath, repo)
                        if ("/package.json" in filepath):
                            parsePackage(filepath, repo)
                        if ("/composer.json" in filepath):
                            parseComposer(filepath, repo)
                        if ("/Gemfile" in filepath):
                            parseGemfile(filepath, repo)
                        if ("/requirements.txt" in filepath):
                            parseRequirements(filepath, repo)
            except Exception as err:
                print("{0} for ".format(err) + repo[0])
    updateData()

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
