import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import {FirebaseFunctionsTypes} from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';

export let firebaseFunctions: FirebaseFunctionsTypes.Module;

const regions = {korea: 'us-central1', us: 'us-central1'};

export const initFirebase = (country: 'korea' | 'us') => {
  const region = regions[country];
  // firestore setting that works for both ios and android simulators
  if (__DEV__) {
    console.log('using firebase emulator');

    const ip = 'localhost';

    auth().useEmulator(`http://${ip}:9099`);
    firestore().useEmulator(ip, 8080);
    storage().useEmulator(ip, 9199);

    firebase.app().functions(region).useFunctionsEmulator(`http://${ip}:5001`);
  }

  firebaseFunctions = firebase.app().functions(region);
};
