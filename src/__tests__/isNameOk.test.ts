import { isNameOk } from '../ts/helpers/modal';

describe('check validation for customer Name value', () => {
    test('Name contains more than 2 words', () => {
        const cases = [
            { input: '', expected: false },
            { input: 'Joe', expected: false },
            { input: 'Joe  Biden ', expected: true },
            { input: 'Joe Biden', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isNameOk(input)).toBe(expected);
        });
    });
    test('Length of words is greater than 3', () => {
        const cases = [
            { input: 'Li Un', expected: false },
            { input: 'Ho Mint', expected: false },
            { input: 'Mint Ho', expected: false },
            { input: 'Joe Joe', expected: true },
            { input: 'John Rambo', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isNameOk(input)).toBe(expected);
        });
    });
});
