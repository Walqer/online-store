import { isPhoneOk } from '../ts/helpers/modal';

describe('check validation for customer Phone value', () => {
    test('first char should be "+"', () => {
        const cases = [
            { input: '123456789', expected: false },
            { input: '1+23456789', expected: false },
            { input: '+123456789', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isPhoneOk(input)).toBe(expected);
        });
    });
    test('phone should contain only digits except + on first pos', () => {
        const cases = [
          { input: '+123e21!41', expected: false },
          { input: '+123456789', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isPhoneOk(input)).toBe(expected);
        });
    });
    test('phone length without + should be >= than 9', () => {
        const cases = [
          { input: '+1234', expected: false },
          { input: '+12345678', expected: false },
          { input: '+123456789', expected: true },
          { input: '+12345678901', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isPhoneOk(input)).toBe(expected);
        });
    });
});
