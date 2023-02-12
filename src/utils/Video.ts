import {
  Asset,
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {encodeToH264, generateThumb} from './Ffmpeg';
import {createStoragePath, uploadFile} from './Storage';

export const takeVideo = async ({
  durationLimit,
}: {
  durationLimit: number;
}): Promise<Asset> => {
  const options: CameraOptions = {
    mediaType: 'video',
    videoQuality: 'high',
    durationLimit,
    presentationStyle: 'fullScreen',
  };

  let asset;

  const {assets, didCancel} = __DEV__
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

export const takeAndUploadVideo = async ({
  onProgress,
  userId,
  id,
}: {
  userId: string;
  id: string;
  onProgress: (progress: number) => void;
}): Promise<string> => {
  let asset;

  try {
    asset = await takeVideo({
      durationLimit: 10,
    });
    console.log('cancel called');
  } catch (error) {
    if ((error as {message: string}).message !== 'cancel') {
      DefaultAlert({
        title: 'Error',
        message: 'Failed to take video',
      });
    }

    throw new Error('cancel');
  }

  if (asset.duration && asset.duration < 3) {
    DefaultAlert({
      title: 'Video is too short',
      message: 'Video should be at least 3 seconds long.',
    });
    throw new Error('cancel');
  }

  if (!asset.uri) {
    DefaultAlert({
      title: 'Error',
      message: 'Video file path not found.',
    });
    throw new Error('cancel');
  }

  // convert to mp4

  let uri;
  try {
    uri = await encodeToH264({
      input: asset.uri,
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

  const videoPath = createStoragePath({
    userId,
    collection: 'moments',
    id,
    type: 'video',
  });
  try {
    await uploadFile({
      path: videoPath,
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
    await uploadFile({
      path: `${videoPath}_thumb`,
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

  return videoPath;
};
