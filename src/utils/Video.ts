import RNFS from 'react-native-fs';
import {
  Asset,
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {saveCacheData} from './Cache';
import {encodeToH264, generateThumb} from './Ffmpeg';

import {createStoragePath, uploadFile} from './Storage';

const duration = {max: 60, min: 3};

export const getMoment = async ({
  durationLimit,
  mode,
  mediaType,
}: {
  durationLimit: number;
  mediaType: CameraOptions['mediaType'];
  mode: 'library' | 'camera';
}): Promise<Asset> => {
  const options: CameraOptions = {
    mediaType,
    videoQuality: 'high',
    maxWidth: 1080,
    maxHeight: 1920,
    durationLimit,
    presentationStyle: 'fullScreen',
  };

  let asset;

  const {assets, didCancel} =
    mode === 'library'
      ? await launchImageLibrary(options)
      : await launchCamera(options);

  if (didCancel) {
    throw new Error('cancel');
  }

  if (!assets?.[0]) {
    throw new Error('no asset');
  }

  asset = assets?.[0];

  return asset;
};

export const takeMoment = async ({
  userId,
  id,
  mode,
  mediaType,
}: {
  userId: string;
  id: string;
  mode: 'library' | 'camera';
  mediaType: CameraOptions['mediaType'];
}) => {
  let asset;

  try {
    asset = await getMoment({
      durationLimit: duration.max,
      mode,
      mediaType,
    });
  } catch (error) {
    if ((error as {message: string}).message !== 'cancel') {
      DefaultAlert({
        title: 'Error',
        message: 'Failed to take video',
      });
    }

    throw new Error('cancel');
  }

  if (asset.duration && asset.duration < duration.min) {
    DefaultAlert({
      title: 'Video is too short',
      message: `Video should be at least ${duration.min} seconds long.`,
    });
    throw new Error('cancel');
  }

  if (asset.duration && asset.duration > duration.max + 1) {
    DefaultAlert({
      title: 'Video is too long',
      message: `Video should be at most ${duration.max} seconds long.`,
    });
    throw new Error('cancel');
  }

  if (!asset.uri) {
    DefaultAlert({
      title: 'Error',
      message: 'File path not found.',
    });
    throw new Error('cancel');
  }

  const media = asset.type?.split('/')[0];

  if (!(media && ['image', 'video'].includes(media))) {
    DefaultAlert({
      title: 'Error',
      message: `Invalid file type ${media}`,
    });
    throw new Error('cancel');
  }

  const remotePath = createStoragePath({
    userId,
    collection: 'moments',
    id,
    type: media as 'image' | 'video',
  });

  return {remotePath, localPath: asset.uri, media: asset.type?.split('/')[0]};
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
  // convert to mp4

  let uri;
  try {
    uri = await encodeToH264({
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
      input: uri,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to generate thumbnail',
    });
    throw new Error('cancel');
  }

  try {
    await uploadFile({
      path: `${remotePath}_thumb`,
      uri: thumbUri,
      onProgress,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to upload thumbnail',
    });
    throw new Error('cancel');
  }

  try {
    await uploadFile({
      path: remotePath,
      uri,
      onProgress,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to upload video',
    });
    throw new Error('cancel');
  }

  try {
    const size = (await RNFS.stat(thumbUri)).size;

    await saveCacheData({
      remotePath: `${remotePath}_thumb`,
      localPath: thumbUri,
      size,
    });
  } catch (error) {}

  try {
    const size = (await RNFS.stat(uri)).size;

    await saveCacheData({
      remotePath,
      localPath: uri,
      size,
    });
  } catch (error) {}
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
  try {
    await uploadFile({
      path: remotePath,
      uri: localPath,
      onProgress,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to upload photo',
    });
    throw new Error('cancel');
  }

  try {
    const size = (await RNFS.stat(localPath)).size;

    await saveCacheData({
      remotePath,
      localPath,
      size,
    });
  } catch (error) {}
};
