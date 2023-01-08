import {firebaseFunctions} from '../utils/Firebase';

export const getBestItems = async (input: {
  type: 'day' | 'week' | 'month' | 'year';
}) => {
  const {data} = await firebaseFunctions.httpsCallable('getBestItems')(input);

  return {...data};
};
