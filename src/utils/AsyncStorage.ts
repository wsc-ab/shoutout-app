import RNAS from '@react-native-async-storage/async-storage';

export const saveToAS = async ({key, data}: {key: string; data: string}) => {
  try {
    await RNAS.setItem(key, data);
  } catch (error) {
    throw new Error('failed to save to AS');
  }
};

export const readFromAS = async ({key}: {key: string}) => {
  try {
    const data = await RNAS.getItem(key);
    return data;
  } catch (error) {
    throw new Error('failed to read from AS');
  }
};

export const deleteFromAS = async ({key}: {key: string}) => {
  try {
    const data = await RNAS.removeItem(key);
    return data;
  } catch (error) {
    throw new Error('failed to delete from AS');
  }
};
