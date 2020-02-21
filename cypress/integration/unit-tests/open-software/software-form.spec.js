/// <reference types="Cypress" />
/* global cy, context, it, date_func */

context('softwareForm.js', () => {
  let softwareObject = [];

  before(() => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
  });

  it('Loads the script', () => {
    cy.window().should('have.property', 'getsoftwareObject');
  });

});
