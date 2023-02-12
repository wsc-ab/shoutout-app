import {firebase} from '@react-native-firebase/auth';
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {encodeToH264, generateThumb} from './Ffmpeg';
import {createStoragePath, uploadFile} from './Storage';

export const takeVideo = async ({
  onCancel,
  durationLimit,
}: {
  onCancel: () => void;
  durationLimit: number;
}) => {
  const options: CameraOptions = {
    mediaType: 'video',
    videoQuality: 'high',
    durationLimit,
    presentationStyle: 'fullScreen',
  };

  let asset;
  console.log('launch');
  try {
    const {assets, didCancel} = __DEV__
      ? await launchImageLibrary(options)
      : await launchCamera(options);

    if (didCancel) {
      onCancel();
      return;
    }

    if (!assets?.[0]) {
      throw new Error('no asset');
    }

    asset = assets?.[0];
  } catch (error) {
    throw new Error('failed');
  }
  console.log('asset');
  return asset;
};

export const takeAndUploadVideo = async ({
  onCancel,
  onProgress,
  userId,
}: {
  userId: string;
  onCancel: () => void;
  onProgress: (progress: number) => void;
}) => {
  let asset;
  console.log('1');

  try {
    asset = await takeVideo({
      onCancel,
      durationLimit: 10,
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to take video',
    });
    onCancel();
    return;
  }

  if (!asset) {
    return;
  }

  console.log('2');
  if (asset.duration && asset.duration < 3) {
    DefaultAlert({
      title: 'Video is too short',
      message: 'Video should be at least 3 seconds long.',
    });
    onCancel();
    return;
  }

  if (!asset.uri) {
    DefaultAlert({
      title: 'Error',
      message: 'Video file path not found.',
    });
    onCancel();
    return;
  }

  // convert to mp4

  let uri;
  try {
    uri = await encodeToH264({
      input: asset.uri,
    });
  } catch (error) {
    onCancel();
    return;
  }

  let thumbUri;
  try {
    thumbUri = await generateThumb({
      input: uri,
    });
  } catch (error) {
    onCancel();
    return;
  }

  const momentId = firebase.firestore().collection('moments').doc().id;
  const videoPath = createStoragePath({
    userId,
    collection: 'moments',
    id: momentId,
    type: 'video',
  });
  try {
    await uploadFile({
      path: videoPath,
      uri,
      onProgress,
    });
  } catch (error) {
    onCancel();
    return;
  }

  try {
    await uploadFile({
      path: `${videoPath}_thumb`,
      uri: thumbUri,
      onProgress,
    });
  } catch (error) {
    onCancel();
    return;
  }

  return videoPath;
};
