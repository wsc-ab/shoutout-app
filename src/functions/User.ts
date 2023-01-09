import {firebaseFunctions} from '../utils/Firebase';

export const createUser = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('createUser')(input);

  return {...data};
};
