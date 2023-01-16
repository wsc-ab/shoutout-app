import {firebaseFunctions} from '../utils/Firebase';

export const createUser = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('createUser')(input);

  return {...data};
};

export const deleteUser = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('deleteUser')(input);

  return {...data};
};

export const checkPhoneNumber = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('checkPhoneNumber')(
    input,
  );

  return {...data};
};

export const sendVerificationCode = async (input: {
  user: {phoneNumber: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('sendVerificationCode')(
    input,
  );

  return {...data};
};

export const signIn = async (input: {user: {id: string; token?: string}}) => {
  const {data} = await firebaseFunctions.httpsCallable('signIn')(input);

  return {...data};
};
