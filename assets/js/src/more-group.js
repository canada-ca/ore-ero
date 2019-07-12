$(document).ready(function() {
  $('.add-more-group').each(function() {
    addBtns($(this).children('h2'));
    wrap($(this));
  });

  $('.add-more-group').on('click', '.btn-tabs-more', function() {
    addElement(
      $(this)
        .parent()
        .parent()
    );
    checkForMinusBtn($(this));
  });

  $('.add-more-group').on('click', '.btn-tabs-more-remove', function() {
    $(this)
      .parent()
      .parent()
      .find('li')
      .last()
      .remove();
    checkForMinusBtn($(this));
  });
});

function addBtns(obj) {
  $(
    '<button type="button" style="margin-left:20px" class="btn btn-primary btn-tabs-more"><i class="glyphicon glyphicon-plus"></i> <span class="wb-inv">Add element</span></button>'
  ).appendTo(obj);

  $(
    '<button type="button" style="margin-left:20px" class="btn btn-primary btn-tabs-more-remove invisible"><i class="glyphicon glyphicon-minus"></i> <span class="wb-inv">Remove element</span></button>'
  ).appendTo(obj);
}

function wrap(obj) {
  let ul = $('<ul class="list-unstyled"></ul>');
  let li = $('<li data-index="0"></li>');
  let details = $('<details open></details>');
  let summary = $('<summary>' + obj.attr('data-title') + '</summary>');
  let content = $(obj).children('.add-more-content');

  ul.append(li);
  li.append(details);
  details.append(summary);
  details.append(content);

  obj.append(ul);
}

function addElement(obj) {
  let ul = $(obj).children('ul');
  let index = $(ul).children('li').length;
  let li = $(ul)
    .children('li')
    .first()
    .clone();
  li.attr('data-index', index);

  li.find('.form-group').each(function() {
    $(this)
      .children()
      .each(function() {
        if ($(this).attr('for'))
          $(this).attr('for', $(this).attr('for') + index);
        if ($(this).attr('id')) $(this).attr('id', $(this).attr('id') + index);
        if ($(this).attr('name'))
          $(this).attr('name', $(this).attr('name') + index);
    });
  })
  $(ul).append(li);
}

function checkForMinusBtn(obj) {
  let section = $(obj).closest('.add-more-group');
  if (section.find('li').length > 1)
    section.find('.btn-tabs-more-remove').removeClass('invisible');
  else section.find('.btn-tabs-more-remove').addClass('invisible');
}
