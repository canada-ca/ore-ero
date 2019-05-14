// Put code in here.
// Embed this at the bottom of the body.
/* global $ YamlWriter USERNAME REPO_NAME YAML PRBOT_URL */

function getSelectedOrgType() {
  return $('#adminCode :selected')
    .parent()
    .attr('label')
    .toLowerCase();
}

function getCodeObject() {
  let codeObject = {
    release: [
      {
        contact: {
          URL: {
            en: $('#enUrlContact').val(),
            fr: $('#frUrlContact').val()
          }
        },
        date: {
          created: $('#dateCreated').val(),
          metadataLastUpdated: $('#dateLastUpdated').val()
        },
        description: {
          en: $('#enDescription').val(),
          fr: $('#frDescription').val()
        },
        name: {
          en: $('#enProjectName').val(),
          fr: $('#frProjectName').val()
        },
        licenses: [],
        repositoryURL: {
          en: $('#enRepoUrl').val(),
          fr: $('#frRepoUrl').val()
        },
        status: $('#status :selected').text(),
        tags: {
          en: [],
          fr: []
        },
        vcs: $('#vcs').val()
      }
    ]
  };

  codeObject.release[0].licenses.push({
    URL: {
      en: $('#enUrlLicense').val(),
      fr: $('#frUrlLicense').val(),
      spdxID: $('#spdxID').val()
    }
  });

  // Append all of our tags
  codeObject.release[0].tags.en.push(
    ...document.querySelectorAll('#tagsEN input').map(child => child.value)
  );
  codeObject.release[0].tags.fr.push(
    ...document.querySelectorAll('#tagsFR input').map(child => child.value)
  );
}

$('#prbotSubmit').click(function() {
  let codeObject = getCodeObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$('#adminCode').val()}.yml`;
  fileWriter
    .merge(file, codeObject, 'releases', 'name.en')
    .then(result => {
      const config = {
        body: JSON.stringify({
          user: USERNAME,
          repo: REPO_NAME,
          title: 'Updated code for ' + $('#adminCode :selected').text(),
          description:
            'Authored by: ' +
            $('#emailContact').val() +
            '\n' +
            'Project: ***' +
            $('#enProjectName').val() +
            '***\n' +
            $('#enDescription').val() +
            '\n',
          commit: 'Committed by ' + $('#emailContact').val(),
          author: {
            name: $('#nameContact').val(),
            email: $('#emailContact').val()
          },
          files: [
            {
              path: file,
              content: YAML.stringify(result, { keepBlobsInJSON: false })
            }
          ]
        }),
        method: 'POST'
      };
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        let header = `schemaVersion: "1.0"\nadminCode: ${$(
          '#adminCode'
        ).val()}\n`;
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title: 'Created code file for ' + $('#adminCode :selected').text(),
            description:
              'Authored by: ' +
              $('#emailContact').val() +
              '\n' +
              'Project: ***' +
              $('#enProjectName').val() +
              '***\n' +
              $('#enDescription').val() +
              '\n',
            commit: 'Committed by ' + $('#emailContact').val(),
            author: {
              name: $('#nameContact').val(),
              email: $('#emailContact').val()
            },
            files: [
              {
                path: file,
                content: header + JSON.stringify(codeObject)
              }
            ]
          }),
          method: 'POST'
        };
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    });
});
