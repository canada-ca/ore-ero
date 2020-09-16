/// <reference types="Cypress" />
/* global cy, context, it */
context('Open Source Software on the English page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-softwares.html');
  });

  it('Loads the English page', () => {
    cy.get('#wb-cont').contains('Open Source Software');
  });

  it('Dynamically filters on the English page', () => {
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

  it('Dynamically filters on the English page', () => {
      cy.get('#dataset-filter_filter')
          .find('input')
          .type('cypress');

      cy.get('#dataset-filter')
          .find('tbody>tr')
          .should('not.contain', 'cypress');
  });

  it('Can filter for an existing element on the English page', () => {
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

context('Open Source Software on the French page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciels-libres.html');
  });

  it('Loads the French page', () => {
    cy.get('#wb-cont').contains('Logiciels libres');
  });

  it('Dynamically filters on the French page', () => {
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

  it('Dynamically filters on the English page', () => {
      cy.get('#dataset-filter_filter')
          .find('input')
          .type('cypress');

      cy.get('#dataset-filter')
          .find('tbody>tr')
          .should('not.contain', 'cypress');
  });

  it('Can filter for an existing element on the French page', () => {
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

context('Open Source Software on the English Form page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
  });

  it('Loads the English Form page', () => {
    cy.get('#wb-cont').contains('Open Source Software Form');
  });

  it('Should return dynamicall filled of existing data information on the English page', () => {
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#enname').should('have.value', name);
      cy.get('#frname').should('not.have.value', '');
      cy.get('#endescriptionwhatItDoes').should('not.have.value', '');
      cy.get('#frdescriptionwhatItDoes').should('not.have.value', '');
      cy.get('#enhomepageURL').should('not.have.value', '');
      cy.get('#frhomepageURL').should('not.have.value', '');
      cy.get('#category').children().first().should('not.be.selected');
      cy.get('#entags').should('not.have.value', '');
      cy.get('#frtags').should('not.have.value', '');
      cy.get('#addMorelicences').find('ul > li').each(($li, id) => {
        let i = id == 0 ? '' : id;
        cy.get('#enlicencesURL' + i).should('not.have.value', '');
        cy.get('#frlicencesURL' + i).should('not.have.value', '');
        cy.get('#licencesspdxID' + i).children().first().should('not.be.selected');
      });
    });
  });

  it('Should submit form on the English page', () => {
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
      .type("1959-09-13")
      .should('have.value','1959-09-13');
    cy.get('input#submitterusername')
      .type('test name')
      .should('have.value','test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.window().then(win => {
      win.submit_init.submitInit();
    });
    cy.get('#prbotSubmitAlertInProgress').should('be.visible');
    });
});

context('Open Source Software on the French Form page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
  });

  it('Loads the French Form page', () => {
    cy.get('#wb-cont').contains('Formulaire du logiciel libre');
  });
  
  it('Should return dynamicall filled of existing data information on the French page', () => {
    cy.get('#nameselect').children().eq(1).invoke('text').then((name) => {
      cy.get('#nameselect').select(name);
      cy.get('#enname').should('have.value', name);
      cy.get('#frname').should('not.have.value', '');
      cy.get('#endescriptionwhatItDoes').should('not.have.value', '');
      cy.get('#frdescriptionwhatItDoes').should('not.have.value', '');
      cy.get('#enhomepageURL').should('not.have.value', '');
      cy.get('#frhomepageURL').should('not.have.value', '');
      cy.get('#category').children().first().should('not.be.selected');
      cy.get('#entags').should('not.have.value', '');
      cy.get('#frtags').should('not.have.value', '');
      cy.get('#addMorelicences').find('ul > li').each(($li, id) => {
        let i = id == 0 ? '' : id;
        cy.get('#enlicencesURL' + i).should('not.have.value', '');
        cy.get('#frlicencesURL' + i).should('not.have.value', '');
        cy.get('#licencesspdxID' + i).children().first().should('not.be.selected');
      });
    });
  });
  
  it('Should submit form on the French page', () => {
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
      .type("1959-09-13")
      .should('have.value','1959-09-13');
    cy.get('input#submitterusername')
      .type('test name')
      .should('have.value','test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
      cy.window().then(win => {
        win.submit_init.submitInit();
      });
      cy.get('#prbotSubmitAlertInProgress').should('be.visible');
  });
});
