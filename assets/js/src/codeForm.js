/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags getLanguages selectLanguage resetLanguages
  submitInit submitConclusion
  getAdminObject getAdminCode
  addMoreLicences addMoreRelatedCode
  slugify
*/

var adminSelect = $('.page-codeForm #adminCode');
var codeSelect = $('.page-codeForm #nameselect');

$(document).ready(function() {
  $('#prbotSubmitcodeForm').click(function() {
    if (submitInit()) submitCodeForm();
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
  });
});

function getCodeAdminObject(name) {
  let codeAdminObject = {
    adminCode: getAdminCode(),
    releases: [name]
  };

  return codeAdminObject;
}

function getCodeReleaseObject() {
  let codeReleaseObject = {
    schemaVersion: '1.0',
    administration: getAdminCode(),
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
    licences: [],
    repositoryURL: {
      en: $('#enrepositoryUrl').val(),
      fr: $('#frrepositoryUrl').val()
    },
    tags: {
      en: getTagsEN(),
      fr: getTagsFR()
    }
  };

  addMoreLicences(codeReleaseObject);

  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    codeReleaseObject.contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    codeReleaseObject.contact.URL.en = $('#encontactURL').val();
  }
  if ($('#frcontactURL').val()) {
    codeReleaseObject.contact.URL.fr = $('#frcontactURL').val();
  }
  if ($('#contactname').val()) {
    codeReleaseObject.contact.name = $('#contactname').val();
  }
  if ($('#contactphone').val()) {
    codeReleaseObject.contact.phone = $('#contactphone').val();
  }

  if ($('#datelastModified').val()) {
    codeReleaseObject.date.lastModified = $('#datelastModified')
      .val()
      .toString();
  }

  if ($('#endownloadUrl').val() || $('#frdownloadUrl').val()) {
    codeReleaseObject.downloadURL = {};
  }
  if ($('#endownloadUrl').val()) {
    codeReleaseObject.downloadURL.en = $('#endownloadUrl').val();
  }
  if ($('#frdownloadUrl').val()) {
    codeReleaseObject.downloadURL.fr = $('#frdownloadUrl').val();
  }

  if ($('#enhomepageURL').val() || $('#frhomepageURL').val()) {
    codeReleaseObject.homepageURL = {};
  }
  if ($('#enhomepageURL').val()) {
    codeReleaseObject.homepageURL.en = $('#enhomepageURL').val();
  }
  if ($('#frhomepageURL').val()) {
    codeReleaseObject.homepageURL.fr = $('#frhomepageURL').val();
  }

  let languages = getLanguages();
  if (languages.length > 0) {
    codeReleaseObject.languages = languages;
  }

  if ($('#enorganization').val() || $('#frorganization').val()) {
    codeReleaseObject.organization = {};
  }
  if ($('#enorganization').val()) {
    codeReleaseObject.organization.en = $('#enorganization').val();
  }
  if ($('#frorganization').val()) {
    codeReleaseObject.organization.fr = $('#frorganization').val();
  }

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
      if (codeReleaseObject.partners == undefined)
        codeReleaseObject.partners = [];
      codeReleaseObject.partners[i] = {};
    }

    if ($('#enpartnersURL' + id).val() || $('#frpartnersURL' + id).val()) {
      codeReleaseObject.partners[i].URL = {};
    }
    if ($('#enpartnersURL' + id).val()) {
      codeReleaseObject.partners[i].URL.en = $('#enpartnersURL' + id).val();
    }
    if ($('#frpartnersURL' + id).val()) {
      codeReleaseObject.partners[i].URL.fr = $('#frpartnersURL' + id).val();
    }

    if ($('#partnersemail' + id).val()) {
      codeReleaseObject.partners[i].email = $('#partnersemail' + id).val();
    }

    if ($('#enpartnersname' + id).val() || $('#frpartnersname' + id).val()) {
      codeReleaseObject.partners[i].name = {};
    }
    if ($('#enpartnersname' + id).val()) {
      codeReleaseObject.partners[i].name.en = $('#enpartnersname' + id).val();
    }
    if ($('#frpartnersname' + id).val()) {
      codeReleaseObject.partners[i].name.fr = $('#frpartnersname' + id).val();
    }
  });

  addMoreRelatedCode(codeReleaseObject);

  if ($('#status :selected').val() != '') {
    codeReleaseObject.status = $('#status :selected').val();
  }

  return codeReleaseObject;
}

function submitCodeForm() {
  let submitBtn = $('#prbotSubmitcodeForm');
  let resetBtn = $('#formReset');
  submitBtn.disabled = true;
  resetBtn.disabled = true;

  let codeReleaseObject = getCodeReleaseObject();
  let codeAdminObject = getCodeAdminObject(codeReleaseObject.name.en);
  let adminObject = getAdminObject();

  let codeName = codeReleaseObject.name.en;
  let adminName = adminObject.name.en;
  let adminCode = adminObject.code == '' ? getAdminCode() : adminObject.code;

  let fileCodeRelease = `_data/db/code/releases/${adminCode}/${slugify(
    codeName
  )}.yml`;
  let fileCodeAdmin = `_data/db/code/administrations/${adminCode}.yml`;
  let fileAdmin = `_data/db/administrations/${adminCode}.yml`;

  let fileWriter = new YamlWriter(
    'VilledeMontreal',
    REPO_NAME,
    'improvement/db'
  );

  if (adminObject.code != '') {
    fileWriter
      .merge(fileAdmin, adminObject, '', 'code')
      .then(console.log('Administration with same code already exists'))
      .catch(err => {
        // Expected behaviour
        if (err.status == 404) {
          return fetch(
            PRBOT_URL,
            getConfigNewAdmin(
              codeName,
              adminName,
              codeReleaseObject,
              codeAdminObject,
              adminObject,
              fileCodeRelease,
              fileCodeAdmin,
              fileAdmin
            )
          );
        }
      })
      .then(response => {
        submitConclusion(response, submitBtn, resetBtn);
      });
  } else {
    fileWriter
      .merge(fileCodeAdmin, codeAdminObject, 'releases', '')
      .then(result => {
        return fetch(
          PRBOT_URL,
          getConfigUpdateCode(
            codeName,
            codeReleaseObject,
            result,
            fileCodeRelease,
            fileCodeAdmin
          )
        );
      })
      .catch(err => {
        if (err.status == 404) {
          return fetch(
            PRBOT_URL,
            getConfigNewCode(
              codeName,
              codeReleaseObject,
              codeAdminObject,
              fileCodeRelease,
              fileCodeAdmin
            )
          );
        } else throw err;
      })
      .then(response => {
        submitConclusion(response, submitBtn, resetBtn);
      });
  }
}

function getConfigNewAdmin(
  codeName,
  adminName,
  codeReleaseObject,
  codeAdminObject,
  adminObject,
  fileCodeRelease,
  fileCodeAdmin,
  fileAdmin
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Created ${codeName} (code) for ${adminName} (new administration).`,
      description:
        `Authored by: ${$('#submitteremail').val()}\n` +
        ` - ***${codeName}:*** ${codeReleaseObject.description.en}\n` +
        ` - New ${adminObject.parent} administration ***${adminName}***`,
      commit: `Commited by ${$('#submitteremail').val()}`,
      author: {
        name: $('#submitteremail').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: fileCodeRelease,
          content: '\---\n' + jsyaml.dump(codeReleaseObject)
        },
        {
          path: fileCodeAdmin,
          content: '\---\n' + jsyaml.dump(codeAdminObject)
        },
        {
          path: fileAdmin,
          content: '\---\n' + jsyaml.dump(adminObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigUpdateCode(
  codeName,
  codeReleaseObject,
  codeAdminObject,
  fileCodeRelease,
  fileCodeAdmin
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `New or Updated ${codeName} (code).`,
      description:
        `Authored by: ${$('#submitteremail').val()}\n` +
        ` - ***${codeName}:*** Updated`,
      commit: `Commited by ${$('#submitteremail').val()}`,
      author: {
        name: $('#submitteremail').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: fileCodeRelease,
          content: '\---\n' + jsyaml.dump(codeReleaseObject)
        },
        {
          path: fileCodeAdmin,
          content: '\---\n' + jsyaml.dump(codeAdminObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNewCode(
  codeName,
  codeReleaseObject,
  codeAdminObject,
  fileCodeRelease,
  fileCodeAdmin
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `New code: ${codeName}.`,
      description:
        `Authored by: ${$('#submitteremail').val()}\n` +
        ` - ***${codeName}:*** ${codeReleaseObject.description.en}`,
      commit: `Commited by ${$('#submitteremail').val()}`,
      author: {
        name: $('#submitteremail').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: fileCodeRelease,
          content: '\---\n' + jsyaml.dump(codeReleaseObject)
        },
        {
          path: fileCodeAdmin,
          content: '\---\n' + jsyaml.dump(codeAdminObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function selectAdmin() {
  let lang = $('html').attr('lang');
  let admin = adminSelect.val();
  $('.additional-option').remove();
  if (admin != '') {
    $.get(
      `https://raw.githubusercontent.com/VilledeMontreal/${REPO_NAME}/improvement/db/_data/db/code/administrations/${admin}.yml`,
      function(resultAdmin) {
        let data = jsyaml.load(resultAdmin);
        data.releases.forEach(function(release) {
          let r = slugify(release);
          $.get(
            `https://raw.githubusercontent.com/VilledeMontreal/${REPO_NAME}/improvement/db/_data/db/code/releases/${admin}/${r}.yml`,
            function(resultRelease) {
              let name = jsyaml.load(resultRelease).name[lang];
              $(
                `<option class="additional-option" value="${name}">${name}</option>`
              ).appendTo('#nameselect');
              $('#nameselect')
                .prop('disabled', false)
                .parent()
                .removeClass('hide');
            }
          );
        });
      }
    ).fail(function() {
      $('#nameselect')
        .prop('disabled', true)
        .parent()
        .addClass('hide');
      resetFields();
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
  let admin = adminSelect.val();
  let release = slugify(codeSelect.val());
  if (release != '') {
    $.get(
      `https://raw.githubusercontent.com/VilledeMontreal/${REPO_NAME}/improvement/db/_data/db/code/releases/${admin}/${release}.yml`,
      function(result) {
        let data = jsyaml.load(result);
        addValueToFields(data);
      }
    );
  } else {
    resetFields();
  }
}

function addValueToFields(obj) {
  // TODO: More-groups
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

  $('#enlicencesURL').val(obj.licences[0].URL.en);
  $('#frlicencesURL').val(obj.licences[0].URL.fr);
  $('#licencesspdxID').val(obj.licences[0].spdxID);

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
  $('#enlicencesURL').val('');
  $('#frlicencesURL').val('');
  $('#licencesspdxID').val('');
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
