/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode slugify
  addMoreLicences resetMoreGroup fillLicenceField
  getToday
*/

const softwareSelect = $('.page-softwareForm #nameselect');
const adminSelect = $('.page-softwareForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitsoftwareForm').click(function() {
    if (submitInit()) {
      if ($('#ennewAdminName').val() != '') submitSoftwareFormNewAdmin();
      else submitFormSoftware();
    }
  });

  softwareSelect.change(function() {
    selectSoftware();
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

function getsoftwareObject() {
  // Mandatory fields
  let softwareObject = {
    schemaVersion: '1.0',
    description: {
      whatItDoes: {
        en: $('#endescriptionwhatItDoes').val(),
        fr: $('#frdescriptionwhatItDoes').val()
      }
    },
    category: $('#category :selected').val(),
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
    administrations: [
      {
        adminCode: getAdminCode(),
        uses: [
          {
            contact: {
              email: $('#contactemail').val()
            },
            date: {
              started: $('#date').val(),
              metadataLastUpdated: getToday()
            }
          }
        ]
      }
    ]
  };

  // More-groups
  addMoreLicences(softwareObject);

  // Optional fields
  if (
    $('#endescriptionhowItWorks').val() ||
    $('#frdescriptionhowItWorks').val()
  ) {
    softwareObject.description.howItWorks = {};
  }
  if ($('#endescriptionhowItWorks').val()) {
    softwareObject.description.howItWorks.en = $(
      '#endescriptionhowItWorks'
    ).val();
  }
  if ($('#frdescriptionhowItWorks').val()) {
    softwareObject.description.howItWorks.fr = $(
      '#frdescriptionhowItWorks'
    ).val();
  }

  if ($('#contactname').val()) {
    softwareObject.administrations[0].uses[0].contact.name = $(
      '#contactname'
    ).val();
  }

  if ($('#enteam').val() || $('#frteam').val()) {
    softwareObject.administrations[0].uses[0].team = {};
    if ($('#enteam').val())
      softwareObject.administrations[0].uses[0].team.en = $('#enteam').val();
    if ($('#frteam').val())
      softwareObject.administrations[0].uses[0].team.fr = $('#frteam').val();
  }

  return softwareObject;
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
  let submitButton = document.getElementById('prbotSubmitsoftwareForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let softwareObject = getsoftwareObject();
  let adminObject = getAdminObject();
  let softwareName = $('#enname').val();
  let adminName = slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  );

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let softwareFile = `_data/software/${slugify(softwareName)}.yml`;
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
          let url =
            $('html').attr('lang') == 'en'
              ? './open-source-softwares.html'
              : './logiciels-libres.html';
          submitConclusion(response, submitButton, resetButton, url);
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

function submitFormSoftware() {
  let submitButton = document.getElementById('prbotSubmitsoftwareForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let softwareObject = getsoftwareObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let ProjectName = $('#enname').val();
  let file = `_data/software/${slugify(ProjectName)}.yml`;

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
      let url =
        $('html').attr('lang') == 'en'
          ? './open-source-softwares.html'
          : './logiciels-libres.html';
      submitConclusion(response, submitButton, resetButton, url);
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
        $('#endescriptionwhatItDoes').val() +
        '\n',
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
        $('#endescriptionwhatItDoes').val() +
        '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(softwareObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function selectSoftware() {
  let value = softwareSelect.val();
  $.getJSON('https://canada-ca.github.io/ore-ero/software.json', function(
    result
  ) {
    if (result[value]) {
      addValueToFieldsSoftware(result[value]);
      $('#adminCode').focus();
    } else if (value == '') {
      resetFieldsSoftware();
    } else {
      alert('Error retrieving the data');
    }
  });
}

function addValueToFieldsSoftware(obj) {
  resetFieldsSoftware();

  $('#enname').val(obj.name.en);
  $('#frname').val(obj.name.fr);
  $('#endescriptionwhatItDoes').val(obj.description.whatItDoes.en);
  $('#frdescriptionwhatItDoes').val(obj.description.whatItDoes.fr);

  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#endescriptionhowItWorks').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frdescriptionhowItWorks').val(obj.description.howItWorks.fr);
  }

  $('#category').val(obj.category);
  $('#enhomepageURL').val(obj.homepageURL.en);
  $('#frhomepageURL').val(obj.homepageURL.fr);
  fillLicenceField(obj.licences);
  addTags(obj);
}

function resetFieldsSoftware() {
  $('#enname').val('');
  $('#frname').val('');
  $('#endescriptionwhatItDoes').val('');
  $('#frdescriptionwhatItDoes').val('');
  $('#endescriptionhowItWorks').val('');
  $('#frdescriptionhowItWorks').val('');
  $('#category').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  resetMoreGroup($('#addMorelicences'));
  resetTags();
}

function selectAdmin() {
  let software = softwareSelect.val();
  let administration = adminSelect.val();
  $.getJSON('https://canada-ca.github.io/ore-ero/software.json', function(
    result
  ) {
    if (result[software]) {
      for (let i = 0; i < result[software].administrations.length; i++) {
        if (result[software].administrations[i].adminCode == administration) {
          addValueToFieldsAdmin(result[software].administrations[i]);
          break;
        } else {
          resetFieldsAdmin();
        }
      }
    }
  });
}

function addValueToFieldsAdmin(obj) {
  resetFieldsAdmin();

  $('#contactemail').val(obj.uses[0].contact.email);
  if (obj.uses[0].contact.name) $('#contactname').val(obj.uses[0].contact.name);

  $('#date').val(obj.uses[0].date.started);
  if (obj.team) {
    if (obj.team.en) $('#enteam').val(obj.team.en);
    if (obj.team.fr) $('#frteam').val(obj.team.fr);
  }
}

function resetFieldsAdmin() {
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#date').val('');
  $('#enteam').val('');
  $('#frteam').val('');
}
