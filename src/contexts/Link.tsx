import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useEffect} from 'react';
import {getLinkData} from '../utils/Link';

type TContextProps = {};

const LinkContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const LinkProvider = ({children}: TProps) => {
  useEffect(() => {
    const loadInitialLink = async () => {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        const {collection, id} = getLinkData(initialLink);
        console.log(collection, id);
      }
    };

    loadInitialLink();
  }, []);
  useEffect(() => {
    console.log('called');

    const unsubscribe = dynamicLinks().onLink(link => {
      console.log(link, 'l');

      const {collection, id} = getLinkData(link);
      console.log(collection, id);
    });
    return () => unsubscribe();
  }, []);
  return <LinkContext.Provider value={{}}>{children}</LinkContext.Provider>;
};

export {LinkProvider};
export default LinkContext;
