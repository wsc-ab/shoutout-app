import dynamicLinks from '@react-native-firebase/dynamic-links';

export const createShareLink = async ({
  target,
  param,
  value,
  imageUrl,
}: {
  target: 'development' | 'production';
  param?: string;
  value?: string;
  imageUrl?: string;
}) => {
  let link = defaultConfigs[target].domainUriPrefix;

  if (param && value) {
    link = link + `/roll?${param}=${value}`;
  }

  const shortLink = await dynamicLinks().buildShortLink({
    ...defaultConfigs[target],
    link,
    social: {
      title: 'Roll',
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
    domainUriPrefix: 'https://dev.airballoon.app',
  },
  production: {
    ios: {
      bundleId: 'com.airballoon.Shoutout',
      appStoreId: '1665341920',
    },
    android: {
      packageName: 'com.airballoon.Shoutout',
    },
    domainUriPrefix: 'https://airballoon.app',
  },
};
