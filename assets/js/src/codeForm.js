/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTags resetTags addTags
  submitInit submitConclusion
  getAdminObject
*/

const codeObj = $('.page-codeForm #ProjectNameSelect');
const adminObj = $('.page-codeForm #AdminCode');

$(document).ready(function() {
  adminObj.focus();

  adminObj.change(function() {
    selectAdmin();
  });

  codeObj.change(function() {
    selectCode();
  });

  $('#prbotSubmitcodeForm').click(function() {
    if (submitInit()) submitCodeForm();
  });
});

function getCodeObject() {
  let codeObject = {
    schemaVersion: $('#SchemaVersion').val(),
    adminCode: $('#AdminCode').val(),
    releases: [
      {
        contact: {
          email: $('#ContactEmail').val()
        },
        date: {
          created: $('#DateCreated').val(),
          metadataLastUpdated: $('#DateUpdated').val()
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
              en: $('#enLicensesURL').val(),
              fr: $('#frLicensesURL').val()
            },
            spdxID: $('#LicensesSpdxID').val()
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

  if ($('#frContactURL').val() || $('#enContactURL').val()) {
    codeObject.releases[0].contact.URL = {};
  }
  if ($('#enContactURL').val()) {
    codeObject.releases[0].contact.URL.en = $('#enContactURL').val();
  }
  if ($('#frContactURL').val()) {
    codeObject.releases[0].contact.URL.fr = $('#frContactURL').val();
  }

  if ($('#ContactName').val()) {
    codeObject.releases[0].contact.name = $('#ContactName').val();
  }

  if ($('#ContactPhone').val()) {
    codeObject.releases[0].contact.phone = $('#ContactPhone').val();
  }

  if ($('#DateModified').val()) {
    codeObject.releases[0].date.lastModified = $('#DateModified')
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

  if ($('#enHomepageUrl').val() || $('#frHomepageUrl').val()) {
    codeObject.releases[0].homepageURL = {};
  }
  if ($('#enHomepageUrl').val()) {
    codeObject.releases[0].homepageURL.en = $('#enHomepageUrl').val();
  }
  if ($('#frHomepageUrl').val()) {
    codeObject.releases[0].homepageURL.fr = $('#frHomepageUrl').val();
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
    $('#enPartnerUrl').val() ||
    $('#frPartnerUrl').val() ||
    $('#PartnerEmail').val() ||
    $('#enPartnerName').val() ||
    $('#frPartnerName').val()
  ) {
    codeObject.releases[0].partners = {};
  }

  if ($('#enPartnerUrl').val() || $('#frPartnerUrl').val()) {
    codeObject.releases[0].partners.URL = {};
  }
  if ($('#enPartnerUrl').val()) {
    codeObject.releases[0].partners.URL.en = $('#enPartnerUrl').val();
  }
  if ($('#frPartnerUrl').val()) {
    codeObject.releases[0].partners.URL.fr = $('#frPartnerUrl').val();
  }

  if ($('#PartnerEmail').val()) {
    codeObject.releases[0].partners.email = $('#PartnerEmail').val();
  }

  if ($('#enPartnerName').val() || $('#frPartnerName').val()) {
    codeObject.releases[0].partners.name = {};
  }
  if ($('#enPartnerName').val()) {
    codeObject.releases[0].partners.name.en = $('#enPartnerName').val();
  }
  if ($('#frPartnerName').val()) {
    codeObject.releases[0].partners.name.fr = $('#frPartnerName').val();
  }

  if (
    $('enRelatedCodeUrl').val() ||
    $('#frRelatedCodeUrl').val() ||
    $('#enRelatedCodeName').val() ||
    $('#frRelatedCodeName').val()
  ) {
    codeObject.releases[0].relatedCode = [{}];
  }

  if ($('enRelatedCodeUrl').val() || $('#frRelatedCodeUrl').val()) {
    codeObject.releases[0].relatedCode[0].URL = {};
  }
  if ($('enRelatedCodeUrl').val()) {
    codeObject.releases[0].relatedCode[0].URL.en = $('enRelatedCodeUrl').val();
  }
  if ($('#frRelatedCodeUrl').val()) {
    codeObject.releases[0].relatedCode[0].URL.fr = $('#frRelatedCodeUrl').val();
  }

  if ($('#enRelatedCodeName').val() || $('#frRelatedCodeName').val()) {
    codeObject.releases[0].relatedCode[0].name = {};
  }
  if ($('#enRelatedCodeName').val()) {
    codeObject.releases[0].relatedCode[0].name.en = $(
      '#enRelatedCodeName'
    ).val();
  }
  if ($('#frRelatedCodeName').val()) {
    codeObject.releases[0].relatedCode[0].name.fr = $(
      '#frRelatedCodeName'
    ).val();
  }

  if ($('#Status :selected').val() != '') {
    codeObject.releases[0].status = $('#Status :selected').val();
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
  return $('#AdminCode :selected')
    .parent()
    .attr('label')
    .toLowerCase();
}

function submitFormAdminCodeForm() {
  let codeObject = getCodeObject();
  let adminObject = getAdminObject();

  let submitButton = document.getElementById('prbotSubmitcodeForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let codeFile = `_data/code/${getSelectedOrgType()}/${$(
    '#AdminCode'
  ).val()}.yml`;
  let adminFile = `_data/administrations/municipal.yml`;

  fileWriter
    .merge(codeFile, codeObject, 'releases', 'name.en')
    .then(resultCode => {
      fileWriter
        .mergeAdminFile(adminFile, adminObject, '', 'code')
        .then(resultAdmin => {
          const config = {
            body: JSON.stringify({
              user: USERNAME,
              repo: REPO_NAME,
              title:
                'Updated code for ' +
                $('#AdminCode :selected').text() +
                ' and administrations for ' +
                $('#OrgLevel').val(),
              description: 'Authored by: ' + $('#SubmitterEmail').val() + '\n',
              commit: 'Committed by ' + $('#SubmitterEmail').val(),
              author: {
                name: $('#SubmitterUsername').val(),
                email: $('#SubmitterEmail').val()
              },
              files: [
                {
                  path: codeFile,
                  content: jsyaml.dump(resultCode, { lineWidth: 160 })
                },
                {
                  path: adminFile,
                  content: jsyaml.dump(resultAdmin, { lineWidth: 160 })
                }
              ]
            }),
            method: 'POST'
          };
          return fetch(PRBOT_URL, config);
        });
    })
    .catch(err => {
      if (err.status == 404) {
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title:
              'Created a code file for ' +
              $('#AdminCode :selected').text() +
              'and an administration file for' +
              $('#OrgLevel').val(),
            description: 'Authored by: ' + $('#SubmitterEmail').val() + '\n',
            commit: 'Committed by ' + $('#SubmitterEmail').val(),
            author: {
              name: $('#SubmitterUsername').val(),
              email: $('#SubmitterEmail').val()
            },
            files: [
              {
                path: codeFile,
                content: '---\n' + jsyaml.dump(codeObject, { lineWidth: 160 })
              },
              {
                path: adminFile,
                content: '---\n' + jsyaml.dump(adminObject, { lineWidth: 160 })
              }
            ]
          }),
          method: 'POST'
        };
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    })
    .then(response => {
      submitConclusion(response, submitButton, resetButton);
    });
}

function submitCodeForm() {
  let submitButton = document.getElementById('prbotSubmitcodeForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let codeObject = getCodeObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$('#AdminCode').val()}.yml`;
  fileWriter
    .merge(file, codeObject, 'releases', 'name.en')
    .then(result => {
      const config = getConfigUpdate(result, file);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        const config = getConfigNew(codeObject, file);
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
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
      title: 'Updated code for ' + $('#AdminCode :selected').text(),
      description:
        'Authored by: ' +
        $('#SubmitterEmail').val() +
        '\n' +
        'Project: ***' +
        $('#enProjectName').val() +
        '***\n' +
        $('#enDescription').val() +
        '\n',
      commit: 'Committed by ' + $('#SubmitterEmail').val(),
      author: {
        name: $('#SubmitterUsername').val(),
        email: $('#SubmitterEmail').val()
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

function getConfigNew(codeObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created code file for ' + $('#AdminCode :selected').text(),
      description:
        'Authored by: ' +
        $('#SubmitterEmail').val() +
        '\n' +
        'Project: ***' +
        $('#enProjectName').val() +
        '***\n' +
        $('#enDescription').val() +
        '\n',
      commit: 'Committed by ' + $('#SubmitterEmail').val(),
      author: {
        name: $('#SubmitterUsername').val(),
        email: $('#SubmitterEmail').val()
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
  let lang = $('html').attr('lang');
  let admin = adminObj.val();
  $('.additional-option').remove();
  if (admin != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/code.json', function(
      result
    ) {
      let orgLevel = getOrgLevel(result, admin);
      if (orgLevel == undefined) {
        $('#ProjectNameSelect')
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
          ).appendTo('#ProjectNameSelect');
        });
        $('#ProjectNameSelect')
          .prop('disabled', false)
          .parent()
          .removeClass('hide');
      }
    });
  } else {
    $('#ProjectNameSelect').prop('disabled', true);
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
  $('#enProjectName').val(obj.name.en);
  $('#frProjectName').val(obj.name.fr);
  $('#enDescription').val(obj.description.en);
  $('#frDescription').val(obj.description.fr);

  if (obj.contact.url) {
    if (obj.contact.URL.en) $('#enContactURL').val(obj.contact.URL.en);
    if (obj.contact.URL.fr) $('#frContactURL').val(obj.contact.URL.fr);
  }
  $('#ContactEmail').val(obj.contact.email);
  if (obj.contact.name) $('#ContactName').val(obj.contact.name);
  if (obj.contact.phone) $('#ContactPhone').val(obj.contact.phone);

  $('#DateCreated').val(obj.date.created);
  $('#DateModified').val(obj.date.metadataLastUpdated);

  $('#enLicensesURL').val(obj.licenses[0].URL.en);
  $('#frLicensesURL').val(obj.licenses[0].URL.fr);
  $('#LicensesSpdxID').val(obj.licenses[0].spdxID);

  addTags(obj);

  $('#enRepositoryUrl').val(obj.repositoryURL.en);
  $('#frRepositoryUrl').val(obj.repositoryURL.fr);

  if (obj.downloadURL) {
    if (obj.downloadURL.en) $('#enDownloadUrl').val(obj.downloadURL.en);
    if (obj.downloadURL.fr) $('#frDownloadUrl').val(obj.downloadURL.fr);
  }

  if (obj.homepageURL) {
    if (obj.homepageURL.en) $('#enHomepageUrl').val(obj.homepageURL.en);
    if (obj.homepageURL.fr) $('#frHomepageUrl').val(obj.homepageURL.fr);
  }

  resetLanguages();
  if (obj.languages != undefined) {
    obj.languages.forEach(function(language) {
      $('#codeLanguage .' + language).attr('checked', true);
    });
  }

  if (obj.organizations) {
    if (obj.organizations.en) $('#enOrganization').val(obj.organizations.en);
    if (obj.organizations.fr) $('#frOrganization').val(obj.organizations.fr);
  }

  if (obj.partners) {
    if (obj.partners.URL) {
      if (obj.partners.URL.en) $('#enPartnerUrl').val(obj.partners.URL.en);
      if (obj.partners.URL.fr) $('#frPartnerUrl').val(obj.partners.URL.fr);
    }
    if (obj.partners.email) $('#PartnerEmail').val(obj.partners.email);
    if (obj.partners.name) {
      if (obj.partners.name.en) $('#enPartnerName').val(obj.partners.name.en);
      if (obj.partners.name.fr) $('#frPartnerName').val(obj.partners.name.fr);
    }
  }

  if (obj.relatedCode) {
    if (obj.relatedCode[0].URL) {
      if (obj.relatedCode[0].URL.en)
        $('enRelatedCodeUrl').val(obj.relatedCode[0].URL.en);
      if (obj.relatedCode[0].URL.fr)
        $('#frRelatedCodeUrl').val(obj.relatedCode[0].URL.fr);
    }
    if (obj.relatedCode[0].name) {
      if (obj.relatedCode[0].name.en)
        $('#enRelatedCodeName').val(obj.relatedCode[0].name.en);
      if (obj.relatedCode[0].name.fr)
        $('#frRelatedCodeName').val(obj.relatedCode[0].name.fr);
    }
  }

  if (obj.status) $('#Status').val(obj.status);
  if (obj.version) $('#VersionProject').val(obj.version);
  if (obj.vcs) $('#Vcs').val(obj.vcs);
}

function resetFields() {
  $('#enProjectName').val('');
  $('#frProjectName').val('');
  $('#enDescription').val('');
  $('#frDescription').val('');
  $('#enContactURL').val('');
  $('#frContactURL').val('');
  $('#ContactEmail').val('');
  $('#ContactName').val('');
  $('#ContactPhone').val('');
  $('#DateCreated').val('');
  $('#DateModified').val('');
  $('#enLicensesURL').val('');
  $('#frLicensesURL').val('');
  $('#LicensesSpdxID').val('');
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
  $('#enPartnerUrl').val('');
  $('#frPartnerUrl').val('');
  $('#PartnerEmail').val('');
  $('#enPartnerName').val('');
  $('#frPartnerName').val('');
  $('enRelatedCodeUrl').val('');
  $('#frRelatedCodeUrl').val('');
  $('#enRelatedCodeName').val('');
  $('#frRelatedCodeName').val('');
  $('#Status').val('');
  $('#VersionProject').val('');
  $('#Vcs').val('');
}

function resetLanguages() {
  $('#codeLanguages input[type="checkbox"]').each(function(i, input) {
    $(input).attr('checked', false);
  });
}
