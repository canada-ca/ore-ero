/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Design Form', () => {

    it('Loads the script', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
        cy.window().should('have.property', 'designType');
        });

    it('Values should be autofilled when design name is selected', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
        cy.window().get('#nameselect').children().eq(1).invoke('text').then((name) => {
          cy.window().get('#nameselect').select(name);
          cy.window().get('#enname').should('have.value', name);
          cy.window().get('#frname').should('not.have.value', '');
          cy.window().get('#endescriptionwhatItDoes').should('not.have.value', '');
          cy.window().get('#frdescriptionwhatItDoes').should('not.have.value', '');
          cy.window().get('#enhomepageURL').should('not.have.value', '');
          cy.window().get('#frhomepageURL').should('not.have.value', '');
          cy.window().get('#addMoredesignType').find('ul > li').each(($li, id) => {
            let i = id == 0 ? '' : id;
            cy.window().get('#designType' + i).children().first().should('not.be.selected');
          });
          cy.window().get('#addMorelicences').find('ul > li').each(($li, id) => {
            let i = id == 0 ? '' : id;
            cy.window().get('#enlicencesURL' + i).should('not.have.value', '');
            cy.window().get('#frlicencesURL' + i).should('not.have.value', '');
            cy.window().get('#licencesspdxID' + i).children().first().should('not.be.selected');
          });
        });
    });

    it('Should reset all fields when reset is activated', () => {
        cy.window().get('#date').type('2020-02-19');
        cy.window().get('#contactemail').type('Test@test.ca');
        cy.window().get('#contactname').type('Test');
        cy.window().get('#submitterusername').type('Test');
        cy.window().get('#submitteremail').type('Test@test.ca');
        cy.window().get('#frteam').type('Test');
        cy.window().get('#enteam').type('Test');
        cy.window().get('#frdescriptionhowItWorks').type('Test');
        cy.window().get('#endescriptionhowItWorks').type('Test');
        cy.window().get('#designStatus').select('Original design');
        cy.window().get('#adminCode').children().eq(1)
        .children().eq(1).invoke('text').then((code) => {
            cy.window().get('#adminCode').select(code);
            cy.window().get('#formReset').click().then(() => {
            cy.window().get('#adminCode').children().first().should('be.selected');
            cy.window().get('#nameselect').children().first().should('be.selected');
            cy.window().get('#enname').should('have.value', '');
            cy.window().get('#frname').should('have.value', '');
            cy.window().get('#endescriptionwhatItDoes').should('have.value', '');
            cy.window().get('#frdescriptionwhatItDoes').should('have.value', '');
            cy.window().get('#frdescriptionhowItWorks').should('have.value', '');
            cy.window().get('#endescriptionhowItWorks').should('have.value', '');
            cy.window().get('#enhomepageURL').should('have.value', '');
            cy.window().get('#frhomepageURL').should('have.value', '');
            cy.window().get('#addMoredesignType').find('ul > li').should('have.length.lte', 1);
            cy.window().get('#designType').children().first().should('be.selected');
            cy.window().get('#addMorelicences').find('ul > li').should('have.length.lte', 1);
            cy.window().get('#enlicencesURL').should('have.value', '');
            cy.window().get('#frlicencesURL').should('have.value', '');
            cy.window().get('#licencesspdxID').children().first().should('be.selected');
            cy.window().get('#designStatus').children().first().should('be.selected');
            cy.window().get('#frteam').should('have.value', '');
            cy.window().get('#enteam').should('have.value', '');
            cy.window().get('#date').should('have.value', '');
            cy.window().get('#contactemail').should('have.value', '');
            cy.window().get('#contactname').should('have.value', '');
            cy.window().get('#submitteremail').should('have.value', '');
            cy.window().get('#submitterusername').should('have.value', '');
          });
        });
    });

    it('Loads the script on french page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
        cy.window().should('have.property', 'designType');
        });

    it('Values should be autofilled when design name is selected on french page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
        cy.window().get('#nameselect').children().eq(1).invoke('text').then((name) => {
          cy.window().get('#nameselect').select(name);
          cy.window().get('#enname').should('not.have.value', '');
          cy.window().get('#frname').should('have.value', name);
          cy.window().get('#endescriptionwhatItDoes').should('not.have.value', '');
          cy.window().get('#frdescriptionwhatItDoes').should('not.have.value', '');
          cy.window().get('#enhomepageURL').should('not.have.value', '');
          cy.window().get('#frhomepageURL').should('not.have.value', '');
          cy.window().get('#addMoredesignType').find('ul > li').each(($li, id) => {
            let i = id == 0 ? '' : id;
            cy.window().get('#designType' + i).children().first().should('not.be.selected');
          });
          cy.window().get('#addMorelicences').find('ul > li').each(($li, id) => {
            let i = id == 0 ? '' : id;
            cy.window().get('#enlicencesURL' + i).should('not.have.value', '');
            cy.window().get('#frlicencesURL' + i).should('not.have.value', '');
            cy.window().get('#licencesspdxID' + i).children().first().should('not.be.selected');
          });
        });
    });

    it('Should reset all fields when reset is activated on french page', () => {
        cy.window().get('#date').type('2020-02-19');
        cy.window().get('#contactemail').type('Test@test.ca');
        cy.window().get('#contactname').type('Test');
        cy.window().get('#submitterusername').type('Test');
        cy.window().get('#submitteremail').type('Test@test.ca');
        cy.window().get('#frteam').type('Test');
        cy.window().get('#enteam').type('Test');
        cy.window().get('#frdescriptionhowItWorks').type('Test');
        cy.window().get('#endescriptionhowItWorks').type('Test');
        cy.window().get('#designStatus').select('Design original');
        cy.window().get('#adminCode').children().eq(1)
        .children().eq(1).invoke('text').then((code) => {
            cy.window().get('#adminCode').select(code);
            cy.window().get('#formReset').click().then(() => {
            cy.window().get('#adminCode').children().first().should('be.selected');
            cy.window().get('#nameselect').children().first().should('be.selected');
            cy.window().get('#enname').should('have.value', '');
            cy.window().get('#frname').should('have.value', '');
            cy.window().get('#endescriptionwhatItDoes').should('have.value', '');
            cy.window().get('#frdescriptionwhatItDoes').should('have.value', '');
            cy.window().get('#enhomepageURL').should('have.value', '');
            cy.window().get('#frhomepageURL').should('have.value', '');
            cy.window().get('#addMoredesignType').find('ul > li').should('have.length.lte', 1);
            cy.window().get('#designType').children().first().should('be.selected');
            cy.window().get('#addMorelicences').find('ul > li').should('have.length.lte', 1);
            cy.window().get('#enlicencesURL').should('have.value', '');
            cy.window().get('#frlicencesURL').should('have.value', '');
            cy.window().get('#licencesspdxID').children().first().should('be.selected');
            cy.window().get('#designStatus').children().first().should('be.selected');
            cy.window().get('#frteam').should('have.value', '');
            cy.window().get('#enteam').should('have.value', '');
            cy.window().get('#date').should('have.value', '');
            cy.window().get('#contactemail').should('have.value', '');
            cy.window().get('#contactname').should('have.value', '');
            cy.window().get('#submitteremail').should('have.value', '');
            cy.window().get('#submitterusername').should('have.value', '');
          });
        });
    });

});