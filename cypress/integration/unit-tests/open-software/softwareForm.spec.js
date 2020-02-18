/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Source Software', () => {
  it('Loads the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
    cy.get('#wb-cont').contains('Open Source Software Form');
  });

  it('Should return dynamicall filled of existing data information on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
  });

  it('Should not dynamicall filled of unexisting data information on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .should('not.contain', 'sourcetree');
  });
});
