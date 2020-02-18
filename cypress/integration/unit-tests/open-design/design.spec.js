/// <reference types="Cypress" />
/* global cy, context, it */

context('Open Design', () => {
    it('Loads the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design.html');
        cy.get('#wb-cont').contains('Open Designs');
    });

    it('Dynamically filters on the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('docker');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .should('not.contain', 'docker');
    });

    it('Can filter for an existing element', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design.html');
        let expected = cy.get('#dataset-filter').find('tbody');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type(expected);

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .should('contain', expected);
    });

    it('Loads the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre.html');
        cy.get('#wb-cont').contains('Designs Libres');
    });

    it('Dynamically filters on the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('docker');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .should('not.contain', 'docker');
    });
});