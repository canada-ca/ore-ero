/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Source Software', () => {
    
    // before(() => {
    //     cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
    //     cy.get('#wb-cont').contains('Open Source Software Form');
    // });

    it('Loads the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
        cy.get('#wb-cont').contains('Open Source Software Form');
    });


});