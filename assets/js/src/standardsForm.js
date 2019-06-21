/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTags resetTags addTags
  submitInit submitConclusion
*/

const standardObj = $('.page-standardsForm #StandardCodeSelect');
const adminObj = $('.page-standardsForm #adminCode');

$(document).ready(function() {
  $('#StandardCode').focus();

  standardObj.change(function() {
    selectStandard();
    if (adminObj.val() != '') selectAdmin();
  });

  adminObj.change(function() {
    selectAdmin();
  });

  $('#prbotSubmitstandardsForm').click(function() {
    if (submitInit()) submitStandardsForm();
  });
});

function getStandardsObject() {
  let standardsObject = {
    schemaVersion: $('#schemaVersion').val(),
    date: {
      created: $('#dateCreated').val(),
      metadataLastUpdated: $('#dateLastUpdated').val()
    },
    description: {
      en: $('#enDescription').val(),
      fr: $('#frDescription').val()
    },
    name: {
      en: $('#enName').val(),
      fr: $('#frName').val()
    },
    specURL: {
      en: $('#enSpecURL').val(),
      fr: $('#frSpecURL').val()
    },
    standardCode: $('#StandardCode')
      .val()
      .toUpperCase(),
    standardsOrg: $('#StandardOrg').val(),
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode: $('#adminCode').val(),
        contact: {
          email: $('#emailContact').val()
        },
        references: [
          {
            URL: {
              en: $('#enUrlReference').val(),
              fr: $('#frUrlReference').val()
            },
            name: {
              en: $('#enNameReference').val(),
              fr: $('#frNameReference').val()
            }
          }
        ],
        status: $('#Status').val()
      }
    ]
  };

  if ($('#frUrlContact').val() || $('#enUrlContact').val()) {
    standardsObject.administrations[0].contact.URL = {};
  }
  if ($('#enUrlContact').val()) {
    standardsObject.administrations[0].contact.URL.en = $(
      '#enUrlContact'
    ).val();
  }
  if ($('#frUrlContact').val()) {
    standardsObject.administrations[0].contact.URL.fr = $(
      '#frUrlContact'
    ).val();
  }

  if ($('#nameContact').val()) {
    standardsObject.administrations[0].contact.name = $('#nameContact').val();
  }

  return standardsObject;
}

function submitStandardsForm() {
  let submitButton = document.getElementById('prbotSubmitstandardsForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let name = $('#StandardCode')
    .val()
    .toLowerCase();

  let standardsObject = getStandardsObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/normes_ouvertes-open_standards/${name}.yml`;

  fileWriter
    .merge(file, standardsObject, 'administrations', 'adminCode')
    .then(result => {
      const config = getConfigUpdate(result);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        const config = getConfigNew(standardsObject, file);
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    })
    .then(response => {
      submitConclusion(response, submitButton, resetButton);
    });
}

function getConfigUpdate(result, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${name} standard file`,
      description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
      commit: 'Committed by ' + $('#submitterEmail').val(),
      author: {
        name: $('#submitterUsername').val(),
        email: $('#submitterEmail').val()
      },
      files: [
        {
          path: file,
          content: jsyaml.dump(result, { lineWidth: 160 })
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNew(standardsObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the standard file for ' + name,
      description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
      commit: 'Committed by ' + $('#submitterEmail').val(),
      author: {
        name: $('#submitterUsername').val(),
        email: $('#submitterEmail').val()
      },
      files: [
        {
          path: file,
          content:
            '---\n' +
            jsyaml.dump(standardsObject, {
              lineWidth: 160
            })
        }
      ]
    }),
    method: 'POST'
  };
}

function selectStandard() {
  let value = standardObj.val().toLowerCase();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/normes_ouvertes-open_standards.json',
    function(result) {
      if (result[value]) {
        addValueToFieldsStandard(result[value]);
        $('#adminCode').focus();
      } else if (value == '') {
        resetFieldsStandard();
      } else {
        alert('Error retrieving the data');
      }
    }
  );
}

function addValueToFieldsStandard(obj) {
  $('#schemaVersion').val(obj['schemaVersion']);
  $('#StandardCode').val(obj['standardCode']);
  $('#enName').val(obj['name']['en']);
  $('#frName').val(obj['name']['fr']);
  $('#enDescription').val(obj['description']['en']);
  $('#frDescription').val(obj['description']['fr']);
  $('#dateCreated').val(obj['date']['created']);
  $('#enSpecURL').val(obj['specURL']['en']);
  $('#frSpecURL').val(obj['specURL']['fr']);
  $('#StandardOrg').val(obj['standardsOrg']);

  addTags(obj);
}

function resetFieldsStandard() {
  $('#schemaVersion').val('1.0');
  $('#StandardCode').val('');
  $('#enName').val('');
  $('#frName').val('');
  $('#enDescription').val('');
  $('#frDescription').val('');
  $('#dateCreated').val('');
  $('#enSpecURL').val('');
  $('#frSpecURL').val('');
  $('#StandardOrg').val('');
  $('#StandardCode').focus();
  resetTags();
}

function selectAdmin() {
  let standard = standardObj.val().toLowerCase();
  let administration = adminObj.val();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/normes_ouvertes-open_standards.json',
    function(result) {
      if (result[standard]) {
        for (let i = 0; i < result[standard]['administrations'].length; i++) {
          if (
            result[standard]['administrations'][i]['adminCode'] ==
            administration
          ) {
            addValueToFieldsAdmin(result[standard]['administrations'][i]);
            break;
          } else {
            resetFieldsAdmin();
          }
        }
      } else {
        console.log('standard empty of not found');
      }
    }
  );
}

function addValueToFieldsAdmin(obj) {
  if (obj['contact']['URL']) {
    if (obj['contact']['URL']['en'])
      $('#enUrlContact').val(obj['contact']['URL']['en']);
    if (obj['contact']['URL']['fr'])
      $('#frUrlContact').val(obj['contact']['URL']['fr']);
  }

  if (obj['contact']['email']) $('#emailContact').val(obj['contact']['email']);

  if (obj['contact']['name']) $('#nameContact').val(obj['contact']['name']);

  $('#enUrlReference').val(obj['references'][0]['URL']['en']);
  $('#frUrlReference').val(obj['references'][0]['URL']['fr']);
  $('#enNameReference').val(obj['references'][0]['name']['en']);
  $('#frNameReference').val(obj['references'][0]['name']['fr']);

  $('#Status').val(obj['status']);
}

function resetFieldsAdmin() {
  $('#enUrlContact').val('');
  $('#frUrlContact').val('');
  $('#emailContact').val('');
  $('#nameContact').val('');
  $('#enUrlReference').val('');
  $('#frUrlReference').val('');
  $('#enNameReference').val('');
  $('#frNameReference').val('');
  $('#Status').val('');
}
