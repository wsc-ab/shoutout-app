import RNFS from 'react-native-fs';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {saveCacheData} from './Cache';
import {encodeImage, encodeToH264, generateThumb, resizeImage} from './Ffmpeg';
import {uploadFile} from './Storage';

export const onUploading = () => {
  DefaultAlert({
    title: 'Please wait',
    message: 'We are uploading your previous moment.',
  });
};

export const uploadImage = async ({
  localPath,
  remotePath,
  onProgress,
}: {
  localPath: string;
  remotePath: string;
  onProgress?: () => void;
}) => {
  // encode image
  let encodedUri;
  try {
    encodedUri = await encodeImage({
      input: localPath,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to encode image',
    });
    throw new Error('cancel');
  }

  let resizedImage;
  try {
    resizedImage = await resizeImage({
      input: encodedUri,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to resize image',
    });
    throw new Error('cancel');
  }

  const uploadPromises = [];

  uploadPromises.push(
    uploadFile({
      path: remotePath,
      uri: encodedUri,
      onProgress,
    }),
  );
  uploadPromises.push(
    uploadFile({
      path: `${remotePath}_200x200`,
      uri: resizedImage,
      onProgress,
    }),
  );

  uploadPromises.push(saveToLocalCache({localPath: encodedUri, remotePath}));
  uploadPromises.push(
    saveToLocalCache({
      localPath: resizedImage,
      remotePath: `${remotePath}_200x200`,
    }),
  );

  try {
    await Promise.all(uploadPromises);
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to upload image',
    });
    throw new Error('cancel');
  }
};

const saveToLocalCache = async ({
  localPath,
  remotePath,
}: {
  localPath: string;
  remotePath: string;
}) => {
  const size = (await RNFS.stat(localPath)).size;

  await saveCacheData({
    remotePath,
    localPath,
    size,
  });
};

export const uploadVideo = async ({
  localPath,
  remotePath,
  onProgress,
}: {
  localPath: string;
  remotePath: string;
  onProgress?: () => void;
}) => {
  // encode video
  let encodedUri;
  try {
    encodedUri = await encodeToH264({
      input: localPath,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to encode video',
    });
    throw new Error('cancel');
  }

  let thumbUri;
  try {
    thumbUri = await generateThumb({
      input: encodedUri,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to generate thumbnail',
    });
    throw new Error('cancel');
  }

  const uploadPromises = [];

  uploadPromises.push(
    uploadFile({
      path: `${remotePath}_thumb`,
      uri: thumbUri,
      onProgress,
    }),
  );
  uploadPromises.push(
    uploadFile({
      path: remotePath,
      uri: encodedUri,
      onProgress,
    }),
  );

  uploadPromises.push(saveToLocalCache({remotePath, localPath: encodedUri}));
  uploadPromises.push(
    saveToLocalCache({
      remotePath: `${remotePath}_thumb`,
      localPath: thumbUri,
    }),
  );
};
