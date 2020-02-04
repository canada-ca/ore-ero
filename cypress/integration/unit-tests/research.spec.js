/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Research', () => {
    it('Loads the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-researches.html');
        cy.get('#wb-cont').contains('Open Researches');
    });

    it('Dynamically filters on the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-researches.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('jekyll');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .first()
            .find('td>a')
            .first()
            .contains('Jekyll');
    });

    it('Loads the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/recherches-libres.html');
        cy.get('#wb-cont').contains('Recherches libres');
    });

    it('Dynamically filters on the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/recherches-libres.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('jekyll');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .first()
            .find('td>a')
            .first()
            .contains('Jekyll');
    });
});