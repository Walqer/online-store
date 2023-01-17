import { updateQueryStringParameter } from '../ts/helpers/querystring';

test('Test Add and Update query strings parameters', () => {
    const cases = [
        { uri: 'http://x.com/', key: 'x', value: '123', expected: 'http://x.com/?x=123' },
        { uri: 'http://x.com/?x=123', key: 'x', value: '34', expected: 'http://x.com/?x=34' },
        { uri: 'http://x.com/?x=34', key: 'y', value: 'qw', expected: 'http://x.com/?x=34&y=qw' },
    ];
    cases.forEach(({ uri, key, value, expected }) => {
        expect(updateQueryStringParameter(uri!, key!, value!)).toBe(expected);
    });
});
