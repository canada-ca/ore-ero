/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Source Software Form', () => {
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

  it('Should submit form on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
    cy.get('select#adminCode')
      .as('option')
      .invoke('val', 'asc-csa')
      .first()
      .trigger('change')
      .contains('Canadian Space Agency');
    cy.get('input#contactemail')
      .type('jekyll@ymail.com')
      .should('have.value','jekyll@ymail.com');
    cy.get('input#date')
      .type("1959-09-13");
    cy.get('input#submitterusername')
      .type('test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.get('form')
      .submit();
  });

  it('Should not submit form on the English page', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
    cy.get('select#adminCode')
      .as('option')
      .invoke('val', 'asc-csa')
      .first()
      .trigger('change')
      .should('not.contain', 'Hardware');
    cy.get('input#contactemail')
      .type('ymail')
      .should('have.value','ymail');
    cy.get('input#date')
      .type("1959-09-13");
    cy.get('input#submitterusername')
      .type('test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.get('form')
      .submit();
  });

  it('Loads the French page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
    cy.get('#wb-cont').contains('Formulaire du logiciel libre');
  });

  it('Should return dynamicall filled of existing data information on the French page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
  });

  it('Should not dynamicall filled of unexisting data information on the French page', () => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .should('not.contain', 'sourcetree');
  });

    it('Should submit form on the French page', () => {
      cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
      cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
    cy.get('select#adminCode')
      .as('option')
      .invoke('val', 'asc-csa')
      .first()
      .trigger('change')
      .contains('Agence spatiale canadienne');
    cy.get('input#contactemail')
      .type('jekyll@ymail.com')
      .should('have.value','jekyll@ymail.com');
    cy.get('input#date')
      .type("1959-09-13");
    cy.get('input#submitterusername')
      .type('test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.get('form').submit();
    });

    it('Should not submit form on the French page', () => {
      cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
      cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
    cy.get('select#adminCode')
      .as('option')
      .invoke('val', 'asc-csa')
      .first()
      .trigger('change')
      .should('not.contain', 'Hardware');
    cy.get('input#contactemail')
      .type('ymail')
      .should('have.value','ymail');
    cy.get('input#date')
      .type("1959-09-13");
    cy.get('input#submitterusername')
      .type('test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.get('button#prbotSubmitsoftwareForm')
      .click();
    });

});
