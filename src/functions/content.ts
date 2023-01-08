import {firebaseFunctions} from '../utils/Firebase';

export const createContent = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('createContent')(input);

  return {...data};
};

export const addShoutout = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('addShoutout')(input);

  return {...data};
};

export const removeShoutout = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeShoutout')(input);

  return {...data};
};

export const addPass = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('addPass')(input);

  return {...data};
};
