/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Source Code', () => {
    it('Loads the English page', () => {
      cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
      cy.get('#wb-cont').contains('Open Source Code');
    });
  
    it('Dynamically filters on the English page', () => {
      cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
      cy.get('#dataset-filter_filter')
        .find('input')
        .type('youcanbenefit');
  
      cy.get('#dataset-filter')
        .find('tbody>tr')
        .first()
        .find('td>a')
        .first()
        .contains('YouCanBenefit');
    });
  
    it('Loads the French page', () => {
      cy.visit('http://localhost:4000/ore-ero/fr/codes-source-ouverts.html');
      cy.get('#wb-cont').contains('Code Source Ouvert');
    });
  
    it('Dynamically filters on the French page', () => {
      cy.visit('http://localhost:4000/ore-ero/fr/codes-source-ouverts.html');
      cy.get('#dataset-filter_filter')
        .find('input')
        .type('youcanbenefit');
  
      cy.get('#dataset-filter')
        .find('tbody>tr')
        .first()
        .find('td>a')
        .first()
        .contains('YouCanBenefit');
    });
  });