import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultAlert from '../components/defaults/DefaultAlert';

export const getImage = async () => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    presentationStyle: 'fullScreen',
  };

  let asset;

  const {assets, didCancel} = await launchImageLibrary(options);

  if (didCancel) {
    throw new Error('cancel');
  }

  if (!assets?.[0]) {
    throw new Error('no asset');
  }

  asset = assets?.[0];

  if (!asset.uri) {
    DefaultAlert({
      title: 'Error',
      message: 'Image file path not found.',
    });
    throw new Error('cancel');
  }

  return asset.uri;
};
