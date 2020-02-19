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
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
        cy.window().get('#formReset').click().then(() => {
            cy.window().get('#adminCode').children().first().should('be.selected');
            cy.window().get('#nameselect').children().first().should('be.selected');
            cy.window().get('#enname').should('have.value', '');
            cy.window().get('#frname').should('have.value', '');
            cy.window().get('#endescriptionwhatItDoes').should('have.value', '');
            cy.window().get('#frdescriptionwhatItDoes').should('have.value', '');
            cy.window().get('#enhomepageURL').should('have.value', '');
            cy.window().get('#frhomepageURL').should('have.value', '');
            cy.window().get('#addMoredesignType').find('ul > li').each(($li, id) => {
              let i = id == 0 ? '' : id;
              cy.window().get('#designType' + i).children().first().should('be.selected');
            });
            cy.window().get('#addMorelicences').find('ul > li').each(($li, id) => {
              let i = id == 0 ? '' : id;
              cy.window().get('#enlicencesURL' + i).should('have.value', '');
              cy.window().get('#frlicencesURL' + i).should('have.value', '');
              cy.window().get('#licencesspdxID' + i).children().first().should('be.selected');
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
});