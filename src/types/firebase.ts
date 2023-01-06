import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type TObject = {[key in string]: any};

export type TAuthUser = FirebaseAuthTypes.User;
export type TDocData = FirebaseFirestoreTypes.DocumentData;
export type TDocSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;
