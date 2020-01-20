/*
  global
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode hideNewAdminForm slugify
  addMoreLicences resetMoreGroup fillLicenceField
  getToday addMoreGroup
*/

const researchSelect = $('.page-researchForm #nameselect');
const adminSelect = $('.page-researchForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitresearchForm').click(function() {
    if (submitInit()) {
      if ($('#ennewAdminName').val() != '') submitResearchFormNewAdmin();
      else submitResearchForm();
    }
  });

  researchSelect.change(function() {
    selectResearch();
    if (adminSelect.val() != '') selectAdmin();
  });

  adminSelect.change(function() {
    selectAdmin();
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
    hideNewAdminForm();
    resetMoreGroup($('#addMorelicences'));
  });
});

function getresearchObject() {
  // Mandatory fields
  let researchObject = {
    schemaVersion: '1.0',
    description: {
      whatItDoes: {
        en: $('#endescriptionwhatItDoes').val(),
        fr: $('#frdescriptionwhatItDoes').val()
      }
    },
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
    homepageURL: {
      en: $('#enhomepageURL').val(),
      fr: $('#frhomepageURL').val()
    },
    researchAcronym: $('#researchAcronym')
      .val()
      .toUpperCase(),
    researchOrg: {
      en: $('#enresearchOrg').val(),
      fr: $('#frresearchOrg').val()
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
          created: $('#date').val(),
          metadataLastUpdated: getToday()
        },
        references: [],
        status: $('#status').val()
      }
    ]
  };

  // More-groups

  addMoreLicences(researchObject);

  $('#addMorereference ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    researchObject.administrations[0].references[i] = {
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
  if (
    $('#endescriptionhowItWorks').val() ||
    $('#frdescriptionhowItWorks').val()
  ) {
    researchObject.description.howItWorks = {};
    if ($('#endescriptionhowItWorks').val())
      researchObject.description.howItWorks.en = $(
        '#endescriptionhowItWorks'
      ).val();
    if ($('#frdescriptionhowItWorks').val())
      researchObject.description.howItWorks.fr = $(
        '#frdescriptionhowItWorks'
      ).val();
  }

  if ($('#contactname').val()) {
    researchObject.administrations[0].contact.name = $('#contactname').val();
  }

  if ($('#enteam').val() || $('#frteam').val()) {
    researchObject.administrations[0].team = {};
    if ($('#enteam').val())
      researchObject.administrations[0].team.en = $('#enteam').val();
    if ($('#frteam').val())
      researchObject.administrations[0].team.fr = $('#frteam').val();
  }

  return researchObject;
}

function submitResearchForm() {
  let submitButton = document.getElementById('prbotSubmitresearchForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let researchObject = getresearchObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/research/${researchObject.researchAcronym.toLowerCase()}.yml`;

  fileWriter
    .merge(file, researchObject, 'administrations', 'adminCode')
    .then(result => {
      return fetch(
        PRBOT_URL,
        getConfigUpdate(result, file, researchObject.researchAcronym)
      );
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(PRBOT_URL, getConfigNew(researchObject, file));
      } else throw err;
    })
    .then(response => {
      let url =
        $('html').attr('lang') == 'en'
          ? './open-researches.html'
          : './recherches-libres.html';
      submitConclusion(response, submitButton, resetButton, url);
    });
}

function getConfigUpdate(result, file, code) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${code} research file`,
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

function getConfigNew(researchObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the research file for ' + researchObject.researchAcronym,
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(researchObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function submitResearchFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitresearchForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let researchObject = getresearchObject();
  let adminObject = getAdminObject();

  let researchName = researchObject.researchAcronym.toLowerCase();
  let adminName = slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  );

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let researchFile = `_data/research/${researchName}.yml`;
  let adminFile = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then(adminResult => {
      fileWriter
        .merge(researchFile, researchObject, 'administrations', 'adminCode')
        .then(researchResult => {
          return fetch(
            PRBOT_URL,
            getConfigUpdateResearchNewAdmin(
              researchName,
              adminName,
              researchFile,
              adminFile,
              researchResult,
              adminResult
            )
          );
        })
        .catch(err => {
          if (err.status == 404) {
            return fetch(
              PRBOT_URL,
              getConfigNewResearchNewAdmin(
                researchName,
                adminName,
                researchFile,
                adminFile,
                researchObject,
                adminResult
              )
            );
          } else throw err;
        })
        .then(response => {
          let url =
            $('html').attr('lang') == 'en'
              ? './open-researches.html'
              : './recherches-libres.html';
          submitConclusion(response, submitButton, resetButton, url);
        });
    })
    .catch(err => {
      if (err.status == 404) console.log('File not Found');
      else throw err;
    });
}

function getConfigUpdateResearchNewAdmin(
  researchName,
  adminName,
  researchFile,
  adminFile,
  researchResult,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Updated research file for ' +
        researchName +
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
          path: researchFile,
          content: '---\n' + jsyaml.dump(researchResult)
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

function getConfigNewResearchNewAdmin(
  researchName,
  adminName,
  researchFile,
  adminFile,
  researchObject,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Creaded research file for ' +
        researchName +
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
          path: researchFile,
          content: '---\n' + jsyaml.dump(researchObject)
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

function selectResearch() {
  let value = researchSelect.val();
  $.getJSON('http://localhost:4000/ore-ero/research.json', function(result) {
    if (result[value]) {
      addValueToFieldsResearch(result[value]);
      $('#adminCode').focus();
    } else if (value == '') {
      resetFieldsResearch();
    } else {
      alert('Error retrieving the data');
    }
  });
}

function addValueToFieldsResearch(obj) {
  resetFieldsResearch();

  $('#researchAcronym')
    .val(obj.researchAcronym)
    .prop('disabled', true);
  $('#enname')
    .val(obj.name.en)
    .prop('disabled', true);
  $('#frname')
    .val(obj.name.fr)
    .prop('disabled', true);

  $('#endescriptionwhatItDoes').val(obj.description.whatItDoes.en);
  $('#frdescriptionwhatItDoes').val(obj.description.whatItDoes.fr);
  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#endescriptionhowItWorks').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frdescriptionhowItWorks').val(obj.description.howItWorks.fr);
  }
  $('#enhomepageURL').val(obj.homepageURL.en);
  $('#frhomepageURL').val(obj.homepageURL.fr);
  $('#enresearchOrg').val(obj.researchOrg.en);
  $('#frresearchOrg').val(obj.researchOrg.fr);
  fillLicenceField(obj.licences);

  addTags(obj);
}

function resetFieldsResearch() {
  $('#researchAcronym')
    .val('')
    .prop('disabled', false);
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
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  $('#enspecURL').val('');
  $('#frspecURL').val('');
  $('#enresearchOrg').val('');
  $('#frresearchOrg').val('');
  resetMoreGroup($('#addMorelicences'));
  resetTags();
}

function selectAdmin() {
  let research = researchSelect.val();
  let administration = adminSelect.val();
  $.getJSON('http://localhost:4000/ore-ero/research.json', function(result) {
    if (result[research]) {
      for (let i = 0; i < result[research].administrations.length; i++) {
        if (result[research].administrations[i].adminCode == administration) {
          addValueToFieldsAdmin(result[research].administrations[i]);
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

  $('#date').val(obj.date.created);

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

  if (obj.team) {
    if (obj.team.en) $('#enteam').val(obj.team.en);
    if (obj.team.fr) $('#frteam').val(obj.team.fr);
  }
}

function resetFieldsAdmin() {
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#date').val('');
  resetMoreGroup($('#addMorereference'));
  $('#status').val('');
  $('#enteam').val('');
  $('#frteam').val('');
}
