import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import storage from '@react-native-firebase/storage';
import {getThumbnailPath} from './Storage';

export const createShareLink = async ({
  target,
  param,
  value,
  image,
}: {
  target: 'production' | 'development';
  param?: string;
  value?: string;
  image?: {path: string; type: 'video' | 'image'};
}) => {
  let link = defaultConfigs[target].domainUriPrefix;

  if (param && value) {
    link = link + `/share?${param}=${value}`;
  }

  let imageUrl;

  if (image) {
    const thumbRef = storage().ref(getThumbnailPath(image.path, image.type));

    imageUrl = await thumbRef.getDownloadURL();
  }

  console.log(defaultConfigs[target], 'defaultConfigs[target]');

  const shortLink = await dynamicLinks().buildShortLink({
    ...defaultConfigs[target],
    link,
    social: {
      title: target === 'production' ? 'Roll Mobile' : 'ROLL Development',
      descriptionText: 'Check this Roll out!',
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
    domainUriPrefix: 'https://links.roll.airballoon.app',
  },
};

export const getLinkData = ({url}: FirebaseDynamicLinksTypes.DynamicLink) => {
  const prefix = 'airballoon.app/share?';

  const data = url.split(prefix)[1];
  const collection = data.split('=')[0];
  const id = data.split('=')[1];

  return {collection, id};
};
