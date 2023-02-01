import {CameraOptions, launchCamera} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {TDocData} from '../types/Firebase';
import {uploadContent} from './Storage';

const durationLimit = 30;

const selectContent = async () => {
  const options: CameraOptions = {
    mediaType: 'video',
    videoQuality: 'high',
    durationLimit,
  };

  let asset;

  try {
    const {assets} = await launchCamera(options);
    asset = assets?.[0];
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'Failed to launch camera,',
    });
  }

  return asset;
};

export const selectAndUploadContent = async ({
  authUserData,
  setSubmitting,
  setProgress,
}: {
  authUserData: TDocData;
  setSubmitting: (submitting: boolean) => void;
  setProgress: (progress: number) => void;
}) => {
  const asset = await selectContent();

  if (!asset) {
    return {uploaded: undefined, asset: undefined};
  }

  if (asset.duration && asset.duration < 5) {
    DefaultAlert({
      title: 'Video is too short',
      message: 'Video should be at least 5 seconds long.',
    });
    return {uploaded: undefined, asset: undefined};
  }

  let uploaded;

  try {
    setSubmitting(true);
    uploaded = await uploadContent({
      asset,
      id: authUserData.id,
      onProgress: setProgress,
    });

    DefaultAlert({
      title: 'Uploaded',
    });
  } catch (error) {
    DefaultAlert({
      title: 'Error',
      message: 'This file is not supported.',
    });
    setProgress(0);

    setSubmitting(false);
  }

  return {uploaded, asset};
};
