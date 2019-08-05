$(document).ready(function() {
  $('input[type="tel"]').keyup(function(evt) {
    if (evt.originalEvent.code != 'Backspace') {
      let input = $(this);
      if (input.val().length == 3 || input.val().length == 7)
        input.val(input.val() + '-');
    }
  });
});
