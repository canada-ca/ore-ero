/// <reference types="Cypress" />
/* global cy, context, it, before, expect, date */

context('date.js', () => {
    const now = new Date();
    const output = (now.getFullYear() +
        '-' +
        ((now.getMonth() + 1) < 10 ? '0' : '') +
        (now.getMonth() + 1) +
        '-' +
        ((now.getDate()) < 10 ? '0' : '') +
        (now.getDate())
    );

    before(() => {
        cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
    });

    it('Loads the script', () => {
        cy.window().should('have.property', 'Date');
    });

    it('It should call and return Date.now()', () => {
        cy.window().then(win => {
            console.log(date);
            let value = win.date.getToday();
            expect(value).to.equal(output);
        });
    });

    it('It should not equal to day time', () => {
        cy.window().then(win => {
            const outputDate = new Date(Date.now());;
            expect(getToday()).not.toEqual(outputDate);
        });
    });

    // it("Returns undefined if it doesn't exist", () => {
    //     cy.window().then(win => {
    //         let value = win.date.getToday();
    //         expect(value).to.equal(undefined);
    //     });
    // });

    // it('Adds new object', () => {
    //     // cy.window().then(win => {
    //     //     let innerValue = {
    //     //         b: 'B'
    //     //     };
    //     //     let value = {
    //     //         a: {
    //     //             a: 'A'
    //     //         }
    //     //     };

    //     //     win.DeepObject.set(value, 'b', innerValue);
    //     //     expect(value.b.b).to.equal('B');
    //     // });
    // });
});