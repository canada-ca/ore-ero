/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode
  slugify getToday
*/

var branch = 'master';

var standardSelect = $('.page-standardForm #standardAcronymselect');
var adminSelect = $('.page-standardForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitstandardForm').click(function() {
    if (submitInit()) submitStandardForm();
  });

  standardSelect.change(function() {
    selectStandard();
    if (adminSelect.val() != '') selectAdmin();
  });

  adminSelect.change(function() {
    selectAdmin();
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getStandardObject(admin) {
  // Mandatory fields
  let standardObject = {
    schemaVersion: '1.0',
    date: {
      created: $('#datecreated').val(),
      metadataLastUpdated: getToday()
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
    standardAcronym: $('#standardAcronym')
      .val()
      .toUpperCase(),
    standardOrg: {
      en: $('#enstandardOrg').val(),
      fr: $('#frstandardOrg').val()
    },
    tags: {
      en: getTagsEN(),
      fr: getTagsFR()
    },
    administrations: [admin]
  };

  return standardObject;
}

function getStandardAdmin(admin) {
  // Mandatory fields
  let standardAdmin = {
    adminCode: admin,
    contact: {
      email: $('#contactemail').val()
    },
    references: [],
    status: $('#status').val()
  };

  // More-groups
  $('#addMorereference ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    standardAdmin.references[i] = {
      URL: {
        en: $('#enreferenceURL' + id).val(),
        fr: $('#frreferenceURL' + id).val()
      },
      name: {
        en: $('#enreferencename' + id).val(),
        fr: $('#frreferencename' + id).val()
      }
    };
  });

  // Optional fields
  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    standardAdmin.contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    standardAdmin.contact.URL.en = $('#encontactURL').val();
  }
  if ($('#frcontactURL').val()) {
    standardAdmin.contact.URL.fr = $('#frcontactURL').val();
  }
  if ($('#contactname').val()) {
    standardAdmin.contact.name = $('#contactname').val();
  }

  return standardAdmin;
}

function submitStandardForm() {
  let submitBtn = $('#prbotSubmitstandardForm');
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

  let standardObject = getStandardObject(adminCode);
  let standardAdmin = getStandardAdmin(adminCode);

  let standardName = slugify(standardObject.standardCode);

  let fileStandard = `_data/db/standard/standards/${slugify(standardName)}.yml`;
  let fileStdAdmin = `_data/db/standard/administrations/${slugify(
    standardName
  )}/${adminCode}.yml`;
  let fileAdmin = `_data/db/administrations/${adminCode}.yml`;

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME, branch);

  let config;

  fileWriter
    .merge(fileStandard, standardObject, 'administrations', '')
    .then(result => {
      config = getConfigUpdateStandard(standardName, result, fileStandard);
    })
    .catch(err => {
      if (err.status == 404) {
        config = getConfigNewStandard(
          standardName,
          standardObject,
          fileStandard
        );
      } else throw err;
    })
    .then(function() {
      fileWriter
        .merge(fileStdAdmin, standardAdmin, 'references', 'name.en')
        .then(result => {
          getConfigUpdateStdAdmin(config, adminName, result, fileStdAdmin);
        })
        .catch(err => {
          if (err.status == 404)
            getConfigNewStdAdmin(
              config,
              adminName,
              standardAdmin,
              fileStdAdmin
            );
          else throw err;
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
                if (err.status == 404)
                  configNewAdmin(config, fileAdmin, adminObject);
                else throw err;
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

function getConfigNewStandard(standardName, standardObject, fileStandard) {
  return getConfigStandard(
    standardName,
    standardObject,
    fileStandard,
    'Created'
  );
}

function getConfigUpdateStandard(standardName, standardObject, fileStandard) {
  return getConfigStandard(
    standardName,
    standardObject,
    fileStandard,
    'Updated'
  );
}

function getConfigStandard(standardName, standardObject, fileStandard, change) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title: `${change} ${standardName} (standard)`,
      description:
        `Authored by: ${$('#submitteremail').val()}\n` +
        ` - ***${standardName}:*** ${standardObject.name.en}`,
      commit: `Commited by ${$('#submitteremail').val()}`,
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: fileStandard,
          content: '\---\n' + jsyaml.dump(standardObject)
        }
      ]
    },
    method: 'POST'
  };
}

function getConfigUpdateStdAdmin(config, adminName, stdAdmin, fileStdAdmin) {
  getConfigStdAdmin(config, adminName, stdAdmin, fileStdAdmin, 'updated');
}

function getConfigNewStdAdmin(config, adminName, stdAdmin, fileStdAdmin) {
  getConfigStdAdmin(config, adminName, stdAdmin, fileStdAdmin, 'added');
}

function getConfigStdAdmin(config, adminName, stdAdmin, fileStdAdmin, change) {
  config.body.title += ` and ${change} relation with ${adminName}`;
  config.body.description += `\n - ***${adminName}***:`;
  if (stdAdmin.references.length == 1)
    config.body.description += ' ' + stdAdmin.references[0].name.en;
  else {
    stdAdmin.references.forEach(function(reference) {
      config.body.description += '\n   - ' + reference.name.en;
    });
  }
  config.body.description += '\n';
  config.body.files[config.body.files.length] = {
    path: fileStdAdmin,
    content: '\---\n' + jsyaml.dump(stdAdmin)
  };
}

function configNewAdmin(config, fileAdmin, adminObject) {
  config.body.title += ' (new administration)';
  config.body.files[config.body.files.length] = {
    path: fileAdmin,
    content: '\---\n' + jsyaml.dump(adminObject)
  };
}

function getFinalConfig(config) {
  config.body = JSON.stringify(config.body);
  return config;
}

function selectStandard() {
  let standard = standardSelect.val();
  if (standard != '') {
    $.get(
      `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/${branch}/_data/db/standard/standards/${standard}.yml`,
      function(result) {
        let data = jsyaml.load(result);
        addValueToFieldsStandard(data);
      }
    );
  } else resetFieldsStandard();
}

function addValueToFieldsStandard(obj) {
  $('#standardAcronym').val(obj['standardAcronym']);
  $('#enname').val(obj['name']['en']);
  $('#frname').val(obj['name']['fr']);
  $('#endescription').val(obj['description']['en']);
  $('#frdescription').val(obj['description']['fr']);
  $('#datecreated').val(obj['date']['created']);
  $('#enspecURL').val(obj['specURL']['en']);
  $('#frspecURL').val(obj['specURL']['fr']);
  $('#enstandardOrg').val(obj['standardOrg']['en']);
  $('#frstandardOrg').val(obj['standardOrg']['fr']);

  addTags(obj);
}

function resetFieldsStandard() {
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
  let standard = standardSelect.val();
  let administration = adminSelect.val();
  if (standard != '' && administration != '') {
    $.get(
      `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/${branch}/_data/db/standard/administrations/${standard}/${administration}.yml`,
      function(result) {
        let data = jsyaml.load(result);
        addValueToFieldsAdmin(data);
      }
    ).fail(resetFieldsAdmin());
  } else resetFieldsAdmin();
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
