import { isCVCOk } from '../ts/helpers/modal';

describe('check validation for customer Credit Card CVC value', () => {
  test('cvc length should be equal to 3', () => {
    const cases = [
      { input: '', expected: false },
      { input: '12', expected: false },
      { input: '1234', expected: false },
      { input: '123', expected: true },
    ];
    cases.forEach(({ input, expected }) => {
      expect(isCVCOk(input)).toBe(expected);
    });
  });
});