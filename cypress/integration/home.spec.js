/// <reference types="Cypress" />
/* global cy, context, it */

context('Home', () => {
  it('Loads the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/index.html');
    cy.get('#wb-cont').contains('Open Resource Exchange');
  });

  it('Loads the French page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/index.html');
    cy.get('#wb-cont').contains('Échange de ressources ouvert');
  });
});
