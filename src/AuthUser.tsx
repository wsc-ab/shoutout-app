import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import SignUpModal from './SignUpModal';
import {TAuthUser, TDocData, TDocSnapshot} from './types/firebase';

type TContextProps = {authUserData: TDocData; onSignOut: () => void};

const AuthUserContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const AuthUserProvider = ({children}: TProps) => {
  const [authUser, setAuthUser] = useState<TAuthUser | null>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      setAuthUser(user);
    });
    return unsubscribe;
  }, []);

  const [authUserData, setAuthUserData] = useState<TDocData>();
  const [modal, setModal] = useState<'signUp'>();

  // subscribe to auth user data change
  useEffect(() => {
    let isMounted = true;

    const loadAuthUser = (authUserId: string) => {
      const onNext = (userDoc: TDocSnapshot) => {
        const userData = userDoc.data();

        if (!userData) {
          setModal('signUp');
        }

        if (isMounted) {
          setAuthUserData(userData);
        }
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
  }, [authUser?.uid]);

  const onSignOut = async () => {
    try {
      await firebase.auth().signOut();
      setAuthUser(undefined);
      setAuthUserData(undefined);
      setModal(undefined);
    } catch (error) {}
  };

  const onSuccess = () => setModal(undefined);

  return (
    <AuthUserContext.Provider
      value={{
        authUserData: authUserData!,
        onSignOut,
      }}>
      {children}
      {modal === 'signUp' && authUser && (
        <SignUpModal
          onCancel={onSignOut}
          uid={authUser.uid}
          onSuccess={onSuccess}
        />
      )}
    </AuthUserContext.Provider>
  );
};

export {AuthUserProvider};
export default AuthUserContext;
