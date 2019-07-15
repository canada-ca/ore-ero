/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTags resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode
*/

const ossObj = $('.page-ossForm #nameselect');
const adminObj = $('.page-ossForm #adminCode');

$(document).ready(function() {
  ossObj.change(function() {
    selectOss();
    if (adminObj.val() != '') selectAdmin();
  });

  adminObj.change(function() {
    selectAdmin();
  });

  $('#prbotSubmitossForm').click(function() {
    if (submitInit()) {
      if ($('#newAdminCode').val() != '') submitSoftwareFormNewAdmin();
      else submitFormOss();
    }
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getOssObject() {
  let ossObject = {
    schemaVersion: '1.0',
    description: {
      en: $('#endescription').val(),
      fr: $('#frdescription').val()
    },
    homepageURL: {
      en: $('#enhomepageURL').val(),
      fr: $('#frhomepageURL').val()
    },
    licenses: [
      {
        URL: {
          en: $('#enlicensesURL').val(),
          fr: $('#frlicensesURL').val()
        },
        spdxID: $('#licensesspdxID').val()
      }
    ],
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode: getAdminCode(),
        uses: [
          {
            contact: {
              email: $('#contactemail').val()
            },
            date: {
              started: $('#datestarted').val(),
              metadataLastUpdated: $('#datemetadataLastUpdated').val()
            },
            description: {
              en: $('#useendescription').val(),
              fr: $('#usefrdescription').val()
            },
            name: {
              en: $('#useenname').val(),
              fr: $('#usefrname').val()
            }
          }
        ]
      }
    ]
  };

  // Then we handle all optional fields.

  // contact.URL
  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    ossObject.administrations[0].uses[0].contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    ossObject.administrations[0].uses[0].contact.URL.en = $(
      '#encontactURL'
    ).val();
  }
  if ($('#frcontactURL').val()) {
    ossObject.administrations[0].uses[0].contact.URL.fr = $(
      '#frcontactURL'
    ).val();
  }

  // contact.name, TODO: update to match schema
  if ($('#contactname').val()) {
    ossObject.administrations[0].uses[0].contact.name = $('#contactname').val();
  }

  // relatedCode TODO: support multiple relatedCode fields
  if (
    $('#enrelatedCodeURL').val() ||
    $('#frrelatedCodeURL').val() ||
    $('#enrelatedCodename').val() ||
    $('#frrelatedCodename').val()
  ) {
    ossObject.administrations[0].uses[0].relatedCode = [{}];
  }
  // relatedCode.URL
  if ($('#enrelatedCodeURL').val() || $('#frrelatedCodeURL').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL = {};
  }
  if ($('#enrelatedCodeURL').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.en = $(
      '#enrelatedCodeURL'
    ).val();
  }
  if ($('#frrelatedCodeURL').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.fr = $(
      '#frrelatedCodeURL'
    ).val();
  }
  // relatedCode.name
  if ($('#enrelatedCodename').val() || $('#frrelatedCodename').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name = {};
  }
  if ($('#enrelatedCodename').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.en = $(
      '#enrelatedCodename'
    ).val();
  }
  if ($('#frrelatedCodename').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.fr = $(
      '#frrelatedCodename'
    ).val();
  }

  // status
  if ($('#status :selected').val() != '') {
    ossObject.administrations[0].uses[0].status = $('#status :selected').val();
  }

  return ossObject;
}

function getSelectedOrgType() {
  if ($('#adminCode').val() != '')
    return $('#adminCode :selected')
      .parent()
      .attr('label')
      .toLowerCase();
  else return $('#orgLevel').val();
}

function submitSoftwareFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitossForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let softwareObject = getOssObject();
  let adminObject = getAdminObject();
  let softwareName = $('#enname')
    .val()
    .toLowerCase();
  let adminName = $('#newAdminCode').val();

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let softwareFile = `_data/logiciels_libres-open_source_software/${softwareName}.yml`;
  let adminFile = `_data/administrations/${getSelectedOrgType()}.yml`;

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
          submitConclusion(response, submitButton, resetButton);
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
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
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
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
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
  let ProjectName = $('#enname')
    .val()
    .toLowerCase();
  let file = `_data/logiciels_libres-open_source_software/${ProjectName}.yml`;

  fileWriter
    .merge(file, softwareObject, 'administrations', 'adminCode')
    .then(result => {
      return fetch(PRBOT_URL, getConfigUpdate(result, file, ProjectName));
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(
          PRBOT_URL,
          getConfigNew(softwareObject, file, ProjectName)
        );
      } else throw err;
    })
    .then(response => {
      submitConclusion(response, submitButton, resetButton);
    });
}

function getConfigUpdate(result, file, ProjectName) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${ProjectName} software file`,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        $('#enname').val() +
        '***\n' +
        $('#endescription').val() +
        '\n',
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

function getConfigNew(softwareObject, file, ProjectName) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the software file for ' + ProjectName,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        $('#enname').val() +
        '***\n' +
        $('#endescription').val() +
        '\n',
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
  $('#enname').val(obj['name']['en']);
  $('#frname').val(obj['name']['fr']);
  $('#endescription').val(obj['description']['en']);
  $('#frdescription').val(obj['description']['fr']);
  $('#enhomepageURL').val(obj['homepageURL']['en']);
  $('#frhomepageURL').val(obj['homepageURL']['fr']);
  $('#enlicensesURL').val(obj['licenses'][0]['URL']['en']);
  $('#frlicensesURL').val(obj['licenses'][0]['URL']['fr']);
  $('#licensesspdxID').val(obj['licenses'][0]['spdxID']);
  addTags(obj);
}

function resetFieldsOss() {
  $('#enname').val('');
  $('#frname').val('');
  $('#endescription').val('');
  $('#frdescription').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  $('#enlicensesURL').val('');
  $('#frlicensesURL').val('');
  $('#licensesspdxID').val('');
  $('#enname').focus();
  $('#frname').focus();
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
      $('#encontactURL').val(obj['uses'][0]['contact']['URL']['en']);
    if (obj['uses']['contact']['URL']['fr'])
      $('#frcontactURL').val(obj['uses'][0]['contact']['URL']['fr']);
  }
  if (obj['uses'][0]['contact']['email'])
    $('#contactemail').val(obj['uses'][0]['contact']['email']);
  if (obj['uses'][0]['contact']['name'])
    $('#contactname').val(obj['uses'][0]['contact']['name']);

  $('#datestarted').val(obj['uses'][0]['date']['started']);
  $('#datemetadataLastUpdated').val(
    obj['uses'][0]['date']['metadataLastUpdated']
  );
  $('#useenname').val(obj['uses'][0]['name']['en']);
  $('#usefrname').val(obj['uses'][0]['name']['fr']);
  $('#useendescription').val(obj['uses'][0]['description']['en']);
  $('#usefrdescription').val(obj['uses'][0]['description']['fr']);

  if (obj['uses'][0]['relatedCode']) {
    if (obj['uses'][0]['relatedCode']['URL']) {
      if (obj['uses'][0]['relatedCode']['URL']['en'])
        $('#enrelatedCodeURL').val(obj['uses'][0]['relatedCode']['URL']['en']);
      if (obj['uses'][0]['relatedCode']['URL']['fr'])
        $('#frrelatedCodeURL').val(obj['uses'][0]['relatedCode']['URL']['fr']);
    }
  }
  if (obj['uses'][0]['status']) $('#status').val(obj['uses'][0]['status']);
}

function resetFieldsAdmin() {
  $('#encontactURL').val('');
  $('#frcontactURL').val('');
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#datestarted').val('');
  $('#useenname').val('');
  $('#usefrname').val('');
  $('#useendescription').val('');
  $('#usefrdescription').val('');
  $('#enrelatedCodeURL').val('');
  $('#frrelatedCodeURL').val('');
  $('#enrelatedCodename').val('');
  $('#frrelatedCodename').val('');
  $('#status').val('');
}
