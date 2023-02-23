/**
 * @format
 */

import notifee from '@notifee/react-native';
import {firebase} from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Your app's background handler for incoming remote messages
firebase.messaging().setBackgroundMessageHandler(async () => {
  // Increment the count by 1
  await notifee.incrementBadgeCount();
});

AppRegistry.registerComponent(appName, () => App);
