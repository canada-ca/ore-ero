/* exported addMoreLicences fillLicenceField addMoreRelatedCode resetMoreGroup */

$(document).ready(function() {
  $('.add-more-group').each(function() {
    addBtns($(this).children('h2'));
    wrap($(this));
  });

  $('.add-more-group').on('click', '.btn-tabs-more', function() {
    addMoreGroup(
      $(this)
        .parent()
        .parent()
    );
  });

  $('.add-more-group').on('click', '.btn-tabs-more-remove', function() {
    removeMoreGroup(
      $(this)
        .parent()
        .parent()
    );
  });
});

function addMoreGroup(group) {
  addElement(group);
  checkForMinusBtn(group);
}

function removeMoreGroup(group) {
  group
    .find('li')
    .last()
    .remove();
  checkForMinusBtn(group);
}

function resetMoreGroup(group) {
  while (group.find('li').length > 1) removeMoreGroup(group);

  group.find('li').each(function(i, li) {
    $(li)
      .find('input')
      .each(function(i, input) {
        $(input).val('');
      });
    $(li)
      .find('select')
      .each(function(i, select) {
        $(select).prop('selectedIndex', 0);
      });
  });
}

function addBtns(obj) {
  $(
    '<button type="button" class="btn btn-primary btn-tabs-more mrgn-lft-md"><i class="glyphicon glyphicon-plus"></i> <span class="wb-inv">Add element</span></button>'
  ).appendTo(obj);

  $(
    '<button type="button" class="btn btn-primary btn-tabs-more-remove invisible mrgn-lft-md"><i class="glyphicon glyphicon-minus"></i> <span class="wb-inv">Remove element</span></button>'
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
        replaceID($(this), index);
      });
  });

  li.find('.more-group-id-replace').each(function() {
    $(this)
      .children()
      .each(function() {
        replaceID($(this), index);
      });
  });

  $(ul).append(li);
}

function replaceID(element, index) {
  if (element.attr('for')) element.attr('for', element.attr('for') + index);
  if (element.attr('id')) element.attr('id', element.attr('id') + index);
  if (element.attr('name')) element.attr('name', element.attr('name') + index);
  element.val('');
}

function checkForMinusBtn(obj) {
  let section = $(obj).closest('.add-more-group');
  if (section.find('li').length > 1)
    section.find('.btn-tabs-more-remove').removeClass('invisible');
  else section.find('.btn-tabs-more-remove').addClass('invisible');
}

function addMoreLicences(obj) {
  $('#addMorelicences ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    obj.licences[i] = {
      URL: {
        en: $('#enlicencesURL' + id).val(),
        fr: $('#frlicencesURL' + id).val()
      },
      spdxID: $('#licencesspdxID' + id).val()
    };
  });
}

function fillLicenceField(licences) {
  licences.forEach(function(licence, i) {
    let id;
    if (i == 0) id = '';
    else {
      id = i;
      addMoreGroup($('#addMorelicences'));
    }
    $('#enlicencesURL' + id).val(licence.URL.en);
    $('#frlicencesURL' + id).val(licence.URL.fr);
    $('#licencesspdxID' + id).val(licence.spdxID);
  });
}

function addMoreRelatedCode(obj) {
  $('#addMorerelatedCode ul.list-unstyled > li').each(function(i) {
    let id =
      $(this).attr('data-index') == '0' ? '' : $(this).attr('data-index');
    if (
      $('#enrelatedCodeURL' + id).val() ||
      $('#frrelatedCodeURL' + id).val() ||
      $('#enrelatedCodename' + id).val() ||
      $('#frrelatedCodename' + id).val()
    ) {
      if (obj.relatedCode == undefined) obj.relatedCode = [];
      obj.relatedCode[i] = {};
    }

    if (
      $('#enrelatedCodeURL' + id).val() ||
      $('#frrelatedCodeURL' + id).val()
    ) {
      obj.relatedCode[i].URL = {};
    }
    if ($('#enrelatedCodeURL' + id).val()) {
      obj.relatedCode[i].URL.en = $('#enrelatedCodeURL' + id).val();
    }
    if ($('#frrelatedCodeURL' + id).val()) {
      obj.relatedCode[i].URL.fr = $('#frrelatedCodeURL' + id).val();
    }

    if (
      $('#enrelatedCodename' + id).val() ||
      $('#frrelatedCodename' + id).val()
    ) {
      obj.relatedCode[i].name = {};
    }
    if ($('#enrelatedCodename' + id).val()) {
      obj.relatedCode[i].name.en = $('#enrelatedCodename' + id).val();
    }
    if ($('#frrelatedCodename' + id).val()) {
      obj.relatedCode[i].name.fr = $('#frrelatedCodename' + id).val();
    }
  });
}
