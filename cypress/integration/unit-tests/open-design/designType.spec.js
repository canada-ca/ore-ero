/// <reference types="Cypress" />
/* global cy, context, it, expect */

context('Open Design Form', () => {
   
it ('New type button should make new type field appear if hidden and both new type button and remove new type button should hide it if shown', () => {
  cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
  cy.get('#newTypeButton').click();
  cy.get('#newType').should('be.visible');
  cy.get('#newTypeButton').click();
  cy.get('#newType').should('be.hidden');
  cy.get('#newTypeButton').click();
  cy.get('#cancelnewTypeButton').click();
  cy.get('#newType').should('be.hidden');
  });

it ('newType button and designType select should return the other to default state when clicked/changed', () => {
  cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
  cy.get('#newTypeButton').click();
  cy.get('#designType').select('Application');
  cy.get('#newType').should('be.hidden');  
  cy.get('#newTypeButton').click();
  cy.get('#designType').children().first().should('be.selected');  
  });

  it ('New type button should make new type field appear if hidden and both new type button and remove new type button should hide it if shown on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    cy.get('#newTypeButton').click();
    cy.get('#newType').should('be.visible');
    cy.get('#newTypeButton').click();
    cy.get('#newType').should('be.hidden');
    cy.get('#newTypeButton').click();
    cy.get('#cancelnewTypeButton').click();
    cy.get('#newType').should('be.hidden');
    });
  
  it ('newType button and designType select should return the other to default state when clicked/changed on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    cy.get('#newTypeButton').click();
    cy.get('#designType').select('Application');
    cy.get('#newType').should('be.hidden');  
    cy.get('#newTypeButton').click();
    cy.get('#designType').children().first().should('be.selected');  
    });

  it ('addMoredesignType button should add an element to the list and show the removeMoredesignType button', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    cy.get('#addMoredesignType').find('.btn-tabs-more').click();
    cy.get('#addMoredesignType').find('ul > li').should('have.length', 2);
    cy.get('#addMoredesignType').find('.btn-tabs-more-remove').should('be.visible');
  });
  it ('removeMoredesignType button should remove an item from the list and disappear', () => {
    cy.get('#addMoredesignType').find('.btn-tabs-more-remove').click();
    cy.get('#addMoredesignType').find('ul > li').should('have.length', 1);
    cy.get('#addMoredesignType').find('.btn-tabs-more-remove').should('be.hidden');
  });

  


});