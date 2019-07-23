/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode
  addMoreLicences
  slugify
*/

var branch = 'master';

var softwareSelect = $('.page-softwareForm #nameselect');
var adminSelect = $('.page-softwareForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitsoftwareForm').click(function() {
    if (submitInit()) submitSoftwareForm();
  });

  softwareSelect.change(function() {
    selectSoftware();
    // if (adminSelect.val() != '') selectAdmin();
  });

  adminSelect.change(function() {
    selectAdmin();
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getSoftwareUse(admin) {
  // Mandatory fields
  let softwareUse = {
    adminCode: admin,
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
  };

  // Optional fields
  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    softwareUse.uses[0].contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    softwareUse.uses[0].contact.URL.en = $('#encontactURL').val();
  }
  if ($('#frcontactURL').val()) {
    softwareUse.uses[0].contact.URL.fr = $('#frcontactURL').val();
  }

  if ($('#contactname').val()) {
    softwareUse.uses[0].contact.name = $('#contactname').val();
  }

  if ($('#status :selected').val() != '') {
    softwareUse.uses[0].status = $('#status :selected').val();
  }

  // Optional more-group
  $('#addMoreusers ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    if ($('#users' + id).val() != '') {
      if (softwareUse.uses[0].users == undefined)
        softwareUse.uses[0].users = [];
      softwareUse.uses[0].users[i] = $('#users' + id).val();
    }
  });

  return softwareUse;
}

function getSoftwareObject(admin) {
  // Mandatory fields
  let softwareObject = {
    schemaVersion: '1.0',
    description: {
      en: $('#endescription').val(),
      fr: $('#frdescription').val()
    },
    homepageURL: {
      en: $('#enhomepageURL').val(),
      fr: $('#frhomepageURL').val()
    },
    licences: [],
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
    tags: {
      en: getTagsEN(),
      fr: getTagsFR()
    },
    administrations: [admin]
  };

  // More-groups
  addMoreLicences(softwareObject);

  return softwareObject;
}

function submitSoftwareForm() {
  let submitBtn = $('#prbotSubmitsoftwareForm');
  let resetBtn = $('#formReset');
  submitBtn.disabled = true;
  resetBtn.disabled = true;

  let adminObject = getAdminObject();
  let adminCode = slugify(
    adminObject.code == '' ? getAdminCode() : adminObject.code
  );
  let adminName =
    $('#ennewAdminName').val() == ''
      ? adminSelect.val()
      : $('#ennewAdminName').val();

  let softwareObject = getSoftwareObject(adminCode);
  let softwareUse = getSoftwareUse(adminCode);

  let softwareName = slugify(softwareObject.name.en);

  let fileSoftware = `_data/db/software/softwares/${slugify(softwareName)}.yml`;
  let fileUse = `_data/db/software/uses/${slugify(
    softwareName
  )}/${adminCode}.yml`;
  let fileAdmin = `_data/db/administrations/${adminCode}.yml`;

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME, branch);

  let config;

  fileWriter
    .merge(fileSoftware, softwareObject, 'administrations', '')
    .then(result => {
      config = getConfigUpdateSoftware(softwareName, result, fileSoftware);
    })
    .catch(err => {
      if (err.status == 404) {
        config = getConfigNewSoftware(
          softwareName,
          softwareObject,
          fileSoftware
        );
      } else throw err;
    })
    .then(function() {
      fileWriter
        .merge(fileUse, softwareUse, 'uses', 'name.en')
        .then(result => {
          getConfigUpdateUse(config, adminName, result, fileUse);
        })
        .catch(err => {
          if (err.status == 404) {
            getConfigNewUse(config, adminName, softwareUse, fileUse);
          } else throw err;
        })
        .then(function() {
          if (adminObject.code != '') {
            $.get(
              `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/${branch}/${fileAdmin}`,
              function() {
                // TODO handle admin code already in use
                console.log('Admin code already exists');
              }
            )
              .fail(function(err) {
                if (err.status == 404) {
                  configNewAdmin(config, fileAdmin, adminObject);
                } else throw err;
              })
              .always(function() {
                getFinalConfig(config);
                fetch(PRBOT_URL, config).then(function(response) {
                  submitConclusion(response, submitBtn, resetBtn);
                });
              });
          } else {
            getFinalConfig(config);
            fetch(PRBOT_URL, config).then(function(response) {
              submitConclusion(response, submitBtn, resetBtn);
            });
          }
        });
    });
}

function getConfigNewSoftware(softwareName, softwareObject, fileSoftware) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title: `Created ${softwareName} (software)`,
      description:
        `Authored by: ${$('#submitteremail').val()}\n` +
        ` - ***${softwareName}:*** ${softwareObject.description.en}`,
      commit: `Commited by ${$('#submitteremail').val()}`,
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: fileSoftware,
          content: '---\n' + jsyaml.dump(softwareObject)
        }
      ]
    },
    method: 'POST'
  };
}

function getConfigUpdateSoftware(softwareName, softwareObject, fileSoftware) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated ${softwareName} (software)`,
      description:
        `Authored by: ${$('#submitteremail').val()}\n` +
        ` - ***${softwareName}:*** ${softwareObject.description.en}`,
      commit: `Commited by ${$('#submitteremail').val()}`,
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: fileSoftware,
          content: '---\n' + jsyaml.dump(softwareObject)
        }
      ]
    },
    method: 'POST'
  };
}

function getConfigUpdateUse(config, adminName, softwareUse, fileUse) {
  config.body.title += ` and updated use for ${adminName}`;
  config.body.description += `\n - ***${softwareUse.uses[0].name.en}:*** ${
    softwareUse.uses[0].description.en
  }`;
  config.body.files[config.body.files.length] = {
    path: fileUse,
    content: '---\n' + jsyaml.dump(softwareUse)
  };
}

function getConfigNewUse(config, adminName, softwareUse, fileUse) {
  config.body.title += ` and created use for ${adminName}`;
  config.body.description += `\n - ***${softwareUse.uses[0].name.en}:*** ${
    softwareUse.uses[0].description.en
  }`;
  config.body.files[config.body.files.length] = {
    path: fileUse,
    content: '---\n' + jsyaml.dump(softwareUse)
  };
}

function configNewAdmin(config, fileAdmin, adminObject) {
  config.body.title += ' (new administration)';
  config.body.files[config.body.files.length] = {
    path: fileAdmin,
    content: '---\n' + jsyaml.dump(adminObject)
  };
}

function getFinalConfig(config) {
  config.body = JSON.stringify(config.body);
  return config;
}

function selectSoftware() {
  let software = softwareSelect.val();
  if (software != '') {
    $.get(
      `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/${branch}/_data/db/software/softwares/${software}.yml`,
      function(result) {
        let data = jsyaml.load(result);
        addValueToFieldsSoftware(data);
      }
    );
  } else resetFieldsSoftware();
}

function addValueToFieldsSoftware(obj) {
  // TODO: More-groups
  $('#enname').val(obj['name']['en']);
  $('#frname').val(obj['name']['fr']);
  $('#endescription').val(obj['description']['en']);
  $('#frdescription').val(obj['description']['fr']);
  $('#enhomepageURL').val(obj['homepageURL']['en']);
  $('#frhomepageURL').val(obj['homepageURL']['fr']);
  $('#enlicencesURL').val(obj['licences'][0]['URL']['en']);
  $('#frlicencesURL').val(obj['licences'][0]['URL']['fr']);
  $('#licencesspdxID').val(obj['licences'][0]['spdxID']);
  addTags(obj);
}

function resetFieldsSoftware() {
  $('#enname').val('');
  $('#frname').val('');
  $('#endescription').val('');
  $('#frdescription').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  $('#enlicencesURL').val('');
  $('#frlicencesURL').val('');
  $('#licencesspdxID').val('');
  $('#enname').focus();
  $('#frname').focus();
  resetTags();
}

function selectAdmin() {
  let software = softwareSelect.val();
  let administration = adminSelect.val();
  if (software != '' && administration != '') {
    $.get(
      `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/${branch}/_data/db/software/uses/${software}/${administration}.yml`,
      function(result) {
        let data = jsyaml.load(result);
        addValueToFieldsAdmin(data);
      }
    ).fail(function() {
      resetFieldsAdmin();
    });
  } else resetFieldsAdmin();
}

function addValueToFieldsAdmin(obj) {
  // TODO: More-groups
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
  $('#useenname').val(obj['uses'][0]['name']['en']);
  $('#usefrname').val(obj['uses'][0]['name']['fr']);
  $('#useendescription').val(obj['uses'][0]['description']['en']);
  $('#usefrdescription').val(obj['uses'][0]['description']['fr']);

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
  $('#status').val('');
}
