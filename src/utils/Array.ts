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

export const getDuplicateIds = (ids0: string[], ids1: string[]) => {
  const filtered = ids0.filter(id => ids1.includes(id));

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
