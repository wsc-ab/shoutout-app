import {firebaseFunctions} from '../utils/Firebase';

export const getItems = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('getItems')(input);

  return {...data};
};
