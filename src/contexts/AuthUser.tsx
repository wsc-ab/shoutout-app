import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {TAuthUser, TDocData, TDocSnapshot} from '../types/firebase';

type TContextProps = {
  loaded: boolean;
  authUser: TAuthUser;
  authUserData: TDocData;
  onSignOut: () => void;
};

const AuthUserContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const AuthUserProvider = ({children}: TProps) => {
  const [authUser, setAuthUser] = useState<TAuthUser | null>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setAuthUser(user);
      } else {
        setLoaded(true);
      }
    });

    return unsubscribe;
  }, []);

  const [authUserData, setAuthUserData] = useState<TDocData>();

  // subscribe to auth user data change
  useEffect(() => {
    let isMounted = true;

    const loadAuthUser = (authUserId: string) => {
      const onNext = (userDoc: TDocSnapshot) => {
        const userData = userDoc.data();

        if (isMounted) {
          setAuthUserData(userData);
        }

        setLoaded(true);
      };

      const onError = (error: Error) => {
        Alert.alert('Please sign in again', error.message);
      };

      const unsubscribe = firestore()
        .collection('users')
        .doc(authUserId)
        .onSnapshot(onNext, onError);

      return unsubscribe;
    };

    if (authUser?.uid) {
      loadAuthUser(authUser.uid);
    }
    return () => {
      isMounted = false;
    };
  }, [authUser?.uid, loaded]);

  const onSignOut = async () => {
    await firebase.auth().signOut();
    setAuthUser(undefined);
    setAuthUserData(undefined);
  };

  return (
    <AuthUserContext.Provider
      value={{
        loaded,
        authUser,
        authUserData: authUserData!,
        onSignOut,
      }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export {AuthUserProvider};
export default AuthUserContext;
