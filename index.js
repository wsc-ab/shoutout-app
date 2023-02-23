/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import {
  firebase,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

// Your app's background handler for incoming remote messages
firebase
  .messaging()
  .setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('called');

      const {notification, data} = remoteMessage;
      if (notification) {
        await notifee.displayNotification({
          title: notification.title,
          body: notification.body,
          data: data,
        });
      }
      // Increment the count by 1
      await notifee.incrementBadgeCount();
    },
  );

AppRegistry.registerComponent(appName, () => App);
