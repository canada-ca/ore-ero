/* exported getAdminObject getAdminCode getSelectedOrgType getOrgLevel hideNewAdminForm*/

/* global  slugify */

var newAdminON = false;

$(document).ready(function () {
  $('#newAdminButton').click(function () {
    if (!newAdminON) showNewAdminForm();
    else hideNewAdminForm();
  });

  $('#removeNewAdminButton').click(function () {
    hideNewAdminForm();
  });

  $('#adminCode').change(function () {
    if (newAdminON) {
      hideNewAdminForm();
    }
  });

  $('#orgLevel').change(function () {
    if ($(this).val() == 'municipal')
      $('#provinceSelect')
        .attr('required', 'required')
        .siblings('label')
        .addClass('required');
    else
      $('#provinceSelect')
        .removeAttr('required')
        .siblings('label')
        .removeClass('required');
  });
});

function showNewAdminForm() {
  $('#newAdmin').removeClass('hide');
  $('#adminCode').removeAttr('required');
  $('label[for="adminCode"]').removeClass('required');
  $('label[for="adminCode"] strong').addClass('hide');
  $('#adminCode').prop('selectedIndex', 0).change();

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
  $('#provinceSelect').prop('selectIndex', 0);
  $('#ennewAdminName').val('');
  $('#frnewAdminName').val('');
}

function getAdminCode() {
  if ($('#adminCode').val() == '') {
    return slugify(
      $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
    );
  }
  return $('#adminCode').val();
}

function getAdminObject() {
  // Mandatory fields
  let adminObj = {
    code: getAdminCode(),
    name: {
      en: $('#ennewAdminName').val(),
      fr: $('#frnewAdminName').val(),
    },
  };

  // Optional fields
  let province = $('#provinceSelect').val();
  if (province != '') adminObj.provinceCode = province;

  return adminObj;
}

function getSelectedOrgType() {
  if ($('#adminCode').val() != '')
    return $('#adminCode :selected').parent().data('value');
  else return $('#orgLevel').val();
}

function getOrgLevel(result, admin) {
  if (result == null) return undefined;

  let federal = result.federal[admin];
  let provincial = result.provincial[admin];
  let municipal = result.municipal[admin];

  let orgLevel;

  if (municipal != undefined) orgLevel = municipal;
  else if (provincial != undefined) orgLevel = provincial;
  else if (federal != undefined) orgLevel = federal;

  return orgLevel;
}
