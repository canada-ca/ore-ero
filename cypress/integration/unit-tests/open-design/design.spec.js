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

    it('Can filter for an existing element on the English page', () => {
        cy.visit('http://localhost:4000/ore-ero/en/open-design.html');
        cy.get('#dataset-filter')
            .find('tbody')
            .get('td')
            .eq(0)
            .invoke('text')
            .then((expected) => {
                cy.get('#dataset-filter_filter')
                    .find('input')
                    .type(expected);

                cy.get('#dataset-filter')
                    .find('tbody>tr')
                    .should('contain', expected);
            });
    });
    

    it('Loads the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre.html');
        cy.get('#wb-cont').contains('Designs Libres');
    });

    it('Dynamically filters on the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre.html');
        cy.get('#dataset-filter_filter')
            .find('input')
            .type('docker');

        cy.get('#dataset-filter')
            .find('tbody>tr')
            .should('not.contain', 'docker');
    });

    it('Can filter for an existing element on the French page', () => {
        cy.visit('http://localhost:4000/ore-ero/fr/design-libre.html');
        cy.get('#dataset-filter')
            .find('tbody')
            .get('td')
            .eq(0)
            .invoke('text')
            .then((expected) => {
                cy.get('#dataset-filter_filter')
                    .find('input')
                    .type(expected);

                cy.get('#dataset-filter')
                    .find('tbody>tr')
                    .should('contain', expected);
            });
    });

    
});


context('Common parts', () => {
    const selectTags = [
      '#dt_govLevel',
      '#dt_licence',
      '#dt_type',
      '#dt_status'
    ];
    // eslint-disable-next-line no-undef
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-design.html');
    });

    it('should reset inputs', function() {
      //select first element of the select
      //should test if it's null
      selectTags.forEach(selectTag => {
        cy.get(`${selectTag} > option`)
          .eq(1)
          .then(element => {
            cy.get(selectTag).select(element.val());
          });
      });

      cy.get('.wb-tables-filter > .row > :nth-child(2) > .btn').click();

      selectTags.forEach(selectTag => {
        cy.get(`${selectTag} > option`)
          .eq(0)
          .should('be.selected');
      });
    });

    it('should filter the first element with the right values', () => {
      cy.get('.sorting_1')
        .first()
        .then(projectName => {
          cy.get('tbody > :nth-child(1) > :nth-child(4)').then(type => {
            cy.get(`#dt_type`).select(type.text().trim());
          });
          cy.get('tbody > :nth-child(1) > :nth-child(3)').then(licence => {
            cy.get(`#dt_licence`).select(licence.text().trim());
          });
          cy.get('.wb-tables-filter > .row > :nth-child(1) > .btn').click();
          cy.get(':nth-child(1) > .sorting_1').contains(projectName.text());
        });
    });

    it('should open the correct modal', () => {
      //25, 25 should hit the link no matter the size of the box
      cy.get(':nth-child(1) > .sorting_1').click(25, 25);
      cy.get(':nth-child(1) > .sorting_1').then(name => {
        cy.get('.wb-overlay.open').contains(name.text());
      });

      // click on the close button
      cy.get('.wb-overlay.open .btn').click();
      cy.get('.wb-overlay').should('not.be.visible');
    });
  });