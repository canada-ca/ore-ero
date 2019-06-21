/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  validateRequired toggleAlert getTags resetTags addTags
  ALERT_OFF ALERT_IN_PROGRESS ALERT_FAIL ALERT_SUCCESS
*/

const ossObj = $('.page-ossForm #ProjectNameSelect');
const adminObj = $('.page-ossForm #adminCode');

$(document).ready(function() {
  $('#enProjectName').focus();

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
      submitStandardsForm();
    }
  });
});

function getOssObject() {
  // Required fields are included first.
  let ossObject = {
    schemaVersion: $('#schemaVersion').val(),
    description: {
      en: $('#enDescription').val(),
      fr: $('#frDescription').val()
    },
    homepageURL: {
      en: $('#enHomepageUrl').val(),
      fr: $('#frHomepageUrl').val()
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
    name: {
      en: $('#enProjectName').val(),
      fr: $('#frProjectName').val()
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
              email: $('#emailContact').val()
            },
            date: {
              started: $('#dateStarted').val(),
              metadataLastUpdated: $('#dateLastUpdated').val()
            },
            description: {
              en: $('#enUseDescription').val(),
              fr: $('#enUseDescription').val()
            },
            name: {
              en: $('#enUseName').val(),
              fr: $('#frUseName').val()
            },
          }
        ]
      }
    ]
  };

  // Then we handle all optional fields.

  // contact.URL
  if ($('#frUrlContact').val() || $('#enUrlContact').val()) {
    ossObject.administrations[0].uses[0].contact.URL = {};
  }
  if ($('#enUrlContact').val()) {
    ossObject.administrations[0].uses[0].contact.URL.en = $('#enUrlContact').val();
  }
  if ($('#frUrlContact').val()) {
    ossObject.administrations[0].uses[0].contact.URL.fr = $('#frUrlContact').val();
  }

  // contact.name, TODO: update to match schema
  if ($('#nameContact').val()) {
    ossObject.administrations[0].uses[0].contact.name = $('#nameContact').val();
  }

  // relatedCode TODO: support multiple relatedCode fields
  if (
    $('#enUrlRelatedCode').val() ||
    $('#frUrlRelatedCode').val() ||
    $('#enNameRelatedCode').val() ||
    $('#frNameRelatedCode').val()
  ) {
    ossObject.administrations[0].uses[0].relatedCode = [{}];
  }
  // relatedCode.URL
  if ($('#enUrlRelatedCode').val() || $('#frUrlRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL = {};
  }
  if ($('#enUrlRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.en = $('#enUrlRelatedCode').val();
  }
  if ($('#frUrlRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].URL.fr = $('#frUrlRelatedCode').val();
  }
  // relatedCode.name
  if ($('#enNameRelatedCode').val() || $('#frNameRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name = {};
  }
  if ($('#enNameRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.en = $(
      '#enNameRelatedCode'
    ).val();
  }
  if ($('#frNameRelatedCode').val()) {
    ossObject.administrations[0].uses[0].relatedCode[0].name.fr = $(
      '#frNameRelatedCode'
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
  let ProjectName =$('#enProjectName').val().toLowerCase();
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
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated software for ${ProjectName} `,
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

function getConfigNew(ossObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the software file for ' + ProjectName ,
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
  console.log(value);
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
  $('#enProjectName').val(obj['name']['en']);
  $('#frProjectName').val(obj['name']['fr']);
  $('#enDescription').val(obj['description']['en']);
  $('#frDescription').val(obj['description']['fr']);
  $('#enHomepageUrl').val(obj['homepageURL']['en']);
  $('#frHomepageUrl').val(obj['homepageURL']['fr']);
  $('#enLicenses').val(obj['licenses'][0]['URL']['en']);
  $('#frLicenses').val(obj['licenses'][0]['URL']['fr']);
  $('#spdxID').val(obj['licenses'][0]['spdxID']);
  addTags(obj);
}

function resetFieldsOss() {
  $('#schemaVersion').val('1.0');
  $('#enProjectName').val('');
  $('#frProjectName').val('');
  $('#enDescription').val('');
  $('#frDescription').val('');
  $('#enHomepageUrl').val('');
  $('#frHomepageUrl').val('');
  $('#enLicenses').val('');
  $('#frLicenses').val('');
  $('#spdxID').val('');
  $('#enProjectName').focus();
  $('#frProjectName').focus();
  resetTags();
}