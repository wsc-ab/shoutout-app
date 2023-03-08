import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {signIn} from '../functions/User';
import {TBundleId} from '../types/Data';

import {TAuthUser, TDocData, TDocSnapshot} from '../types/Firebase';

type TContextProps = {
  loaded: boolean;
  authUserData: TDocData;
  reportedContents: string[];
  addReportContent: (id: string) => void;
  removeReportContent: (id: string) => void;
  onReload: () => void;
  onSignOut: () => void;
  bundleId: TBundleId;
};

const AuthUserContext = createContext({} as TContextProps);

export type TProps = {
  bundleId: TBundleId;
  children: React.ReactNode;
};

const AuthUserProvider = ({children, bundleId}: TProps) => {
  const [authUser, setAuthUser] = useState<TAuthUser | null>();

  const [reportedContents, setReportedContents] = useState<string[]>([]);
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

  useEffect(() => {
    const newReportedContents = authUserData?.reported.moments.map(
      ({id}: {id: string}) => id,
    );

    setReportedContents(newReportedContents);
  }, [authUserData?.reported.moments]);

  const onSignOut = async () => {
    try {
      await firebase.auth().signOut();
      setAuthUser(undefined);
      setAuthUserData(undefined);
    } catch (error) {
      !__DEV__ && DefaultAlert({title: 'Failed to sign out'});
    }
  };

  const addReportContent = (id: string) =>
    setReportedContents(pre => [...pre, id]);
  const removeReportContent = (id: string) =>
    setReportedContents(pre => pre.filter(el => el !== id));

  return (
    <AuthUserContext.Provider
      value={{
        loaded,
        bundleId,
        authUserData: authUserData!,
        onSignOut,
        onReload,
        addReportContent,
        removeReportContent,
        reportedContents,
      }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export {AuthUserProvider};
export default AuthUserContext;
