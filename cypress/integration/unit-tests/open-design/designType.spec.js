/// <reference types="Cypress" />
/* global cy, context, it, expect */

context('Open Design Form', () => {
   
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

  it ('New type button should make new type field appear if hidden and both new type button and remove new type button should hide it if shown on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    cy.window().get('#newTypeButton').click();
    cy.window().get('#newType').should('be.visible');
    cy.window().get('#newTypeButton').click();
    cy.window().get('#newType').should('be.hidden');
    cy.window().get('#newTypeButton').click();
    cy.window().get('#cancelnewTypeButton').click();
    cy.window().get('#newType').should('be.hidden');
    });
  
  it ('newType button and designType select should return the other to default state when clicked/changed on french page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/design-libre-formulaire.html');
    cy.window().get('#newTypeButton').click();
    cy.window().get('#designType').select('Application');
    cy.window().get('#newType').should('be.hidden');  
    cy.window().get('#newTypeButton').click();
    cy.window().get('#designType').children().first().should('be.selected');  
    });

});