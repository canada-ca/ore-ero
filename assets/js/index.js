// Put code in here.
// Embed this at the bottom of the body.

$("#prbotSubmit").click(function() {
  console.log("prbot to the rescue!");
  let content =
    "" +
    `  -
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
  console.log(content);
  let fileWriter = new FileWriter(USERNAME, REPO_NAME);
  fileWriter.append(
    "_data/code/municipal/" + $("#adminCode").val() + ".yml",
    content
  ).then(result => {
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
            path: "_data/code/municipal/" + $("#adminCode").val() + ".yml",
            content: result
          }
        ]
      }),
      method: "POST"
    };
    const url = "https://canada-pr-bot.herokuapp.com/";
    return fetch(url, config);
  });
});
