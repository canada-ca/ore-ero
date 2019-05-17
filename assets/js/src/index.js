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
 * WET uses the JQuery plugin (https://jqueryvalidation.org/) for their form validation
 * @return {Boolean} true/false if the form is valid/invalid
 */
function validateRequired() {
  let form = document.getElementById('validation');
  let elements = form.elements;
  let validator = $('#validation').validate();
  let isValid = true;
  for (let i = 0; i < elements.length; i++) {
    let currentElement = elements[i];
    if (currentElement.required) {
      if (!validator.element('#' + currentElement.id)) {
        isValid = false;
      }
    }
  }
  if (!isValid) {
    // Jump to top of form to see error messages
    location.href = '#wb-cont';
  }
  return isValid;
}

const ALERT_IN_PROGRESS = 0;
const ALERT_FAIL = 1;
const ALERT_SUCCESS = 2;
const ALERT_OFF = 3;

function toggleAlert(option) {
  let alertInProgress = document.getElementById('prbotSubmitAlertInProgress');
  let alertFail = document.getElementById('prbotSubmitAlertFail');
  let alertSuccess = document.getElementById('prbotSubmitAlertSuccess');
  if (option == ALERT_IN_PROGRESS) {
    alertInProgress.style.display = 'block';
  } else if (option == ALERT_FAIL) {
    alertFail.style.display = 'block';
  } else if (option == ALERT_SUCCESS) {
    alertSuccess.style.display = 'block';
  } else if (option == ALERT_OFF) {
    alertInProgress.style.display = 'none';
    alertFail.style.display = 'none';
    alertSuccess.style.display = 'none';
  } else {
    console.log('Invalid alert option');
  }
}

function submitForm() {
  let submitButton = document.getElementById('prbotSubmit');
  let resetButton = document.getElementById('codeFormReset');
  submitButton.disabled = true;
  resetButton.disabled = true;
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
            $('#gitHubEmail').val() +
            '\n' +
            'Project: ***' +
            $('#enProjectName').val() +
            '***\n' +
            $('#enDescription').val() +
            '\n',
          commit: 'Committed by ' + $('#gitHubEmail').val(),
          author: {
            name: $('#gitHubUsername').val(),
            email: $('#gitHubEmail').val()
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
              $('#gitHubEmail').val() +
              '\n' +
              'Project: ***' +
              $('#enProjectName').val() +
              '***\n' +
              $('#enDescription').val() +
              '\n',
            commit: 'Committed by ' + $('#gitHubEmail').val(),
            author: {
              name: $('#gitHubUsername').val(),
              email: $('#gitHubEmail').val()
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
    })
    .then(response => {
      if (response.status != 200) {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_FAIL);
        submitButton.disabled = false;
        resetButton.disabled = false;
      } else {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_SUCCESS);
        // Redirect to home page
        setTimeout(function() {
          window.location.href = './index.html';
        }, 2000);
      }
    });
}

$('#prbotSubmit').click(function() {
  // Progress only when form input is valid
  if (validateRequired()) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_IN_PROGRESS);
    window.scrollTo(0, document.body.scrollHeight);
    submitForm();
  }
});
