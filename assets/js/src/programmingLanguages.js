/* exported addMoreLanguages */

function addMoreLanguages() {
  $(`<div class="control-group input-group col-xs-2" style="margin-top:10px" >
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
      </div>`).appendTo('#Languages');

  $(document).ready(function() {
    $(this)
      .parents('.control-group')
      .remove();
  });
}
