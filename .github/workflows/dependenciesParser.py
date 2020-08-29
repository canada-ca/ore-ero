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
                value["dependency"] = f'\'{value["dependency"]}\''
            
            file.write(f'\n- dependency: {value["dependency"]}')            
            file.write(f'\n{indent(1)}origin: {value["origin"]}')
            file.write(f'\n{indent(1)}type: {value["type"]}')
            file.write(f'\n{indent(1)}admins:')
            if value["admin"] == []:
                file.write(" []")
            else: 
                for admin in sorted(value["admin"]):
                    if admin == "on":
                        admin = "'on'"
                    file.write(f'\n{indent(2)}- {admin}')
            file.write(f'\n{indent(1)}projects:')
            if value["project"] == []:
                file.write(" []")
            else: 
                projects = value["project"]
                projects.sort(key=lambda x: x['en'].lower(), reverse=False)
                for project in projects:
                    file.write(f'\n{indent(2)}- projectName:')
                    file.write(f'\n{indent(4)}en: {project["en"]}')
                    file.write(f'\n{indent(4)}fr: {project["fr"]}')
        file.write("\n")

def parsePackageLock(packagelock, repo):
    # Schema and handling for dependency trees is different from package.json
    # https://docs.npmjs.com/files/package-lock.json
    data = json.loads(packagelock.read())
    if data.get("dependencies") is not None:
        for key in data["dependencies"]:
            if "dev" in data["dependencies"][key] and data["dependencies"][key]["dev"]:
                addDependency(repo, key, "npm", "dev")
            else:
                addDependency(repo, key, "npm", "core")

def parsePackage(package, repo):
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

def parseRequirements(requirements, repo):
    data = requirements.readlines()
    if data is not None:
        for dep in data:
            dep = dep.decode()
            dep = dep.strip()
            if dep == '':
              continue
            if dep.startswith( "#" ):
              continue
            if dep.startswith( "-e " ):
              dep = dep[3:]
            key = dep.split("=")[0].split("<")[0].split(">")[0]
            addDependency(repo, key, "pypi", "core")

def parseComposer(composer, repo):
    data = json.loads(composer.read())
    if data.get("require") is not None:
        for key in data["require"].keys():
            addDependency(repo, key, "composer", "core")

    if data.get("require-dev") is not None:
        for key in data["require-dev"].keys():
            addDependency(repo, key, "composer", "dev")

def parseGemfile(gemfile, repo):
    data = gemfile.readlines()
    if data is not None:
        for dep in data:
            dep = dep.decode()
            if (dep.startswith("gem")):
                key = dep.split("'")[1]
                addDependency(repo, key, "bundler", "core")

def addDependency(repo, dependency, origin, deptype):
  dependency = dependency.lower()
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
                with ZipFile(io.BytesIO(response.content), mode='r') as zip:
                    for filepath in zip.namelist():
                        if ("/package-lock.json" in filepath):
                            with zip.open(filepath, mode='r') as depfile:
                                parsePackageLock(depfile, repo)
                        if ("/package.json" in filepath):
                            with zip.open(filepath, mode='r') as depfile:
                                parsePackage(depfile, repo)
                        if ("/composer.json" in filepath):
                            with zip.open(filepath, mode='r') as depfile:
                                parseComposer(depfile, repo)
                        if ("/Gemfile" in filepath):
                            with zip.open(filepath, mode='r') as depfile:
                                parseGemfile(depfile, repo)
                        if ("/requirements.txt" in filepath):
                            with zip.open(filepath, mode='r') as depfile:
                                parseRequirements(depfile, repo)
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
