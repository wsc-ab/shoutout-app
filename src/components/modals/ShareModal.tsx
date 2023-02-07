import {Platform, Share} from 'react-native';
import DefaultAlert from '../defaults/DefaultAlert';

type TShareConfig = {
  title: string;
  message?: string;
  url: string;
};

const openShareModal = async ({title, url}: {title: string; url: string}) => {
  try {
    const shareConfig: TShareConfig = {
      title,
      url,
    };

    if (Platform.OS === 'android') {
      shareConfig.title = shareConfig.title + `, AppLink: ${url}`;
      shareConfig.message = undefined;
    }

    await Share.share(shareConfig);
  } catch (error) {
    DefaultAlert({title: 'Failed to open share modal'});
  }
};

export default openShareModal;
