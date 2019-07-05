/* exported addMoreLanguages getLanguages selectLanguage resetLanguages */

function addMoreLanguages() {
  $(`<div class="control-group additional-languages input-group col-xs-2" style="margin-top:10px" >
        <input type="text" id="${'_' +
          Math.random()
            .toString(36)
            .substr(
              2,
              9
            )}" name="language" data-for="languages" class="form-control" required="required">
        <div class="input-group-btn">
          <button class="btn btn-default remove" type="button"><i class="glyphicon glyphicon-remove"></i></button>
        </div>
      </div>`).appendTo('#languages');
}

function getLanguages() {
  return $(
    'input[data-for="languages"]:checked, input[data-for="languages"][type="text"]'
  )
    .toArray()
    .map(input => input.value);
}

function selectLanguage(language) {
  $('#languages .' + language).prop('checked', true);
}

function resetLanguages() {
  $('#languages input[type="checkbox"]').each(function(i, input) {
    $(input).prop('checked', false);
  });

  $(document).ready(function() {
    $('.additional-languages').remove();
  });
}
