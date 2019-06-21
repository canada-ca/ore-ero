/* exported getTags addTags resetTags */

function getTags(query) {
  return $(query)
    .map(function() {
      return this.value ? this.value : null;
    })
    .get();
}

function addMoreTags() {
  let wrapper = $('<div class="copy hide"></div>');
  tagObject('copy', '').appendTo(wrapper);
  wrapper.appendTo('#tags');
}

function addTags(obj) {
  if (obj['tags']) {
    resetTags();
    let index = 0;
    obj['tags']['en'].forEach(function(tag) {
      if (index == 0) $('#enTags').val(tag);
      else
        tagObject('tagEN' + index, tag)
          .addClass('additional-tag')
          .appendTo('#tagsEN');
      index++;
    });
    index = 0;
    obj['tags']['fr'].forEach(function(tag) {
      if (index == 0) $('#frTags').val(tag);
      else
        tagObject('tagFR' + index, tag)
          .addClass('additional-tag')
          .appendTo('#tagsFR');
      index++;
    });
  } else {
    resetTags();
  }
}

function resetTags() {
  $('#tagEN').val('');
  $('#tagFR').val('');
  $('.additional-tag').remove();
}

function tagObject(id, value) {
  return $(`<div class="control-group input-group col-xs-2" style="margin-top:10px" >
    <input type="text" id="${id}" name="tag" value="${value}" class="form-control">
    <div class="input-group-btn">
      <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
    </div>
  </div>`);
}

$(document).ready(function() {
  addMoreTags();
  $('.add-more').click(function() {
    var html = $('.copy').html();
    $(html).appendTo('#tagsEN');
    $(html).appendTo('#tagsFR');
  });

  $('body').on('click', '.remove', function() {
    $(this)
      .parents('.control-group')
      .remove();
  });
});
