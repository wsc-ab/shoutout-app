import {Alert, PermissionsAndroid, Platform} from 'react-native';
import GeoLocation from 'react-native-geolocation-service';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {TLocation} from '../types/Firebase';

export const getCurrentLocation: () => Promise<
  TLocation | undefined
> = async () => {
  const isPermitted = await checkLocationPermission();

  if (!isPermitted) {
    throw new Error('no location permission');
  }

  if (isPermitted) {
    return new Promise(res => {
      GeoLocation.getCurrentPosition(
        ({coords: {latitude: lat, longitude: lng}}) => {
          res({lat, lng});
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
    });
  }
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
