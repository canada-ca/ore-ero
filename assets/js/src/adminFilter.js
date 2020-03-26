$('#dt_govLevel').on('change', function() {
  $('#dt_department').prop('selectedIndex', 0);
  if ($('#dt_govLevel').prop('selectedIndex') == 0) {
    $('#dt_department')
      .parent()
      .addClass('hide');
  } else {
    $('#dt_department')
      .parent()
      .removeClass('hide');
    let level = $('#dt_govLevel').val();
    let length = document.getElementById('dt_department').options.length;
    for (let i = 1; i < length; i++) {
      if ($('#' + i).data('level') == level) {
        $('#' + i).removeClass('hide');
      } else {
        $('#' + i).addClass('hide');
      }
    }
  }
});

$('#dt_govLevel')
  .parent()
  .siblings(':last')
  .children(':last')
  .on('click', function() {
    $('#dt_department')
      .parent()
      .addClass('hide');
  });
