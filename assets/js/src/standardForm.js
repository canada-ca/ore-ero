/*
  global
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode hideNewAdminForm slugify
  resetMoreGroup addMoreGroup
  getToday
*/

const standardSelect = $('.page-standardForm #standardAcronymselect');
const adminSelect = $('.page-standardForm #adminCode');

$(document).ready(function () {
  $('#prbotSubmitstandardForm').click(function () {
    if (submitInit()) {
      if ($('#ennewAdminName').val() != '') submitStandardFormNewAdmin();
      else submitStandardForm();
    }
  });

  standardSelect.change(function () {
    selectStandard();
    if (adminSelect.val() != '') selectAdmin();
    if (standardSelect.prop('selectedIndex') == 0) setRequiredUpdate();
    else setNotRequiredUpdate();
  });

  adminSelect.change(function () {
    selectAdmin();
  });

  $('#formReset').click(function () {
    $('#validation').trigger('reset');
    resetTags();
    hideNewAdminForm();
    resetMoreGroup($('#addMorereference'));
    setRequiredUpdate();
  });
});

function setRequiredUpdate() {
  adminSelect.attr('required', 'required');
  adminSelect.prop('labels').item(0).setAttribute('class', 'h2 required');
  $('#date').attr('required', 'required');
  $('#date').prop('labels').item(0).setAttribute('class', 'h2 required');
  $('#contactemail').attr('required', 'required');
  $('#contactemail')
    .prop('labels')
    .item(0)
    .setAttribute('class', 'h2 required');
  $('#addMorereference ul.list-unstyled > li').each(function () {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    $('#enreferenceURL' + id).attr('required', 'required');
    $('#enreferenceURL' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', 'required');
    $('#frreferenceURL' + id).attr('required', 'required');
    $('#frreferenceURL' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', 'required');
    $('#enreferencename' + id).attr('required', 'required');
    $('#enreferencename' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', 'required');
    $('#frreferencename' + id).attr('required', 'required');
    $('#frreferencename' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', 'required');
  });
  $('#status').attr('required', 'required');
  $('#status').prop('labels').item(0).setAttribute('class', 'h2 required');
}

function setNotRequiredUpdate() {
  hideNewAdminForm();
  adminSelect.removeAttr('required');
  adminSelect.prop('labels').item(0).setAttribute('class', 'h2');
  $('#date').removeAttr('required');
  $('#date').prop('labels').item(0).setAttribute('class', 'h2');
  $('#contactemail').removeAttr('required');
  $('#contactemail').prop('labels').item(0).setAttribute('class', 'h2');
  $('#addMorereference ul.list-unstyled > li').each(function () {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    $('#enreferenceURL' + id).removeAttr('required');
    $('#enreferenceURL' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', '');
    $('#frreferenceURL' + id).removeAttr('required');
    $('#frreferenceURL' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', '');
    $('#enreferencename' + id).removeAttr('required');
    $('#enreferencename' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', '');
    $('#frreferencename' + id).removeAttr('required');
    $('#frreferencename' + id)
      .prop('labels')
      .item(0)
      .setAttribute('class', '');
  });
  $('#status').removeAttr('required');
  $('#status').prop('labels').item(0).setAttribute('class', 'h2');
}
function getStandardObject() {
  // Mandatory fields
  let standardObject = {
    schemaVersion: '1.0',
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
    specURL: {
      en: $('#enspecURL').val(),
      fr: $('#frspecURL').val(),
    },
    standardAcronym: $('#standardAcronym').val().toUpperCase(),
    standardOrg: {
      en: $('#enstandardOrg').val(),
      fr: $('#frstandardOrg').val(),
    },
    tags: {
      en: getTagsEN(),
      fr: getTagsFR(),
    },
    administrations: [],
  };

  // More-groups
  if (getAdminCode()) {
    standardObject.administrations[0] = {};
    standardObject.administrations[0].contact = {};
    standardObject.administrations[0].date = {};
    standardObject.administrations[0].references = [];
    standardObject.administrations[0].adminCode = getAdminCode();
    if ($('#contactemail').val())
      standardObject.administrations[0].contact.email = $(
        '#contactemail'
      ).val();
    if ($('#contactname').val()) {
      standardObject.administrations[0].contact.name = $('#contactname').val();
    }
    if ($('#enteam').val() || $('#frteam').val()) {
      standardObject.administrations[0].team = {};
      if ($('#enteam').val())
        standardObject.administrations[0].team.en = $('#enteam').val();
      if ($('#frteam').val())
        standardObject.administrations[0].team.fr = $('#frteam').val();
    }
    if ($('#date').val())
      standardObject.administrations[0].date.started = $('#date').val();
    standardObject.administrations[0].date.metadataLastUpdated = getToday();

    $('#addMorereference ul.list-unstyled > li').each(function (i) {
      let id =
        $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
      standardObject.administrations[0].references[i] = {
        URL: {
          en: $('#enreferenceURL' + id).val(),
          fr: $('#frreferenceURL' + id).val(),
        },
        name: {
          en: $('#enreferencename' + id).val(),
          fr: $('#frreferencename' + id).val(),
        },
      };
    });
    standardObject.administrations[0].status = $('#status').val();
  }
  // Optional fields
  if (
    $('#endescriptionhowItWorks').val() ||
    $('#frdescriptionhowItWorks').val()
  ) {
    standardObject.description.howItWorks = {};
    if ($('#endescriptionhowItWorks').val())
      standardObject.description.howItWorks.en = $(
        '#endescriptionhowItWorks'
      ).val();
    if ($('#frdescriptionhowItWorks').val())
      standardObject.description.howItWorks.fr = $(
        '#frdescriptionhowItWorks'
      ).val();
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
    .then((result) => {
      return fetch(
        PRBOT_URL,
        getConfigUpdate(result, file, standardObject.standardAcronym)
      );
    })
    .catch((err) => {
      if (err.status == 404) {
        return fetch(PRBOT_URL, getConfigNew(standardObject, file));
      } else throw err;
    })
    .then((response) => {
      let url =
        $('html').attr('lang') == 'en'
          ? './open-standards.html'
          : './normes-ouvertes.html';
      submitConclusion(response, submitButton, resetButton, url);
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
        email: $('#submitteremail').val(),
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(result),
        },
      ],
    }),
    method: 'POST',
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
        email: $('#submitteremail').val(),
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(standardObject),
        },
      ],
    }),
    method: 'POST',
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
  let adminName = slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  );

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let standardFile = `_data/standard/${standardName}.yml`;
  let adminFile = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then((adminResult) => {
      fileWriter
        .merge(standardFile, standardObject, 'administrations', 'adminCode')
        .then((standardResult) => {
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
        .catch((err) => {
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
        .then((response) => {
          let url =
            $('html').attr('lang') == 'en'
              ? './open-standards.html'
              : './normes-ouvertes.html';
          submitConclusion(response, submitButton, resetButton, url);
        });
    })
    .catch((err) => {
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
        email: $('#submitteremail').val(),
      },
      files: [
        {
          path: standardFile,
          content: '---\n' + jsyaml.dump(standardResult),
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(adminObject),
        },
      ],
    }),
    method: 'POST',
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
        email: $('#submitteremail').val(),
      },
      files: [
        {
          path: standardFile,
          content: '---\n' + jsyaml.dump(standardObject),
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(adminObject),
        },
      ],
    }),
    method: 'POST',
  };
}

function selectStandard() {
  let value = standardSelect.val();
  $.getJSON('../standard.json', function (result) {
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

  $('#standardAcronym').val(obj.standardAcronym).prop('disabled', true);
  $('#enname').val(obj.name.en).prop('disabled', true);
  $('#frname').val(obj.name.fr).prop('disabled', true);

  $('#endescriptionwhatItDoes').val(obj.description.whatItDoes.en);
  $('#frdescriptionwhatItDoes').val(obj.description.whatItDoes.fr);
  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#endescriptionhowItWorks').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frdescriptionhowItWorks').val(obj.description.howItWorks.fr);
  }

  $('#enspecURL').val(obj.specURL.en);
  $('#frspecURL').val(obj.specURL.fr);
  $('#enstandardOrg').val(obj.standardOrg.en);
  $('#frstandardOrg').val(obj.standardOrg.fr);

  addTags(obj);
}

function resetFieldsStandard() {
  $('#standardAcronym').val('').prop('disabled', false);
  $('#enname').val('').prop('disabled', false);
  $('#frname').val('').prop('disabled', false);
  $('#endescriptionwhatItDoes').val('');
  $('#frdescriptionwhatItDoes').val('');
  $('#endescriptionhowItWorks').val('');
  $('#frdescriptionhowItWorks').val('');
  $('#enspecURL').val('');
  $('#frspecURL').val('');
  $('#enstandardOrg').val('');
  $('#frstandardOrg').val('');
  resetTags();
}

function selectAdmin() {
  let standard = standardSelect.val();
  let administration = adminSelect.val();
  $.getJSON('../standard.json', function (result) {
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

  $('#date').val(obj.date.created);

  obj.references.forEach(function (reference, i) {
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
