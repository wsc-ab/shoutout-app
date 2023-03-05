import {firebaseFunctions} from '../utils/Firebase';

export const createRoom = async (input: {
  room: {
    id: string;
    type: 'public' | 'private';
    name: string;
    startAt?: number;
    endAt?: number;
  };
  users: {ids: string[]};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createRoom')(input);

  return {...data};
};

export const getRooms = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('getRooms')(input);

  return {...data};
};

export const addRoomUsers = async (input: {
  room: {id: string};
  users: {ids: string[]};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addRoomUsers')(input);

  return {...data};
};

export const removeRoomUser = async (input: {
  room: {id: string};
  user: {id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeRoomUser')(input);

  return {...data};
};
