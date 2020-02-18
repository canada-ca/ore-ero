/// <reference types="Cypress" />
/* global cy, context, it, expect */

context('Open Design Form', () => {
    
before(() => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
});

it('Loads the script', () => {
    cy.window().should('have.property', 'designType');
  });

it ('should reset newType input fields when resetType method is called', () => {    
        
});
});