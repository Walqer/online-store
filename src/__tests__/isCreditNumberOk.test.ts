import { isCreditNumberOk } from '../ts/helpers/modal';

describe('check validation for customer Credit Card Number value', () => {
  test('length of credit card number should not be lower than 19(with spaces)', () => {
    const cases = [
      { input: '', expected: false },
      { input: '4566555588884444', expected: false },
      { input: '1234 5667 8956 5125', expected: true },
    ];
    cases.forEach(({ input, expected }) => {
      expect(isCreditNumberOk(input)).toBe(expected);
    });
  });
});