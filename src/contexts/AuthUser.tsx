import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {signIn} from '../functions/User';

import {TAuthUser, TDocData, TDocSnapshot} from '../types/Firebase';

type TContextProps = {
  loaded: boolean;
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

        try {
          await signIn({user: {id: user.uid}});
        } catch (error) {
          await onSignOut();
        }
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
    const loadAuthUser = (authUserId: string) => {
      const onNext = async (userDoc: TDocSnapshot) => {
        const userData = userDoc.data();
        if (!userData) {
          setAuthUser(undefined);
        }

        setAuthUserData(userData);
        setLoaded(true);
      };

      const onError = (error: Error) => {
        onSignOut();
        DefaultAlert({
          title: 'Please sign in again',
          message: (error as {message: string}).message,
        });
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
  }, [authUser?.uid]);

  const onSignOut = async () => {
    await firebase.auth().signOut();
    setAuthUser(undefined);
    setAuthUserData(undefined);
  };

  return (
    <AuthUserContext.Provider
      value={{
        loaded,
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
