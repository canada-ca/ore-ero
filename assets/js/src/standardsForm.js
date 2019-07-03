/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTags resetTags addTags
  submitInit submitConclusion
*/

const standardObj = $('.page-standardsForm #standardCodeselect');
const adminObj = $('.page-standardsForm #adminCode');

$(document).ready(function() {
  $('#standardCode').focus();

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

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getStandardsObject() {
  let standardsObject = {
    schemaVersion: $('#schemaVersion').val(),
    date: {
      created: $('#datecreated').val(),
      metadataLastUpdated: $('#datemetadataLastUpdated').val()
    },
    description: {
      en: $('#endescription').val(),
      fr: $('#frdescription').val()
    },
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
    specURL: {
      en: $('#enspecURL').val(),
      fr: $('#frspecURL').val()
    },
    standardCode: $('#standardCode')
      .val()
      .toUpperCase(),
    standardsOrg: $('#standardOrg').val(),
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode: $('#adminCode').val(),
        contact: {
          email: $('#contactemail').val()
        },
        references: [
          {
            URL: {
              en: $('#enreferenceURL').val(),
              fr: $('#frreferenceURL').val()
            },
            name: {
              en: $('#enreferencename').val(),
              fr: $('#frreferencename').val()
            }
          }
        ],
        status: $('#status').val()
      }
    ]
  };

  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    standardsObject.administrations[0].contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    standardsObject.administrations[0].contact.URL.en = $(
      '#encontactURL'
    ).val();
  }
  if ($('#frcontactURL').val()) {
    standardsObject.administrations[0].contact.URL.fr = $(
      '#frcontactURL'
    ).val();
  }

  if ($('#contactname').val()) {
    standardsObject.administrations[0].contact.name = $('#contactname').val();
  }

  return standardsObject;
}

function submitStandardsForm() {
  let submitButton = document.getElementById('prbotSubmitstandardsForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let standardsObject = getStandardsObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/normes_ouvertes-open_standards/${standardsObject.standardCode.toLowerCase()}.yml`;

  fileWriter
    .merge(file, standardsObject, 'administrations', 'adminCode')
    .then(result => {
      const config = getConfigUpdate(
        result,
        file,
        standardsObject.standardCode
      );
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

function getConfigUpdate(result, file, code) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${code} standard file`,
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
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
      title: 'Created the standard file for ' + standardsObject.standardCode,
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
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
  $('#standardCode').val(obj['standardCode']);
  $('#enname').val(obj['name']['en']);
  $('#frname').val(obj['name']['fr']);
  $('#endescription').val(obj['description']['en']);
  $('#frdescription').val(obj['description']['fr']);
  $('#datecreated').val(obj['date']['created']);
  $('#enspecURL').val(obj['specURL']['en']);
  $('#frspecURL').val(obj['specURL']['fr']);
  $('#standardOrg').val(obj['standardsOrg']);

  addTags(obj);
}

function resetFieldsStandard() {
  $('#schemaVersion').val('1.0');
  $('#standardCode').val('');
  $('#enname').val('');
  $('#frname').val('');
  $('#endescription').val('');
  $('#frdescription').val('');
  $('#datecreated').val('');
  $('#enspecURL').val('');
  $('#frspecURL').val('');
  $('#standardOrg').val('');
  $('#standardCode').focus();
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
        resetFieldsAdmin();
      }
    }
  );
}

function addValueToFieldsAdmin(obj) {
  if (obj['contact']['email']) $('#contactemail').val(obj['contact']['email']);

  if (obj['contact']['name']) $('#contactname').val(obj['contact']['name']);

  $('#enreferenceURL').val(obj['references'][0]['URL']['en']);
  $('#frreferenceURL').val(obj['references'][0]['URL']['fr']);
  $('#enreferencename').val(obj['references'][0]['name']['en']);
  $('#frreferencename').val(obj['references'][0]['name']['fr']);

  $('#status').val(obj['status']);
}

function resetFieldsAdmin() {
  $('#encontactURL').val('');
  $('#frcontactURL').val('');
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#enreferenceURL').val('');
  $('#frreferenceURL').val('');
  $('#enreferencename').val('');
  $('#frreferencename').val('');
  $('#status').val('');
}
