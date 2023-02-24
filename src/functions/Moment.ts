import DefaultAlert from '../components/defaults/DefaultAlert';
import {TLatLng} from '../types/Firebase';
import {firebaseFunctions} from '../utils/Firebase';

export const createMoment = async (input: {
  moment: {
    id: string;
    path: string;
    latlng: TLatLng;
    type: 'everyone' | 'friends';
    name: string;
  };
  room?: {id: string};
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

export const addLike = async (input: {moment: {id: string; path: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('addLike')(input);

  return {...data};
};

export const removeLike = async (input: {
  moment: {id: string; path: string};
}) => {
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
  moment: {id: string; path: string; user: {id: string}};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addView')(input);

  return {...data};
};

export const getMoments = async (input: {pagination: {number: number}}) => {
  const {data} = await firebaseFunctions.httpsCallable('getMoments')(input);

  return {...data};
};

export const getFriendMoments = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('getFriendMoments')(
    input,
  );

  return {...data};
};

export const createReport = async (input: {
  moment: {id: string; path: string; user: {id: string}};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createReport')(input);

  return {...data};
};

export const deleteReport = async (input: {
  moment: {id: string; path: string; user: {id: string}};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteReport')(input);

  return {...data};
};

export const addMoment = async (input: {
  moment: {id: string};
  content: {path: string; latlng: TLatLng; name: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addMoment')(input);

  return {...data};
};

export const removeMoment = async (input: {
  moment: {
    id: string;
  };
  content: {path: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeMoment')(input);

  return {...data};
};

export const sendNotification = async (input: {
  moment: {
    id: string;
  };
  content: {path: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('sendNotification')(
    input,
  );

  return {...data};
};
