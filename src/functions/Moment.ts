import DefaultAlert from '../components/defaults/DefaultAlert';
import {TLatLng} from '../types/Firebase';
import {firebaseFunctions} from '../utils/Firebase';

export const createMoment = async (input: {
  moment: {
    id: string;
    latlng: TLatLng;
    name: string;
    content: {
      path: string;
      mode: 'camera' | 'library';
      media: 'photo' | 'video';
    };
  };
  channel: {id: string};
}) => {
  try {
    const {data} = await firebaseFunctions.httpsCallable('createMoment')(input);

    return {...data};
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: (error as {message: string}).message,
    });
    throw new Error('cancel');
  }
};

export const addLike = async (input: {moment: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('addLike')(input);

  return {...data};
};

export const removeLike = async (input: {moment: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeLike')(input);

  return {...data};
};

export const addFollow = async (input: {user: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('addFollow')(input);

  return {...data};
};

export const removeFollow = async (input: {user: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeFollow')(input);

  return {...data};
};

export const addView = async (input: {
  moment: {id: string; user: {id: string}};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addView')(input);

  return {...data};
};

export const getMoments = async (input: {pagination: {number: number}}) => {
  const {data} = await firebaseFunctions.httpsCallable('getMoments')(input);

  return {...data};
};

export const createReport = async (input: {moment: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('createReport')(input);

  return {...data};
};

export const deleteReport = async (input: {moment: {id: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteReport')(input);

  return {...data};
};

export const deleteMoment = async (input: {
  moment: {
    id: string;
  };
}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteMoment')(input);

  return {...data};
};
