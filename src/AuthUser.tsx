import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import SignUpModal from './SignUpModal';
import {TData} from './types/firebase';

type TContextProps = {authUserData: TData; onSignOut: () => void};

const AuthUserContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const AuthUserProvider = ({children}: TProps) => {
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      setAuthUser(user);
    });
    return unsubscribe;
  }, []);

  const [authUserData, setAuthUserData] = useState<TData>();
  const [modal, setModal] = useState<'signUp'>();

  console.log(authUserData, 'authUserData');

  // subscribe to auth user data change
  useEffect(() => {
    let isMounted = true;

    const loadAuthUser = (authUserId: string) => {
      console.log('loaded');

      const onNext = userDoc => {
        const userData = userDoc.data();

        if (!userData) {
          setModal('signUp');
        }

        if (isMounted) {
          setAuthUserData(userData);
        }
      };

      const onError = error => console.log(error, 'user error');

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
