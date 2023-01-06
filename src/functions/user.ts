import {firebaseFunctions} from '../utils/Firebase';

export const editUser = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('editUser')(input);

  return {...data};
};
