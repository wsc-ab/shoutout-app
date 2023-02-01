import {firebaseFunctions} from '../utils/Firebase';

export const createMoment = async (input: {
  moment: {id: string; path: string; type?: string; isFirst: boolean};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createMoment')(input);

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

export const getMoments = async (input: {
  pagination: {startAfterId?: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('getMoments')(input);

  return {...data};
};

export const createReport = async (input: {
  target: {collection: string; id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createReport')(input);

  return {...data};
};

export const deleteMoment = async (input: {moment: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteMoment')(input);

  return {...data};
};

export const addLink = async (input: {
  from: {id: string};
  to: {id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addLink')(input);

  return {...data};
};

export const getMoment = async (input: {moment: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('getMoment')(input);

  return {...data};
};
