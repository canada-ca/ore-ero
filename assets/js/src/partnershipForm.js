/*
  global
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode getSelectedOrgType getOrgLevel hideNewAdminForm
  resetMoreGroup
  addMorePartners getNewAdminPartnerPromise fillPartnersField resetPartners
  getToday
*/

const partnershipSelect = $('.page-partnershipForm #nameselect');
const adminSelect = $('.page-partnershipForm #adminCode');

$(document).ready(function () {
  $('#prbotSubmitpartnershipForm').click(function () {
    if (submitInit()) {
      submitForm();
    }
  });

  adminSelect.change(function () {
    selectAdmin();
  });

  partnershipSelect.change(function () {
    selectPartnership();
  });

  $('#formReset').click(function () {
    $('#validation').trigger('reset');
    resetTags();
    hideNewAdminForm();
    resetPartners();
  });
});

function getPartnershipObject() {
  // Mandatory fields
  let partnershipObject = {
    schemaVersion: '1.0',
    adminCode: getAdminCode(),
    projects: [
      {
        contact: {
          email: $('#contactemail').val(),
        },
        category: $('#category :selected').val(),
        date: {
          closed: $('#dateclosed').val(),
          started: $('#datestarted').val(),
          metadataLastUpdated: getToday(),
        },
        description: {
          whatItDoes: {
            en: $('#endescriptionwhatItDoes').val(),
            fr: $('#frdescriptionwhatItDoes').val(),
          },
        },
        name: {
          en: $('#enname').val(),
          fr: $('#frname').val(),
        },
      },
    ],
  };

  // Optional fields
  if ($('#contactname').val()) {
    partnershipObject.projects[0].contact.name = $('#contactname').val();
  }
  if ($('#contactphone').val()) {
    partnershipObject.projects[0].contact.phone = $('#contactphone').val();
  }

  if (
    $('#endescriptionhowItWorks').val() ||
    $('#frdescriptionhowItWorks').val()
  ) {
    partnershipObject.projects[0].description.howItWorks = {};
    if ($('#endescriptionhowItWorks').val()) {
      partnershipObject.projects[0].description.howItWorks.en = $(
        '#endescriptionhowItWorks'
      ).val();
    }
    if ($('#frdescriptionhowItWorks').val()) {
      partnershipObject.projects[0].description.howItWorks.fr = $(
        '#frdescriptionhowItWorks'
      ).val();
    }
  }

  addMorePartners(partnershipObject.projects[0]);

  let tagsEN = getTagsEN();
  let tagsFR = getTagsFR();
  if (tagsEN.length != 0 || tagsFR.length != 0) {
    partnershipObject.projects[0].tags = {};
    if (tagsEN.length != 0) partnershipObject.projects[0].tags.en = tagsEN;
    if (tagsFR.length != 0) partnershipObject.projects[0].tags.fr = tagsFR;
  }

  if ($('#enteam').val() || $('#frteam').val()) {
    partnershipObject.projects[0].team = {};
    if ($('#enteam').val()) {
      partnershipObject.projects[0].team.en = $('#enteam').val();
    }
    if ($('#frteam').val()) {
      partnershipObject.projects[0].team.fr = $('#frteam').val();
    }
  }

  return partnershipObject;
}

function submitForm() {
  let submitBtn = $('#prbotSubmitpartnershipForm');
  let resetBtn = $('#formReset');
  submitBtn.disabled = true;
  resetBtn.disabled = true;

  let partnershipObject = getPartnershipObject();
  let adminObject = getAdminObject();

  let partnershipName = partnershipObject.projects[0].name.en;
  let adminCode = getAdminCode();
  let adminName = adminObject.name.en
    ? adminObject.name.en
    : $('#adminCode :selected').html();

  let partnershipFile = `_data/partnership/${getSelectedOrgType()}/${
    $('#ennewAdminName').val() != '' ? adminCode : $('#adminCode').val()
  }.yml`;
  let adminFile = `_data/administrations/${$('#orgLevel').val()}.yml`;

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);

  let config;

  fileWriter
    .merge(partnershipFile, partnershipObject, 'projects', 'name.en')
    .then((resultPartnership) => {
      config = getConfigBase(
        'Updated',
        partnershipName,
        adminName,
        partnershipFile,
        resultPartnership
      );
    })
    .catch((err) => {
      if (err.status == 404)
        config = getConfigBase(
          'Created',
          partnershipName,
          adminName,
          partnershipFile,
          partnershipObject
        );
      else throw err;
    })
    .then(function () {
      let adminPromise = [];
      if ($('#ennewAdminName').val() != '') {
        adminPromise.push(
          fileWriter
            .mergeAdminFile(adminFile, adminObject, '', 'code')
            .then((resultAdmin) => {
              addNewAdminToConfig(
                config,
                adminName,
                adminCode,
                adminFile,
                resultAdmin
              );
            })
        );
      }
      Promise.all(adminPromise).then(function () {
        let newAdminPartnerPromise = getNewAdminPartnerPromise(
          partnershipObject.projects[0],
          fileWriter,
          config
        );
        Promise.all(newAdminPartnerPromise)
          .then(function () {
            config.body.description = config.body.description + '\n';
            config.body = JSON.stringify(config.body);
            return fetch(PRBOT_URL, config);
          })
          .then((response) => {
            let url =
              $('html').attr('lang') == 'en'
                ? './partnerships.html'
                : './partenariats.html';
            submitConclusion(response, submitBtn, resetBtn, url);
          });
      });
    });
}

function getConfigBase(change, projectName, adminName, file, object) {
  return {
    body: {
      user: USERNAME,
      repo: REPO_NAME,
      title:
        change + ' ' + projectName + ' partnership project under ' + adminName,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Partnership project: ***' +
        projectName +
        '***\n' +
        $('#endescriptionwhatItDoes').val(),
      commit: 'Commited by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val(),
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(object),
        },
      ],
    },
    method: 'POST',
  };
}

function addNewAdminToConfig(config, name, adminCode, file, object) {
  config.body.title = config.body.title + ' (new) ';
  config.body.description =
    config.body.description +
    '\n\n' +
    'New Administration:' +
    '\n' +
    ' - ***' +
    name +
    '*** (' +
    adminCode +
    ')';
  config.body.files[config.body.files.length] = {
    path: file,
    content: '---\n' + jsyaml.dump(object),
  };
}

function selectAdmin() {
  resetFields();
  let lang = $('html').attr('lang');
  let admin = adminSelect.val();
  $('.additional-option').remove();
  if (admin != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/partnership.json', function (
      result
    ) {
      let orgLevel = getOrgLevel(result, admin);
      if (orgLevel == undefined) {
        $('#nameselect').prop('disabled', true).parent().addClass('hide');
      } else {
        orgLevel.projects.sort(function (a, b) {
          let aName = a.name[lang].toLowerCase();
          let bName = b.name[lang].toLowerCase();
          return aName < bName ? -1 : aName > bName ? 1 : 0;
        });
        orgLevel.projects.forEach(function (project) {
          $(
            '<option class="additional-option" value="' +
              project.name[lang] +
              '">' +
              project.name[lang] +
              '</option>'
          ).appendTo('#nameselect');
        });
        $('#nameselect').prop('disabled', false).parent().removeClass('hide');
      }
    });
  } else {
    $('#nameselect').prop('disabled', true).parent().addClass('hide');
  }
}

function selectPartnership() {
  let lang = $('html').attr('lang');
  let admin = adminSelect.val();
  let partnership = partnershipSelect.val();
  if (partnership != '') {
    $.getJSON('https://canada-ca.github.io/ore-ero/partnership.json', function (
      result
    ) {
      let orgLevel = getOrgLevel(result, admin);
      if (orgLevel == undefined) {
        resetFields();
      } else {
        for (let i = 0; i < orgLevel.projects.length; i++) {
          if (orgLevel.projects[i].name[lang] == partnership) {
            addValueToFields(orgLevel.projects[i]);
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

  $('#enname').val(obj.name.en).prop('disabled', true);
  $('#frname').val(obj.name.fr).attr('disabled', true);

  $('#endescriptionwhatItDoes').val(obj.description.whatItDoes.en);
  $('#frdescriptionwhatItDoes').val(obj.description.whatItDoes.fr);
  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#endescriptionhowItWorks').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frdescriptionhowItWorks').val(obj.description.howItWorks.fr);
  }

  if (obj.team) {
    if (obj.team.en) $('#enteam').val(obj.team.en);
    if (obj.team.fr) $('#frteam').val(obj.team.fr);
  }

  $('#category').val(obj.category);

  addTags(obj);

  $('#contactemail').val(obj.contact.email);
  if (obj.contact.name) $('#contactname').val(obj.contact.name);
  if (obj.contact.phone) $('#contactphone').val(obj.contact.phone);

  $('#datestarted').val(obj.date.started);
  $('#dateclosed').val(obj.date.closed);

  fillPartnersField(obj);
}

function resetFields() {
  $('#enname').val('').prop('disabled', false);
  $('#frname').val('').prop('disabled', false);
  $('#endescriptionwhatItDoes').val('');
  $('#frdescriptionwhatItDoes').val('');
  $('#endescriptionhowItWorks').val('');
  $('#frdescriptionhowItWorks').val('');
  $('#enteam').val('');
  $('#frteam').val('');
  $('#category').val('');
  resetTags();
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#contactphone').val('');
  $('#datestarted').val('');
  $('#dateclosed').val('');
  resetMoreGroup($('#addMorepartners'));
}
