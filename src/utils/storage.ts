import storage from '@react-native-firebase/storage';
import {Asset} from 'react-native-image-picker';

export const createStoragePath = (id: string, type: string) => {
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
  var dateTime = date + '_' + time;

  const fileName = dateTime;
  const filePath = id + '/' + type + '/' + fileName;

  return filePath;
};

export const uploadContent = async ({
  asset,
  id,
  onProgress,
}: {
  asset: Asset;
  id: string;

  onProgress: (progress: number) => void;
}): Promise<string | undefined> => {
  const uri = asset.uri;

  // if uri doesn't start from file, no need to upload content
  // return the uri

  if (!uri?.startsWith('file://')) {
    return uri;
  }

  const path = createStoragePath(id, asset.type ?? 'content');
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
      () => rej(new Error('content upload error')),
      () => res(path),
    );
  });

  try {
    const result = await promise;
    return result;
  } catch (error) {
    console.log(error, 'e');

    throw new Error('upload content failed');
  }
};
