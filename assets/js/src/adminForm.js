/* exported getAdminObject getAdminCode */

/*
  global $
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  submitInit submitConclusion
*/

var newAdminON = false;

$(document).ready(function() {
  $('#prbotSubmitadminForm').click(function() {
    if (submitInit()) submitAdminForm();
  });

  $('#newAdminButton').click(function() {
    if (!newAdminON) showNewAdminForm();
    else hideNewAdminForm();
  });

  $('#removeNewAdminButton').click(function() {
    hideNewAdminForm();
  });

  $('#adminCode').change(function() {
    if (newAdminON) {
      hideNewAdminForm();
    }
  });
});

function showNewAdminForm() {
  $('#newAdmin').removeClass('hide');
  $('#adminCode').removeAttr('required');
  $('label[for="adminCode"]').removeClass('required');
  $('label[for="adminCode"] strong').addClass('hide');
  $('#adminCode')
    .prop('selectedIndex', 0)
    .change();

  newAdminON = true;
}

function hideNewAdminForm() {
  $('#newAdmin').addClass('hide');
  $('#adminCode').attr('required', 'required');
  $('label[for="adminCode"]').addClass('required');
  $('label[for="adminCode"] strong').removeClass('hide');

  newAdminON = false;
  resetNewAdminForm();
}

function resetNewAdminForm() {
  $('#orgLevel').prop('selectedIndex', 1);
  $('#newAdminCode').val('');
  $('#provinceSelect').prop('selectIndex', 0);
  $('#ennewAdminName').val('');
  $('#frnewAdminName').val('');
}

function getAdminObject() {
  let adminObject = {
    code: $('#newAdminCode').val(),
    provinceCode: $('#provinceSelect').val(),
    name: {
      en: $('#ennewAdminName').val(),
      fr: $('#frnewAdminName').val()
    }
  };

  return adminObject;
}

function getAdminCode() {
  return $('#adminCode').val() == ''
    ? $('#newAdminCode').val()
    : $('#adminCode').val();
}

function submitAdminForm() {
  let submitButton = document.getElementById('prbotSubmitadminForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let adminObject = getAdminObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(file, adminObject, '', 'code')
    .then(result => {
      return fetch(PRBOT_URL, getConfigUpdate(result, file));
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(PRBOT_URL, getConfigNew(adminObject, file));
      } else throw err;
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
      title: `Updated the ${$('#orgLevel').val()} file`,
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

function getConfigNew(adminObject, file) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created an administration file',
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(adminObject)
        }
      ]
    }),
    method: 'POST'
  };
}
