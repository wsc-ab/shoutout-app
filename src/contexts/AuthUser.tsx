import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {signIn} from '../functions/User';

import {TAuthUser, TDocData, TDocSnapshot, TObject} from '../types/Firebase';
import {getSecondsGap, getSubmitDate} from '../utils/Date';

type TContextProps = {
  loaded: boolean;
  authUser: TAuthUser | null | undefined;
  authUserData: TDocData;
  onReload: () => void;
  onSignOut: () => void;
  content?: TObject;
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
        await signIn({user: {id: user.uid}});
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

  const lastContent = authUserData?.contributeTo?.contents?.items?.[0];

  const submitDate = getSubmitDate();

  // set is submitted to ture
  // if last content has been updated within 24 hours till the next submit date.

  const submitted = lastContent?.addedAt
    ? getSecondsGap({
        date: submitDate,
        timestamp: lastContent.addedAt,
      }) <
      60 * 60 * 24
    : false;

  return (
    <AuthUserContext.Provider
      value={{
        loaded,
        authUser,
        authUserData: authUserData!,
        onSignOut,
        onReload,
        content: submitted ? lastContent : undefined,
      }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export {AuthUserProvider};
export default AuthUserContext;
