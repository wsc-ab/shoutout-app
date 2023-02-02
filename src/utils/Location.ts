import {Alert, PermissionsAndroid, Platform} from 'react-native';
import GeoLocation from 'react-native-geolocation-service';
import DefaultAlert from '../components/defaults/DefaultAlert';

export const getCurrentLocation = async () => {
  const isPermitted = await checkLocationPermission();

  if (!isPermitted) {
    throw new Error('no location permission');
  }

  let location;

  if (isPermitted) {
    GeoLocation.getCurrentPosition(
      async ({coords: {latitude: lat, longitude: lng}}) => {
        location = {lat, lng};
      },
      error => {
        DefaultAlert({
          title: 'Failed  to get location',
          message: error.message,
        });
      },
      {
        accuracy: {android: 'high', ios: 'bestForNavigation'},
        enableHighAccuracy: true,
      },
    );
  }

  return location;
};

export const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const granted = await GeoLocation.requestAuthorization('whenInUse');

    if (granted === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Please check your permission',
        "We couldn't access your location data.",
      );
    }
  }
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        'Please check your permission',
        "We couldn't access your location data.",
      );
    }
  }
};
