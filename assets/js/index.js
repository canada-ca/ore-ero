// Put code in here.
// Embed this at the bottom of the body.

function getSelectedOrgType() {
  return $("#adminCode :selected").parent().attr('label').toLowerCase();
}

$("#prbotSubmit").click(function () {
  let content =
    "" +
    `releases:
  -
    contact: 
      URL: 
        en: ${$("#enUrlContact").val()}
        fr: ${$("#frUrlContact").val()}
    date: 
      created: ${$("#dateCreated").val()}
      metadataLastUpdated: ${$("#dateLastUpdated").val()}
    description: 
      en: ${$("#enDescription").val()}
      fr: ${$("#frDescription").val()}
    name: 
      en: ${$("#enProjectName").val()}
      fr: ${$("#frProjectName").val()}
    licenses: 
      - 
        URL: 
          en: ${$("#enUrlLicense").val()}
          fr: ${$("#frUrlLicense").val()}
          spdxID: ${$("#spdxID").val()}
    repositoryURL: 
      en: ${$("#enRepoUrl").val()}
      fr: ${$("#frRepoUrl").val()}
    status: ${$("#status :selected").text()}
    tags: 
      en: 
${[...document.querySelectorAll("#tagsEN input")]
      .map(child => child.value)
      .map(tag => '        - "' + tag + '"')
      .join("\n")}
      fr: 
${[...document.querySelectorAll("#tagsFR input")]
      .map(child => child.value)
      .map(tag => '        - "' + tag + '"')
      .join("\n")}
    vcs: ${$("#vcs").val()}
`;
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$("#adminCode").val()}.yml`;
  fileWriter.merge(file, content, "releases", "name.en").then(result => {
    const config = {
      body: JSON.stringify({
        user: "j-rewerts",
        repo: "ore-ero",
        title: "New project for " + $("#adminCode :selected").text(),
        description:
          "Authored by: " +
          $("#emailContact").val() +
          "\n" +
          "Project: ***" +
          $("#enProjectName").val() +
          "***\n" +
          $("#enDescription").val() +
          "\n",
        commit: "Committed by " + $("#emailContact").val(),
        files: [
          {
            path: file,
            content: YAML.stringify(result, { keepBlobsInJSON: false })
          }
        ]
      }),
      method: "POST"
    };
    const url = "https://canada-pr-bot.herokuapp.com/";
    return fetch(url, config);
  });
});
