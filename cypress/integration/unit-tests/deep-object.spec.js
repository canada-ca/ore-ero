/// <reference types="Cypress" />
/* global cy, context, it, before, expect */

context('deep-object.js', () => {
  const obj1 = {
    a: {
      a: 'Alpha',
      b: 'Beta',
      c: 'Gamma',
    },
    b: [0, 1, 2, 3, 4],
    c: [
      {
        a: 'Alpha',
      },
      {
        a: 'Beta',
      },
      {
        a: 'Gamma',
      },
    ],
  };

  before(() => {
    cy.visit('http://localhost:4000/ore-ero/en/index.html');
  });

  it('Loads the script', () => {
    cy.window().should('have.property', 'DeepObject');
  });

  it('Finds shallow objects', () => {
    cy.window().then((win) => {
      let value = win.DeepObject.get(obj1, 'a');
      expect(value).to.equal(obj1.a);
    });
  });

  it('Finds array elements', () => {
    cy.window().then((win) => {
      let value = win.DeepObject.get(obj1, 'b.0');
      expect(value).to.equal(0);
    });
  });

  it('Finds objects in arrays', () => {
    cy.window().then((win) => {
      let value = win.DeepObject.get(obj1, 'c.0.a');
      expect(value).to.equal('Alpha');
    });
  });

  it("Returns undefined if it doesn't exist", () => {
    cy.window().then((win) => {
      let value = win.DeepObject.get(obj1, 'c.5');
      expect(value).to.equal(undefined);
    });
  });

  it('Replaces string that already exists', () => {
    cy.window().then((win) => {
      let value = {
        a: 'A',
        b: 'B',
      };

      win.DeepObject.set(value, 'a', 'sweet!');
      expect(value.a).to.equal('sweet!');
    });
  });

  it('Adds new string that does not exist', () => {
    cy.window().then((win) => {
      let value = {
        a: 'A',
        b: 'B',
      };

      win.DeepObject.set(value, 'c', 'C');
      expect(value.c).to.equal('C');
    });
  });

  it('Replaces nested object', () => {
    cy.window().then((win) => {
      let innerValue = {
        a: 'Alpha',
      };
      let value = {
        a: {
          a: 'A',
        },
      };

      win.DeepObject.set(value, 'a', innerValue);
      expect(value.a.a).to.equal('Alpha');
    });
  });

  it('Adds new object', () => {
    cy.window().then((win) => {
      let innerValue = {
        b: 'B',
      };
      let value = {
        a: {
          a: 'A',
        },
      };

      win.DeepObject.set(value, 'b', innerValue);
      expect(value.b.b).to.equal('B');
    });
  });
});
