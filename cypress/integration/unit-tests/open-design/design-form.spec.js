/// <reference types="Cypress" />
/* global cy, context, it */

context('General Open Design Form', () => {
    it('Loads the French form page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
        cy.get('#wb-cont').contains('Formulaire du Design libre');
    });
    it('Loads the English form page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
        cy.get('#wb-cont').contains('Open Design Form');
    });
    it('Loads the script', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
        cy.window().should('have.property', 'designType');
        });

    

    it ('Should reset all fields filled by design select if the selected option is modified', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
        cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
            cy.get('#nameselect').select(name);
            cy.get('#nameselect').select('');
            cy.get('#nameselect').children().first().should('be.selected');
            cy.get('#enname').should('have.value', '');
            cy.get('#frname').should('have.value', '');
            cy.get('#endescriptionwhatItDoes').should('have.value', '');
            cy.get('#frdescriptionwhatItDoes').should('have.value', '');
            cy.get('#enhomepageURL').should('have.value', '');
            cy.get('#frhomepageURL').should('have.value', '');
            cy.get('#addMoredesignType').find('ul > li').should('have.length.lte', 1);
            cy.get('#designType').children().first().should('be.selected');
            cy.get('#addMorelicences').find('ul > li').should('have.length.lte', 1);
            cy.get('#enlicencesURL').should('have.value', '');
            cy.get('#frlicencesURL').should('have.value', '');
            cy.get('#licencesspdxID').children().first().should('be.selected');    
        });
         
    });

    it ('New admin button should make new admin field appear if hidden and both new admin button and remove new admin button should hide it if shown', () => {
      cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
      cy.get('#newAdminButton').click();
      cy.get('#newAdmin').should('be.visible');
      cy.get('#newAdminButton').click();
      cy.get('#newAdmin').should('be.hidden');
      cy.get('#newAdminButton').click();
      cy.get('#removeNewAdminButton').click();
      cy.get('#newAdmin').should('be.hidden');
    });

    it('Loads the script on french page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
        cy.window().should('have.property', 'designType');
        });


    it ('Should reset all fields filled by design select if the selected option is modified on french page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
        cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
            cy.get('#nameselect').select(name);
            cy.get('#nameselect').select('');
            cy.get('#nameselect').children().first().should('be.selected');
            cy.get('#enname').should('have.value', '');
            cy.get('#frname').should('have.value', '');
            cy.get('#endescriptionwhatItDoes').should('have.value', '');
            cy.get('#frdescriptionwhatItDoes').should('have.value', '');
            cy.get('#enhomepageURL').should('have.value', '');
            cy.get('#frhomepageURL').should('have.value', '');
            cy.get('#addMoredesignType').find('ul > li').should('have.length.lte', 1);
            cy.get('#designType').children().first().should('be.selected');
            cy.get('#addMorelicences').find('ul > li').should('have.length.lte', 1);
            cy.get('#enlicencesURL').should('have.value', '');
            cy.get('#frlicencesURL').should('have.value', '');
            cy.get('#licencesspdxID').children().first().should('be.selected');    
        });
         
    });

});

context('Open Design Form Reset', () => {
  it('Values should be autofilled when design name is selected', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#enname').should('have.value', name);
      cy.get('#frname').should('not.have.value', '');
      cy.get('#endescriptionwhatItDoes').should('not.have.value', '');
      cy.get('#frdescriptionwhatItDoes').should('not.have.value', '');
      cy.get('#enhomepageURL').should('not.have.value', '');
      cy.get('#frhomepageURL').should('not.have.value', '');
      cy.get('#addMoredesignType').find('ul > li').each(($li, id) => {
        let i = id == 0 ? '' : id;
        cy.get('#designType' + i).children().first().should('not.be.selected');
      });
      cy.get('#addMorelicences').find('ul > li').each(($li, id) => {
        let i = id == 0 ? '' : id;
        cy.get('#enlicencesURL' + i).should('not.have.value', '');
        cy.get('#frlicencesURL' + i).should('not.have.value', '');
        cy.get('#licencesspdxID' + i).children().first().should('not.be.selected');
      });
    });
});

it('Should reset all fields when reset is activated', () => {
    cy.get('#date').type('2020-02-19');
    cy.get('#contactemail').type('Test@test.ca');
    cy.get('#contactname').type('Test');
    cy.get('#submitterusername').type('Test');
    cy.get('#submitteremail').type('Test@test.ca');
    cy.get('#frteam').type('Test');
    cy.get('#enteam').type('Test');
    cy.get('#frdescriptionhowItWorks').type('Test');
    cy.get('#endescriptionhowItWorks').type('Test');
    cy.get('#designStatus').select('Original design');
    cy.get('#addMoredesignType').find('.btn-tabs-more').click();
    cy.get('#addMoredesignType').find('.btn-tabs-more').click();
    cy.get('#addMorelicences').find('.btn-tabs-more').click();
    cy.get('#addMorelicences').find('.btn-tabs-more').click();
    cy.get('#adminCode').children().eq(1)
    .children().eq(1).invoke('text').then((code) => {
        cy.get('#adminCode').select(code);
        cy.get('#formReset').click().then(() => {
        cy.get('#adminCode').children().first().should('be.selected');
        cy.get('#nameselect').children().first().should('be.selected');
        cy.get('#enname').should('have.value', '');
        cy.get('#frname').should('have.value', '');
        cy.get('#endescriptionwhatItDoes').should('have.value', '');
        cy.get('#frdescriptionwhatItDoes').should('have.value', '');
        cy.get('#frdescriptionhowItWorks').should('have.value', '');
        cy.get('#endescriptionhowItWorks').should('have.value', '');
        cy.get('#enhomepageURL').should('have.value', '');
        cy.get('#frhomepageURL').should('have.value', '');
        cy.get('#addMoredesignType').find('ul > li').should('have.length.lte', 1);
        cy.get('#designType').children().first().should('be.selected');
        cy.get('#addMorelicences').find('ul > li').should('have.length.lte', 1);
        cy.get('#enlicencesURL').should('have.value', '');
        cy.get('#frlicencesURL').should('have.value', '');
        cy.get('#licencesspdxID').children().first().should('be.selected');
        cy.get('#designStatus').children().first().should('be.selected');
        cy.get('#frteam').should('have.value', '');
        cy.get('#enteam').should('have.value', '');
        cy.get('#date').should('have.value', '');
        cy.get('#contactemail').should('have.value', '');
        cy.get('#contactname').should('have.value', '');
        cy.get('#submitteremail').should('have.value', '');
        cy.get('#submitterusername').should('have.value', '');
      });
    });
});

it('Values should be autofilled when design name is selected on french page', () => {
  cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
  cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
    cy.get('#nameselect').select(name);
    cy.get('#enname').should('not.have.value', '');
    cy.get('#frname').should('have.value', name);
    cy.get('#endescriptionwhatItDoes').should('not.have.value', '');
    cy.get('#frdescriptionwhatItDoes').should('not.have.value', '');
    cy.get('#enhomepageURL').should('not.have.value', '');
    cy.get('#frhomepageURL').should('not.have.value', '');
    cy.get('#addMoredesignType').find('ul > li').each(($li, id) => {
      let i = id == 0 ? '' : id;
      cy.get('#designType' + i).children().first().should('not.be.selected');
    });
    cy.get('#addMorelicences').find('ul > li').each(($li, id) => {
      let i = id == 0 ? '' : id;
      cy.get('#enlicencesURL' + i).should('not.have.value', '');
      cy.get('#frlicencesURL' + i).should('not.have.value', '');
      cy.get('#licencesspdxID' + i).children().first().should('not.be.selected');
    });
  });
});

it('Should reset all fields when reset is activated on french page', () => {
  cy.get('#date').type('2020-02-19');
  cy.get('#contactemail').type('Test@test.ca');
  cy.get('#contactname').type('Test');
  cy.get('#submitterusername').type('Test');
  cy.get('#submitteremail').type('Test@test.ca');
  cy.get('#frteam').type('Test');
  cy.get('#enteam').type('Test');
  cy.get('#frdescriptionhowItWorks').type('Test');
  cy.get('#endescriptionhowItWorks').type('Test');
  cy.get('#designStatus').select('Design original');
  cy.get('#addMoredesignType').find('.btn-tabs-more').click();
  cy.get('#addMoredesignType').find('.btn-tabs-more').click();
  cy.get('#addMorelicences').find('.btn-tabs-more').click();
  cy.get('#addMorelicences').find('.btn-tabs-more').click();
  cy.get('#adminCode').children().eq(1)
  .children().eq(1).invoke('text').then((code) => {
      cy.get('#adminCode').select(code);
      cy.get('#formReset').click().then(() => {
        cy.get('#adminCode').children().first().should('be.selected');
        cy.get('#nameselect').children().first().should('be.selected');
        cy.get('#enname').should('have.value', '');
        cy.get('#frname').should('have.value', '');
        cy.get('#endescriptionwhatItDoes').should('have.value', '');
        cy.get('#frdescriptionwhatItDoes').should('have.value', '');
        cy.get('#frdescriptionhowItWorks').should('have.value', '');
        cy.get('#endescriptionhowItWorks').should('have.value', '');
        cy.get('#enhomepageURL').should('have.value', '');
        cy.get('#frhomepageURL').should('have.value', '');
        cy.get('#addMoredesignType').find('ul > li').should('have.length.lte', 1);
        cy.get('#designType').children().first().should('be.selected');
        cy.get('#addMorelicences').find('ul > li').should('have.length.lte', 1);
        cy.get('#enlicencesURL').should('have.value', '');
        cy.get('#frlicencesURL').should('have.value', '');
        cy.get('#licencesspdxID').children().first().should('be.selected');
        cy.get('#designStatus').children().first().should('be.selected');
        cy.get('#frteam').should('have.value', '');
        cy.get('#enteam').should('have.value', '');
        cy.get('#date').should('have.value', '');
        cy.get('#contactemail').should('have.value', '');
        cy.get('#contactname').should('have.value', '');
        cy.get('#submitteremail').should('have.value', '');
        cy.get('#submitterusername').should('have.value', '');
    });
  });
});
});

context('Open Design Form submission', () => {
  
  
  it ('Should fail submit', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    //Wait needed because otherwise the click happens too fast and the validation doesn't really go through
    cy.wait(1000);
    cy.get('#prbotSubmitdesignForm').click().then(() => {
      cy.get('#errors-validation').should('exist');
      cy.get('#errors-validation').find('ul > li').should('have.length', 15);
    });
  });

  it ('Should fail submit with 1 error', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#adminCode').children().eq(1)
      .children().eq(1).invoke('text').then((code) => {
        cy.get('#adminCode').select(code);
        cy.get('#contactemail').type('Test@test.ca');
        cy.get('#submitterusername').type('Test');
        cy.get('#submitteremail').type('Test@test.ca');
        cy.get('#prbotSubmitdesignForm').click().then(() => {
          cy.get('#errors-validation').find('ul > li').should('have.length', 1);
        });
      });
    });
  });

  it ('Should submit', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#adminCode').children().eq(1)
      .children().eq(1).invoke('text').then((code) => {
        cy.get('#adminCode').select(code);
        cy.get('#submitterusername').type('Test');
        cy.get('#submitteremail').type('Test@test.ca');
        cy.get('#contactemail').type('Test@test.ca');
        cy.get('#date').type('2020-02-19');
        cy.get('#prbotSubmitdesignForm').click().then(() => {
          cy.get('#prbotSubmitAlertInProgress').should('be.visible');
        });
        cy.get('#validation').submit().end();
      });
    });
  });

  it ('Should fail submit on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    //Wait needed because otherwise the click happens too fast and the validation doesn't really go through
    cy.wait(1000);
    cy.get('#prbotSubmitdesignForm').click().then(() => {
      cy.get('#errors-validation').should('exist');
      cy.get('#errors-validation').find('ul > li').should('have.length', 15);
    });
  });

  it ('Should fail submit with 1 error on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#adminCode').children().eq(1)
      .children().eq(1).invoke('text').then((code) => {
        cy.get('#adminCode').select(code);
        cy.get('#submitterusername').type('Test');
        cy.get('#submitteremail').type('Test@test.ca');
        cy.get('#contactemail').type('Test@test.ca');
        cy.get('#prbotSubmitdesignForm').click().then(() => {
          cy.get('#errors-validation').find('ul > li').should('have.length', 1);
        });
      });
    });
  });

  it ('Should submit on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#adminCode').children().eq(1)
      .children().eq(1).invoke('text').then((code) => {
        cy.get('#adminCode').select(code);
        cy.get('#submitterusername').type('Test');
        cy.get('#submitteremail').type('Test@test.ca');
        cy.get('#contactemail').type('Test@test.ca');
        cy.get('#date').type('2020-02-19');
        cy.get('#prbotSubmitdesignForm').click().then(() => {
          cy.get('#prbotSubmitAlertInProgress').should('be.visible');
        });
        cy.get('#validation').submit().end();
      });
    });
  });
});