import RNAS from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {deleteFromAS, readFromAS, saveToAS} from './AsyncStorage';
import {createMockId} from './Storage';

export const loadFromCache = async ({remotePath}: {remotePath: string}) => {
  // 1. check if cached
  let localPath = await checkCache({remotePath});

  // 2. if not cached, cache it
  if (!localPath) {
    localPath = await saveCache({remotePath});
  }

  // 3. return local path
  console.log(localPath, 'localPath');

  return `file://${localPath}`;
};

export const checkCache = async ({
  remotePath,
}: {
  remotePath: string;
}): Promise<string | undefined> => {
  const cacheData = await readCacheData({remotePath});

  // if no local path is found, return undefined
  if (!cacheData?.localPath) {
    return undefined;
  }

  // if cache file is not found, return undefined
  const exist = await RNFS.exists(cacheData.localPath);
  if (!exist) {
    return undefined;
  }

  // if cache file size is different, return undefined
  const size = (await RNFS.stat(cacheData.localPath)).size;

  if (!(size === cacheData.size)) {
    return undefined;
  }

  // if cache file size is different from remote path, return undefined
  const storageRef = storage().ref(remotePath);
  const metaData = await storageRef.getMetadata();

  if (!(metaData.size === cacheData.size)) {
    return undefined;
  }

  return cacheData.localPath;
};

export const saveCache = async ({remotePath}: {remotePath: string}) => {
  try {
    const storageRef = storage().ref(remotePath);
    const metaData = await storageRef.getMetadata();
    const ext = metaData.contentType!.split('/')[1];
    const size = metaData.size;

    const cacheFolder = `${RNFS.CachesDirectoryPath}/firebase`;

    if (!(await RNFS.exists(cacheFolder))) {
      await RNFS.mkdir(RNFS.CachesDirectoryPath + '/firebase');
    }

    const localPath = `${cacheFolder}/${createMockId(10)}.${ext}`;

    const downloadUrl = await storageRef.getDownloadURL();
    await RNFS.downloadFile({fromUrl: downloadUrl, toFile: localPath}).promise;

    await saveCacheData({remotePath, localPath, size});

    return localPath;
  } catch (error) {
    console.log(error, 'failed to sve');

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

    const path = localPath.startsWith('file://')
      ? localPath.split('file://')[1]
      : localPath;

    await saveToAS({
      key: `cache_${remotePath}`,
      data: JSON.stringify({localPath: path, accessedAt, size}),
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
}): Promise<TCacheData | undefined> => {
  try {
    const json = await readFromAS({
      key: `cache_${remotePath}`,
    });

    if (json) {
      const parsed = JSON.parse(json);
      return parsed as TCacheData;
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
        await deleteFromAS({key});
      }
    }

    await RNFS.unlink(RNFS.CachesDirectoryPath + '/firebase');
    await RNFS.mkdir(RNFS.CachesDirectoryPath + '/firebase');
    const now = Date.now();
    await saveToAS({
      key: 'lastCacheClean',
      data: JSON.stringify({cleanedAt: now}),
    });
  } catch (error) {
    console.log(error, 'e');

    throw new Error('failed to clear cache');
  }
};

export const removeOldCache = async ({days = 7}: {days?: number}) => {
  try {
    const keys = await RNAS.getAllKeys();
    const now = Date.now();
    for (const key of keys) {
      if (key.startsWith('cache')) {
        const data = await readFromAS({key});
        if (data) {
          const cacheData = JSON.parse(data) as TCacheData;

          const milliSecondsSince = now - cacheData.accessedAt;

          // remove cache older than 7 days
          if (milliSecondsSince >= days * 24 * 60 * 60 * 1000) {
            await RNFS.unlink(cacheData.localPath);
            await deleteFromAS({key});
          }
        }
      }
    }
    await saveToAS({
      key: 'lastCacheClean',
      data: JSON.stringify({cleanedAt: now}),
    });
  } catch (error) {
    throw new Error('failed to remove old cache');
  }
};

type TCacheData = {localPath: string; accessedAt: number; size: number};
