import {
  Asset,
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';

import {createStoragePath} from './Storage';

const duration = {min: 3, max: 60};

export const getMedia = async ({
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
    mode === 'library' || __DEV__
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

export const takeMedia = async ({
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
    asset = await getMedia({
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

  return {remotePath, localPath: asset.uri, media};
};
