import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type TObject = {[key in string]: any};

export type TAuthUser = FirebaseAuthTypes.User;
export type TDocData = FirebaseFirestoreTypes.DocumentData;
export type TDocSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;

export type TTimestampClient = {_seconds: number; _nanoseconds: number};
export type TTimestamp = {seconds: number; nanoseconds: number};
export type TLocation = {
  lat: number;
  lng: number;
  address?: AddressComponent[];
};

export type AddressComponent = {
  types: string[];
  long_name: string;
  short_name: string;
};
