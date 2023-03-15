import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useContext, useEffect, useState} from 'react';
import ChannelModal from '../components/channel/ChannelModal';
import ChannelSearchModal from '../components/channel/ChannelSearchModal';

import AuthUserModal from '../components/modals/AuthUserModal';

import ContactsModal from '../components/modals/ContactsModal';
import {TObject} from '../types/Firebase';
import {getQueryParams} from '../utils/Share';
import AuthUserContext from './AuthUser';

type TModal = {
  target: string;
  data?: TObject;
};

type TContextProps = {
  onUpdate: (modal?: TModal) => void;
  modal?: TModal;
};

const ModalContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const ModalProvider = ({children}: TProps) => {
  const [modal, setModal] = useState<TModal>();
  const {authUserData} = useContext(AuthUserContext);

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

  const onUpdate = (newModal?: TModal) => {
    setModal(undefined);
    if (newModal) {
      setModal(newModal);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        onUpdate,
      }}>
      {children}
      {modal?.target === 'channel' && modal.data?.channel && (
        <ChannelModal channel={modal.data.channel} />
      )}
      {modal?.target === 'auth' && <AuthUserModal />}
      {modal?.target === 'friends' && <ContactsModal />}
      {modal?.target === 'search' && <ChannelSearchModal />}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
