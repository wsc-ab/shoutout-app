import {firebaseFunctions} from '../utils/Firebase';

export const createContent = async (input: {
  content: {id: string; path: string; type?: string; isFirst: boolean};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createContent')(input);

  return {...data};
};

export const addLike = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('addLike')(input);

  return {...data};
};

export const removeLike = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeLike')(input);

  return {...data};
};

export const addView = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('addView')(input);

  return {...data};
};

export const getContents = async (input: {
  pagination: {startAfterId?: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('getContents')(input);

  return {...data};
};

export const createReport = async (input: {
  target: {collection: string; id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createReport')(input);

  return {...data};
};

export const deleteContent = async (input: {content: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteContent')(input);

  return {...data};
};

export const addLink = async (input: {
  from: {id: string};
  to: {id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addLink')(input);

  return {...data};
};

export const getContent = async (input: {content: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('getContent')(input);

  return {...data};
};
