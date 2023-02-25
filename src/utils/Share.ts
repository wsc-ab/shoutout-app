import dynamicLinks from '@react-native-firebase/dynamic-links';
import storage from '@react-native-firebase/storage';
import {TObject} from '../types/Firebase';
import {getThumbnailPath} from './Storage';

export const createShareLink = async ({
  type,
  target,
  image,
}: {
  type: 'production' | 'development';
  target: {collection: string; id: string; path?: string};
  image?: {path: string; type: 'video' | 'image'};
}) => {
  let base = defaultConfigs[type].domainUriPrefix + '/share';

  const link = setQueryParams({base, target});

  let imageUrl;

  if (image) {
    const thumbRef = storage().ref(getThumbnailPath(image.path, image.type));

    imageUrl = await thumbRef.getDownloadURL();
  }

  const shortLink = await dynamicLinks().buildShortLink({
    ...defaultConfigs[type],
    link,
    social: {
      title: type === 'production' ? 'Shoutout Mobile' : 'Shoutout Development',
      descriptionText: 'Connect live moments on Shoutout!',
      imageUrl,
    },
  });

  return shortLink;
};

const defaultConfigs = {
  development: {
    ios: {
      bundleId: 'app.airballoon.Shoutout',
      appStoreId: '1663592786',
    },
    android: {
      packageName: 'app.airballoon.Shoutout',
    },
    domainUriPrefix: 'https://links.dev.shoutout.airballoon.app',
  },
  production: {
    ios: {
      bundleId: 'com.airballoon.Shoutout',
      appStoreId: '1665341920',
    },
    android: {
      packageName: 'com.airballoon.Shoutout',
    },
    domainUriPrefix: 'https://links.roll.airballoon.app', // TODO change url to shoutout
  },
};

export const getQueryParams = (url: string) => {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: TObject = {};
  let match;

  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }

  console.log(params, 'p');

  return params;
};

export const setQueryParams = ({
  base,
  target,
}: {
  base: string;
  target: {
    collection: string;
    id: string;
    path?: string;
  };
}) => {
  let link = base + '?';
  Object.entries(target).map(([key, value], index) => {
    if (index !== 0) {
      link = link + '&';
    }
    link = link + `${key}=${value}`;
  });

  return link;
};
