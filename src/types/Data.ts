import {IconProp} from '@fortawesome/fontawesome-svg-core';

export type TBundleId = 'app.airballoon.Shoutout' | 'com.airballoon.Shoutout';

export type TNotification = {
  title: string;
  body: string;
  collection?: string;
  image?: string;
  id?: string;
  icon?: IconProp;
  color?: string;
};
