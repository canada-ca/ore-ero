context('Licences', () => {
    it ('addMorelicences button should add an element to the list and show the removeMorelicences button', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    cy.get('#addMorelicences').find('.btn-tabs-more').click();
    cy.get('#addMorelicences').find('ul > li').should('have.length', 2);
    cy.get('#addMorelicences').find('.btn-tabs-more-remove').should('be.visible');
  });
  it ('removeMorelicences button should remove an item from the list and disappear', () => {
    cy.get('#addMorelicences').find('.btn-tabs-more-remove').click();
    cy.get('#addMorelicences').find('ul > li').should('have.length', 1);
    cy.get('#addMorelicences').find('.btn-tabs-more-remove').should('be.hidden');
  });

  it ('There should be available licence options', () => {
    cy.visit('http://localhost:4000/ore-ero/en/open-design-form.html');
    cy.get('#licencesspdxID').children().should('have.length.greaterThan', 1);
  });
});