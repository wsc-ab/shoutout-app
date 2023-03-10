import {firebaseFunctions} from '../utils/Firebase';

export const createChannel = async (input: {
  channel: {
    id: string;
    name: string;
    options: {
      type: 'public' | 'private';
      mode: 'camera' | 'library' | 'both';
      ghosting: {mode: 'off' | '1' | '7' | '14'};
      sponsor?: {detail: string};
    };
  };
  users: {ids: string[]};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createChannel')(input);

  return {...data};
};

export const addChannelUsers = async (input: {
  channel: {id: string};
  users: {ids: string[]};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addChannelUsers')(
    input,
  );

  return {...data};
};

export const removeChannelUser = async (input: {
  channel: {id: string};
  user: {id: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeChannelUser')(
    input,
  );

  return {...data};
};

export const joinChannelWithCode = async (input: {channel: {code: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('joinChannelWithCode')(
    input,
  );

  return {...data};
};

export const deleteChannel = async (input: {
  channel: {
    id: string;
  };
}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteChannel')(input);

  return {...data};
};

export const editChannel = async (input: {
  channel: {
    id: string;
    name: string;
    options: {
      type: 'public' | 'private';
      mode: 'camera' | 'library' | 'both';
      ghosting: {mode: 'off' | '1' | '7' | '14'};
    };
  };
}) => {
  const {data} = await firebaseFunctions.httpsCallable('editChannel')(input);

  return {...data};
};
