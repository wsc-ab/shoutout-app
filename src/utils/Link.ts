import {FirebaseDynamicLinksTypes} from '@react-native-firebase/dynamic-links';

export const getLinkData = ({url}: FirebaseDynamicLinksTypes.DynamicLink) => {
  const prefix = 'airballoon.app/roll?';

  const data = url.split(prefix)[1];
  const collection = data.split('=')[0];
  const id = data.split('=')[0];

  return {collection, id};
};
