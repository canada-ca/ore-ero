/* exported getAdminObject getAdminCode */

/* global $ */

var newAdminON = false;

$(document).ready(function() {
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

function getAdminCode() {
  return $('#adminCode').val() == ''
    ? $('#newAdminCode')
        .val()
        .toLowerCase()
    : $('#adminCode').val();
}

function getAdminObject() {
  // Mandatory fields
  let adminObj = {
    code: $('#newAdminCode').val(),
    name: {
      en: $('#ennewAdminName').val(),
      fr: $('#frnewAdminName').val()
    },
    parent: $('#orgLevel').val()
  };

  // Optional fields
  let province = $('#provinceSelect').val();
  if (province != '') adminObj.provinceCode = province;

  return adminObj;
}
