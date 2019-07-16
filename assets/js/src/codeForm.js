/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags getLanguages selectLanguage resetLanguages
  submitInit submitConclusion
  getAdminObject getAdminCode
  addMoreLicenses addMoreRelatedCode
*/

const codeObj = $('.page-codeForm #nameselect');
const adminObj = $('.page-codeForm #adminCode');

$(document).ready(function() {
  adminObj.change(function() {
    selectAdmin();
  });

  codeObj.change(function() {
    selectCode();
  });

  $('#prbotSubmitcodeForm').click(function() {
    if (submitInit()) {
      if ($('#newAdminCode').val() != '') submitFormAdminCodeForm();
      else submitCodeForm();
    }
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
    resetLanguages();
  });
});

function getCodeObject() {
  // Handles mandatory fields
  let codeObject = {
    schemaVersion: '1.0',
    adminCode: getAdminCode(),
    releases: [
      {
        contact: {
          email: $('#contactemail').val()
        },
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
        licenses: [],
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

  // Handle more-groups
  addMoreLicenses(codeObject.releases[0]);

  // Handle optional fields
  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    codeObject.releases[0].contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    codeObject.releases[0].contact.URL.en = $('#encontactURL').val();
  }
  if ($('#frcontactURL').val()) {
    codeObject.releases[0].contact.URL.fr = $('#frcontactURL').val();
  }

  if ($('#contactname').val()) {
    codeObject.releases[0].contact.name = $('#contactname').val();
  }

  if ($('#contactphone').val()) {
    codeObject.releases[0].contact.phone = $('#contactphone').val();
  }

  if ($('#datelastModified').val()) {
    codeObject.releases[0].date.lastModified = $('#datelastModified')
      .val()
      .toString();
  }

  if ($('#endownloadUrl').val() || $('#frdownloadUrl').val()) {
    codeObject.releases[0].downloadURL = {};
  }
  if ($('#endownloadUrl').val()) {
    codeObject.releases[0].downloadURL.en = $('#endownloadUrl').val();
  }
  if ($('#frdownloadUrl').val()) {
    codeObject.releases[0].downloadURL.fr = $('#frdownloadUrl').val();
  }

  if ($('#enhomepageURL').val() || $('#frhomepageURL').val()) {
    codeObject.releases[0].homepageURL = {};
  }
  if ($('#enhomepageURL').val()) {
    codeObject.releases[0].homepageURL.en = $('#enhomepageURL').val();
  }
  if ($('#frhomepageURL').val()) {
    codeObject.releases[0].homepageURL.fr = $('#frhomepageURL').val();
  }

  let languages = getLanguages();
  if (languages.length > 0) {
    codeObject.releases[0].languages = languages;
  }

  if ($('#enorganization').val() || $('#frorganization').val()) {
    codeObject.releases[0].organization = {};
  }
  if ($('#enorganization').val()) {
    codeObject.releases[0].organization.en = $('#enorganization').val();
  }
  if ($('#frorganization').val()) {
    codeObject.releases[0].organization.fr = $('#frorganization').val();
  }

  // Optional more-group
  $('#addMorepartners ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    if (
      $('#enpartnersURL' + id).val() ||
      $('#frpartnersURL' + id).val() ||
      $('#partnersemail' + id).val() ||
      $('#enpartnersname' + id).val() ||
      $('#frpartnersname' + id).val()
    ) {
      if (codeObject.releases[0].partners == undefined)
        codeObject.releases[0].partners = [];
      codeObject.releases[0].partners[i] = {};
    }

    if ($('#enpartnersURL' + id).val() || $('#frpartnersURL' + id).val()) {
      codeObject.releases[0].partners[i].URL = {};
    }
    if ($('#enpartnersURL' + id).val()) {
      codeObject.releases[0].partners[i].URL.en = $(
        '#enpartnersURL' + id
      ).val();
    }
    if ($('#frpartnersURL' + id).val()) {
      codeObject.releases[0].partners[i].URL.fr = $(
        '#frpartnersURL' + id
      ).val();
    }

    if ($('#partnersemail' + id).val()) {
      codeObject.releases[0].partners[i].email = $('#partnersemail' + id).val();
    }

    if ($('#enpartnersname' + id).val() || $('#frpartnersname' + id).val()) {
      codeObject.releases[0].partners[i].name = {};
    }
    if ($('#enpartnersname' + id).val()) {
      codeObject.releases[0].partners[i].name.en = $(
        '#enpartnersname' + id
      ).val();
    }
    if ($('#frpartnersname' + id).val()) {
      codeObject.releases[0].partners[i].name.fr = $(
        '#frpartnersname' + id
      ).val();
    }
  });

  addMoreRelatedCode(codeObject.releases[0]);

  if ($('#status :selected').val() != '') {
    codeObject.releases[0].status = $('#status :selected').val();
  }

  return codeObject;
}

function getSelectedOrgType() {
  if ($('#adminCode').val() != '')
    return $('#adminCode :selected')
      .parent()
      .attr('label')
      .toLowerCase();
  else return $('#orgLevel').val();
}

function submitFormAdminCodeForm() {
  let submitButton = document.getElementById('prbotSubmitcodeForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let codeObject = getCodeObject();
  let adminObject = getAdminObject();

  let codeName = codeObject.releases[0].name.en;
  let adminName = $('#newAdminCode').val();

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let codeFile = `_data/code/${$('#orgLevel').val()}/${$(
    '#newAdminCode'
  ).val()}.yml`;
  let adminFile = `_data/administrations/${getSelectedOrgType()}.yml`;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then(resultAdmin => {
      fileWriter
        .merge(codeFile, codeObject, 'releases', 'name.en')
        .catch(err => {
          if (err.status == 404) {
            return fetch(
              PRBOT_URL,
              getConfigNewAdmin(
                codeName,
                adminName,
                codeFile,
                codeObject,
                adminFile,
                resultAdmin
              )
            );
          } else throw err;
        })
        .then(response => {
          submitConclusion(response, submitButton, resetButton);
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
    body: JSON.stringify({
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
        $('#endescription').val() +
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
    }),
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
  fileWriter
    .merge(file, codeObject, 'releases', 'name.en')
    .then(result => {
      const config = getConfigUpdate(result, file);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(PRBOT_URL, getConfigNew(codeObject, file));
      } else throw err;
    })
    .then(response => {
      submitConclusion(response);
    });
}

function getConfigUpdate(result, file) {
  return {
    body: JSON.stringify({
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
          content: '---\n' + jsyaml.dump(result)
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNew(codeObject, file) {
  return {
    body: JSON.stringify({
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
          content: '---\n' + jsyaml.dump(codeObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function selectAdmin() {
  let lang = $('html').attr('lang');
  let admin = adminObj.val();
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
        resetFields();
      } else {
        orgLevel.releases.forEach(function(release) {
          $(
            '<option class="additional-option" value="' +
              release.name[lang] +
              '">' +
              release.name[lang] +
              (release.version ? ' (' + release.version + ')' : '') +
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
    resetFields();
  }
}

function selectCode() {
  let lang = $('html').attr('lang');
  let admin = adminObj.val();
  let code = codeObj.val();
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

function getOrgLevel(result, admin) {
  let federal = result.federal[admin];
  let provincial = result.provincial[admin];
  let municipal = result.municipal[admin];

  let orgLevel;

  if (municipal != undefined) orgLevel = municipal;
  else if (provincial != undefined) orgLevel = provincial;
  else if (federal != undefined) orgLevel = federal;

  return orgLevel;
}

function addValueToFields(obj) {
  $('#enname').val(obj.name.en);
  $('#frname').val(obj.name.fr);
  $('#endescription').val(obj.description.en);
  $('#frdescription').val(obj.description.fr);

  if (obj.contact.url) {
    if (obj.contact.URL.en) $('#encontactURL').val(obj.contact.URL.en);
    if (obj.contact.URL.fr) $('#frcontactURL').val(obj.contact.URL.fr);
  }
  $('#contactemail').val(obj.contact.email);
  if (obj.contact.name) $('#contactname').val(obj.contact.name);
  if (obj.contact.phone) $('#contactphone').val(obj.contact.phone);

  $('#datecreated').val(obj.date.created);
  $('#datelastModified').val(obj.date.datelastModified);

  $('#enlicensesURL').val(obj.licenses[0].URL.en);
  $('#frlicensesURL').val(obj.licenses[0].URL.fr);
  $('#licensesspdxID').val(obj.licenses[0].spdxID);

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

  resetLanguages();
  if (obj.languages != undefined) {
    obj.languages.forEach(function(language) {
      selectLanguage(language);
    });
  }

  if (obj.organizations) {
    if (obj.organizations.en) $('#enorganization').val(obj.organizations.en);
    if (obj.organizations.fr) $('#frorganization').val(obj.organizations.fr);
  }

  if (obj.partners) {
    if (obj.partners.URL) {
      if (obj.partners.URL.en) $('#enpartnersURL').val(obj.partners.URL.en);
      if (obj.partners.URL.fr) $('#frpartnersURL').val(obj.partners.URL.fr);
    }
    if (obj.partners.email) $('#partnersemail').val(obj.partners.email);
    if (obj.partners.name) {
      if (obj.partners.name.en) $('#enpartnersname').val(obj.partners.name.en);
      if (obj.partners.name.fr) $('#frpartnersname').val(obj.partners.name.fr);
    }
  }

  if (obj.relatedCode) {
    if (obj.relatedCode[0].URL) {
      if (obj.relatedCode[0].URL.en)
        $('#enrelatedCodeURL').val(obj.relatedCode[0].URL.en);
      if (obj.relatedCode[0].URL.fr)
        $('#frrelatedCodeURL').val(obj.relatedCode[0].URL.fr);
    }
    if (obj.relatedCode[0].name) {
      if (obj.relatedCode[0].name.en)
        $('#enrelatedCodename').val(obj.relatedCode[0].name.en);
      if (obj.relatedCode[0].name.fr)
        $('#frrelatedCodename').val(obj.relatedCode[0].name.fr);
    }
  }

  if (obj.status) $('#status').val(obj.status);
}

function resetFields() {
  $('#enname').val('');
  $('#frname').val('');
  $('#endescription').val('');
  $('#frdescription').val('');
  $('#encontactURL').val('');
  $('#frcontactURL').val('');
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#contactphone').val('');
  $('#datecreated').val('');
  $('#datelastModified').val('');
  $('#enlicensesURL').val('');
  $('#frlicensesURL').val('');
  $('#licensesspdxID').val('');
  resetTags();
  $('#enrepositoryUrl').val('');
  $('#frrepositoryUrl').val('');
  $('#endownloadUrl').val('');
  $('#frdownloadUrl').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  resetLanguages();
  $('#enorganization').val('');
  $('#frorganization').val('');
  $('#enpartnersURL').val('');
  $('#frpartnersURL').val('');
  $('#partnersemail').val('');
  $('#enpartnersname').val('');
  $('#frpartnersname').val('');
  $('#enrelatedCodeURL').val('');
  $('#frrelatedCodeURL').val('');
  $('#enrelatedCodename').val('');
  $('#frrelatedCodename').val('');
  $('#status').val('');
}
