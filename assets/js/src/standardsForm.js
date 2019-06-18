/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  validateRequired toggleAlert getTags
  ALERT_OFF ALERT_IN_PROGRESS ALERT_FAIL ALERT_SUCCESS
*/

const section = $('.page-standardsForm #StandardCodeSelect');
const admin = $('.page-standardsForm #adminCode');

$(document).ready(function() {
  $('#StandardCode').focus();

  section.change(function() {
    selectStandard();
    if (admin.val() != '') selectAdmin();
  });

  admin.change(function() {
    selectAdmin();
  });

  $('#prbotSubmitstandardsForm').click(function() {
    // Progress only when form input is valid
    if (validateRequired()) {
      toggleAlert(ALERT_OFF);
      toggleAlert(ALERT_IN_PROGRESS);
      window.scrollTo(0, document.body.scrollHeight);
      submitStandardsForm();
    }
  });
});

function getStandardsObject() {
  let standardsObject = {
    schemaVersion: $('#schemaVersion').val(),
    date: {
      created: $('#dateCreated').val(),
      metadataLastUpdated: $('#dateLastUpdated').val()
    },
    description: {
      en: $('#enDescription').val(),
      fr: $('#frDescription').val()
    },
    name: {
      en: $('#enName').val(),
      fr: $('#frName').val()
    },
    specURL: {
      en: $('#enSpecURL').val(),
      fr: $('#frSpecURL').val()
    },
    standardCode: $('#StandardCode')
      .val()
      .toUpperCase(),
    standardsOrg: $('#StandardOrg').val(),
    tags: {
      en: getTags([...document.querySelectorAll('#tagsEN input')]),
      fr: getTags([...document.querySelectorAll('#tagsFR input')])
    },
    administrations: [
      {
        adminCode: $('#adminCode').val(),
        contact: {
          email: $('#emailContact').val()
        },
        references: [
          {
            URL: {
              en: $('#enUrlReference').val(),
              fr: $('#frUrlReference').val()
            },
            name: {
              en: $('#enNameReference').val(),
              fr: $('#frNameReference').val()
            }
          }
        ],
        status: $('#Status').val()
      }
    ]
  };

  if ($('#frUrlContact').val() || $('#enUrlContact').val()) {
    standardsObject.administrations[0].contact.URL = {};
  }
  if ($('#enUrlContact').val()) {
    standardsObject.administrations[0].contact.URL.en = $(
      '#enUrlContact'
    ).val();
  }
  if ($('#frUrlContact').val()) {
    standardsObject.administrations[0].contact.URL.fr = $(
      '#frUrlContact'
    ).val();
  }

  if ($('#nameContact').val()) {
    standardsObject.administrations[0].contact.name = $('#nameContact').val();
  }

  return standardsObject;
}

function submitStandardsForm() {
  let submitButton = document.getElementById('prbotSubmitstandardsForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let name = $('#StandardCode')
    .val()
    .toLowerCase();

  let standardsObject = getStandardsObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/normes_ouvertes-open_standards/${name}.yml`;

  fileWriter
    .merge(file, standardsObject, 'administrations', 'adminCode')
    .then(result => {
      const config = {
        body: JSON.stringify({
          user: USERNAME,
          repo: REPO_NAME,
          title: `Updated the ${name} standard file`,
          description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
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
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title: 'Created the standard file for ' + name,
            description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
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
                  jsyaml.dump(standardsObject, {
                    lineWidth: 160
                  })
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

function selectStandard() {
  let value = section.val().toLowerCase();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/normes_ouvertes-open_standards.json',
    function(result) {
      if (result[value]) {
        $('#schemaVersion').val(result[value]['schemaVersion']);
        $('#StandardCode').val(result[value]['standardCode']);
        $('#enName').val(result[value]['name']['en']);
        $('#frName').val(result[value]['name']['fr']);
        $('#enDescription').val(result[value]['description']['en']);
        $('#frDescription').val(result[value]['description']['fr']);
        $('#dateCreated').val(result[value]['date']['created']);
        $('#enSpecURL').val(result[value]['specURL']['en']);
        $('#frSpecURL').val(result[value]['specURL']['fr']);
        $('#StandardOrg').val(result[value]['standardsOrg']);

        if (result[value]['tags']) {
          $('.additional-tag').remove();
          let index = 0;
          result[value]['tags']['en'].forEach(function(tag) {
            if (index == 0) $('#tagEN').val(tag);
            else
              $(`<div class="control-group input-group col-xs-2 additional-tag" style="margin-top:10px" >
                <input type="text" id="tagEN${index}" name="tag" value="${tag}" class="form-control" required="required">
                <div class="input-group-btn">
                <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
              </div></div>`).appendTo('#tagsEN');
            index++;
          });
          index = 0;
          result[value]['tags']['fr'].forEach(function(tag) {
            if (index == 0) $('#tagFR').val(tag);
            else
              $(`<div class="control-group input-group col-xs-2 additional-tag" style="margin-top:10px" >
                <input type="text" id="tagFR${index}" name="tag" value="${tag}" class="form-control" required="required">
                <div class="input-group-btn">
                <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
              </div></div>`).appendTo('#tagsFR');
            index++;
          });
        } else {
          $('#tagEN').val('');
          $('#tagFR').val('');
          $('.additional-tag').remove();
        }

        $('#adminCode').focus();
      } else if (value == '') {
        $('#schemaVersion').val('1.0');
        $('#StandardCode').val('');
        $('#enName').val('');
        $('#frName').val('');
        $('#enDescription').val('');
        $('#frDescription').val('');
        $('#dateCreated').val('');
        $('#enSpecURL').val('');
        $('#frSpecURL').val('');
        $('#StandardOrg').val('');
        $('#StandardCode').focus();
        $('#tagEN').val('');
        $('#tagFR').val('');
        $('.additional-tag').remove();
      } else {
        alert('Error retrieving the data');
      }
    }
  );
}

function selectAdmin() {
  let standard = section.val().toLowerCase();
  let administration = admin.val();
  $.getJSON(
    'https://canada-ca.github.io/ore-ero/normes_ouvertes-open_standards.json',
    function(result) {
      if (result[standard]) {
        for (let i = 0; i < result[standard]['administrations'].length; i++) {
          if (
            result[standard]['administrations'][i]['adminCode'] ==
            administration
          ) {
            if (result[standard]['administrations'][i]['contact']['URL']) {
              if (
                result[standard]['administrations'][i]['contact']['URL']['en']
              )
                $('#enUrlContact').val(
                  result[standard]['administrations'][i]['contact']['URL']['en']
                );
              if (
                result[standard]['administrations'][i]['contact']['URL']['fr']
              )
                $('#frUrlContact').val(
                  result[standard]['administrations'][i]['contact']['URL']['fr']
                );
            }
            if (result[standard]['administrations'][i]['contact']['email'])
              $('#emailContact').val(
                result[standard]['administrations'][i]['contact']['email']
              );
            if (result[standard]['administrations'][i]['contact']['name'])
              $('#nameContact').val(
                result[standard]['administrations'][i]['contact']['name']
              );
            $('#enUrlReference').val(
              result[standard]['administrations'][i]['references'][0]['URL'][
                'en'
              ]
            );
            $('#frUrlReference').val(
              result[standard]['administrations'][i]['references'][0]['URL'][
                'fr'
              ]
            );
            $('#enNameReference').val(
              result[standard]['administrations'][i]['references'][0]['name'][
                'en'
              ]
            );
            $('#frNameReference').val(
              result[standard]['administrations'][i]['references'][0]['name'][
                'fr'
              ]
            );

            $('#Status').val(result[standard]['administrations'][i]['status']);
            break;
          } else {
            $('#enUrlContact').val('');
            $('#frUrlContact').val('');
            $('#emailContact').val('');
            $('#nameContact').val('');
            $('#enUrlReference').val('');
            $('#frUrlReference').val('');
            $('#enNameReference').val('');
            $('#frNameReference').val('');
            $('#Status').val('');
          }
        }
      } else {
        console.log('standard empty of not found');
      }
    }
  );
}
