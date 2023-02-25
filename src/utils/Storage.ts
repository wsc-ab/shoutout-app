import storage from '@react-native-firebase/storage';

export const createMockId = (length: number) => {
  // Alphanumeric characters
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let mockId = '';
  for (let i = 0; i < length; i++) {
    mockId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return mockId;
};

export const createStoragePath = ({
  userId,
  collection,
  id,
  type,
}: {
  collection: string;
  userId: string;
  id: string;
  type: 'image' | 'video';
}) => {
  const fileName = `${collection}_${id}_${createMockId(5)}`;
  const filePath = userId + '/' + `${type}s` + '/' + fileName;

  return filePath;
};

export const uploadFile = async ({
  uri,
  path,
  onProgress,
}: {
  uri: string;
  path: string;
  onProgress?: (progress: number) => void;
}): Promise<string> => {
  // if uri doesn't start from file, no need to upload file
  // return the uri

  if (!uri?.startsWith('file://')) {
    return uri;
  }

  const ref = storage().ref(path);

  const uploadTask = ref.putFile(uri);

  const promise: Promise<string> = new Promise((res, rej) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        if (onProgress) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        }
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

export const getUserProfileImageThumbPath = (id: string) =>
  `${id}/images/profileImage_200x200`;

export const getUserProfileImagePath = (id: string) =>
  `${id}/images/profileImage`;
