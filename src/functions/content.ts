import {firebaseFunctions} from '../utils/Firebase';

export const createContent = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('createContent')(input);

  return {...data};
};
