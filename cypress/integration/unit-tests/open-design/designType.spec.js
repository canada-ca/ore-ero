/// <reference types="Cypress" />
/* global cy, context, it, expect */

context('Open Design Form', () => {
    

it('Loads the script', () => {
  cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
  cy.window().should('have.property', 'designType');
  });

// it ('should reset newType input fields when resetType method is called', () => {
//     cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
//     cy.window().get('#newTypeButton').click();
//     cy.window().get('#ennewType').type('Test');
//     cy.window().invoke('resetType', '');
//     cy.window().get('#ennewType').should('be.equal', ''); 
//   });
    
it ('New type button should make new type field appear if hidden and both new type button and remove new type button should hide it if shown', () => {
  cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
  cy.window().get('#newTypeButton').click();
  cy.window().get('#newType').should('be.visible');
  cy.window().get('#newTypeButton').click();
  cy.window().get('#newType').should('be.hidden');
  cy.window().get('#newTypeButton').click();
  cy.window().get('#cancelnewTypeButton').click();
  cy.window().get('#newType').should('be.hidden');
  });

it ('newType button and designType select should return the other to default state when clicked/changed', () => {
  cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
  cy.window().get('#newTypeButton').click();
  cy.window().get('#designType').select('Application');
  cy.window().get('#newType').should('be.hidden');  
  cy.window().get('#newTypeButton').click();
  cy.window().get('#designType').children().first().should('be.selected');  
  });

});