/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode
  resetMoreGroup addMoreGroup
  getToday
*/

const standardSelect = $('.page-standardForm #standardAcronymselect');
const adminSelect = $('.page-standardForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitstandardForm').click(function() {
    if (submitInit()) {
      if ($('#newAdminCode').val() != '') submitStandardFormNewAdmin();
      else submitStandardForm();
    }
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

function getStandardObject() {
  // Mandatory fields
  let standardObject = {
    schemaVersion: '1.0',
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
    administrations: [
      {
        adminCode: getAdminCode(),
        contact: {
          email: $('#contactemail').val()
        },
        date: {
          created: $('#datecreated').val(),
          metadataLastUpdated: getToday()
        },
        references: [],
        status: $('#status').val()
      }
    ]
  };

  // More-groups
  $('#addMorereference ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    standardObject.administrations[0].references[i] = {
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
    standardObject.administrations[0].contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    standardObject.administrations[0].contact.URL.en = $('#encontactURL').val();
  }
  if ($('#frcontactURL').val()) {
    standardObject.administrations[0].contact.URL.fr = $('#frcontactURL').val();
  }

  if ($('#contactname').val()) {
    standardObject.administrations[0].contact.name = $('#contactname').val();
  }

  return standardObject;
}

function submitStandardForm() {
  let submitButton = document.getElementById('prbotSubmitstandardForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let standardObject = getStandardObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/standard/${standardObject.standardAcronym.toLowerCase()}.yml`;

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

function getConfigNew(standardObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the standard file for ' + standardObject.standardAcronym,
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(standardObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function submitStandardFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitstandardForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let standardObject = getStandardObject();
  let adminObject = getAdminObject();

  let standardName = standardObject.standardAcronym.toLowerCase();
  let adminName = $('#newAdminCode').val();

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let standardFile = `_data/standard/${standardName}.yml`;
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
  let value = standardSelect.val();
  $.getJSON('https://canada-ca.github.io/ore-ero/standard.json', function(
    result
  ) {
    if (result[value]) {
      addValueToFieldsStandard(result[value]);
      $('#adminCode').focus();
    } else if (value == '') {
      resetFieldsStandard();
    } else {
      alert('Error retrieving the data');
    }
  });
}

function addValueToFieldsStandard(obj) {
  resetFieldsStandard();

  $('#standardAcronym').val(obj.standardAcronym);
  $('#enname').val(obj.name.en);
  $('#frname').val(obj.name.fr);
  $('#endescription').val(obj.description.en);
  $('#frdescription').val(obj.description.fr);
  $('#datecreated').val(obj.date.created);
  $('#enspecURL').val(obj.specURL.en);
  $('#frspecURL').val(obj.specURL.fr);
  $('#enstandardOrg').val(obj.standardOrg.en);
  $('#frstandardOrg').val(obj.standardOrg.fr);

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
  $.getJSON('https://canada-ca.github.io/ore-ero/standard.json', function(
    result
  ) {
    if (result[standard]) {
      for (let i = 0; i < result[standard].administrations.length; i++) {
        if (result[standard].administrations[i].adminCode == administration) {
          addValueToFieldsAdmin(result[standard].administrations[i]);
          break;
        } else {
          resetFieldsAdmin();
        }
      }
    } else {
      resetFieldsAdmin();
    }
  });
}

function addValueToFieldsAdmin(obj) {
  resetFieldsAdmin();

  $('#contactemail').val(obj.contact.email);
  if (obj.contact.name) $('#contactname').val(obj.contact.name);
  if (obj.contact.URL) {
    if (obj.contact.URL.en) $('#encontactURL').val(obj.contact.URL.en);
    if (obj.contact.URL.fr) $('#encontactURL').val(obj.contact.URL.fr);
  }

  $('#datecreated').val(obj.date.created);

  obj.references.forEach(function(reference, i) {
    let id;
    if (i == 0) id = '';
    else {
      id = i;
      addMoreGroup($('#addMorereference'));
    }
    $('#enreferenceURL' + id).val(reference.URL.en);
    $('#frreferenceURL' + id).val(reference.URL.fr);
    $('#enreferencename' + id).val(reference.name.en);
    $('#frreferencename' + id).val(reference.name.fr);
  });

  $('#status').val(obj.status);
}

function resetFieldsAdmin() {
  $('#encontactURL').val('');
  $('#frcontactURL').val('');
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#datecreated').val('');
  resetMoreGroup($('#addMorereference'));
  $('#status').val('');
}
