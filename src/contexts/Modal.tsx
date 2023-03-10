import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useContext, useEffect, useState} from 'react';
import CreateGeneralChannelModal from '../components/forms/CreateGeneralChannelModal';
import CreateMomentForm from '../components/forms/CreateMomentForm';
import CreateSponsoredChannelModal from '../components/forms/CreateSponsoredChannelModal';

import AuthUserModal from '../components/modals/AuthUserModal';
import ChannelModal from '../components/modals/ChannelModal';
import ChannelSearchModal from '../components/modals/ChannelSearchModal';
import ContactsModal from '../components/modals/ContactsModal';
import MomentsModal from '../components/modals/MomentsModal';
import UsersModal from '../components/modals/UsersModal';
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
      {modal?.target === 'moments' && modal.data && (
        <MomentsModal moments={modal.data.moments} />
      )}
      {modal?.target === 'channel' && modal.data?.channel && (
        <ChannelModal
          channel={modal.data.channel}
          momentIndex={modal.data.momentIndex}
        />
      )}
      {modal?.target === 'createGeneralChannel' && (
        <CreateGeneralChannelModal {...modal.data} />
      )}
      {modal?.target === 'createSponsoredChannel' && (
        <CreateSponsoredChannelModal {...modal.data} />
      )}
      {modal?.target === 'auth' && <AuthUserModal />}
      {modal?.target === 'friends' && <ContactsModal />}
      {modal?.target === 'channelUsers' && modal.data && (
        <UsersModal channel={modal.data.channel} />
      )}

      {modal?.target === 'createMoment' && modal.data && (
        <CreateMomentForm {...modal.data} />
      )}
      {modal?.target === 'search' && <ChannelSearchModal />}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
