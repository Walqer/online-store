import { isExpiryOk } from '../ts/helpers/modal';

describe('check validation for customer Credit Card Expire date value', () => {
  test('month should not be more than 12', () => {
    const cases = [
      { input: '00/26', expected: false },
      { input: '13/23', expected: false },
      { input: '12/23', expected: true },
      { input: '02/28', expected: true },
    ];
    cases.forEach(({ input, expected }) => {
      expect(isExpiryOk(input)).toBe(expected);
    });
  });
  test('year should not be lower than 23', () => {
    const cases = [
      { input: '12/00', expected: false },
      { input: '12/22', expected: false },
      { input: '12/23', expected: true },
    ];
    cases.forEach(({ input, expected }) => {
      expect(isExpiryOk(input)).toBe(expected);
    });
  });
  test('fiels length should be equal to 5 (include "/")', () => {
    const cases = [
      { input: '12/345', expected: false },
      { input: '123/45', expected: false },
      { input: '1234/1234', expected: false },
      { input: '1/1', expected: false },
      { input: '1/112', expected: false },
      { input: '12/23', expected: true },
    ];
    cases.forEach(({ input, expected }) => {
      expect(isExpiryOk(input)).toBe(expected);
    });
  });
});