/* exported resetTypes, addTypes, fillTypeFields*/
/*
  global
  addMoreGroup
*/
$(document).ready(function () {
  $('.add-more-group#addMoredesignType').on(
    'click',
    '.btn-tabs-more',
    function () {
      let length = $('#addMoredesignType ul li').length;
      let index = length == 1 ? '' : length - 1;
      $('#newType' + index).addClass('hide');
    }
  );
  $('#addMoredesignType').on('click', '.newTypeButton button', function () {
    let index = getmoreIndex($(this));
    if (!$('#newType' + index).hasClass('hide')) {
      hideType(index);
      resetType(index);
    } else {
      addType(index);
    }
  });
  $('#addMoredesignType').on(
    'click',
    '.newTypeButtonRemove button',
    function () {
      let index = getmoreIndex($(this));
      hideType(index);
      resetType(index);
    }
  );
  $('#addMoredesignType').on('change', '.designTypeSelect select', function () {
    let index = getmoreIndex($(this));
    if (
      $('#designType' + index).val() != '' &&
      !$('#newType' + index).hasClass('hide')
    ) {
      hideType(index);
    }
  });
});

function addTypes(designObject) {
  $('#addMoredesignType ul.list-unstyled > li').each(function (i) {
    let id = getmoreIndex($(this));
    let selectedIndex = $('#designType' + id).prop('selectedIndex');
    if (selectedIndex == 0) {
      designObject.designTypes[i] = {
        type: {
          en: $('#ennewType' + id).val(),
          fr: $('#frnewType' + id).val(),
        },
      };
    } else {
      designObject.designTypes[i] = {
        type: {
          en: $('#designType' + id).val(),
          fr: $('#option' + selectedIndex).data('fr'),
        },
      };
    }
  });
}

function hideType(index) {
  $('#newType' + index).addClass('hide');
  $('#designType' + index).attr('required', 'required');
  $('#ennewType' + index).removeAttr('required');
  $('#frnewType' + index).removeAttr('required');
}

function resetTypes() {
  $('#addMoredesignType ul.list-unstyled > li').each(function () {
    let id = getmoreIndex($(this));
    if (id != 0) {
      $(this).remove();
    }
  });
  $('#designType').prop('selectedIndex', 0);
  resetType('');
  hideType('');
}

function fillTypeFields(designTypes) {
  designTypes.forEach(function (designType, i) {
    let id;
    if (i == 0) id = '';
    else {
      id = i;
      addMoreGroup($('#addMoredesignType'));
    }
    $('#designType' + id).val(designType.type.en);
  });
}

function addType(index) {
  resetType(index);
  $('#newType' + index).removeClass('hide');
  $('#designType' + index).removeAttr('required');
  $('#designType' + index).prop('selectedIndex', 0);
  $('#ennewType' + index).attr('required', 'required');
  $('#frnewType' + index).attr('required', 'required');
}

function getmoreIndex(element) {
  let nb = $(element).closest('li').attr('data-index');
  return nb != 0 ? nb : '';
}

function resetType(index) {
  $('#ennewType' + index).val('');
  $('#frnewType' + index).val('');
}
