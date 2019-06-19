/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  validateRequired toggleAlert
  ALERT_OFF ALERT_IN_PROGRESS ALERT_FAIL ALERT_SUCCESS
*/

function getAdminObject() {
  let adminObject = {
    code: $('#adminCode').val(),
    provinceCode: $('#provinceCode').val(),
    name: {
      en: $('#enOrganisationName').val(),
      fr: $('#frOrganisationName').val()
    }
  };
  return adminObject;
}

function submitAdminForm() {
  let submitButton = document.getElementById('adminPrbotSubmit');
  let resetButton = document.getElementById('adminCodeFormReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let adminObject = getAdminObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(file, adminObject, '', 'code')
    .then(result => {
      const config = {
        body: JSON.stringify({
          user: USERNAME,
          repo: REPO_NAME,
          title: `Updated the ${$('#orgLevel').val()} file`,
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
            title: 'Created an administration file',
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
                  jsyaml.dump(adminObject, {
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

$('#adminPrbotSubmit').click(function() {
  // Progress only when form input is valid
  if (validateRequired()) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_IN_PROGRESS);
    window.scrollTo(0, document.body.scrollHeight);
    submitAdminForm();
  }
});
