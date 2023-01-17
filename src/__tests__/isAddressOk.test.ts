import { isAddressOk } from '../ts/helpers/modal';

describe('check validation for customer Address value', () => {
    test('Address should contain more than or equal to 3 words', () => {
        const cases = [
            { input: 'qwe', expected: false },
            { input: 'qwe qwe', expected: false },
            { input: 'qweqwe', expected: false },
            { input: 'qwe12 qwe12', expected: false },
            { input: 'almaty tolebi   666-66', expected: true },
            { input: 'almaty tolebi almaty tolebi', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isAddressOk(input)).toBe(expected);
        });
    });
    test('each word length shold be more than or equal to 5', () => {
        const cases = [
            { input: 'qwe qwe qwe', expected: false },
            { input: 'qwe1234 qwe1234 qw', expected: false },
            { input: 'almaty tolebi   666-66', expected: true },
            { input: 'minsk, testa 666-66', expected: true },
            { input: 'almaty tolebi almaty tolebi', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isAddressOk(input)).toBe(expected);
        });
    });
});
