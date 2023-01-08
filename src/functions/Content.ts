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

export const getContents = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('getContents')(input);

  return {...data};
};

export const replaceContent = async (input: {
  id: string;
  path: string;
  type: string;
}) => {
  const {data} = await firebaseFunctions.httpsCallable('replaceContent')(input);

  return {...data};
};
