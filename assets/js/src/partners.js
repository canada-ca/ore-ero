/* global $ jsyaml slugify addMoreGroup */
/* exported fillPartnersField getNewAdminPartnerPromise addMorePartners */

$(document).ready(function() {
  // More-group overwrite for partner
  $('.add-more-group#addMorepartners').on(
    'click',
    '.btn-tabs-more',
    function() {
      let length = $('#addMorepartners ul li').length;
      let index = length == 1 ? '' : length - 1;
      hideFieldsPartner(index);
    }
  );

  hideFieldsPartner('');
  $('#addMorepartners').on(
    'change',
    '.partnersAdminCodeSelect select',
    function() {
      selectPartners(this);
    }
  );
  $('#addMorepartners').on('click', '.partnersAdminCodeBtn button', function() {
    addNewPartner(this);
  });
  $('#addMorepartners').on(
    'click',
    '.partnersAdminCodeRemove button',
    function() {
      removeNewPartner(this);
    }
  );
  $('#addMorepartners').on('change', '.orgLevelPartner select', function() {
    let index = getmoreIndex($(this));
    if ($(this).val() == 'municipal') {
      $('#provinceSelectPartner' + index)
        .attr('required', 'required')
        .siblings('label')
        .addClass('required');
    } else {
      $('#provinceSelectPartner' + index)
        .removeAttr('required')
        .siblings('label')
        .removeClass('required');
    }
  });
});

function getAdminCodePartner(index) {
  return slugify(
    $('#enpartnersname' + index).val() +
      ($('#provinceSelectPartner' + index).val() !== ''
        ? '-' + $('#provinceSelectPartner' + index).val()
        : '')
  );
}

function addMorePartners(obj) {
  $('#addMorepartners ul.list-unstyled > li').each(function(i) {
    let id = i == 0 ? '' : i;

    if (
      $('#partners' + id).val() != '' ||
      $('#enpartnersname' + id).val() != ''
    ) {
      let adminCode = '';
      if ($('#partners' + id).val() != '')
        adminCode = $('#partners' + id).val();
      else if ($('#enpartnersname' + id).val() != '') {
        adminCode = getAdminCodePartner(id);
      }

      if (obj.partners == undefined) obj.partners = [];
      obj.partners[i] = {};

      obj.partners[i].adminCode = adminCode;

      if ($('#partnerscontactemail' + id).val() != '')
        obj.partners[i].email = $('#partnerscontactemail' + id).val();

      if ($('#partnerscontactname' + id).val() != '')
        obj.partners[i].name = $('#partnerscontactname' + id).val();
    }
  });
}

function getNewAdminPartnerPromise(obj, fileWriter, config) {
  let promises = [];

  if (obj.partners && obj.partners.length > 0) {
    let newAdmins = [];
    obj.partners.forEach(function(partner, index) {
      let id = index == 0 ? '' : index;
      if ($('#partners' + id).val() == '') {
        if (newAdmins[$('#orgLevelPartner' + id).val()] == null)
          newAdmins[$('#orgLevelPartner' + id).val()] = [];
        newAdmins[$('#orgLevelPartner' + id).val()][
          Object.keys(newAdmins[$('#orgLevelPartner' + id).val()]).length
        ] = getNewAdminPartnerObject(id);
      }
    });

    Object.keys(newAdmins).forEach(function(orgLevel) {
      let promise = fileWriter
        .mergePartnerAdminFile(
          `_data/administrations/${orgLevel}.yml`,
          newAdmins[orgLevel],
          '',
          'code'
        )
        .then(result => {
          config.body.files[config.body.files.length] = {
            path: `_data/administrations/${orgLevel}.yml`,
            content: '---\n' + jsyaml.dump(result)
          };
        });

      promises.push(promise);
    });
  }

  return promises;
}

function getNewAdminPartnerObject(index) {
  let adminObj = {
    code: getAdminCodePartner(index),
    name: {
      en: $('#enpartnersname' + index).val(),
      fr: $('#frpartnersname' + index).val()
    }
  };

  // Optional fields
  let province = $('#provinceSelectPartner' + index).val();
  if (province != '') adminObj.provinceCode = province;

  return adminObj;
}

function fillPartnersField(obj) {
  if (obj.partners)
    obj.partners.forEach(function(partner, i) {
      let id;
      if (i == 0) id = '';
      else {
        id = i;
        addMoreGroup($('#addMorepartners'));
      }
      $('#partners' + id).val(partner.adminCode);
      showFieldsPartner(id, false);
      if (partner.email) $('#partnerscontactemail' + id).val(partner.email);
      if (partner.name) $('#partnerscontactname' + id).val(partner.name);
    });
}

function getmoreIndex(element) {
  let nb = $(element)
    .closest('li')
    .attr('data-index');
  return nb != 0 ? nb : '';
}

function selectPartners(select) {
  let adminCode = $(select).val();
  let id = getmoreIndex(select);
  if (adminCode != '') {
    $.getJSON(
      'https://canada-ca.github.io/ore-ero/administrations.json',
      function(result) {
        let admin = getAdminObjectForPartner(result, adminCode);
        showFieldsPartner(id, false);
        $('#orgLevelPartner' + id).val(admin.level);
        if (admin.values.provinceCode != undefined) {
          $('#provinceSelectPartner' + id)
            .prop('disabled', false)
            .val(admin.values.provinceCode);
        } else
          $('#provinceSelectPartner' + id)
            .prop('disabled', true)
            .val('');
        $('#enpartnersname' + id).val(admin.values.name.en);
        $('#frpartnersname' + id).val(admin.values.name.fr);
      }
    );
  } else {
    hideFieldsPartner(id);
  }
}

function hideFieldsPartner(id) {
  resetFieldsPartner(id);
  hideFieldPartner($('#orgLevelPartner' + id));
  hideFieldPartner($('#provinceSelectPartner' + id));
  hideFieldPartner($('#enpartnersname' + id));
  hideFieldPartner($('#frpartnersname' + id));
  $('#partnersNewAdminSeparator' + id).hide();
  hideFieldPartner($('#partnerscontactname' + id));
  hideFieldPartner($('#partnerscontactemail' + id));
}

function hideFieldPartner(element) {
  element
    .prop('disabled', false)
    .parent('.form-group')
    .hide();
}

function resetFieldsPartner(id) {
  $('#orgLevelPartner' + id).val('');
  $('#provinceSelectPartner' + id)
    .prop('disabled', false)
    .val('');
  $('#enpartnersname' + id).val('');
  $('#frpartnersname' + id).val('');
  $('#partnerscontactname' + id).val('');
  $('#partnerscontactemail' + id).val('');
}

function showFieldsPartner(id, full) {
  hideFieldsPartner(id);
  if (full) {
    showFieldPartner($('#orgLevelPartner' + id));
    showFieldPartner($('#provinceSelectPartner' + id));
    if ($('#orgLevelPartner' + id).val() != 'municipal')
      $('#provinceSelectPartner' + id)
        .removeAttr('required')
        .siblings('label')
        .removeClass('required');
    showFieldPartner($('#enpartnersname' + id));
    showFieldPartner($('#frpartnersname' + id));
    $('#partnersNewAdminSeparator' + id).show();
  }

  showFieldPartnerOptional(id);
}

function showFieldPartner(element) {
  element
    .attr('required', 'required')
    .prop('disabled', false)
    .parent('.form-group')
    .show()
    .children('label')
    .addClass('required');
}

function showFieldPartnerOptional(id) {
  $('#partnerscontactname' + id)
    .parent('.form-group')
    .show();

  $('#partnerscontactemail' + id)
    .parent('.form-group')
    .show();
}

function addNewPartner(button) {
  let id = getmoreIndex(button);

  $('#partners' + id).val('');
  resetFieldsPartner(id);
  showFieldsPartner(id, true);
  showRemoveNewPartnerBtn(id);
}

function removeNewPartner(button) {
  let id = getmoreIndex(button);

  $('#partners' + id).val('');
  resetFieldsPartner(id);
  hideFieldsPartner(id);
  hideRemoveNewPartnerBtn(id);
}

function showRemoveNewPartnerBtn(index) {
  $('newAdminButtonpartners' + index).hide();
}

function hideRemoveNewPartnerBtn(index) {
  $('newAdminButtonpartners' + index).hide();
}

function getAdminObjectForPartner(obj, admin) {
  let administrations = [
    'federal',
    'provincial',
    'municipal',
    'aboriginal',
    'others'
  ];

  for (let i = 0, l1 = administrations.length; i < l1; i++)
    for (let j = 0, l2 = obj[administrations[i]].length; j < l2; j++)
      if (obj[administrations[i]][j].code == admin)
        return {
          level: administrations[i],
          values: obj[administrations[i]][j]
        };
}
