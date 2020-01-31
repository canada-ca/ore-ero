
const licenseSelect = document.getElementById('licencesspdxID');
$(document).ready(function() {
    getLicenses();
});

function getLicenses() {
    $.getJSON('https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json', function(
    result
    ) {
        addOptions(result);
    });
}

function addOptions(list) {
    for (let i = 0; i < list.licenses.length; i++) {
        let newOption = document.createElement('option');
        newOption.text = list.licenses[i].licenseId;
        newOption.value = list.licenses[i].licenseId;
        licenseSelect.appendChild(newOption);
    }
    let nonSPDX = document.createElement('option');
    nonSPDX.text = 'Non-SPDX-or-Public-Domain';
    nonSPDX.value = 'Non-SPDX-or-Public-Domain';
    licenseSelect.appendChild(nonSPDX);
}

