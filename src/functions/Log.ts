import {firebaseFunctions} from '../utils/Firebase';

export const addLog = async (input: {
  id: string;
  collection: string;
  log: {name: string; detail: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addLog')(input);

  return {...data};
};
