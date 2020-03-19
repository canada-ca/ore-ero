/// <reference types="Cypress" />
/* global cy, context, it */

context('Partnerships', () => {
    it('Loads the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/partnerships.html');
        cy.get('#wb-cont').contains('Partnerships');
    });

    it('Dynamically filters on the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/partnerships.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('docker');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .should('not.contain', 'docker');
    });

    it('Loads the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/partenariats.html');
        cy.get('#wb-cont').contains('Partenariats');
    });

    it('Dynamically filters on the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/partenariats.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('docker');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .should('not.contain', 'docker');
    });
});