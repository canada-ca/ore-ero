/* exported resetTypes addTypes fillTypeFields*/
/*
  global
  addMoreGroup
*/
$(document).ready(function() {
  $('.add-more-group#addMoredesignType').on(
    'click',
    '.btn-tabs-more',
    function() {
      let length = $('#addMoredesignType ul li').length;
      let index = length == 1 ? '' : length - 1;
      $('#newType' + index).addClass('hide');
    }
  );
  $('#addMoredesignType').on('click', '.newTypeButton button', function() {
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
    function() {
      let index = getmoreIndex($(this));
      hideType(index);
      resetType(index);
    }
  );
  $('#addMoredesignType').on('change', '.designTypeSelect select', function() {
    let index = getmoreIndex($(this));
    if ($('#designType' + index).val() != '') {
      selectType($('#designType' + index).val(), index);
      if (!$('#newType' + index).hasClass('hide')) {
        hideType(index);
      }
    }
  });
});

function addTypes(designObject) {
  $('#addMoredesignType ul.list-unstyled > li').each(function(i) {
    let id = getmoreIndex($(this));
    designObject.designTypes[i] = {
      value: $('#newTypeEN' + id).val(),
      type: {
        en: $('#newTypeEN' + id).val(),
        fr: $('#newTypeFR' + id).val()
      }
    };
  });
}

function hideType(index) {
  $('#newType' + index).addClass('hide');
  $('#designType' + index).attr('required', 'required');
  $('#ennewType' + index).removeAttr('required');
  $('#frnewType' + index).removeAttr('required');
}

function resetTypes() {
  $('#addMoredesignType ul.list-unstyled > li').each(function() {
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
  designTypes.forEach(function(type, i) {
    let id;
    if (i == 0) id = '';
    else {
      id = i;
      addMoreGroup($('#addMoredesignType'));
    }
    $('#designType' + id).val(type.value);
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
  let nb = $(element)
    .closest('li')
    .attr('data-index');
  return nb != 0 ? nb : '';
}

function selectType(selectedType, index) {
  $.getJSON('http://localhost:4000/ore-ero/design.json', function(result) {
    let found = false;
    let designs = Object.keys(result);
    for (let id = 0; id < designs.length; id++) {
      for (
        let typeId = 0;
        typeId < result[designs[id]].designTypes.length;
        typeId++
      ) {
        if (result[designs[id]].designTypes[typeId].value == selectedType) {
          $('#ennewType' + index).val(
            result[designs[id]].designTypes[typeId].type.en
          );
          $('#frnewType' + index).val(
            result[designs[id]].designTypes[typeId].type.fr
          );
          found = true;
          break;
        }
      }
    }
    if (!found) {
      alert('Error retrieving the data');
    }
  });
}

function resetType(index) {
  $('#ennewType' + index).val('');
  $('#frnewType' + index).val('');
}
