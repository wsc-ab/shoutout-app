import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {TDocData} from '../types/Firebase';
import {uploadFile} from './Storage';

const durationLimit = 30;

const takeVideo = async () => {
  const options: CameraOptions = {
    mediaType: 'video',
    videoQuality: 'high',
    durationLimit,
    presentationStyle: 'fullScreen',
  };

  let asset;

  try {
    const {assets} = __DEV__
      ? await launchImageLibrary(options)
      : await launchCamera(options);
    asset = assets?.[0];
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to launch camera,',
    });
  }

  return asset;
};

export const uploadVideo = async ({
  authUserData,
  setSubmitting,
  id,
  collection,
  setProgress,
}: {
  authUserData: TDocData;
  id: string;
  collection: string;
  setSubmitting: (submitting: boolean) => void;
  setProgress: (progress: number) => void;
}) => {
  const asset = await takeVideo();

  if (!asset) {
    return {uploaded: undefined, asset: undefined};
  }

  if (asset.duration && asset.duration < 3) {
    DefaultAlert({
      title: 'Video is too short',
      message: 'Video should be at least 3 seconds long.',
    });
    return {uploaded: undefined, asset: undefined};
  }

  let uploaded;

  try {
    setSubmitting(true);
    uploaded = await uploadFile({
      asset,
      userId: authUserData.id,
      id,
      collection,
      onProgress: setProgress,
      type: 'video',
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'This file is not supported.',
    });
  } finally {
    setProgress(0);
    setSubmitting(false);
  }

  return {uploaded, asset};
};
