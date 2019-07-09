/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  validateRequired toggleAlert getTags resetTags addTags
  ALERT_OFF ALERT_IN_PROGRESS ALERT_FAIL ALERT_SUCCESS
  getAdminObject
*/

const ossObj = $('.page-ossForm #ProjectNameSelect');
const adminObj = $('.page-ossForm #adminCode');

$('#newAmdminButton').click(function() {
  $('#newAdmin').removeClass('hide');
  $('#adminCode').removeAttr('required');
  $('label[for="adminCode"]').removeClass('required');
});

$('#removeNewAdminButton').click(function() {
  $('#newAdmin').addClass('hide');
  $('#adminCode').attr('required', 'required');
  $('label[for="adminCode"]').addClass('required');
});

$(document).ready(function() {
  ossObj.focus();

  ossObj.change(function() {
    selectOss();
    if (adminObj.val() != '') selectAdmin();
  });

  adminObj.change(function() {
    selectAdmin();
  });

  $('#prbotSubmitossForm').click(function() {
    // Progress only when form input is valid
    if (validateRequired()) {
      toggleAlert(ALERT_OFF);
      toggleAlert(ALERT_IN_PROGRESS);
      window.scrollTo(0, document.body.scrollHeight);
      if ($('#newAdminCode').val()) {
        submitSoftwareFormNewAdmin();
      } else {
        submitFormOss();
      }
    }
  });
});

function getOssObject() {
  // Required fields are included first.
  let ossObject = {
    schemaVersion: $('#schemaVersion').val(),
    description: {
      en: $('#enDescription').val(),
      fr: $('#frDescription').val()
    },
    homepageURL: {
      en: $('#enHomepageUrl').val(),
      fr: $('#frHomepageUrl').val()
    },
    licenses: [
      {
        URL: {
          en: $('#enLicenses').val(),
          fr: $('#frLicenses').val()
        },
        spdxID: $('#spdxID').val()
      }
    ],
    name: {
      en: $('#enProjectName').val(),
      fr: $('#frProjectName').val()
    },
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode:
          $('#adminCode').val() == ''
            ? $('#newAdminCode').val()
            : $('#adminCode').val(),
        uses: [
          {
            contact: {
              email: $('#emailContact').val()
            },
            date: {
              started: $('#dateStarted').val(),
              metadataLastUpdated: $('#dateLastUpdated').val()
            },
            description: {
              en: $('#enUseDescription').val(),
              fr: $('#enUseDescription').val()
            },
            name: {
              en: $('#enUseName').val(),
              fr: $('#frUseName').val()
            }
          }
        ]
      }
    ]
  };

  // Then we handle all optional fields.

  // contact.URL
  if ($('#frUrlContact').val() || $('#enUrlContact').val()) {
    ossObject.administrations[0].uses[0].contact.URL = {};
  }
  if ($('#enUrlContact').val()) {
    ossObject.administrations[0].uses[0].contact.URL.en = $(
      '#enUrlContact'
    ).val();
  }
  if ($('#frUrlContact').val()) {
    ossObject.administrations[0].uses[0].contact.URL.fr = $(
      '#frUrlContact'
    ).val();
  }

  // contact.name, TODO: update to match schema
  if ($('#nameContact').val()) {
    ossObject.administrations[0].uses[0].contact.name = $('#nameContact').val();
  }

  // relatedCode TODO: support multiple relatedCode fields
  if (
    $('#enUrlRelatedCode').val() ||
    $('#frUrlRelatedCode').val() ||
    $('#enNameRelatedCode').val() ||
    $('#frNameRelatedCode').val()
  ) {
    ossObject.administrations[0].uses[0].relatedCode = [{}];
  }
  // relatedCode.URL
  if ($('#enUrlRelatedCode').val() || $('#frUrlRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL = {};
  }
  if ($('#enUrlRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.en = $(
      '#enUrlRelatedCode'
    ).val();
  }
  if ($('#frUrlRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.fr = $(
      '#frUrlRelatedCode'
    ).val();
  }
  // relatedCode.name
  if ($('#enNameRelatedCode').val() || $('#frNameRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name = {};
  }
  if ($('#enNameRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.en = $(
      '#enNameRelatedCode'
    ).val();
  }
  if ($('#frNameRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.fr = $(
      '#frNameRelatedCode'
    ).val();
  }

  // status
  if ($('#status :selected').val() != '') {
    ossObject.administrations[0].uses[0].status = $('#status :selected').val();
  }

  return ossObject;
}

function submitSoftwareFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitossForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let softwareObject = getOssObject();
  let adminObject = getAdminObject();
  let softwareName = $('#enProjectName')
    .val()
    .toLowerCase();
  let adminName = $('#newAdminCode').val();

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let softwareFile = `_data/logiciels_libres-open_source_software/${softwareName}.yml`;
  let adminFile = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then(adminResult => {
      fileWriter
        .merge(softwareFile, softwareObject, 'administrations', 'adminCode')
        .then(softwareResult => {
          return fetch(
            PRBOT_URL,
            getConfigUpdateSoftwareNewAdmin(
              softwareName,
              adminName,
              softwareFile,
              adminFile,
              softwareResult,
              adminResult
            )
          );
        })
        .catch(err => {
          if (err.status == 404) {
            return fetch(
              PRBOT_URL,
              getConfigNewSoftwareNewAdmin(
                softwareName,
                adminName,
                softwareFile,
                adminFile,
                softwareObject,
                adminResult
              )
            );
          } else throw err;
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
    });
}

function getConfigUpdateSoftwareNewAdmin(
  softwareName,
  adminName,
  softwareFile,
  adminFile,
  softwareResult,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Updated software file for ' +
        softwareName +
        ' and created ' +
        adminName +
        ' in administration file',
      description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
      commit: 'Committed by ' + $('#submitterEmail').val(),
      author: {
        name: $('#submitterUsername').val(),
        email: $('#submitterEmail').val()
      },
      files: [
        {
          path: softwareFile,
          content: '---\n' + jsyaml.dump(softwareResult)
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

function getConfigNewSoftwareNewAdmin(
  softwareName,
  adminName,
  softwareFile,
  adminFile,
  softwareObject,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Creaded software file for ' +
        softwareName +
        ' and created ' +
        adminName +
        ' in administration file',
      description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
      commit: 'Committed by ' + $('#submitterEmail').val(),
      author: {
        name: $('#submitterUsername').val(),
        email: $('#submitterEmail').val()
      },
      files: [
        {
          path: softwareFile,
          content: '---\n' + jsyaml.dump(softwareObject)
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

function submitFormOss() {
  let submitButton = document.getElementById('prbotSubmitossForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let softwareObject = getOssObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let ProjectName = $('#enProjectName')
    .val()
    .toLowerCase();
  let file = `_data/logiciels_libres-open_source_software/${ProjectName}.yml`;
  fileWriter
    .merge(file, softwareObject, 'administrations', 'adminCode')
    .then(result => {
      const config = getConfigUpdate(result, file);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        const config = getConfigNew(softwareObject, file);
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

function getConfigUpdate(result, file) {
  let ProjectName = $('#enProjectName').val();
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${ProjectName} software file`,
      description:
        'Authored by: ' +
        $('#submitterEmail').val() +
        '\n' +
        'Project: ***' +
        $('#enProjectName').val() +
        '***\n' +
        $('#enDescription').val() +
        '\n',
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

function getConfigNew(softwareObject, file) {
  let ProjectName = $('#enProjectName').val();
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the software file for ' + ProjectName,
      description:
        'Authored by: ' +
        $('#submitterEmail').val() +
        '\n' +
        'Project: ***' +
        $('#enProjectName').val() +
        '***\n' +
        $('#enDescription').val() +
        '\n',
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
            jsyaml.dump(softwareObject, {
              lineWidth: 160
            })
        }
      ]
    }),
    method: 'POST'
  };
}

function selectOss() {
  let value = ossObj.val().toLowerCase();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/logiciels_libres-open_source_software.json',
    function(result) {
      if (result[value]) {
        addValueToFieldsOss(result[value]);
        $('#adminCode').focus();
      } else if (value == '') {
        resetFieldsOss();
      } else {
        alert('Error retrieving the data');
      }
    }
  );
}

function addValueToFieldsOss(obj) {
  $('#schemaVersion').val(obj['schemaVersion']);
  $('#enProjectName').val(obj['name']['en']);
  $('#frProjectName').val(obj['name']['fr']);
  $('#enDescription').val(obj['description']['en']);
  $('#frDescription').val(obj['description']['fr']);
  $('#enHomepageUrl').val(obj['homepageURL']['en']);
  $('#frHomepageUrl').val(obj['homepageURL']['fr']);
  $('#enLicenses').val(obj['licenses'][0]['URL']['en']);
  $('#frLicenses').val(obj['licenses'][0]['URL']['fr']);
  $('#spdxID').val(obj['licenses'][0]['spdxID']);
  addTags(obj);
}

function resetFieldsOss() {
  $('#schemaVersion').val('1.0');
  $('#enProjectName').val('');
  $('#frProjectName').val('');
  $('#enDescription').val('');
  $('#frDescription').val('');
  $('#enHomepageUrl').val('');
  $('#frHomepageUrl').val('');
  $('#enLicenses').val('');
  $('#frLicenses').val('');
  $('#spdxID').val('');
  $('#enProjectName').focus();
  $('#frProjectName').focus();
  resetTags();
}

function selectAdmin() {
  let oss = ossObj.val().toLowerCase();
  let administration = adminObj.val();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/logiciels_libres-open_source_software.json',
    function(result) {
      if (result[oss]) {
        for (let i = 0; i < result[oss]['administrations'].length; i++) {
          if (
            result[oss]['administrations'][i]['adminCode'] == administration
          ) {
            addValueToFieldsAdmin(result[oss]['administrations'][i]);
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
  if (obj['uses'][0]['contact']['URL']) {
    if (obj['uses'][0]['contact']['URL']['en'])
      $('#enUrlContact').val(obj['uses'][0]['contact']['URL']['en']);
    if (obj['uses']['contact']['URL']['fr'])
      $('#frUrlContact').val(obj['uses'][0]['contact']['URL']['fr']);
  }
  if (obj['uses'][0]['contact']['email'])
    $('#emailContact').val(obj['uses'][0]['contact']['email']);
  if (obj['uses'][0]['contact']['name'])
    $('#nameContact').val(obj['uses'][0]['contact']['name']);

  $('#dateStarted').val(obj['uses'][0]['date']['started']);
  $('#dateLastUpdated').val(obj['uses'][0]['date']['metadataLastUpdated']);
  $('#enUseName').val(obj['uses'][0]['name']['en']);
  $('#frUseName').val(obj['uses'][0]['name']['fr']);
  $('#enUseDescription').val(obj['uses'][0]['description']['en']);
  $('#frUseDescription').val(obj['uses'][0]['description']['fr']);

  if (obj['uses'][0]['relatedCode']) {
    if (obj['uses'][0]['relatedCode']['URL']) {
      if (obj['uses'][0]['relatedCode']['URL']['en'])
        $('#enUrlRelatedCode').val(obj['uses'][0]['relatedCode']['URL']['en']);
      if (obj['uses'][0]['relatedCode']['URL']['fr'])
        $('#frUrlRelatedCode').val(obj['uses'][0]['relatedCode']['URL']['fr']);
    }
  }
  if (obj['uses'][0]['status']) $('#status').val(obj['uses'][0]['status']);
}

function resetFieldsAdmin() {
  $('#enUrlContact').val('');
  $('#frUrlContact').val('');
  $('#emailContact').val('');
  $('#nameContact').val('');
  $('#dateStarted').val('');
  $('#enUseName').val('');
  $('#frUseName').val('');
  $('#enUseDescription').val('');
  $('#frUseDescription').val('');
  $('#enUrlRelatedCode').val('');
  $('#frUrlRelatedCode').val('');
  $('#enNameRelatedCode').val('');
  $('#frNameRelatedCode').val('');
  $('#status').val('');
}
