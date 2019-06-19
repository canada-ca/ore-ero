/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  validateRequired toggleAlert getTags resetTags
  ALERT_OFF ALERT_IN_PROGRESS ALERT_FAIL ALERT_SUCCESS
*/

const codeObj = $('.page-codeForm #ProjectNameSelect');
const adminObj = $('.page-codeForm #adminCode');

$(document).ready(function() {
  adminObj.focus();

  adminObj.change(function() {
    selectAdmin();
  });

  codeObj.change(function() {
    selectCode();
  });

  $('#prbotSubmitcode').click(function() {
    // Progress only when form input is valid
    if (validateRequired()) {
      toggleAlert(ALERT_OFF);
      toggleAlert(ALERT_IN_PROGRESS);
      window.scrollTo(0, document.body.scrollHeight);
      submitCodeForm();
    }
  });
});

function getCodeObject() {
  let codeObject = {
    schemaVersion: $('#schemaVersion').val(),
    adminCode: $('#adminCode').val(),
    releases: [
      {
        contact: {
          email: $('#emailContact').val()
        },
        date: {
          created: $('#dateCreated').val(),
          metadataLastUpdated: $('#dateLastUpdated').val()
        },
        description: {
          en: $('#enDescription').val(),
          fr: $('#frDescription').val()
        },
        name: {
          en: $('#enProjectName').val(),
          fr: $('#frProjectName').val()
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
        repositoryURL: {
          en: $('#enRepositoryUrl').val(),
          fr: $('#frRepositoryUrl').val()
        },
        tags: {
          en: getTags([...document.querySelectorAll('#tagsEN input')]),
          fr: getTags([...document.querySelectorAll('#tagsFR input')])
        }
      }
    ]
  };

  if ($('#frUrlContact').val() || $('#enUrlContact').val()) {
    codeObject.releases[0].contact.URL = {};
  }
  if ($('#enUrlContact').val()) {
    codeObject.releases[0].contact.URL.en = $('#enUrlContact').val();
  }
  if ($('#frUrlContact').val()) {
    codeObject.releases[0].contact.URL.fr = $('#frUrlContact').val();
  }

  if ($('#nameContact').val()) {
    codeObject.releases[0].contact.name = $('#nameContact').val();
  }

  if ($('#phone').val()) {
    codeObject.releases[0].contact.phone = $('#phone').val();
  }

  if ($('#dateLastModified').val()) {
    codeObject.releases[0].date.lastModified = $('#dateLastModified')
      .val()
      .toString();
  }

  if ($('#enDownloadUrl').val() || $('#frDownloadUrl').val()) {
    codeObject.releases[0].downloadURL = {};
  }
  if ($('#enDownloadUrl').val()) {
    codeObject.releases[0].downloadURL.en = $('#enDownloadUrl').val();
  }
  if ($('#frDownloadUrl').val()) {
    codeObject.releases[0].downloadURL.fr = $('#frDownloadUrl').val();
  }

  if ($('#enHomepageURL').val() || $('#frHomepageURL').val()) {
    codeObject.releases[0].homepageURL = {};
  }
  if ($('#enHomepageURL').val()) {
    codeObject.releases[0].homepageURL.en = $('#enHomepageURL').val();
  }
  if ($('#frHomepageURL').val()) {
    codeObject.releases[0].homepageURL.fr = $('#frHomepageURL').val();
  }

  let languages = $(
    'input[data-for="languages"]:checked, input[data-for="languages"][type="text"]'
  )
    .toArray()
    .map(input => input.value);
  if (languages.length > 0) {
    codeObject.releases[0].languages = languages;
  }

  if ($('#enOrganization').val() || $('#frOrganization').val()) {
    codeObject.releases[0].organization = {};
  }
  if ($('#enOrganization').val()) {
    codeObject.releases[0].organization.en = $('#enOrganization').val();
  }
  if ($('#frOrganization').val()) {
    codeObject.releases[0].organization.fr = $('#frOrganization').val();
  }

  if (
    $('#enUrlPartner').val() ||
    $('#frUrlPartner').val() ||
    $('#emailPartner').val() ||
    $('#enNamePartner').val() ||
    $('#frNamePartner').val()
  ) {
    codeObject.releases[0].partners = {};
  }

  if ($('#enUrlPartner').val() || $('#frUrlPartner').val()) {
    codeObject.releases[0].partners.URL = {};
  }
  if ($('#enUrlPartner').val()) {
    codeObject.releases[0].partners.URL.en = $('#enUrlPartner').val();
  }
  if ($('#frUrlPartner').val()) {
    codeObject.releases[0].partners.URL.fr = $('#frUrlPartner').val();
  }

  if ($('#emailPartner').val()) {
    codeObject.releases[0].partners.email = $('#emailPartner').val();
  }

  if ($('#enNamePartner').val() || $('#frNamePartner').val()) {
    codeObject.releases[0].partners.name = {};
  }
  if ($('#enNamePartner').val()) {
    codeObject.releases[0].partners.name.en = $('#enNamePartner').val();
  }
  if ($('#frNamePartner').val()) {
    codeObject.releases[0].partners.name.fr = $('#frNamePartner').val();
  }

  if (
    $('#enUrlRelatedCode').val() ||
    $('#frUrlRelatedCode').val() ||
    $('#enNameRelatedCode').val() ||
    $('#frNameRelatedCode').val()
  ) {
    codeObject.releases[0].relatedCode = [{}];
  }

  if ($('#enUrlRelatedCode').val() || $('#frUrlRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].URL = {};
  }
  if ($('#enUrlRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].URL.en = $('#enUrlRelatedCode').val();
  }
  if ($('#frUrlRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].URL.fr = $('#frUrlRelatedCode').val();
  }

  if ($('#enNameRelatedCode').val() || $('#frNameRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].name = {};
  }
  if ($('#enNameRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].name.en = $(
      '#enNameRelatedCode'
    ).val();
  }
  if ($('#frNameRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].name.fr = $(
      '#frNameRelatedCode'
    ).val();
  }

  if ($('#status :selected').val() != '') {
    codeObject.releases[0].status = $('#status :selected').val();
  }

  if ($('#VersionProject').val()) {
    codeObject.releases[0].version = $('#VersionProject').val();
  }

  if ($('#Vcs').val()) {
    codeObject.releases[0].vcs = $('#Vcs').val();
  }

  return codeObject;
}

function getSelectedOrgType() {
  return $('#adminCode :selected')
    .parent()
    .attr('label')
    .toLowerCase();
}

function submitCodeForm() {
  let submitButton = document.getElementById('prbotSubmitcode');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let codeObject = getCodeObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$('#adminCode').val()}.yml`;
  fileWriter
    .merge(file, codeObject, 'releases', 'name.en')
    .then(result => {
      const config = getConfigUpdate(result);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        const config = getConfigNew();
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

function getConfigUpdate(result) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Updated code for ' + $('#adminCode :selected').text(),
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

function getConfigNew(result) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created code file for ' + $('#adminCode :selected').text(),
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
            jsyaml.dump(codeObject, {
              lineWidth: 160
            })
        }
      ]
    }),
    method: 'POST'
  };
}

function selectAdmin() {
  let admin = adminObj.val();
  $('.additional-option').remove();
  if(admin != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/code.json', function(result) {
      let orgLevel = getOrgLevel(result, admin);
      if(orgLevel == undefined) {
        $('#ProjectNameSelect').prop('disabled', true);
      } else {
        orgLevel.releases.forEach(function(release) {
          $('<option class="additional-option" value="' + release.name.en + '">' + release.name.en + (release.version ? ' (' + release.version + ')' : '') + '</option>').appendTo('#ProjectNameSelect');
        });
        $('#ProjectNameSelect').prop('disabled', false);
      }
      $('#ProjectName').focus();
    });
  } else {
    $('#ProjectNameSelect').prop('disabled', true);
  }
}

function selectCode() {
  let admin = adminObj.val();
  let code = codeObj.val();
  if(code != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/code.json', function(result) {
      let orgLevel = getOrgLevel(result, admin);
      if(orgLevel == undefined) {
        resetFields();
      } else {
        for (let i = 0; i < orgLevel.releases.length; i++) {
          if(orgLevel.releases[i].name.en == code) {
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
  $('#ProjectName').val(obj.name.en);
  $('#enDescription').val(obj.description.en);
  $('#frDescription').val(obj.description.fr);

  if (obj.contact.url) {
    if (obj.contact.URL.en)
      $('#enUrlContact').val(obj.contact.URL.en);
    if (obj.contact.URL.fr)
      $('#frUrlContact').val(obj.contact.URL.fr);
  }
  $('#emailContact').val(obj.contact.email);
  if (obj.contact.name)
    $('#nameContact').val(obj.contact.name);
  if (obj.contact.phone)
    $('#phone').val(obj.contact.phone);

  $('#dateCreated').val(obj.date.created);
  $('#dateLastModified').val(obj.date.metadataLastUpdated);

  $('#enLicenses').val(obj.licenses[0].URL.en);
  $('#frLicenses').val(obj.licenses[0].URL.fr);
  $('#spdxID').val(obj.licenses[0].spdxID);

  addTags(obj);

  $('#enRepositoryUrl').val(obj.repositoryURL.en);
  $('#frRepositoryUrl').val(obj.repositoryURL.fr);

  if (obj.downloadURL) {
    if (obj.downloadURL.en)
      $('#enDownloadUrl').val(obj.downloadURL.en);
    if (obj.downloadURL.fr)
      $('#frDownloadUrl').val(obj.downloadURL.fr);
  }

  if (obj.homepageURL) {
    if (obj.homepageURL.en)
      $('#enHomepageUrl').val(obj.homepageURL.en);
    if (obj.homepageURL.fr)
      $('#frHomepageUrl').val(obj.homepageURL.fr);
  }

  resetLanguages();
  if(obj.languages != undefined) {
    obj.languages.forEach(function (language) {
      $('#codeLanguage .' + language).attr('checked', true);
    });
  }

  if (obj.organizations) {
    if (obj.organizations.en)
      $('#enOrganization').val(obj.organizations.en);
    if (obj.organizations.fr)
      $('#frOrganization').val(obj.organizations.fr);
  }

  if (obj.partners) {
    if (obj.partners.URL) {
      if (obj.partners.URL.en)
        $('#enUrlPartner').val(obj.partners.URL.en);
      if (obj.partners.URL.fr)
        $('#frUrlPartner').val(obj.partners.URL.fr);
    }
    if (obj.partners.email)
      $('#emailPartner').val(obj.partners.email);
    if (obj.partners.name) {
      if (obj.partners.name.en)
        $('#enNamePartner').val(obj.partners.name.en);
      if (obj.partners.name.fr)
        $('#frNamePartner').val(obj.partners.name.fr);
    }
  }

  if (obj.relatedCode) {
    if (obj.relatedCode[0].URL) {
      if (obj.relatedCode[0].URL.en)
        $('#enUrlRelatedCode').val(obj.relatedCode[0].URL.en);
      if (obj.relatedCode[0].URL.fr)
        $('#frUrlRelatedCode').val(obj.relatedCode[0].URL.fr);
    }
    if (obj.relatedCode[0].name) {
      if (obj.relatedCode[0].name.en)
        $('#enNameRelatedCode').val(obj.relatedCode[0].name.en);
      if (obj.relatedCode[0].name.fr)
        $('#enNameRelatedCode').val(obj.relatedCode[0].name.fr);
    }
  }

  if (obj.status)
    $('#status').val(obj.status);

  if (obj.version)
    $('#VersionProject').val(obj.version);
}

function resetFields() {
  $('#ProjectName').val('');
  $('#enDescription').val('');
  $('#frDescription').val('');
  $('#enUrlContact').val('');
  $('#frUrlContact').val('');
  $('#emailContact').val('');
  $('#nameContact').val('');
  $('#phone').val('');
  $('#dateCreated').val('');
  $('#dateLastModified').val('');
  $('#enLicenses').val('');
  $('#frLicenses').val('');
  $('#spdxID').val('');
  resetTags();
  $('#enRepositoryUrl').val('');
  $('#frRepositoryUrl').val('');
  $('#enDownloadUrl').val('');
  $('#frDownloadUrl').val('');
  $('#enHomepageUrl').val('');
  $('#frHomepageUrl').val('');
  resetLanguages();
  $('#enOrganization').val('');
  $('#frOrganization').val('');
  $('#enUrlPartner').val('');
  $('#frUrlPartner').val('');
  $('#emailPartner').val('');
  $('#enNamePartner').val('');
  $('#frNamePartner').val('');
  $('#enUrlRelatedCode').val('');
  $('#frUrlRelatedCode').val('');
  $('#enNameRelatedCode').val('');
  $('#enNameRelatedCode').val('');
  $('#status').val('');
  $('#VersionProject').val('');
}

function resetLanguages() {
  $('#codeLanguages input[type="checkbox"]').each(function (i, input) {
    $(input).attr('checked', false);
  });
}
