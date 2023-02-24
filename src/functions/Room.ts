import {firebaseFunctions} from '../utils/Firebase';

export const createRoom = async (input: {
  room: {
    id: string;
    type: 'open' | 'closed';
    name: string;
    startAt?: number;
    endAt?: number;
  };
  users: {ids: string[]};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createRoom')(input);

  return {...data};
};
