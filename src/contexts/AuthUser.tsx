import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import DefaultAlert from '../components/defaults/DefaultAlert';
import {signIn} from '../functions/User';

import {TAuthUser, TDocData, TDocSnapshot} from '../types/Firebase';

type TContextProps = {
  loaded: boolean;
  authUserData: TDocData;
  reportedContents: string[];
  addReportContent: (path: string) => void;
  removeReportContent: (path: string) => void;
  onReload: () => void;
  onSignOut: () => void;
};

const AuthUserContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const AuthUserProvider = ({children}: TProps) => {
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
    const newReportedContents = authUserData?.reported.items.map(
      ({path}: {path: string}) => path,
    );

    setReportedContents(newReportedContents);
  }, [authUserData?.reported.items]);

  const onSignOut = async () => {
    try {
      await firebase.auth().signOut();
      setAuthUser(undefined);
      setAuthUserData(undefined);
    } catch (error) {
      !__DEV__ && DefaultAlert({title: 'Failed to sign out'});
    }
  };

  const addReportContent = (path: string) =>
    setReportedContents(pre => [...pre, path]);
  const removeReportContent = (path: string) =>
    setReportedContents(pre => pre.filter(el => el !== path));

  return (
    <AuthUserContext.Provider
      value={{
        loaded,
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
