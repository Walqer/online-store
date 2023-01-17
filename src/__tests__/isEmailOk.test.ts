import { isEmailOk } from '../ts/helpers/modal';

describe('check validation for customer Email value', () => {
    test('email validator', () => {
        const cases = [
            { input: '', expected: false },
            { input: 'abc', expected: false },
            { input: '123', expected: false },
            { input: '@.123', expected: false },
            { input: ' ', expected: false },
            { input: 'abc123', expected: false },
            { input: 'example@yandex.1', expected: false },
            { input: 'example@1..ru', expected: false },
            { input: 'example@1.ru', expected: true },
            { input: 'example@yandex.com', expected: true },
            { input: 'exam.ple@gmail.com', expected: true },
        ];
        cases.forEach(({ input, expected }) => {
            expect(isEmailOk(input)).toBe(expected);
        });
    });
});
