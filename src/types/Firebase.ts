import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type TObject = {[key in string]: any};

export type TAuthUser = FirebaseAuthTypes.User;
export type TDocData = FirebaseFirestoreTypes.DocumentData;
export type TDocSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;

export type TTimestampClient = {_seconds: number; _nanoseconds: number};
export type TTimestamp = {seconds: number; nanoseconds: number};

export type TLatLng = {lat: number; lng: number};
export type TLocation = {
  address?: AddressComponent[];
  formatted?: string;
  geometry: AddressGeometry;
  placeId: string;
};

export type AddressComponent = {
  types: string[];
  long_name: string;
  short_name: string;
};

export type AddressGeometry = {
  location: {lat: number; lng: number};
};
