import storage from '@react-native-firebase/storage';
import {Asset} from 'react-native-image-picker';

export const createMockId = () => {
  // Alphanumeric characters
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let mockId = '';
  for (let i = 0; i < 10; i++) {
    mockId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return mockId;
};

export const createStoragePath = (id: string, type: 'image' | 'video') => {
  const today = new Date();

  const date =
    today.getFullYear() +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    ('0' + today.getDate()).slice(-2);

  const time =
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds() +
    ':' +
    today.getMilliseconds();
  const dateTime = date + '_' + time;

  const folder = `${type}s`;

  const fileName = dateTime + '_' + createMockId();
  const filePath = id + '/' + folder + '/' + fileName;

  return filePath;
};

export const uploadFile = async ({
  asset,
  id,
  onProgress,
  type,
}: {
  asset: Asset;
  id: string;
  type: 'image' | 'video';
  onProgress: (progress: number) => void;
}): Promise<string | undefined> => {
  const uri = asset.uri;

  // if uri doesn't start from file, no need to upload file
  // return the uri

  if (!uri?.startsWith('file://')) {
    return uri;
  }

  const path = createStoragePath(id, type);
  const ref = storage().ref(path);

  const uploadTask = ref.putFile(uri);

  const promise: Promise<string> = new Promise((res, rej) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        onProgress(progress);
      },
      () => rej(new Error('file upload error')),
      () => res(path),
    );
  });

  try {
    const result = await promise;
    return result;
  } catch (error) {
    throw new Error('upload file failed');
  }
};

export const getThumbnailPath = (path: string, type: 'video' | 'image') => {
  switch (type) {
    case 'video':
      return `${path}_thumb`;

    case 'image':
      return `${path}_200x200`;
  }
};
