/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTags resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode
*/

const standardObj = $('.page-standardsForm #standardAcronymselect');
const adminObj = $('.page-standardsForm #adminCode');

$(document).ready(function() {
  standardObj.change(function() {
    selectStandard();
    if (adminObj.val() != '') selectAdmin();
  });

  adminObj.change(function() {
    selectAdmin();
  });

  $('#prbotSubmitstandardsForm').click(function() {
    if (submitInit()) {
      if ($('#newAdminCode').val() != '') submitStandardsFormNewAdmin();
      else submitStandardsForm();
    }
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getStandardsObject() {
  let standardsObject = {
    schemaVersion: $('#schemaVersion').val(),
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
    standardAcronym: $('#standardAcronym')
      .val()
      .toUpperCase(),
    standardsOrg: {
      en: $('#enstandardOrg').val(),
      fr: $('#frstandardOrg').val()
    },
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode: getAdminCode(),
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
        date: {
          created: $('#datecreated').val(),
          metadataLastUpdated: $('#datemetadataLastUpdated').val()
        },
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

  let standardObject = getStandardsObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/normes_ouvertes-open_standards/${standardObject.standardAcronym.toLowerCase()}.yml`;

  fileWriter
    .merge(file, standardObject, 'administrations', 'adminCode')
    .then(result => {
      return fetch(
        PRBOT_URL,
        getConfigUpdate(result, file, standardObject.standardAcronym)
      );
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(PRBOT_URL, getConfigNew(standardObject, file));
      } else throw err;
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
          content: '---\n' + jsyaml.dump(result)
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
      title: 'Created the standard file for ' + standardsObject.standardAcronym,
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(standardsObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function submitStandardsFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitstandardsForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let standardObject = getStandardsObject();
  let adminObject = getAdminObject();

  let standardName = standardObject.standardAcronym.toLowerCase();
  let adminName = $('#newAdminCode').val();

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let standardFile = `_data/normes_ouvertes-open_standards/${standardName}.yml`;
  let adminFile = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then(adminResult => {
      fileWriter
        .merge(standardFile, standardObject, 'administrations', 'adminCode')
        .then(standardResult => {
          return fetch(
            PRBOT_URL,
            getConfigUpdateStandardNewAdmin(
              standardName,
              adminName,
              standardFile,
              adminFile,
              standardResult,
              adminResult
            )
          );
        })
        .catch(err => {
          if (err.status == 404) {
            return fetch(
              PRBOT_URL,
              getConfigNewStandardNewAdmin(
                standardName,
                adminName,
                standardFile,
                adminFile,
                standardObject,
                adminResult
              )
            );
          } else throw err;
        })
        .then(response => {
          submitConclusion(response, submitButton, resetButton);
        });
    })
    .catch(err => {
      if (err.status == 404) console.log('File not Found');
      else throw err;
    });
}

function getConfigUpdateStandardNewAdmin(
  standardName,
  adminName,
  standardFile,
  adminFile,
  standardResult,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Updated standard file for ' +
        standardName +
        ' and created ' +
        adminName +
        ' in administration file',
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: standardFile,
          content: '---\n' + jsyaml.dump(standardResult)
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(adminObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNewStandardNewAdmin(
  standardName,
  adminName,
  standardFile,
  adminFile,
  standardObject,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Creaded standard file for ' +
        standardName +
        ' and created ' +
        adminName +
        ' in administration file',
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: standardFile,
          content: '---\n' + jsyaml.dump(standardObject)
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(adminObject)
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
  $('#standardAcronym').val(obj['standardAcronym']);
  $('#enname').val(obj['name']['en']);
  $('#frname').val(obj['name']['fr']);
  $('#endescription').val(obj['description']['en']);
  $('#frdescription').val(obj['description']['fr']);
  $('#datecreated').val(obj['date']['created']);
  $('#enspecURL').val(obj['specURL']['en']);
  $('#frspecURL').val(obj['specURL']['fr']);
  $('#enstandardOrg').val(obj['standardsOrg']['en']);
  $('#frstandardOrg').val(obj['standardsOrg']['fr']);

  addTags(obj);
}

function resetFieldsStandard() {
  $('#schemaVersion').val('1.0');
  $('#standardAcronym').val('');
  $('#enname').val('');
  $('#frname').val('');
  $('#endescription').val('');
  $('#frdescription').val('');
  $('#datecreated').val('');
  $('#enspecURL').val('');
  $('#frspecURL').val('');
  $('#enstandardOrg').val('');
  $('#frstandardOrg').val('');
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
