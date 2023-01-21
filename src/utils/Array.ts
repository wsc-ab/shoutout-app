import {TObject} from '../types/Firebase';

export const shuffleArray = <A extends TObject>(array: A[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sortByTimestamp = <A extends TObject>(
  items: A[],
  field: string,
) => {
  return items.sort(
    (a: TObject, b: TObject) => b[field].seconds - a[field].seconds,
  );
};
