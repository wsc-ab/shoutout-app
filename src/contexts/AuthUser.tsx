import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {TAuthUser, TDocData, TDocSnapshot} from '../types/Firebase';

type TContextProps = {
  loaded: boolean;
  authUser: TAuthUser | null | undefined;
  authUserData: TDocData;
  onReload: () => void;
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

  const onReload = async () => {
    await auth().currentUser?.reload();

    setAuthUser(auth().currentUser);
  };

  const [authUserData, setAuthUserData] = useState<TDocData>();

  // subscribe to auth user data change
  useEffect(() => {
    let isMounted = true;

    const loadAuthUser = (authUserId: string) => {
      const onNext = async (userDoc: TDocSnapshot) => {
        const userData = userDoc.data();

        if (!userData) {
          await onSignOut();
        }

        if (isMounted) {
          setAuthUserData(userData);
        }

        setLoaded(true);
      };

      const onError = (error: Error) => {
        Alert.alert(
          'Please sign in again',
          (error as {message: string}).message,
        );
      };

      const unsubscribe = firestore()
        .collection('users')
        .doc(authUserId)
        .onSnapshot(onNext, onError);

      return unsubscribe;
    };

    if (authUser?.uid) {
      loadAuthUser(authUser.uid);
    } else {
      setLoaded(true);
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

  console.log(authUserData?.name, 'auth');

  return (
    <AuthUserContext.Provider
      value={{
        loaded,
        authUser,
        authUserData: authUserData!,
        onSignOut,
        onReload,
      }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export {AuthUserProvider};
export default AuthUserContext;
