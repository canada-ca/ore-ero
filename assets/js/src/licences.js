const licenseSelect = document.getElementById('licencesspdxID');
$(document).ready(function() {
  getLicenses();
});

function getLicenses() {
  $.getJSON(
    'https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json',
    function(result) {
      addOptions(result);
    }
  );
}

function addOptions(list) {
  list.licenses.forEach(function(license) {
    if (!license.isDeprecatedLicenseId && license.isOsiApproved) {
      let newOption = document.createElement('option');
      newOption.text = newOption.value = license.licenseId;
      licenseSelect.appendChild(newOption);
    }
  })
  let nonSPDX = document.createElement('option');
  nonSPDX.text = nonSPDX.value = 'Non-SPDX-or-Public-Domain';
  licenseSelect.appendChild(nonSPDX);
}
