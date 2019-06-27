$(document).ready(function() {
  $('#newAdminButton').click(function() {
    $('#newAdmin').removeClass('hide');
    $('#adminCode').removeAttr('required');
    $('label[for="adminCode"]').removeClass('required');
    $('label[for="adminCode"] strong').addClass('hide');
  });

  $('#removeNewAdminButton').click(function() {
    $('#newAdmin').addClass('hide');
    $('#adminCode').attr('required', 'required');
    $('label[for="adminCode"]').addClass('required');
    $('label[for="adminCode"] strong').removeClass('hide');
  });
});
