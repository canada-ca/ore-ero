/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  validateRequired toggleAlert getTags resetTags addTags
  ALERT_OFF ALERT_IN_PROGRESS ALERT_FAIL ALERT_SUCCESS
*/

const ossObj = $('.page-ossForm #nameselect');
const adminObj = $('.page-ossForm #adminCode');

$(document).ready(function() {
  $('#enname').focus();

  ossObj.change(function() {
    selectOss();
    if (adminObj.val() != '') selectAdmin();
  });

  adminObj.change(function() {
    selectAdmin();
  });

  $('#prbotSubmitossForm').click(function() {
    // Progress only when form input is valid
    if (validateRequired()) {
      toggleAlert(ALERT_OFF);
      toggleAlert(ALERT_IN_PROGRESS);
      window.scrollTo(0, document.body.scrollHeight);
      submitFormOss();
    }
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getOssObject() {
  // Required fields are included first.
  let ossObject = {
    schemaVersion: $('#schemaVersion').val(),
    description: {
      en: $('#endescription').val(),
      fr: $('#frdescription').val()
    },
    homepageURL: {
      en: $('#enhomepageURL').val(),
      fr: $('#frhomepageURL').val()
    },
    licenses: [
      {
        URL: {
          en: $('#enlicensesURL').val(),
          fr: $('#frlicensesURL').val()
        },
        spdxID: $('licensesspdxID').val()
      }
    ],
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode: $('#adminCode').val(),
        uses: [
          {
            contact: {
              email: $('#contactemail').val()
            },
            date: {
              started: $('#datestarted').val(),
              metadataLastUpdated: $('#datemetadataLastUpdated').val()
            },
            description: {
              en: $('#useendescription').val(),
              fr: $('#usefrdescription').val()
            },
            name: {
              en: $('#enUseName').val(),
              fr: $('#frUseName').val()
            }
          }
        ]
      }
    ]
  };

  // Then we handle all optional fields.

  // contact.URL
  if ($('#frcontactURL').val() || $('#encontactURL').val()) {
    ossObject.administrations[0].uses[0].contact.URL = {};
  }
  if ($('#encontactURL').val()) {
    ossObject.administrations[0].uses[0].contact.URL.en = $(
      '#encontactURL'
    ).val();
  }
  if ($('#frcontactURL').val()) {
    ossObject.administrations[0].uses[0].contact.URL.fr = $(
      '#frcontactURL'
    ).val();
  }

  // contact.name, TODO: update to match schema
  if ($('#contactname').val()) {
    ossObject.administrations[0].uses[0].contact.name = $('#contactname').val();
  }

  // relatedCode TODO: support multiple relatedCode fields
  if (
    $('#enrelatedCodeURL').val() ||
    $('#frrelatedCodeURL').val() ||
    $('#enrelatedCodename').val() ||
    $('#frrelatedCodename').val()
  ) {
    ossObject.administrations[0].uses[0].relatedCode = [{}];
  }
  // relatedCode.URL
  if ($('#enrelatedCodeURL').val() || $('#frrelatedCodeURL').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL = {};
  }
  if ($('#enrelatedCodeURL').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.en = $(
      '#enrelatedCodeURL'
    ).val();
  }
  if ($('#frrelatedCodeURL').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.fr = $(
      '#frrelatedCodeURL'
    ).val();
  }
  // relatedCode.name
  if ($('#enrelatedCodename').val() || $('#frrelatedCodename').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name = {};
  }
  if ($('#enrelatedCodename').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.en = $(
      '#enrelatedCodename'
    ).val();
  }
  if ($('#frrelatedCodename').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.fr = $(
      '#frrelatedCodename'
    ).val();
  }

  // status
  if ($('#status :selected').val() != '') {
    ossObject.administrations[0].uses[0].status = $('#status :selected').val();
  }

  return ossObject;
}

function submitFormOss() {
  let submitButton = document.getElementById('prbotSubmitossForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let ossObject = getOssObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let ProjectName = $('#enname')
    .val()
    .toLowerCase();
  let file = `_data/logiciels_libres-open_source_software/${ProjectName}.yml`;
  fileWriter
    .merge(file, ossObject, 'administrations', 'adminCode')
    .then(result => {
      const config = getConfigUpdate(result, file);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        const config = getConfigNew(ossObject, file);
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

function getConfigUpdate(result, file) {
  let ProjectName = $('#enname').val();
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated software for ${ProjectName} `,
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
          content: jsyaml.dump(result, { lineWidth: 160 })
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNew(ossObject, file) {
  let ProjectName = $('#enname').val();
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
          content:
            '---\n' +
            jsyaml.dump(ossObject, {
              lineWidth: 160
            })
        }
      ]
    }),
    method: 'POST'
  };
}

function selectOss() {
  let value = ossObj.val().toLowerCase();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/logiciels_libres-open_source_software.json',
    function(result) {
      if (result[value]) {
        addValueToFieldsOss(result[value]);
        $('#adminCode').focus();
      } else if (value == '') {
        resetFieldsOss();
      } else {
        alert('Error retrieving the data');
      }
    }
  );
}

function addValueToFieldsOss(obj) {
  $('#schemaVersion').val(obj['schemaVersion']);
  $('#enname').val(obj['name']['en']);
  $('#frname').val(obj['name']['fr']);
  $('#endescription').val(obj['description']['en']);
  $('#frdescription').val(obj['description']['fr']);
  $('#enhomepageURL').val(obj['homepageURL']['en']);
  $('#frhomepageURL').val(obj['homepageURL']['fr']);
  $('#enlicensesURL').val(obj['licenses'][0]['URL']['en']);
  $('#frlicensesURL').val(obj['licenses'][0]['URL']['fr']);
  $('licensesspdxID').val(obj['licenses'][0]['spdxID']);
  addTags(obj);
}

function resetFieldsOss() {
  $('#schemaVersion').val('1.0');
  $('#enname').val('');
  $('#frname').val('');
  $('#endescription').val('');
  $('#frdescription').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  $('#enlicensesURL').val('');
  $('#frlicensesURL').val('');
  $('licensesspdxID').val('');
  $('#enname').focus();
  $('#frname').focus();
  resetTags();
}

function selectAdmin() {
  let oss = ossObj.val().toLowerCase();
  let administration = adminObj.val();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/logiciels_libres-open_source_software.json',
    function(result) {
      if (result[oss]) {
        for (let i = 0; i < result[oss]['administrations'].length; i++) {
          if (
            result[oss]['administrations'][i]['adminCode'] == administration
          ) {
            addValueToFieldsAdmin(result[oss]['administrations'][i]);
            break;
          } else {
            resetFieldsAdmin();
          }
        }
      } else {
        console.log('standard empty of not found');
      }
    }
  );
}

function addValueToFieldsAdmin(obj) {
  if (obj['uses'][0]['contact']['URL']) {
    if (obj['uses'][0]['contact']['URL']['en'])
      $('#encontactURL').val(obj['uses'][0]['contact']['URL']['en']);
    if (obj['uses']['contact']['URL']['fr'])
      $('#frcontactURL').val(obj['uses'][0]['contact']['URL']['fr']);
  }
  if (obj['uses'][0]['contact']['email'])
    $('#contactemail').val(obj['uses'][0]['contact']['email']);
  if (obj['uses'][0]['contact']['name'])
    $('#contactname').val(obj['uses'][0]['contact']['name']);

  $('#datestarted').val(obj['uses'][0]['date']['started']);
  $('#datemetadataLastUpdated').val(
    obj['uses'][0]['date']['metadataLastUpdated']
  );
  $('#enUseName').val(obj['uses'][0]['name']['en']);
  $('#frUseName').val(obj['uses'][0]['name']['fr']);
  $('#useendescription').val(obj['uses'][0]['description']['en']);
  $('#usefrdescription').val(obj['uses'][0]['description']['fr']);

  if (obj['uses'][0]['relatedCode']) {
    if (obj['uses'][0]['relatedCode']['URL']) {
      if (obj['uses'][0]['relatedCode']['URL']['en'])
        $('#enrelatedCodeURL').val(obj['uses'][0]['relatedCode']['URL']['en']);
      if (obj['uses'][0]['relatedCode']['URL']['fr'])
        $('#frrelatedCodeURL').val(obj['uses'][0]['relatedCode']['URL']['fr']);
    }
  }
  if (obj['uses'][0]['status']) $('#status').val(obj['uses'][0]['status']);
}

function resetFieldsAdmin() {
  $('#encontactURL').val('');
  $('#frcontactURL').val('');
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#datestarted').val('');
  $('#enUseName').val('');
  $('#frUseName').val('');
  $('#useendescription').val('');
  $('#usefrdescription').val('');
  $('#enrelatedCodeURL').val('');
  $('#frrelatedCodeURL').val('');
  $('#enrelatedCodename').val('');
  $('#frrelatedCodename').val('');
  $('#status').val('');
}
