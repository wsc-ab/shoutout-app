import {getCityAndCountry} from './Map';

describe('should simplify address', () => {
  test('should get last two of three items', () => {
    const link = 'a, b, c';
    const result = getCityAndCountry(link);

    expect(result).toBe('b, c');
  });
});
