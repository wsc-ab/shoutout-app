import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import storage from '@react-native-firebase/storage';
import {getThumbnailPath, getUserProfileImageThumbPath} from './Storage';

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

  const shortLink = await dynamicLinks().buildShortLink({
    ...defaultConfigs[target],
    link,
    social: {
      title:
        target === 'production' ? 'Shoutout Mobile' : 'Shoutout Development',
      descriptionText: 'Connect live moments on Shoutout!',
      imageUrl,
    },
  });

  return shortLink;
};

export const createInviteLink = async ({
  target,
  authUser,
}: {
  target: 'production' | 'development';
  authUser: {id: string; displayName: string};
}) => {
  const link =
    defaultConfigs[target].domainUriPrefix +
    `/invite?id=${authUser.id}&displayName=${authUser.displayName}`;

  let imageUrl;

  try {
    const thumbRef = storage().ref(getUserProfileImageThumbPath(authUser.id));

    imageUrl = await thumbRef.getDownloadURL();
  } catch (error) {}

  const shortLink = await dynamicLinks().buildShortLink({
    ...defaultConfigs[target],
    link,
    social: {
      title:
        target === 'production' ? 'Shoutout Mobile' : 'Shoutout Development',
      descriptionText: "Let's be friends on Shoutout!",
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

export const getShareLinkData = ({
  url,
}: FirebaseDynamicLinksTypes.DynamicLink) => {
  const prefix = 'airballoon.app/share?';
  if (!url.includes(prefix)) {
    return {collection: undefined, id: undefined};
  }

  const data = url.split(prefix)[1];

  if (data) {
    const collection = data.split('=')[0];
    const id = data.split('=')[1];

    return {collection, id};
  }
  return {collection: undefined, id: undefined};
};

export const getInviteLinkData = ({
  url,
}: FirebaseDynamicLinksTypes.DynamicLink) => {
  const prefix = 'airballoon.app/invite?';
  if (!url.includes(prefix)) {
    return {collection: undefined, id: undefined};
  }

  const data = url.split(prefix)[1];

  if (data) {
    const collection = data.split('=')[0];
    const id = data.split('=')[1];

    return {collection, id};
  }
  return {collection: undefined, id: undefined};
};
