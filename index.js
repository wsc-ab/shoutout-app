/**
 * @format
 */

import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Your app's background handler for incoming remote messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  await notifee.incrementBadgeCount();
});

AppRegistry.registerComponent(appName, () => App);
