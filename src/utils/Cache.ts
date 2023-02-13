import RNAS from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {readFromAS, saveToAS} from './AsyncStorage';
import {createMockId} from './Storage';

export const loadFromCache = async ({remotePath}: {remotePath: string}) => {
  // 1. check if cached
  let localPath = await checkCache({remotePath});

  // 2. if not cached, cache it
  if (!localPath) {
    localPath = await saveCache({remotePath});
  }

  // 3. return local path

  return localPath;
};

export const checkCache = async ({
  remotePath,
}: {
  remotePath: string;
}): Promise<string | undefined> => {
  const localPath = await readCacheData({remotePath});

  // if no cache data is found, return undefined

  if (!localPath) {
    return undefined;
  }

  // if cache file is not found, return undefined
  const exist = await RNFS.exists(localPath);
  if (!exist) {
    return undefined;
  }
  return localPath;
};

export const saveCache = async ({remotePath}: {remotePath: string}) => {
  try {
    const storageRef = storage().ref(remotePath);
    const downloadUrl = await storageRef.getDownloadURL();
    const metaData = await storageRef.getMetadata();
    const ext = metaData.contentType!.split('/')[1];
    const size = metaData.size;
    const localPath = `${RNFS.CachesDirectoryPath}/${createMockId(5)}.${ext}`;

    await RNFS.downloadFile({fromUrl: downloadUrl, toFile: localPath}).promise;
    await saveCacheData({remotePath, localPath, size});

    return localPath;
  } catch (error) {
    throw new Error('failed to save cache');
  }
};

export const saveCacheData = async ({
  remotePath,
  localPath,
  size,
}: {
  remotePath: string;
  localPath: string;
  size: number;
}) => {
  try {
    const accessedAt = Date.now();

    await saveToAS({
      key: remotePath,
      data: JSON.stringify({localPath, accessedAt, size}),
    });

    return localPath;
  } catch (error) {
    throw new Error('failed to save to AS');
  }
};

export const readCacheData = async ({
  remotePath,
}: {
  remotePath: string;
}): Promise<string | undefined> => {
  try {
    const json = await readFromAS({
      key: remotePath,
    });

    if (json) {
      const parsed = JSON.parse(json);
      return parsed.localPath;
    }
  } catch (error) {
    throw new Error('failed to read from AS');
  }
};

export const clearCache = async () => {
  try {
    const keys = await RNAS.getAllKeys();

    for (const key of keys) {
      if (key.startsWith('cache')) {
        await RNAS.removeItem(key);
      }
    }

    await RNFS.unlink(RNFS.CachesDirectoryPath);
  } catch (error) {
    throw new Error('failed to clear cache');
  }
};
