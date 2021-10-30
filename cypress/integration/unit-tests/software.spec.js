/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Source Software', () => {
  it('Loads the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-softwares.html');
    cy.get('#wb-cont').contains('Open Source Software');
  });

  it('Dynamically filters on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-softwares.html');
    cy.get('#dataset-filter_filter').find('input').type('jekyll');

    cy.get('#dataset-filter')
      .find('tbody>tr')
      .first()
      .find('td>a')
      .first()
      .contains('Jekyll');
  });

  it('Dynamically filters on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-softwares.html');
    cy.get('#dataset-filter_filter').find('input').type('cypress');

    cy.get('#dataset-filter').find('tbody>tr').should('not.contain', 'cypress');
  });

  it('Loads the French page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciels-libres.html');
    cy.get('#wb-cont').contains('Logiciels libres');
  });

  it('Dynamically filters on the French page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciels-libres.html');
    cy.get('#dataset-filter_filter').find('input').type('jekyll');

    cy.get('#dataset-filter')
      .find('tbody>tr')
      .first()
      .find('td>a')
      .first()
      .contains('Jekyll');
  });

  it('Dynamically filters on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciels-libres.html');
    cy.get('#dataset-filter_filter').find('input').type('cypress');

    cy.get('#dataset-filter').find('tbody>tr').should('not.contain', 'cypress');
  });
});
