const { getToday } = require('../assets/js/src/date');

describe("Date function", () => {
    // test 
    test("it should get date of today", () => {
        // actual test
        const d = new Date();
        const output = (d.getFullYear() +
            '-' +
            ((d.getMonth() + 1) < 10 ? '0' : '') +
            (d.getMonth() + 1) +
            '-' +
            ((d.getDate()) < 10 ? '0' : '') +
            (d.getDate())
        );
        
        expect(getToday()).toEqual(output);
    });
});