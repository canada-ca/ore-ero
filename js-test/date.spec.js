const { testGetToday } = require('../assets/js/src/date');
describe("Date function", () => {
    // test 
    test("It should call and return Date.now()", () => {
        // actual test
        const now = new Date();
        const output = (now.getFullYear() +
            '-' +
            ((now.getMonth() + 1) < 10 ? '0' : '') +
            (now.getMonth() + 1) +
            '-' +
            ((now.getDate()) < 10 ? '0' : '') +
            (now.getDate())
        );

        expect(testGetToday()).toEqual(output);
    });

    test("It should not equal to day time", () => {
        const output = new Date(Date.now());;

        expect(testGetToday()).not.toEqual(output);
    });
});