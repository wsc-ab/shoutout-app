import {TLatLng} from '../types/Firebase';
import {firebaseFunctions} from '../utils/Firebase';

export const createPrompt = async (input: {
  prompt: {
    id: string;
    type: 'friends';
  };
  moment: {
    id: string;
    type: 'friends' | 'everyone';
  };
  content: {path: string; latlng: TLatLng; name: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('createPrompt')(input);

  return {...data};
};

export const getPrompts = async (input: {}) => {
  const {data} = await firebaseFunctions.httpsCallable('getPrompts')(input);

  return {...data};
};

export const addMoment = async (input: {
  prompt: {
    id: string;
  };
  moment: {
    id: string;
    type: 'friends' | 'everyone';
  };
  content: {path: string; latlng: TLatLng};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('addMoment')(input);

  return {...data};
};

export const removeMoment = async (input: {
  prompt: {
    id: string;
  };
  moment: {
    id: string;
  };
  content: {path: string};
}) => {
  const {data} = await firebaseFunctions.httpsCallable('removeMoment')(input);

  return {...data};
};
