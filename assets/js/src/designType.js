/* exported getTypeEN getTypeFR addType resetType */
$(document).ready(function() {

    $('#newTypeButton').click(function() {
        $('#newType').removeClass('hide');
    });
});
function getnewTypeEN() {
    return getType($('#newTypeEN input'));
  }
  
  function getnewTypeFR() {
    return getType($('#newTypeFR input'));
  }
  
  function getType(query) {
    return $(query)
      .map(function() {
        return this.value ? this.value : null;
      })
      .get();
  }
  
  function addTypes(obj) {
    if (obj.types) {
      resetTypes();
      let index = 0;
      obj.types.en.forEach(function(type) {
        if (index == 0) $('#ennewType').val(type);
        else
          typeObject('ennewType' + index, type)
            .addClass('additional-type')
            .appendTo('#newTypeEN');
        index++;
      });
      index = 0;
      obj.types.fr.forEach(function(type) {
        if (index == 0) $('#frnewType').val(type);
        else
          typeObject('frnewType' + index, type)
            .addClass('additional-type')
            .appendTo('#newTypeFR');
        index++;
      });
    } else {
      resetTypes();
    }
  }
  
  function resetTypes() {
    $('#ennewType').val('');
    $('#frnewType').val('');
    $('.additional-type').remove();
  }
  
  function typeObject(id, value) {
    return $(`<div class="control-group input-group col-xs-2 mrgn-tp-md">
      <input type="text" id="${id}" name="type" value="${value}" class="form-control">
      <div class="input-group-btn">
        <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
      </div>
    </div>`);
  }
  
  $(document).ready(function() {
    $('.add-more').click(function() {
      addMoreTagsHtml('#newTypeEN');
      addMoreTagsHtml('#newTypeFR');
    });
  
    $('body').on('click', '.remove', function() {
      $(this)
        .parents('.control-group')
        .remove();
    });
  });
  
  function addMoreTypesHtml(to) {
    $(
      typeObject(
        '_' +
          Math.random()
            .toString(36)
            .substr(2, 9),
        ''
      ).addClass('additional-type')
    ).appendTo(to);
  }
  