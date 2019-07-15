/* exported getTagsEN getTagsFR addTags resetTags */

function getTagsEN() {
  return getTags($('#tagsEN input'));
}

function getTagsFR() {
  return getTags($('#tagsFR input'));
}

function getTags(query) {
  return $(query)
    .map(function() {
      return this.value ? this.value : null;
    })
    .get();
}

function addMoreTags() {
  let wrapper = $('<div class="copy hide"></div>');
  tagObject('copy' + Math.random(), '').appendTo(wrapper);
  wrapper.appendTo('#tags');
}

function addTags(obj) {
  if (obj['tags']) {
    resetTags();
    let index = 0;
    obj['tags']['en'].forEach(function(tag) {
      if (index == 0) $('#entags').val(tag);
      else
        tagObject('entags' + index, tag)
          .addClass('additional-tag')
          .appendTo('#tagsEN');
      index++;
    });
    index = 0;
    obj['tags']['fr'].forEach(function(tag) {
      if (index == 0) $('#frtags').val(tag);
      else
        tagObject('frtags' + index, tag)
          .addClass('additional-tag')
          .appendTo('#tagsFR');
      index++;
    });
  } else {
    resetTags();
  }
}

function resetTags() {
  $('#entags').val('');
  $('#frtags').val('');
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
