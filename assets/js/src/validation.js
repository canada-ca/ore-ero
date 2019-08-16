/* exported validateRequired submitInit submitConclusion */

/**
 * Validates the required fields in the codeForm
 * WET uses the JQuery plugin (https://jqueryvalidation.org/) for their form validation
 * @return {Boolean} true/false if the form is valid/invalid
 */
function validateRequired() {
  let form = document.getElementById('validation');
  let elements = form.elements;
  let validator = $('#validation').validate();
  let isValid = true;
  for (let i = 0; i < elements.length; i++) {
    let currentElement = elements[i];
    if (currentElement.required) {
      if (!validator.element('#' + currentElement.id)) {
        isValid = false;
      }
    }
  }
  if (!isValid) {
    // Jump to top of form to see error messages
    location.href = '#wb-cont';
  }
  return isValid;
}

const ALERT_IN_PROGRESS = 0;
const ALERT_FAIL = 1;
const ALERT_SUCCESS = 2;
const ALERT_OFF = 3;

function toggleAlert(option) {
  let alertInProgress = $('#prbotSubmitAlertInProgress');
  let alertFail = $('#prbotSubmitAlertFail');
  let alertSuccess = $('#prbotSubmitAlertSuccess');
  if (option == ALERT_IN_PROGRESS) {
    alertInProgress.removeClass('hide');
  } else if (option == ALERT_FAIL) {
    alertFail.removeClass('hide');
  } else if (option == ALERT_SUCCESS) {
    alertSuccess.removeClass('hide');
  } else if (option == ALERT_OFF) {
    alertInProgress.addClass('hide');
    alertFail.addClass('hide');
    alertSuccess.addClass('hide');
  } else {
    console.log('Invalid alert option');
  }
}

function submitConclusion(response, submitButton, resetButton, url) {
  if (response.status != 200) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_FAIL);
    submitButton.disabled = false;
    resetButton.disabled = false;
  } else {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_SUCCESS);
    // Redirect to home page
    setTimeout(function() {
      window.location.href = url;
    }, 3000);
  }
}

function submitInit() {
  let valid = validateRequired();
  if (valid) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_IN_PROGRESS);
    window.scrollTo(0, document.body.scrollHeight);
  }
  return valid;
}
