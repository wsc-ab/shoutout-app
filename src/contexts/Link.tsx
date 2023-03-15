import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useContext, useEffect} from 'react';
import {getQueryParams} from '../utils/Share';
import AuthUserContext from './AuthUser';
import ModalContext from './Modal';

type TContextProps = {};

const LinkContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const LinkProvider = ({children}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);

  useEffect(() => {
    const loadInitialLink = async () => {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        const {collection, id, path} = getQueryParams(initialLink.url);
      }
    };

    if (authUserData) {
      loadInitialLink();
    }
  }, [authUserData]);

  useEffect(() => {
    if (authUserData) {
      const unsub = dynamicLinks().onLink(link => {
        const {collection, id, path} = getQueryParams(link.url);
      });
      return () => unsub();
    }
  }, [authUserData]);

  return <LinkContext.Provider value={{}}>{children}</LinkContext.Provider>;
};

export {LinkProvider};
export default LinkContext;
