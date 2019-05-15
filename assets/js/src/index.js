// Put code in here.
// Embed this at the bottom of the body.
/* global $ YamlWriter USERNAME REPO_NAME YAML PRBOT_URL */

function getSelectedOrgType() {
  return $('#adminCode :selected')
    .parent()
    .attr('label')
    .toLowerCase();
}

/**
 * Validates the required fields in the codeForm
 * @returns {Boolean} true/false if the form is valid/invalid
 */
function validateRequired() {
  let form = document.getElementById('validation')
  let elements = form.elements
  let validator = $('#validation').validate()
  let isValid = true
  for (let i = 0; i < elements.length; i++) {
    let currentElement = elements[i]
    if (currentElement.required) {
      if (!validator.element('#' + currentElement.id)) {
        isValid = false
      }
    }
  }
  if (!isValid) {
    window.scrollTo(0, 0)
  }
  return isValid
}

const ALERT_IN_PROGRESS = 0;
const ALERT_FAIL = 1;
const ALERT_OFF = 2;

function toggleAlert(option) {
  let alertInProgress = document.getElementById('prbotSubmitAlertInProgress')
  let alertFail = document.getElementById('prbotSubmitAlertFail')
  if (option == ALERT_IN_PROGRESS) {
    alertInProgress.style.display = 'block'
  } else if (option == ALERT_FAIL) {
    alertFail.style.display = 'block'
  } else if (option == ALERT_OFF) {
    alertInProgress.style.display = 'none'
    alertFail.style.display = 'none'
  } else {
    console.log("Invalid option")
  }
}

$('#prbotSubmit').click(function() {
  if (validateRequired()) {
    console.log("Form input is good")
    toggleAlert(ALERT_IN_PROGRESS)
  } else {
    console.log("Bad form input")
  }
  let content =
    '' +
    `releases:
  -
    contact: 
      URL: 
        en: ${$('#enUrlContact').val()}
        fr: ${$('#frUrlContact').val()}
    date: 
      created: ${$('#dateCreated').val()}
      metadataLastUpdated: ${$('#dateLastUpdated').val()}
    description: 
      en: ${$('#enDescription').val()}
      fr: ${$('#frDescription').val()}
    name: 
      en: ${$('#enProjectName').val()}
      fr: ${$('#frProjectName').val()}
    licenses: 
      - 
        URL: 
          en: ${$('#enUrlLicense').val()}
          fr: ${$('#frUrlLicense').val()}
          spdxID: ${$('#spdxID').val()}
    repositoryURL: 
      en: ${$('#enRepoUrl').val()}
      fr: ${$('#frRepoUrl').val()}
    status: ${$('#status :selected').text()}
    tags: 
      en: 
${[...document.querySelectorAll('#tagsEN input')]
  .map(child => child.value)
  .map(tag => '        - "' + tag + '"')
  .join('\n')}
      fr: 
${[...document.querySelectorAll('#tagsFR input')]
  .map(child => child.value)
  .map(tag => '        - "' + tag + '"')
  .join('\n')}
    vcs: ${$('#vcs').val()}
`;
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$('#adminCode').val()}.yml`;
  fileWriter
    .merge(file, content, 'releases', 'name.en')
    .then(result => {
      const config = {
        body: JSON.stringify({
          user: USERNAME,
          repo: REPO_NAME,
          title: 'Updated code for ' + $('#adminCode :selected').text(),
          description:
            'Authored by: ' +
            $('#emailContact').val() +
            '\n' +
            'Project: ***' +
            $('#enProjectName').val() +
            '***\n' +
            $('#enDescription').val() +
            '\n',
          commit: 'Committed by ' + $('#emailContact').val(),
          author: {
            name: $('#nameContact').val(),
            email: $('#emailContact').val()
          },
          files: [
            {
              path: file,
              content: YAML.stringify(result, { keepBlobsInJSON: false })
            }
          ]
        }),
        method: 'POST'
      };
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        let header = `schemaVersion: "1.0"\nadminCode: ${$(
          '#adminCode'
        ).val()}\n`;
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title: 'Created code file for ' + $('#adminCode :selected').text(),
            description:
              'Authored by: ' +
              $('#emailContact').val() +
              '\n' +
              'Project: ***' +
              $('#enProjectName').val() +
              '***\n' +
              $('#enDescription').val() +
              '\n',
            commit: 'Committed by ' + $('#emailContact').val(),
            author: {
              name: $('#nameContact').val(),
              email: $('#emailContact').val()
            },
            files: [
              {
                path: file,
                content: header + content
              }
            ]
          }),
          method: 'POST'
        };
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    });
});