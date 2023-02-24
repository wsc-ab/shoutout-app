import {TObject} from '../types/Firebase';

export const sortByTimestamp = <A extends TObject>(
  items: A[],
  field: string,
) => {
  return items.sort(
    (a: TObject, b: TObject) => b[field].seconds - a[field].seconds,
  );
};

export const groupByLength = <A extends TObject>(
  items: A[],
  number: number,
) => {
  const group: [A[]] = [[]];

  items.forEach((item, elIndex) => {
    const groupIndex = Math.floor(elIndex / number);

    if (!group[groupIndex]) {
      group[groupIndex] = [];
    }
    group[groupIndex].push(item);
  });

  return group;
};

export const getSameIds = <A extends TObject>(items0: A[], items1: A[]) => {
  const items1Ids = items1.map(({id}) => id);

  const filtered = items0.filter(({id: elId}) => items1Ids.includes(elId));

  return filtered;
};

export const getFriendStatus = ({
  fromIds,
  toIds,
  id,
}: {
  fromIds: string[];
  toIds: string[];
  id: string;
}) => {
  const isFrom = fromIds.includes(id);
  const isTo = toIds.includes(id);

  if (isFrom && isTo) {
    return 'fromTo';
  } else if (isFrom) {
    return 'from';
  } else if (isTo) {
    return 'to';
  } else {
    return 'none';
  }
};

export const addItemEveryIndex = <A extends TObject, B extends TObject>({
  array,
  index,
  item,
}: {
  array: A[];
  index: number;
  item: B;
}) =>
  array.reduce((list, elem, i) => {
    list.push(elem);
    if ((i + 1) % index === 0) {
      list.push(item);
    }
    return list;
  }, [] as (A | B)[]);

export const pickRandomItem = <A extends TObject | string>({
  array,
}: {
  array: A[];
}) => array[Math.floor(Math.random() * array.length)];

export const moveToFirst = <A extends TObject>({
  array,
  key,
  value,
}: {
  array: A[];
  key: string;
  value: string;
}) => {
  const index = array.findIndex(item => item[key] === value);
  array.unshift(array.splice(index, 1)[0]);

  return array;
};

export const sentToFirst = <A extends TObject>({
  array,
  field,
  value,
}: {
  array: A[];
  field: string;
  value: string;
}) => {
  const items = [...array];
  const pathIndex = items.findIndex(item => item[field] === value);

  if (pathIndex === -1) {
    throw new Error('no item found');
  }

  items.unshift(items.splice(pathIndex, 1)[0]);

  return items;
};
