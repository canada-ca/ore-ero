/*
  global
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags getLanguages selectLanguage resetLanguages
  submitInit submitConclusion
  getAdminObject getAdminCode getSelectedOrgType getOrgLevel hideNewAdminForm slugify
  addMoreLicences addMoreRelatedCode resetMoreGroup addMoreGroup fillLicenceField 
  addMorePartners getNewAdminPartnerPromise fillPartnersField resetPartners
  getToday
*/

const codeSelect = $('.page-codeForm #nameselect');
const adminSelect = $('.page-codeForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitcodeForm').click(function() {
    if (submitInit()) {
      if ($('#ennewAdminName').val() != '') submitFormAdminCodeForm();
      else submitCodeForm();
    }
  });

  adminSelect.change(function() {
    selectAdmin();
  });

  codeSelect.change(function() {
    selectCode();
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
    resetLanguages();
    hideNewAdminForm();
    resetMoreGroup($('#addMorelicences'));
    resetPartners();
    resetMoreGroup($('#addMorerelatedCode'));
  });
});

function getCodeObject() {
  // Mandatory fields
  let codeObject = {
    schemaVersion: '1.0',
    adminCode: getAdminCode(),
    releases: [
      {
        contact: {
          email: $('#contactemail').val()
        },
        date: {
          created: $('#date').val(),
          metadataLastUpdated: getToday()
        },
        description: {
          whatItDoes: {
            en: $('#endescriptionwhatItDoes').val(),
            fr: $('#frdescriptionwhatItDoes').val()
          }
        },
        category: $('#category :selected').val(),
        name: {
          en: $('#enname').val(),
          fr: $('#frname').val()
        },
        licences: [],
        repositoryURL: {
          en: $('#enrepositoryUrl').val(),
          fr: $('#frrepositoryUrl').val()
        },
        tags: {
          en: getTagsEN(),
          fr: getTagsFR()
        }
      }
    ]
  };

  // More-groups
  addMoreLicences(codeObject.releases[0]);

  // Handle optional fields
  if (
    $('#endescriptionhowItWorks').val() ||
    $('#frdescriptionhowItWorks').val()
  ) {
    codeObject.releases[0].description.howItWorks = {};
    if ($('#endescriptionhowItWorks').val()) {
      codeObject.releases[0].description.howItWorks.en = $(
        '#endescriptionhowItWorks'
      ).val();
    }
    if ($('#frdescriptionhowItWorks').val()) {
      codeObject.releases[0].description.howItWorks.fr = $(
        '#frdescriptionhowItWorks'
      ).val();
    }
  }

  if ($('#contactname').val()) {
    codeObject.releases[0].contact.name = $('#contactname').val();
  }

  if ($('#endownloadUrl').val() || $('#frdownloadUrl').val()) {
    codeObject.releases[0].downloadURL = {};
    if ($('#endownloadUrl').val()) {
      codeObject.releases[0].downloadURL.en = $('#endownloadUrl').val();
    }
    if ($('#frdownloadUrl').val()) {
      codeObject.releases[0].downloadURL.fr = $('#frdownloadUrl').val();
    }
  }

  if ($('#enhomepageURL').val() || $('#frhomepageURL').val()) {
    codeObject.releases[0].homepageURL = {};
    if ($('#enhomepageURL').val()) {
      codeObject.releases[0].homepageURL.en = $('#enhomepageURL').val();
    }
    if ($('#frhomepageURL').val()) {
      codeObject.releases[0].homepageURL.fr = $('#frhomepageURL').val();
    }
  }

  let languages = getLanguages();
  if (languages.length > 0) {
    codeObject.releases[0].languages = languages;
  }

  // Optional more-group
  addMorePartners(codeObject.releases[0]);

  addMoreRelatedCode(codeObject.releases[0]);

  if ($('#status :selected').val() != '') {
    codeObject.releases[0].status = $('#status :selected').val();
  }

  if ($('#enteam').val() || $('#frteam').val()) {
    codeObject.releases[0].team = {};
    if ($('#enteam').val()) {
      codeObject.releases[0].team.en = $('#enteam').val();
    }
    if ($('#frteam').val()) {
      codeObject.releases[0].team.fr = $('#frteam').val();
    }
  }

  return codeObject;
}

function submitFormAdminCodeForm() {
  let submitButton = document.getElementById('prbotSubmitcodeForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let codeObject = getCodeObject();
  let adminObject = getAdminObject();

  let codeName = codeObject.releases[0].name.en;
  let adminName = slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  );

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let codeFile = `_data/code/${$('#orgLevel').val()}/${slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  )}.yml`;
  let adminFile = `_data/administrations/${getSelectedOrgType()}.yml`;

  let config;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then(resultAdmin => {
      fileWriter
        .merge(codeFile, codeObject, 'releases', 'name.en')
        .catch(err => {
          if (err.status == 404) {
            config = getConfigNewAdmin(
              codeName,
              adminName,
              codeFile,
              codeObject,
              adminFile,
              resultAdmin
            );
          } else throw err;
        })
        .then(function() {
          let promises = getNewAdminPartnerPromise(
            codeObject.releases[0],
            fileWriter,
            config
          );
          Promise.all(promises)
            .then(function() {
              config.body = JSON.stringify(config.body);
              return fetch(PRBOT_URL, config);
            })
            .then(response => {
              let url =
                $('html').attr('lang') == 'en'
                  ? './open-source-codes.html'
                  : './codes-source-ouverts.html';
              submitConclusion(response, submitButton, resetButton, url);
            });
        });
    });
}

function getConfigNewAdmin(
  codeName,
  adminName,
  codeFile,
  codeObject,
  adminFile,
  resultAdmin
) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Created code for ' +
        codeName +
        ' and updated ' +
        $('#orgLevel').val() +
        ' administrations file with new administration ' +
        adminName,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        codeName +
        '***\n' +
        $('#endescriptionwhatItDoes').val() +
        ' and updated administration for ' +
        adminName +
        '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: codeFile,
          content: '---\n' + jsyaml.dump(codeObject)
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(resultAdmin)
        }
      ]
    },
    method: 'POST'
  };
}

function submitCodeForm() {
  let submitButton = document.getElementById('prbotSubmitcodeForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let codeObject = getCodeObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$('#adminCode').val()}.yml`;

  let config;

  fileWriter
    .merge(file, codeObject, 'releases', 'name.en')
    .then(result => {
      config = getConfigUpdate(result, file);
    })
    .catch(err => {
      if (err.status == 404) {
        config = getConfigNew(codeObject, file);
      } else throw err;
    })
    .then(function() {
      let promises = getNewAdminPartnerPromise(
        codeObject.releases[0],
        fileWriter,
        config
      );
      Promise.all(promises)
        .then(function() {
          config.body = JSON.stringify(config.body);
          return fetch(PRBOT_URL, config);
        })
        .then(response => {
          let url =
            $('html').attr('lang') == 'en'
              ? './open-source-codes.html'
              : './codes-source-ouverts.html';
          submitConclusion(response, submitButton, resetButton, url);
        });
    });
}

function getConfigUpdate(result, file) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Updated code for ' + $('#adminCode :selected').text(),
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
    },
    method: 'POST'
  };
}

function getConfigNew(codeObject, file) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created code file for ' + $('#adminCode :selected').text(),
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
          content: '---\n' + jsyaml.dump(codeObject)
        }
      ]
    },
    method: 'POST'
  };
}

function selectAdmin() {
  resetFields();
  let lang = $('html').attr('lang');
  let admin = adminSelect.val();
  $('.additional-option').remove();
  if (admin != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/code.json', function(
      result
    ) {
      let orgLevel = getOrgLevel(result, admin);
      if (orgLevel == undefined) {
        $('#nameselect')
          .prop('disabled', true)
          .parent()
          .addClass('hide');
      } else {
        orgLevel.releases.sort(function(a, b) {
          let aName = a.name[lang].toLowerCase();
          let bName = b.name[lang].toLowerCase();
          return aName < bName ? -1 : aName > bName ? 1 : 0;
        });
        orgLevel.releases.forEach(function(release) {
          $(
            '<option class="additional-option" value="' +
              release.name[lang] +
              '">' +
              release.name[lang] +
              '</option>'
          ).appendTo('#nameselect');
        });
        $('#nameselect')
          .prop('disabled', false)
          .parent()
          .removeClass('hide');
      }
    });
  } else {
    $('#nameselect')
      .prop('disabled', true)
      .parent()
      .addClass('hide');
  }
}

function selectCode() {
  let lang = $('html').attr('lang');
  let admin = adminSelect.val();
  let code = codeSelect.val();
  if (code != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/code.json', function(
      result
    ) {
      let orgLevel = getOrgLevel(result, admin);
      if (orgLevel == undefined) {
        resetFields();
      } else {
        for (let i = 0; i < orgLevel.releases.length; i++) {
          if (orgLevel.releases[i].name[lang] == code) {
            addValueToFields(orgLevel.releases[i]);
            break;
          } else resetFields();
        }
      }
    });
  } else {
    resetFields();
  }
}

function addValueToFields(obj) {
  resetFields();

  $('#enname')
    .val(obj.name.en)
    .prop('disabled', true);
  $('#frname')
    .val(obj.name.fr)
    .attr('disabled', true);

  $('#endescriptionwhatItDoes').val(obj.description.whatItDoes.en);
  $('#frdescriptionwhatItDoes').val(obj.description.whatItDoes.fr);
  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#endescriptionhowItWorks').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frdescriptionhowItWorks').val(obj.description.howItWorks.fr);
  }

  $('#category').val(obj.category);

  $('#contactemail').val(obj.contact.email);
  if (obj.contact.name) $('#contactname').val(obj.contact.name);

  $('#date').val(obj.date.created);

  fillLicenceField(obj.licences);

  addTags(obj);

  $('#enrepositoryUrl').val(obj.repositoryURL.en);
  $('#frrepositoryUrl').val(obj.repositoryURL.fr);

  if (obj.downloadURL) {
    if (obj.downloadURL.en) $('#endownloadUrl').val(obj.downloadURL.en);
    if (obj.downloadURL.fr) $('#frdownloadUrl').val(obj.downloadURL.fr);
  }

  if (obj.homepageURL) {
    if (obj.homepageURL.en) $('#enhomepageURL').val(obj.homepageURL.en);
    if (obj.homepageURL.fr) $('#frhomepageURL').val(obj.homepageURL.fr);
  }

  if (obj.languages != undefined) {
    obj.languages.forEach(function(language) {
      selectLanguage(language);
    });
  }

  fillPartnersField(obj);

  if (obj.relatedCode)
    obj.relatedCode.forEach(function(related, i) {
      let id;
      if (i == 0) id = '';
      else {
        id = i;
        addMoreGroup('#addMorerelatedCode');
      }
      if (related.URL) {
        if (related.URL.en) $('#enrelatedCodeURL' + id).val(related.URL.en);
        if (related.URL.fr) $('#frrelatedCodeURL' + id).val(related.URL.fr);
      }
      if (related.name) {
        if (related.name.en) $('#enrelatedCodename' + id).val(related.name.en);
        if (related.name.fr) $('#frrelatedCodename' + id).val(related.name.fr);
      }
    });

  if (obj.status) $('#status').val(obj.status);

  if (obj.team) {
    if (obj.team.en) $('#enteam').val(obj.team.en);
    if (obj.team.fr) $('#frteam').val(obj.team.fr);
  }
}

function resetFields() {
  $('#enname')
    .val('')
    .prop('disabled', false);
  $('#frname')
    .val('')
    .prop('disabled', false);
  $('#endescriptionwhatItDoes').val('');
  $('#frdescriptionwhatItDoes').val('');
  $('#endescriptionhowItWorks').val('');
  $('#frdescriptionhowItWorks').val('');
  $('#category').val('');
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#date').val('');
  resetMoreGroup($('#addMorelicences'));
  resetTags();
  $('#enrepositoryUrl').val('');
  $('#frrepositoryUrl').val('');
  $('#endownloadUrl').val('');
  $('#frdownloadUrl').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  resetLanguages();
  $('#enteam').val('');
  $('#frteam').val('');
  resetMoreGroup($('#addMorepartners'));
  resetMoreGroup($('#addMorerelatedCode'));
  $('#status').val('');
}
