/**
 * Add custom form validation on top of the specialized validation in the Web Experience Toolkit
 * https://wet-boew.github.io/v4.0-ci/docs/ref/formvalid/formvalid-en.html#SpecializedValidation
 */

const lettersSpaceError = {
  en: 'Letters with spaces only please.',
  fr: 'Veuillez fournir seulement les lettres avec des espaces.'
};
const alphanumericSpaceError = {
  en: 'Letters and numbers with spaces only please.',
  fr: 'Veuillez fournir seulement des lettres et des chiffres avec des espaces.'
};
const namesError = {
  en: 'Please enter a valid name.',
  fr: 'Veuillez fournir un nom valide.'
};
const phoneError = {
  en: 'Please enter a valid phone number.',
  fr: 'Veuillez fournir un numéro de téléphone valide.'
};

$(document).on('wb-ready.wb', function() {
  let lang = document.documentElement.lang;
  if (jQuery.validator && window.jQuery.validator !== 'undefined') {
    /**
     * Letters with spaces. Usage: data-rule-letters-space
     */
    jQuery.validator.addMethod(
      'letters-space',
      function(value) {
        if (value) {
          if (value.match(/^[A-Za-z\s]+$/)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      jQuery.validator.format(lettersSpaceError[lang])
    );

    /**
     * Letters with spaces French inclusive accents. Usage: data-rule-letters-space-en-fr
     */
    jQuery.validator.addMethod(
      'letters-space-en-fr',
      function(value) {
        if (value) {
          if (value.match(/^[a-zàâçéèêëîïôûùüÿñæœ\s]+$/i)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      jQuery.validator.format(lettersSpaceError[lang])
    );

    /**
     * Alphanumeric with spaces French inclusive accents. Usage: data-rule-alphanum-space-en-fr
     */
    jQuery.validator.addMethod(
      'alphanum-space-en-fr',
      function(value) {
        if (value) {
          if (value.match(/^[0-9a-zàâçéèêëîïôûùüÿñæœ\s]+$/i)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      jQuery.validator.format(alphanumericSpaceError[lang])
    );

    /**
     * Names including French accents. Usage: data-rule-names-en-fr
     */
    jQuery.validator.addMethod(
      'names-en-fr',
      function(value) {
        if (value) {
          if (value.match(/^[a-zàâçéèêëîïôûùüÿñæœ,.'-\s]+$/i)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      jQuery.validator.format(namesError[lang])
    );

    /**
     * Custom phone regex. Usage: data-rule-custom-phone
     */
    jQuery.validator.addMethod(
      'custom-phone',
      function(value) {
        if (value) {
          if (value.match(/^[0-9]{3}[\s]*-[\s]*[0-9]{3}[\s]*-[\s]*[0-9]{4}$/)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      jQuery.validator.format(phoneError[lang])
    );
  }
});
