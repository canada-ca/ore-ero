/* exported getAdminObject getAdminCode getSelectedOrgType getOrgLevel hideNewAdminForm*/

/* global  slugify */

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

  $('#orgLevel').change(function() {
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
  $('#provinceSelect').prop('selectIndex', 0);
  $('#ennewAdminName').val('');
  $('#frnewAdminName').val('');
  $('#adminCodesuffix').val('');
  $('#admin-suffixes')
    .parent()
    .remove();
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
      fr: $('#frnewAdminName').val()
    }
  };

  // Optional fields
  let province = $('#provinceSelect').val();
  if (province != '') adminObj.provinceCode = province;
  let suffix = $('#adminCodesuffix').val();
  let first = suffix;
  if (suffix != '') {
    let suffixes = $('input[data-for="admin-suffixes"][type="text"]').toArray();
    for (let item in suffixes) {
      let val = suffixes[item].value;
      if (!suffix.includes(',' + val) && val != first) suffix += ',' + val;
    }
    adminObj.email_suffix = "'" + suffix + "'";
  }
  return adminObj;
}

function getSelectedOrgType() {
  if ($('#adminCode').val() != '')
    return $('#adminCode :selected')
      .parent()
      .data('value');
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

/*eslint-disable no-unused-vars*/
function adminCodeaddMoreSuffixes() {
  $(`<div class="control-group additional-suffixes input-group col-xs-2 mrgn-tp-md">
        <input type="text" id="${'_' +
          Math.random()
            .toString(36)
            .substr(
              2,
              9
            )}" name="suffix" data-for="admin-suffixes" class="form-control" required="required" >
        <div class="input-group-btn">
          <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
        </div>
      </div>`).appendTo($('#adminCodesuffix').parent());
}
/*eslint-enable no-unused-vars*/
