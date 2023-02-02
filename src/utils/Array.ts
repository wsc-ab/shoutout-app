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
