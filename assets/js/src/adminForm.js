/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  submitInit submitConclusion
*/

function getAdminObject() {
  let adminObject = {
    code: $('#NewAdminCode').val(),
    provinceCode: $('#ProvinceCode').val(),
    name: {
      en: $('#enName').val(),
      fr: $('#frName').val()
    }
  };

  return adminObject;
}

function submitAdminForm() {
  let submitButton = document.getElementById('prbotSubmitadminForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let adminObject = getAdminObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/administrations/${$('#OrgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(file, adminObject, '', 'code')
    .then(result => {
      const config = getConfigUpdate(result, file);
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        const config = getConfigNew(adminObject, file);
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    })
    .then(response => {
      submitConclusion(response, submitButton, resetButton);
    });
}

function getConfigUpdate(result, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${$('#OrgLevel').val()} file`,
      description: 'Authored by: ' + $('#SubmitterEmail').val() + '\n',
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

function getConfigNew(adminObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created an administration file',
      description: 'Authored by: ' + $('#SubmitterEmail').val() + '\n',
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
            jsyaml.dump(adminObject, {
              lineWidth: 160
            })
        }
      ]
    }),
    method: 'POST'
  };
}

$('#prbotSubmitadminForm').click(function() {
  if (submitInit()) submitAdminForm();
});
