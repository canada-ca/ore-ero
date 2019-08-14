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

function addTags(obj) {
  if (obj.tags) {
    resetTags();
    let index = 0;
    obj.tags.en.forEach(function(tag) {
      if (index == 0) $('#entags').val(tag);
      else
        tagObject('entags' + index, tag)
          .addClass('additional-tag')
          .appendTo('#tagsEN');
      index++;
    });
    index = 0;
    obj.tags.fr.forEach(function(tag) {
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
  return $(`<div class="control-group input-group col-xs-2 mrgn-tp-md">
    <input type="text" id="${id}" name="tag" value="${value}" class="form-control">
    <div class="input-group-btn">
      <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
    </div>
  </div>`);
}

$(document).ready(function() {
  $('.add-more').click(function() {
    addMoreTagsHtml('#tagsEN');
    addMoreTagsHtml('#tagsFR');
  });

  $('body').on('click', '.remove', function() {
    $(this)
      .parents('.control-group')
      .remove();
  });
});

function addMoreTagsHtml(to) {
  $(
    tagObject(
      '_' +
        Math.random()
          .toString(36)
          .substr(2, 9),
      ''
    ).addClass('additional-tag')
  ).appendTo(to);
}
