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

export const addView = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('addView')(input);

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

export const getRank = async (input: {date: string}) => {
  const {data} = await firebaseFunctions.httpsCallable('getRank')(input);
  console.log(data, 'data');

  return {...data};
};

export const createReport = async (input: {
  target: {collection: string; id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createReport')(input);

  return {...data};
};

export const editContent = async (input: {
  conent: {id: string; path: string; type: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('editContent')(input);

  return {...data};
};

export const deleteContent = async (input: {content: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteContent')(input);

  return {...data};
};
