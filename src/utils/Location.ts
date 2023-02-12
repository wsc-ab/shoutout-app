import {Alert, PermissionsAndroid, Platform} from 'react-native';
import GeoLocation from 'react-native-geolocation-service';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {TLatLng} from '../types/Firebase';

export const getLatLng = async (): Promise<TLatLng> => {
  const isPermitted = await checkLocationPermission();

  if (!isPermitted) {
    DefaultAlert({
      title: 'Check permission',
      message: "We couldn't access your location data.",
    });
    throw new Error('no location permission');
  }

  const promise = new Promise((res, rej) => {
    GeoLocation.getCurrentPosition(
      ({coords: {latitude: lat, longitude: lng}}) => {
        res({lat, lng});
      },
      error => {
        DefaultAlert({
          title: 'Failed  to get location',
          message: error.message,
        });
        rej('cancel');
      },
      {
        accuracy: {android: 'high', ios: 'bestForNavigation'},
        enableHighAccuracy: true,
      },
    );
  });

  try {
    const location = (await promise) as TLatLng;

    return location;
  } catch (error) {
    throw new Error('failed');
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
