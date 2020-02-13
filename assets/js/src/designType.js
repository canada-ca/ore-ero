/* exported resetTypes addTypes*/
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
  }});
  $('#addMoredesignType').on(
      'click',
      '.newTypeButtonRemove button',
      function() {
      let index = getmoreIndex($(this));
      hideType(index);
      resetType(index);
  });
  $('#addMoredesignType').on(
    'change',
    '.designTypeSelect select', function() {
    let index = getmoreIndex($(this));
    if ($('#designType' + index).val() != '') {
      selectType($('#designType' + index).val(), index);
      if (!$('#newType' + index).hasClass('hide')) {
        hideType(index);
      }
    }
  });
});
  
  function getType(query) {
    return $(query)
      .map(function() {
        return this.value ? this.value : null;
      })
      .get();
  }

  function addTypes(designObject) {
    $('#addMoredesignType ul.list-unstyled > li').each(function(i) {
        let id =
          $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
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
    $('#addMoredesignType ul.list-unstyled > li').each(function(i) {
      let id =
        $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
      $('#designType' + id)
      .prop('selectedIndex', 0)
      .change();
      resetType(id);
      hideType(id);
      }
    );
  }

  function addType(index) {
    resetType(index);
    $('#newType' + index).removeClass('hide');
    $('#designType' + index).removeAttr('required');
    $('#designType' + index)
      .prop('selectedIndex', 0)
      .change();
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
    $.getJSON('https://github.com/canada-ca/ore-ero/design.json', function(
    result
  ) {
    let found = false;
    for (let id = 0; i < result.length; id++) {
      for (let typeId = 0; i < result[id].designTypes.length; typeId++) {
        if (found = (design[id].designTypes[typeId].value == selectedType)) {
          $('#ennewType' + index).val(result[id].designTypes[typeId].type.en);
          $('#frnewType' + index).val(result[id].designTypes[typeId].type.fr);
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
  