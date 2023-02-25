import {getQueryParams, setQueryParams} from './Share';

describe('get value from dynamic link', () => {
  test('should get collection, id and path', () => {
    const link = 'airballoon.app/share?collection=a&id=b&path=c';
    const data = getQueryParams(link);
    expect(data).toMatchObject({
      collection: 'a',
      id: 'b',
      path: 'c',
    });
  });

  test('should get collection and id', () => {
    const link = 'airballoon.app/share?collection=a&id=b';
    const data = getQueryParams(link);
    expect(data).toMatchObject({
      collection: 'a',
      id: 'b',
    });
  });
});

describe('setQueryParams', () => {
  test('with collection, id and path', () => {
    const base = 'airballoon.app/share';
    const target = {collection: 'a', id: 'b', path: 'c'};

    const data = setQueryParams({base, target});
    expect(data).toBe('airballoon.app/share?collection=a&id=b&path=c');
  });

  test('with collection and id', () => {
    const base = 'airballoon.app/share';
    const target = {collection: 'a', id: 'b'};

    const data = setQueryParams({base, target});
    expect(data).toBe('airballoon.app/share?collection=a&id=b');
  });
});
